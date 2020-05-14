const Cesium = window.Cesium

// 笛卡尔坐标转经纬度坐标
function cartesian3ToLonLat (cartesian3) {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  return {
    longitude,
    latitude,
    height: cartographic.height
  }
}

// 1.创建闭合的线数据
class CutFill {
  constructor (viewer, positions, polylineOption = {}, gridLineOption = {}) {
    if (viewer instanceof Cesium.Viewer === false) {
      throw new Error('Viewer 不是一个标准的Cesium Viewer')
    }
    this.gridSet = [] // 栅格数据集合
    this.grids = [] // 网格
    this.scopePolyline = undefined // 框选区域
    this.positions = positions // 选中区域坐标
    this.polylineOption = polylineOption // 选框折线参数
    this.gridLineOption = gridLineOption // 网格线参数
    this.viewer = viewer
    this.create()
  }

  create () {
    this.drawScopePolyline()
    this.drawGrids()
  }

  /**
   * 构建框选范围
   */
  drawScopePolyline () {
    let options = Object.assign({}, CutFill.defaultScopePolyline, this.polylineOption)
    let positions = this.positions.slice()
    options.positions = positions
    // 构建闭合的线, 复制第一个点
    positions.push(positions[0].clone())
    // 添加框选区域折线
    this.scopePolyline = this.viewer.entities.add({
      name: 'scopePolyline',
      polyline: options
    })
  }

  /**
   * 绘制网格
   */
  drawGrids () {
    const gridOptions = Object.assign({}, CutFill.defaultGridPolyline, this.gridLineOption)
    const { minLon, maxLon, minLat, maxLat, minHeight, maxHeight } = this._calculateBoundaryValue()
    const lonStep = (maxLon - minLon) / 20
    const latStep = (maxLat - minLat) / 20
    const baseHeight = (maxHeight + minHeight) / 2
    for (let i = 0; i < 21; i++) {
      const longitude = minLon + i * lonStep
      const latitude = minLat + i * latStep
      const verticalStarPos = new Cesium.Cartesian3.fromDegrees(longitude, minLat, baseHeight)
      const verticalEndPos = new Cesium.Cartesian3.fromDegrees(longitude, maxLat, baseHeight)
      const horizontalStartPos = new Cesium.Cartesian3.fromDegrees(minLon, latitude, baseHeight)
      const horizontalEndPos = new Cesium.Cartesian3.fromDegrees(maxLon, latitude, baseHeight)
      const verticalLine = this.viewer.entities.add({
        name: 'verticalLine' + i,
        polyline: {
          ...gridOptions,
          positions: [verticalStarPos, verticalEndPos]
        }
      })
      this.grids.push(verticalLine)
      const horizontalLine = this.viewer.entities.add({
        name: 'horizontal' + i,
        polyline: {
          ...gridOptions,
          positions: [horizontalStartPos, horizontalEndPos]
        }
      })
      this.grids.push(horizontalLine)
    }

    let gridLat = minLat + (latStep / 2)
    let gridLon = minLon + (lonStep / 2)
    for (let m = 0; m < 20; m++) {
      gridLat += latStep
      for (let n = 0; n < 20; n++) {
        gridLon += lonStep
        const point = {
          longitude: gridLon,
          latitude: gridLat,
          height: baseHeight
        }
        this.gridSet.push(point)
      }
    }
    this.gridSet.slice(0, 1).forEach(async (gridPos, index) => {
      console.log(gridPos)
      const sightline = new Cesium.Sightline(this.viewer.scene)
      sightline.build()
      const name = 'point'
      const flag = sightline.addTargetPoint({
        position : [gridPos.longitude, gridPos.latitude, gridPos.height],
        name
      })
      console.log(flag)
      sightline.viewPosition = [gridPos.longitude, gridPos.latitude, 0]
      const res = await this.getBarrierPoint(sightline, name, index + 1)
      console.log(res)
    })
    console.log(this.gridSet)
  }

  drawDiffLine (slight, lonS) {

  }

  // 获取碰撞点
  async getBarrierPoint (sightline, name, delta) {
    return new Promise((resolve) => {
      setTimeout(() => {
        sightline.getBarrierPoint(name, res => {
          let height = 0
          if (res.position && res.position.height > 0) {
            height = res.position.height
          }
          console.log(res)
          resolve(height)
          // sightline.removeAllTargetPoint()
        })
      }, 100)
    })
  }

  /**
   * 计算边界值
   * @returns {{minHeight: *, minLon: *, maxLat: *, maxHeight: *, minLat: *, maxLon: *}}
   * @private
   */
  _calculateBoundaryValue () {
    const firstPos = cartesian3ToLonLat(this.positions[0])
    let minLon = firstPos.longitude,
      maxLon = firstPos.longitude,
      minLat = firstPos.latitude,
      maxLat = firstPos.latitude,
      minHeight = firstPos.height,
      maxHeight = firstPos.height
    this.positions.slice(1).forEach(pos => {
      const coordinate = cartesian3ToLonLat(pos)
      if (coordinate.longitude < minLon) minLon = coordinate.longitude
      if (coordinate.longitude > maxLon) maxLon = coordinate.longitude
      if (coordinate.latitude < minLat) minLat = coordinate.latitude
      if (coordinate.latitude > maxLat) maxLat = coordinate.latitude
      if (coordinate.height < minHeight) minHeight = coordinate.height
      if (coordinate.maxHeight > maxHeight) maxHeight = coordinate.maxHeight
    })
    return {
      minLon,
      maxLon,
      minLat,
      maxLat,
      minHeight,
      maxHeight
    }
  }

  remove () {
  }

  /**
   * 默认框选区域闭合折线
   * @type {{material: *, width: number, depthFailMaterial}}
   */
  static defaultScopePolyline = {
    material: Cesium.Color.RED,
    width: 4,
    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN
    })
  }
  /**
   * 网格默认参数
   * @type {{material, width: number, depthFailMaterial}}
   */
  static defaultGridPolyline = {
    width: 1,
    material: Cesium.Color.WHITE,
    depthFailMaterial: Cesium.Color.WHITE
  }
}

export default CutFill
