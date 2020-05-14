<template>
  <div>
    <p>{{value}}aaa</p>
    <p>{{text}}11</p>
    <div><button @click="changeValue">修改value</button></div>
  </div>
</template>

<script>
  export default {
    name: 'MySwitch',
    model: {
      prop: 'text',

      event: 'update'
    },
    props: {
      text: {
        type: String
      },
      value: {
        type: String
      }
    },
    methods: {
      changeValue () {
        // this.value = '我是子组件修改后的内容'
        this.$emit('update', '我是子组件修改内容')
      }
    }
  }
</script>

<style scoped>

</style>
