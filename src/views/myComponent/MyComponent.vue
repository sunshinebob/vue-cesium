<template>
  <div>
    <button @click="showMessage">测试</button>
    <button @click="showInfo">测试</button>
    <div class="switchWrapper">
      <MySwitch v-model="text" value="我是父组件value"></MySwitch>
      <div><button @click="changeText">父组件修改</button></div>
    </div>
  </div>
</template>

<script>
  import MySwitch from '@/components/mySwitch/MySwitch'
  export default {
    name: 'MyComponent',
    components: {
      MySwitch
    },
    data () {
      return {
        text: '我是父组件修改内容'
      }
    },
    methods: {
      changeText () {
        this.text = '我是父组件修改的内容'
      },
      showMessage () {
        this.$notice({
          type: 'success',
          content: '我是success',
          duration: '3000'
        })
      },
      showInfo () {
        this.$notice({
          type: 'info',
          content: '我是info'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .switchWrapper {
    width: 300px;
    margin: 0 auto;
  }
</style>
