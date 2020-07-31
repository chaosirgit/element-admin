<template>
  <div class="amap-page-container">
    <el-amap
      ref="map"
      vid="amapDemo"
      :amap-manager="AMapManager"
      :center="center"
      :zoom="zoom"
      :plugin="plugin"
      :events="events"
      class="amap-demo"
    />

    <div class="toolbar">
      <button @click="getMap()">get map</button>
    </div>
  </div>
</template>

<style>
  .amap-demo {
    height: 300px;
  }
</style>

<script>
// NPM 方式
import { AMapManager } from 'vue-amap'
// CDN 方式
// let amapManager = new VueAMap.AMapManager();
export default {
  data: function() {
    return {
      AMapManager,
      zoom: 12,
      center: [121.59996, 31.197646],
      events: {
        init: (o) => {
          console.log(o.getCenter())
          console.log(this.$refs.map.$$getInstance())
          o.getCity(result => {
            console.log(result)
          })
        },
        'moveend': () => {
        },
        'zoomchange': () => {
        },
        'click': (e) => {
          alert('map clicked')
        }
      },
      plugin: ['ToolBar', {
        pName: 'MapType',
        defaultType: 0,
        events: {
          init(o) {
            console.log(o)
          }
        }
      }]
    }
  },

  methods: {
    getMap() {
      // amap vue component
      console.log(AMapManager._componentMap)
      // gaode map instance
      console.log(AMapManager._map)
    }
  }
}
</script>
