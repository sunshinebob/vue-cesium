const Cesium = window.Cesium
const LEFT_CLICK = Cesium.ScreenSpaceEventType.LEFT_CLICK
const RIGHT_CLICK = Cesium.ScreenSpaceEventType.RIGHT_CLICK
const MOUSE_MOVE = Cesium.ScreenSpaceEventType.MOUSE_MOVE
const MOUSE_DOWN = Cesium.ScreenSpaceEventType.MOUSE_DOWN
const MOUSE_UP = Cesium.ScreenSpaceEventType.MOUSE_UP

class CesiumDrawing {
  constructor (viewer, options = {}) {
    if (viewer instanceof Cesium.Viewer === false) {
      throw new Error('viewer 不是一个有效的Cesium viewer')
    }
    this.viewer = viewer
    this.options = options
  }

  create () {
  }

  remove () {
  }

  destroy () {
  }

  static defaultStyle = {
    clampToGround: true,
    material: Cesium.Color.fromCssColorString('rgb(255,255,255, 0.1)'),
    width: 3
  }
}

export {
  CesiumDrawing
}
