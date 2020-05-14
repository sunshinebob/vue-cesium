<template>
  <div>
    <CesiumViewer @addEvent="addMarker" ref="cesiumViewer"></CesiumViewer>
  </div>
</template>

<script>
  import CesiumViewer from '@/components/cesiumViewer/CesiumViewer'
  export default {
    name: 'Layout',
    mounted () {
      // this.$refs.cesiumViewer.init()
    },
    methods: {
      addMarker (e) {
        console.log(e)
      }
    },
    components: {
      CesiumViewer
    }
  }
</script>

<style scoped>

</style>
