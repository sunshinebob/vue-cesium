<template>
  <div class="fullSize">
    <div class="full-container" id="cesiumContainer"></div>
    <div class="btns">
      <div class="btn" @click="addMarker">点击</div>
      <div class="btn" @click="drawPolyline">画线</div>
      <div class="btn" @click="createGrid">画格子</div>
      <div class="btn" @click="generateDelta">碰撞检测</div>
      <div class="btn" @click="getHeight">获取高层</div>
      <div class="btn" @click="cutFill">土方量测量</div>
    </div>
  </div>
</template>

<script>
  import { CursorTip } from '../../js/untils'
  import { CesiumPolygon, CesiumPolyline } from '../../core/Graphic'
  import { positions } from '@/data/mockData'
  import CutFill from '../../core/CutFill'

  const Cesium = window.Cesium
  const LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK
  const RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK
  const MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE
  export default {
    name: 'CesiumViewer',
    data () {
      return {
        viewer: null
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        // http://api.tianditu.gov.cn/api?v=4.0&tk=69640460bdb8b2a172c41752dd7060d6
        const Cesium = window.Cesium
        const _this = this
        _this.viewerDefaultProperty = {
          timeline: false,
          // 谷歌底图
          imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: 'http://www.google.cn/maps/vt?lyrs=y@800&x={x}&y={y}&z={z}',
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            minimumLevel: 1,
            maximumLevel: 20
          })
        }
        // _this.viewerDefaultProperty = {
        //   // 谷歌底图
        //   imageryProvider: new Cesium.TiandituImageryProvider({
        //     mapStyle: Cesium.TiandituMapsStyle.IMG_C, //天地图全球中文注记服务（经纬度投影）
        //     token: '69640460bdb8b2a172c41752dd7060d6'
        //   })
        // }

        const viewer = new Cesium.Viewer('cesiumContainer', _this.viewerDefaultProperty)
        // const imageryLayers = viewer.imageryLayers
        // const labelImagery = new Cesium.TiandituImageryProvider({
        //   mapStyle : Cesium.TiandituMapsStyle.CIA_C, //天地图全球中文注记服务（经纬度投影）
        //   token:'69640460bdb8b2a172c41752dd7060d6'
        // })
        // imageryLayers.addImageryProvider(labelImagery)
        // this.viewer = viewer
        // // 解决天地图偏暗问题
        // viewer.scene.highDynamicRange = false
        // viewer.scene.fxaa = false
        const g5 = 'https://map.aifaas.cloud:8443/iserver/services/3D-g5/rest/realspace/datas/m-520/config'
        const promise = viewer.scene.addS3MTilesLayerByScp(g5, { name: 'g5' })
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(104.0528, 30.5386, 553),
          duration: 0
        })

        this.cursorTip = new CursorTip(
          '左键标绘，右键结束',
          'marker-tip',
          viewer
        )
        this.viewer = viewer
        this.cursorTip.visible = false

        // const polygon = this.createPolyline({
        //   positions: car3Pos,
        //   isClosed: true
        // })
        // console.log(polygon)
        // const cesiumPolygon = new CesiumPolygon(viewer, positions)
        // let entity = cesiumPolygon.graphic
        // entity.polygon.height = 50
        // entity.polygon.fill = false

        // 坐标转换测试
      },
      cutFill () {
        let car3Pos = positions.map(item => {
          return new Cesium.Cartesian3(item.x, item.y, item.z)
        })
        let cutFill = new CutFill(this.viewer, car3Pos)
        console.log(cutFill)
      },
      getExclude (arrowPositions) {
        const arrow = this.viewer.entities.add({
          polyline: {
            positions: arrowPositions,
            width: 10,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.YELLOW
            ),
          },
        })
        const objectsToExclude = [arrow]
        return objectsToExclude
      },
      async generateDelta () {
        const position = positions[0]
        let {longitude, latitude, height} = this.covertCoordinate(position)
        // const start = new Cesium.Cartesian3(position.x, position.y, position.z)
        // const end = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0)
        console.log(longitude, latitude, height)
        const sightline = new Cesium.Sightline(this.viewer.scene)
        sightline.build()
        const flag = sightline.addTargetPoint({
          position : [longitude, latitude, height],
          name : 'point1'
        })
        console.log(flag)
        sightline .hiddenColor = Cesium.Color.fromCssColorString('rgba(255,255,255,0)')
        sightline .visibleColor  = Cesium.Color.fromCssColorString('rgba(255,255,255,0)')
        sightline.viewPosition = [longitude, latitude, 0]
        // sightline.viewPosition = [longitude, 30.53951833113116, 0]
        // console.log(sightline)
        // setTimeout(() => {
        //   sightline.getBarrierPoint('point1', (res) => {
        //     console.log(res)
        //     sightline.removeAllTargetPoint()
        //   })
        // }, 300)
        const res = await this.getPoint(sightline)
        console.log(res)
      },
      getPoint (sightline) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            sightline.getBarrierPoint('point1', (res) => {
              resolve(res)
              // sightline.removeAllTargetPoint()
            })
          }, 50)
        })
      },
      getHeight () {
        positions.forEach(pos => {
          this.genereateHeight(pos)
        })
      },
      genereateHeight (position) {
        console.log(position)
        const cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z)
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        console.log(longitude, latitude)
        console.log(this.viewer.scene.getHeight(), cartographic.height)
      },
      createGrid () {
        // 计算构造矩形的4个顶点位置
        const firstPos = this.covertCoordinate(positions[0])
        let minLon = firstPos.longitude,
          maxLon = firstPos.longitude,
          minLat = firstPos.latitude,
          maxLat = firstPos.latitude,
          minHeight = firstPos.height,
          maxHeight = firstPos.height
        positions.slice(1).forEach(pos => {
          const coordinate = this.covertCoordinate(pos)
          if (coordinate.longitude < minLon) minLon = coordinate.longitude
          if (coordinate.longitude > maxLon) maxLon = coordinate.longitude
          if (coordinate.latitude < minLat) minLat = coordinate.latitude
          if (coordinate.latitude > maxLat) maxLat = coordinate.latitude
          if (coordinate.height < minHeight) minHeight = coordinate.height
          if (coordinate.maxHeight > maxHeight) maxHeight = coordinate.maxHeight
        })
        const lonStep = (maxLon - minLon) / 20
        const latStep = (maxLat - minLat) / 20
        const baseHeight = (maxHeight + minHeight) / 2
        const options = {
          width: 1,
          material: Cesium.Color.WHITE,
          depthFailMaterial: Cesium.Color.WHITE
        }
        // 构建竖线
        let verticalPolylines = []
        let horizontalPolylines = []
        for (let i = 0; i < 21; i++) {
          let longitude = minLon + i * lonStep
          const startPos = new Cesium.Cartesian3.fromDegrees(longitude, minLat, baseHeight)
          const endPos = new Cesium.Cartesian3.fromDegrees(longitude, maxLat, baseHeight)
          const positions = [startPos, endPos]
          let polyline = this.createPolyline({
            positions,
            options
          })
          verticalPolylines.push(polyline)
        }

        // 构建横线
        for (let j = 0; j < 21; j++) {
          let latitude = minLat + j * latStep
          const startPos = new Cesium.Cartesian3.fromDegrees(minLon, latitude, baseHeight)
          const endPos = new Cesium.Cartesian3.fromDegrees(maxLon, latitude, baseHeight)
          const positions = [startPos, endPos]
          let polyline = this.createPolyline({
            positions,
            options
          })
          horizontalPolylines.push(polyline)
        }
        console.log(verticalPolylines, horizontalPolylines)

      },
      covertCoordinate (position) {
        const cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z)
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        return {
          longitude,
          latitude,
          height: cartographic.height
        }
      },

      drawPolyline () {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
        let polyline = null
        let positions = []
        const self = this
        const handlerLeftClick = (e) => {
          const cartesian = self.viewer.scene.pickPosition(e.position)
          console.log(self.covertCoordinate(cartesian))
          // console.log(cartesian)
          if (positions.length === 0) {
            positions.push(cartesian.clone())
          }
          positions.push(cartesian)
        }
        const handlerMouseMove = function (e) {
          let cartesian = self.viewer.scene.pickPosition(e.endPosition)
          if (positions.length >= 2) {
            if (!Cesium.defined(polyline)) {
              polyline = new CesiumPolyline(self.viewer, positions)
            } else {
              if (cartesian !== undefined) {
                positions.pop()
                positions.push(cartesian)
              }
            }
          }
        }
        const handlerRightClick = function () {
          positions.pop()
          polyline.destroy()
          const res = self.createPolyline(positions)
          console.log(res)
          console.log(positions)
          handler.removeInputAction(LEFT_CLICK)
          handler.removeInputAction(RIGHT_CLICK)
          handler.removeInputAction(MOUSE_MOVE)
          Cesium.defined(polyline) && console.log(polyline)
        }
        handler.setInputAction(handlerLeftClick, LEFT_CLICK)
        handler.setInputAction(handlerRightClick, RIGHT_CLICK)
        handler.setInputAction(handlerMouseMove, MOUSE_MOVE)
      },

      addMarker () {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
        let polygon = null
        let positions = []
        const self = this
        const pick = function (e) {
          console.log(e.position)
          const cartesian = self.viewer.scene.pickPosition(e.position)
          console.log(self.covertCoordinate(cartesian))
          // console.log(cartesian)
          if (positions.length === 0) {
            positions.push(cartesian.clone())
          }
          positions.push(cartesian)
        }
        const updatePolyline = function (e) {
          self.cursorTip.updatePosition(e.endPosition)
          let cartesian = self.viewer.scene.pickPosition(e.endPosition)
          if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
              polygon = self.createPolygon(positions)
            } else {
              if (cartesian !== undefined) {
                positions.pop()
                positions.push(cartesian)
              }
            }
          }
        }
        const complete = function () {
          positions.pop()
          handler.removeInputAction(LEFT_CLICK)
          handler.removeInputAction(RIGHT_CLICK)
          handler.removeInputAction(MOUSE_MOVE)
          self.cursorTip.visible = false
          Cesium.defined(polygon) && console.log(polygon)
        }
        handler.setInputAction(pick, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        handler.setInputAction(complete, RIGHT_CLICK)
        handler.setInputAction(updatePolyline, MOUSE_MOVE)
      },
      createPolyline ({ positions, options = {}, isClosed = false }) {
        const material = options.material || Cesium.Color.RED
        const width = options.width || 4
        const depthFailMaterial = options.depthFailMaterial || new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.CYAN
        })
        if (isClosed) {
          positions.push(positions[0].clone())
        }
        const polylineOptions = {
          id: this.generateId(),
          type: 'polyline',
          name: 'Blue dashed line',
          polyline: {
            positions,
            width,
            material,
            depthFailMaterial,
            arcType: Cesium.ArcType.NONE
          }
        }
        console.log(polylineOptions)
        const polyline = this.viewer.entities.add(polylineOptions)
        return polyline
      },
      createPolygon (positions) {
        return new CesiumPolygon(
          this.viewer,
          positions
        )
      },
      generateId () {
        return (
          (Math.random() * 10000000).toString(16).substr(0, 4) +
          '-' +
          new Date().getTime() +
          '-' +
          Math.random().toString().substr(2, 5)
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btns {
    position: absolute;
    left: 100px;
    top: 100px;
    display: flex;

    .btn {
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #89d4ff;
      color: #fff;
      cursor: pointer;
    }

    .btn + .btn {
      margin-left: 10px;
    }
  }

</style>
