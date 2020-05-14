import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.scss'
import Message from '@/components/message'
import Notice from '@/components/notice'

Vue.use(Message)
Vue.use(Notice)
// import SuperMapCesium from 'vue-cesium-supermap'
// 引入超图cesium
// Vue.use(SuperMapCesium, {
//   // cesiumPath: './assets/Cesium/Cesium'
//   cesiumPath: 'https://lauxb.github.io/vue-cesium-supermap/Cesium'
// })

// import VueCesium from 'vue-cesium'
// // VueCesium 默认使用 `https://unpkg.com/cesium/Build/Cesium/Cesium.js`
// Vue.use(VueCesium, {
//   cesiumPath: 'https://unpkg.com/cesium/Build/Cesium/Cesium.js'
// })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
