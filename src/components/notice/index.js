import Vue from 'vue'
import Notice from './Notice'

let noticeInstance = null
// 创建子类
const NoticeConstructor = Vue.extend(Notice)

// 初始化notice实例
const init = () => {
  noticeInstance = new NoticeConstructor()
  noticeInstance.$mount()
  document.body.appendChild(noticeInstance.$el)
}

const caller = (options) => {
  if (!noticeInstance) {
    init()
  }
  noticeInstance.add(options)
}

const install = (vue) => {
  vue.prototype.$notice = caller
}

export default {
  install
}
