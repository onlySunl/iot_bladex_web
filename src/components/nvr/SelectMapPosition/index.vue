<template>
  <div>
    <el-dialog
        draggable
        title="选择地图位置"
        width="800px"
        top="5vh"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >
      <div style="width: 100%;height: 500px" id="SelectMapPosition"></div>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit">确 定</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
/* global T */
var map;
var zoom = 12;
var marker = null;

export default {
  name: 'SelectMapPosition',
  data() {
    return {
      showDialog: false,
      data: {
        lat: null,
        lng: null,
      },
    };
  },
  methods: {
    openDialog(e) {
      this.showDialog = true;
      this.$nextTick(() => {
        map = new T.Map('SelectMapPosition', {
          projection: 'EPSG:4326'
        });
        let center;
        if (e.lat || e.lng) {
          center = new T.LngLat(e.lng, e.lat, zoom);
        } else {
          center = new T.LngLat(116.39122, 39.90684, zoom);
        }
        map.centerAndZoom(center, zoom);
        map.addEventListener("click", this.mapClick);

        var control = new T.Control.Zoom();
        map.addControl(control);
        var scale = new T.Control.Scale();
        map.addControl(scale);

        var miniMap = new T.Control.OverviewMap({
          isOpen: true,
          size: new T.Point(150, 150)
        });
        map.addControl(miniMap);

        var ctrl = new T.Control.MapType();
        map.addControl(ctrl);

        var menu = new T.ContextMenu({
          width: 100
        });
        var txtMenuItem = [
          {
            text: '放大',
            callback: function () {
              map.zoomIn();
            }
          },
          {
            text: '缩小',
            callback: function () {
              map.zoomOut();
            }
          },
          {
            text: '查看全国',
            callback: function () {
              map.setZoom(4);
            }
          }
        ];

        for (var i = 0; i < txtMenuItem.length; i++) {
          var menuItem = new T.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback);
          menu.addItem(menuItem);
          if (i == 1) {
            menu.addSeparator();
          }
        }
        map.addContextMenu(menu);

        if (e.lat || e.lng) {
          this.data.lat = e.lat;
          this.data.lng = e.lng;
          var icon = new T.Icon({
            iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
            iconSize: new T.Point(19, 27),
            iconAnchor: new T.Point(10, 25)
          });

          if (marker) {
            map.removeOverLay(marker);
          }
          marker = new T.Marker(new T.LngLat(e.lng, e.lat), {icon: icon});
          map.addOverLay(marker);
        } else {
          this.data.lat = null;
          this.data.lng = null;
        }
      });
    },
    close() {
      this.showDialog = false;
    },
    mapClick(e) {
      var icon = new T.Icon({
        iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      });

      if (marker) {
        map.removeOverLay(marker);
      }
      marker = new T.Marker(new T.LngLat(e.lnglat.getLng(), e.lnglat.getLat()), {icon: icon});
      map.addOverLay(marker);
      this.data.lat = e.lnglat.getLat();
      this.data.lng = e.lnglat.getLng();
    },
    onSubmit() {
      if (!this.data.lat || !this.data.lng) {
        this.$message({
          message: '请选择位置',
          type: 'error',
        });
        return;
      }
      this.close();
      this.$emit('onSubmit', this.data);
    },
  },
};
</script>

<style scoped>
</style>
