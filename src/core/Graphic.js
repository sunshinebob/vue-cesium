import GraphicType from './GRaphicType'

const Cesium = window.Cesium

export function generateId () {
  return (
    (Math.random() * 10000000).toString(16).substr(0, 4) +
    '-' +
    new Date().getTime() +
    '-' +
    Math.random().toString().substr(2, 5)
  )
}


/**
 *  @Author: Bob
 *  @Date: 2020-31-15 14:31:51
 *  @LastEditTime: 2020-31-15 14:31:51
 *  @Desc: 定义基础图像，包括点、线、面
 */

class BaseGraphic {
  constructor (viewer) {
    if (viewer instanceof Cesium.Viewer === false) {
      throw new Error('viewer 不是一个有效的Cesium Viewer对象')
    }
    this.viewer = viewer
    this._type = undefined
    this._gvtype = undefined
    this._gvid = undefined
    this._name = undefined
    this.graphic = undefined
  }

  get gvtype () {
    return this._gvtype
  }

  set gvtype (v) {
    this._gvtype = v
  }

  get gvid () {
    return this._gvid
  }

  set gvid (v) {
    this._gvid = v
  }

  get show () {
    if (this.graphic) {
      return this.graphic.show
    }
    return false
  }

  set show (v) {
    if (this.graphic) {
      this.graphic.show = v
    }
  }

  flyTo () {
    if (this.graphic) {
      this.viewer.flyTo(this.graphic)
    }
  }
}

class CesiumBillboard extends BaseGraphic {
  /**
   * Cesium Marker
   * @param viewer Cesium Viewer
   * @param options
   * 遵循Cesium billboard方式
   */
  constructor (viewer, options, data = {}) {
    super(viewer)
    this.viewer = viewer
    this._type = 'Marker'
    this.gvtype = GraphicType.MARKER
    this.gvid = generateId()
    this.position = options.position
    this.data = data
    const { longitude, latitude, height } = { ...this.position }
    const billboardOptions = {
      ...CesiumBillboard.defaultStyle,
      ...options
    }

    this.options = {
      gvtype: this.gvtype,
      id: this.gvid,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 0.5),
      billboard: billboardOptions
    }
    this.create()
  }

  create () {
    this.graphic = this.viewer.entities.add(this.options)
  }

  remove () {
    if (this.viewer) {
      this.viewer.entities.remove(this.graphic)
    }
    this.graphic = null
  }

  destroy () {
    this.remove()
    this.viewer = null
    this.options = undefined
    this.position = undefined
  }

  static defaultStyle = {
    image: 'https://faas-file.oss-cn-shenzhen.aliyuncs.com/icon/marker.png',
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 设置图标水平方向居中
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM // 设置图标图片底部接触场景
  }
}

/**
 * Cesium折线类
 */
class CesiumPolyline extends BaseGraphic {
  constructor (viewer, positions, options = CesiumPolyline.defaultStyle) {
    super(viewer)
    this.viewer = viewer
    this.gvid = generateId()
    this.gvtype = GraphicType.POLYLINE
    this.positions = positions
    const self = this
    const _update = function () {
      return self.positions
    }
    options.height = 10
    this.options = {
      id: this.gvid,
      gvtype: this.gvtype,
      polyline: options
    }
    this.options.polyline.positions = new Cesium.CallbackProperty(_update, false)
    this.create()
  }

  create () {
    if (this.viewer) {
      this.graphic = this.viewer.entities.add(this.options)
    }
  }

  remove () {
    if (this.viewer && this.graphic) {
      this.viewer.entities.remove(this.graphic)
    }
  }

  destroy () {
    this.remove()
    this.viewer = undefined
    this.positions = undefined
    this.options = undefined
  }

  static defaultStyle = {
    width : 4,
    arcType: Cesium.ArcType.NONE,
    material: Cesium.Color.BLUE,
    depthFailMaterial : new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN
    })
  }
}

class CesiumPolygon extends BaseGraphic {
  constructor (viewer, positions, options = CesiumPolygon.defaultStyle) {
    super(viewer)
    this.viewer = viewer
    this.gvid = generateId()
    this.gvtype = GraphicType.POLYLINE
    this.positions = positions
    const self = this
    const _update = function () {
      return self.positions
    }
    this.options = {
      id: this.gvid,
      gvtype: this.gvtype,
      name: 'polygon',
      polygon: options,
      // 设置图形贴模型
      clampToS3M: true
    }
    this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false)
    this.outlineGraphic = undefined // 多边形外边框
    this.create()
  }

  create () {
    this.graphic = this.viewer.entities.add(this.options)
    // this.createOutline()
  }

  createOutline () {
    this.outlineGraphic = new CesiumPolyline(this.viewer, this.positions)
  }

  remove () {
    if (this.viewer && this.graphic) {
      this.viewer.entities.remove(this.graphic)
    }
  }

  destroy () {
    this.remove()
    this.viewer = undefined
    this.positions = undefined
    this.options = undefined
    if (this.outlineGraphic) {
      this.outlineGraphic.destroy()
    }
    this.outlineGraphic = undefined
  }

  static defaultStyle = {
    /* eslint-disable */
    material: new Cesium.Color.fromCssColorString('rgba(255,255,255,0.1)'),
    // fill: false,
    outline: true, // 设置外边
    outlineColor: Cesium.Color.RED,
    // outlineColor: new Cesium.Color.fromCssColorString('rgb(255,255,255)'),
    perPositionHeight: true // 是否设置每个点的高度

    // outlineWidth: 2,
    // material: new Cesium.Color(1.0, 0.0, 0.0, 0.3)
  }
}

export {
  CesiumBillboard,
  CesiumPolyline,
  CesiumPolygon
}
