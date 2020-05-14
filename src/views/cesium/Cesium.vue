<template>
  <div class="main">
    <div id="cesiumContainer"></div>
    <div class="toolbar">
      <div class="btn btn-marker" @click="addMarker">添加标记</div>
    </div>
  </div>
</template>

<script>
  import CesiumModel from './secium'
  import {CursorTip} from '../../js/untils'

  export default {
    name: 'Cesium',
    data () {
      return {
        cesiumModel: null
      }
    },
    mounted () {
      this.initCesiumViewer()
    },
    methods: {
      initCesiumViewer () {
        const sceneUrl = 'http://192.168.6.129:8090/iserver/services/3D-G5/rest/realspace'
        this.cesiumModel = new CesiumModel('cesiumContainer')
        this.cesiumModel.openScene(sceneUrl)
      },
      addMarker () {
        this.cesiumModel.openMarkerTool()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    position: relative;
    width: 100%;
    height: 100%;
    #cesiumContainer {
      width: 100%;
      height: 100%;
    }
    .toolbar {
      position: absolute;
      display: flex;
      align-items: center;
      top: 20px;
      left: 20px;
      width: 400px;
      height: 100px;
      padding: 10px;
      background-color: rgba(153, 153, 153, 0.52);
      .btn {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background-color: #7fe1fa;
        cursor: pointer;
        &:active {
          background-color: #6ab3fa;
        }
      }
    }
  }
</style>
