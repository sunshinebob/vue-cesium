const Cesium = window.Cesium

class CursorTip {
  constructor (text, id, viewer) {
    this.el = null
    this._visible = true
    this._initTooltip(text, id, viewer)
  }

  _initTooltip (text, id, viewer) {
    const tooltip = document.createElement('div')
    tooltip.className = 'twipsy right'
    tooltip.id = id || 'cursor-tip'
    const arrow = document.createElement('div')
    arrow.className = 'twipsy-arrow'
    tooltip.appendChild(arrow)
    const title = document.createElement('div')
    title.className = 'twipsy-inner'
    title.innerHTML = text || '左键点击，右键取消'
    tooltip.appendChild(title)
    document.body.appendChild(tooltip)
    this.el = tooltip
    const self = this
    if (viewer instanceof Cesium.Viewer) {
      // 设置tooltip跟随鼠标移动
      viewer.screenSpaceEventHandler.setInputAction(e => {
        self.updatePosition(e.endPosition)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
  }

  updatePosition (pixel) {
    this.el.style.left = `${pixel.x + 10}px`
    this.el.style.top = `${pixel.y + 10}px`
  }

  updateText (text) {
    this.el.innerHTML = text
  }

  get visible () {
    return this._visible
  }

  set visible (v) {
    this._visible = v
    this.el.style.display = v ? 'block' : 'none'
  }
}

export {
  CursorTip
}
