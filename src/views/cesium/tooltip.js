class Tooltip {
  constructor (frameDiv) {
    this._div = null
    this._title = null
    this.message = ''
    this._initTooltip(frameDiv)
  }

  /**
   * 创建提示框，并将提示框dom节点添加到指定父节点
   * @param frameDiv 父节点
   * @private
   */
  _initTooltip (frameDiv) {
    const div = document.createElement('div')
    div.className = 'twipsy right'

    const arrow = document.createElement('div')
    arrow.className = 'twipsy-arrow'
    div.appendChild(arrow)

    const title = document.createElement('div')
    title.className = 'twipsy-inner'
    div.appendChild(title)

    frameDiv.appendChild(div)
    this._div = div
    this._title = title

    const self = this
    div.addEventListener('mousemove', (event) => {
      const position = {
        x: event.clientX,
        y: event.clientY
      }
      self.showAt(position, self.message)
    })
  }

  /**
   * 设置tooltip显示或隐藏
   * @param visible
   */
  setVisible (visible) {
    this._div.style.display = visible ? 'block' : 'none'
  }

  /**
   * 守则tooltip显示位置
   * @param position
   * @param message
   */
  showAt (position, message) {
    if (position && message) {
      this.setVisible(true)
      this._title.innerHTML = message
      this._div.style.left = `${position.x + 10}px`
      this._div.style.top = `${position.y - this._div.clientHeight / 2}px`
      this.message = message
    }
  }
}

export function createTooltip (frameDiv) {
  frameDiv = frameDiv || document.body
  return new Tooltip(frameDiv)
}
