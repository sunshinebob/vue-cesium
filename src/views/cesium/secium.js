import { createTooltip } from './tooltip'

const Cesium = window.Cesium
// bin地图access_key
const BING_MAP_KEY = 'AoYWP4oApRkB0gyraUkMkJ-FNAqTOzNBfwgQYZflN0vDRLnD8KrwEm8lmLdwFYFh'

class CesiumModel {
  constructor (target, options = null) {
    this.cesium = Cesium
    this.viewer = null
    // 创建提示框
    this.tooltip = createTooltip(document.body)
    // 初始化场景
    this._init(target, options)
  }

  _init (target) {
    if (!target) {
      throw new Error('绑定目标tarter不存在')
    }
    this.viewer = new this.cesium.Viewer(target)
    // 添加bingMap地图
    this.viewer.imageryLayers.addImageryProvider(new this.cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: this.cesium.BingMapsStyle.AERIAL,
      key: BING_MAP_KEY
    }))
  }

  /**
   * 添加三维模型到场景
   * @param sceneUrl 模型URL
   * @param options 配置参数
   */
  openScene (sceneUrl, options) {
    if (!this.viewer) return
    const scene = this.viewer.scene
    const widget = this.viewer.cesiumWidget
    try {
      const promise = scene.open(sceneUrl)
      this.cesium.when(promise, layers => {

      }, () => {
        const errMsg = '加载模型失败，请检查网络连接状态'
        widget.showErrorPanel(errMsg)
      })
    } catch (e) {
      const errMsg = '渲染发生错误，已停止渲染'
      widget.showErrorPanel(errMsg)
    }
  }

  /**
   * 开启点标记工具
   */
  openMarkerTool () {
    const handlerMarker = new this.cesium.DrawHandler(this.viewer, this.cesium.DrawMode.Marker)
    handlerMarker.activate()
    handlerMarker.movingEvt.addEventListener(pos => {
      console.log(pos)
      this.tooltip.showAt(pos, '点击插入标记')
    })
    handlerMarker.drawEvt.addEventListener((evt) =>{
      console.log(evt)
      this.tooltip.setVisible(false)
    })
  }

}

export default CesiumModel
