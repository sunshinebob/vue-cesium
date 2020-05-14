import Vue from 'vue'
import Message from './Message'

let messageInstance = null
// 构建子类
const MessageConstructor = Vue.extend(Message)

const init = () => {
  // 创建message实例
  messageInstance = new MessageConstructor()
  // 实例渲染位置，如果不传入选择器，将渲染到文档外的元素
  // 可以想象为document.createElement()在内存外的元素
  messageInstance.$mount()
  document.body.appendChild(messageInstance.$el)
}

const caller = (options) => {
  if (!messageInstance) {
    init()
  }
  messageInstance.add(options)
}

const install = (vue) => {
  vue.prototype.$message = caller
}
export default {
  install
}
