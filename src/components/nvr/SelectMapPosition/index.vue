<template>
  <div>
    <el-dialog
        draggable
        title="选择地图位置"
        width="800"
        top="5re"
        :close-on-click-modal="false"
        v-model="showDialog"
        :destroy-on-close="true"
        @close="close()"
    >
      <!-- 地址信息显示区域 -->
      <div class="map-info-panel">
        <div class="info-item">
          <span class="info-label">详细地址：</span>
          <span class="info-value">{{ addressText || '点击地图选择位置' }}</span>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">经度：</span>
            <span class="info-value">{{ data.lng || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">纬度：</span>
            <span class="info-value">{{ data.lat || '-' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 地图容器 -->
      <div style="width: 100%;height: 400px" id="SelectMapPosition"></div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit">确 定</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SelectMapPosition" lang="js">
import { ref, nextTick } from "vue";
import { ElMessage } from "element-plus";

const emit = defineEmits(['onSubmit']);

defineExpose({ openDialog })

let map;
const zoom = 12;
let marker = null;
const showDialog = ref(false);
const data = ref({
  lat: null,
  lng: null,
});
const addressText = ref('');

// 逆地理编码获取地址
function reverseGeocode(lat, lng) {
  // 使用天地图逆地理编码服务
  const postStr = JSON.stringify({ lon: lng, lat: lat, ver: 1 });
  const url = `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=YOUR_TK`;
  
  // 由于天地图 API 需要 key，这里使用简单的坐标显示
  // 实际项目中可以配置天地图 key 进行逆地理编码
  addressText.value = `经度: ${lng.toFixed(6)}, 纬度: ${lat.toFixed(6)}`;
}

function openDialog(e) {
  showDialog.value = true;
  addressText.value = '';
  
  nextTick(() => {
    map = new T.Map('SelectMapPosition', {
      projection: 'EPSG:4326'
    });
    
    let center;
    if (e.lat || e.lng) {
      center = new T.LngLat(e.lng, e.lat);
      data.value.lat = e.lat;
      data.value.lng = e.lng;
      reverseGeocode(e.lat, e.lng);
    } else {
      center = new T.LngLat(116.39122, 39.90684);
      data.value.lat = null;
      data.value.lng = null;
    }
    
    // 设置显示地图的中心点和级别
    map.centerAndZoom(center, zoom);
    map.addEventListener("click", mapClick);

    // 创建缩放平移控件
    const control = new T.Control.Zoom();
    map.addControl(control);
    
    // 创建比例尺控件
    const scale = new T.Control.Scale();
    map.addControl(scale);

    // 创建小地图控件
    const miniMap = new T.Control.OverviewMap({
      isOpen: true,
      size: new T.Point(150, 150)
    });
    map.addControl(miniMap);

    // 创建地图类型控件
    const ctrl = new T.Control.MapType();
    map.addControl(ctrl);

    // 创建右键菜单
    const menu = new T.ContextMenu({
      width: 100
    });
    
    const txtMenuItem = [
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

    for (let i = 0; i < txtMenuItem.length; i++) {
      const menuItem = new T.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback);
      menu.addItem(menuItem);
      if (i === 1) {
        menu.addSeparator();
      }
    }
    map.addContextMenu(menu);

    // 如果已有坐标，显示标记
    if (e.lat || e.lng) {
      addMarker(e.lng, e.lat);
    }
  });
}

// 添加标记点
function addMarker(lng, lat) {
  const icon = new T.Icon({
    iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
    iconSize: new T.Point(19, 27),
    iconAnchor: new T.Point(10, 25)
  });

  if (marker) {
    map.removeOverLay(marker);
  }
  
  marker = new T.Marker(new T.LngLat(lng, lat), { icon: icon });
  map.addOverLay(marker);
}

function close() {
  showDialog.value = false;
  addressText.value = '';
}

function mapClick(e) {
  const lng = e.lnglat.getLng();
  const lat = e.lnglat.getLat();
  
  // 添加标记
  addMarker(lng, lat);
  
  // 更新坐标
  data.value.lat = lat;
  data.value.lng = lng;
  
  // 逆地理编码获取地址
  reverseGeocode(lat, lng);
}

function onSubmit() {
  if (!data.value.lat || !data.value.lng) {
    ElMessage({
      message: '请选择位置',
      type: 'error',
    });
    return;
  }
  
  close();
  emit('onSubmit', {
    lat: data.value.lat,
    lng: data.value.lng,
    address: addressText.value
  });
}
</script>

<style scoped>
.map-info-panel {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.info-item {
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-row {
  display: flex;
  gap: 24px;
}

.info-label {
  color: #606266;
  font-size: 13px;
}

.info-value {
  color: #303133;
  font-size: 13px;
  font-weight: 500;
}
</style>
