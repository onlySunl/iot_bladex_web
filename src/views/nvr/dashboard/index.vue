<template>

  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-left">
        <div class="logo-icon">
          <i class="el-icon-monitor"></i>
        </div>
        <div class="header-title">
          <h1>智能视频监控大屏</h1>
          <p>Intelligent Video Monitoring Dashboard</p>
        </div>
      </div>
      
      <div class="header-center">
        <div class="stat-card">
          <div class="stat-value">{{ deviceStats.total || 0 }}</div>
          <div class="stat-label">设备总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value online">{{ deviceStats.online || 0 }}</div>
          <div class="stat-label">在线设备</div>
        </div>
        <div class="stat-card">
          <div class="stat-value offline">{{ deviceStats.offline || 0 }}</div>
          <div class="stat-label">离线设备</div>
        </div>
      </div>

      <div class="header-right">
        <div class="current-time">
          <div class="time-date">{{ currentDate }}</div>
          <div class="time-clock">{{ currentTime }}</div>
        </div>
        <div class="header-actions">
          <el-button :icon="el-icon-setting" @click="goBack" class="action-btn">系统</el-button>
          <el-button :icon="el-icon-refresh" @click="refreshData" class="action-btn">刷新</el-button>
          <el-button :icon="el-icon-full-screen" @click="toggleFullScreen" class="action-btn">全屏</el-button>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-panel left-panel">
        <div class="panel-card">
          <div class="panel-title">
            <div class="title-icon">
              <i class="el-icon-s-unfold"></i>
            </div>
            <span>设备列表</span>
            <div class="panel-tools">
              <el-switch
                v-model="showRegion"
                active-text="行政区划"
                inactive-text="业务分组"
                @change="handleTreeTypeChange"
              />
            </div>
          </div>
          <div class="panel-body device-list">
            <div v-if="showRegion">
              <RegionTree
                ref="regionTreeRef"
                :showIndex="false"
                :showContextmenu="false"
                :hasDevice="true"
                @handleNodeClick="handleDeviceClick"
                :isContextmenu="false"
              />
            </div>
            <div v-else>
              <GroupTree
                ref="groupTreeRef"
                :showIndex="false"
                :showContextmenu="false"
                :hasDevice="true"
                @handleNodeClick="handleDeviceClick"
                :isContextmenu="false"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-panel center-panel">
        <div class="panel-card video-card">
          <div class="panel-title">
            <div class="title-icon">
              <i class="el-icon-video-play"></i>
            </div>
            <span>实时视频预览</span>
            <div class="panel-tools">
              <div v-if="centerTab === 'video'" class="split-tools-inline">
                <el-radio-group v-model="splitCount" size="small" @change="handleSplitChange" class="split-radio-group">
                  <el-radio-button :value="1">1屏</el-radio-button>
                  <el-radio-button :value="4">4屏</el-radio-button>
                  <el-radio-button :value="6">6屏</el-radio-button>
                  <el-radio-button :value="9">9屏</el-radio-button>
                  <el-radio-button :value="12">12屏</el-radio-button>
                  <el-radio-button :value="16">16屏</el-radio-button>
                  <el-radio-button :value="25">25屏</el-radio-button>
                </el-radio-group>
              </div>
              <el-tabs v-model="centerTab" type="card" size="small">
                <el-tab-pane label="视频" name="video" />
                <el-tab-pane label="地图" name="map" />
              </el-tabs>
            </div>
          </div>
          <div class="panel-body" v-show="centerTab === 'video'">
            <div class="video-grid" :style="gridStyle">
              <div
                v-for="i in splitCount"
                :key="i"
                class="video-item"
                :class="{ active: playerIdx === (i-1) }"
                @click="playerIdx = (i-1)"
              >
                <div v-if="!videoUrls[i-1]" class="no-video" :style="{ gap: `${getNoVideoSize(i-1).gap}px` }">
                  <div class="no-video-icon" :style="{ width: `${getNoVideoSize(i-1).iconSize}px`, height: `${getNoVideoSize(i-1).iconSize}px`, borderRadius: `${getNoVideoSize(i-1).iconSize / 4}px` }">
                    <el-icon :size="getNoVideoSize(i-1).iconSize * 0.6"><VideoCamera /></el-icon>
                  </div>
                  <span :style="{ fontSize: `${getNoVideoSize(i-1).fontSize}px` }">{{ videoTips[i-1] || '选择设备播放' }}</span>
                </div>
                <div v-else class="video-player">
                  <div class="close-btn" @click.stop="deleteClick(i-1)" :style="{ 
                    width: `${Math.max(20, 28 - (splitCount - 1) * 0.3)}px`, 
                    height: `${Math.max(20, 28 - (splitCount - 1) * 0.3)}px`, 
                    borderRadius: `${Math.max(4, 8 - (splitCount - 1) * 0.15)}px`,
                    top: `${Math.max(4, 8 - (splitCount - 1) * 0.15)}px`,
                    right: `${Math.max(4, 8 - (splitCount - 1) * 0.15)}px`
                  }">
                    <el-icon :size="Math.max(12, 16 - (splitCount - 1) * 0.2)"><Close /></el-icon>
                  </div>
                  <EasyPlayer
                      :ref="`dashboard-player${i-1}`"
                      :id="`dashboard-player${i-1}`"
                      class="easy-player"
                      width="100"
                      height="100"
                      :isPercentage="true"
                      :quality="quality"
                      :defaultQuality="defaultQuality"
                      :isPtz="isPtz"
                      :isQuality="isQuality"
                      :hasAudio="enableAudio[i-1] === '1'"
                      :isMute="enableAudio[i-1] === '1'"
                      :isLive="isLive"
                      :videoUrl="videoUrls[i-1]"
                    />
                </div>
              </div>
            </div>
          </div>
          <div class="panel-body" v-show="centerTab === 'map'" id="dashboard-map" style="height: 100%;"></div>
        </div>
      </div>

      <div class="dashboard-panel right-panel">
        <div class="panel-card">
          <div class="panel-title">
            <div class="title-icon">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <span>设备统计</span>
          </div>
          <div class="panel-body">
            <div class="device-stats-wrapper">
              <LeftTop ref="leftTopRef" />
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-title">
            <div class="title-icon">
              <el-icon><Odometer /></el-icon>
            </div>
            <span>系统资源</span>
          </div>
          <div class="panel-body">
            <el-tabs v-model="activeResourceTab" class="resource-tabs" @tab-change="handleResourceTabChange">
              <el-tab-pane label="CPU" name="cpu">
                <div class="resource-item-wrapper" v-if="activeResourceTab === 'cpu'" :key="'cpu-' + tabKey">
                  <RightTop ref="rightTopRef" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="网络" name="net">
                <div class="resource-item-wrapper" v-if="activeResourceTab === 'net'" :key="'net-' + tabKey">
                  <LeftBottom ref="leftBottomRef" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="内存" name="mem">
                <div class="resource-item-wrapper" v-if="activeResourceTab === 'mem'" :key="'mem-' + tabKey">
                  <BottomCenter ref="bottomCenterRef" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="磁盘" name="disk">
                <div class="resource-item-wrapper" v-if="activeResourceTab === 'disk'" :key="'disk-' + tabKey">
                  <RightBottom ref="rightBottomRef" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="媒体服务" name="media">
                <div class="resource-item-wrapper" v-if="activeResourceTab === 'media'" :key="'media-' + tabKey">
                  <TopCenter ref="topCenterRef" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <el-dialog :title="`视频播放-${mapDeviceRow.deviceName || ''}`"
               v-model="easyPlayerOpen"
               width="840px"
               append-to-body
               draggable
               @close="closeEasyPlayer"
               :z-index="99999"
               class="dashboard-video-dialog"
    >
      <div style="width: 100%;height: 100%;display: flex;justify-content: center" v-if="easyPlayerOpen">
        <EasyPlayer
            ref="mapEasyPlayerRef"
            style="width: 800px;height: 400px;"
            width="100"
            height="100"
            :isPercentage="true"
            :quality="mapQuality"
            :defaultQuality="mapDefaultQuality"
            :isPtz="mapIsPtz"
            :isQuality="mapIsQuality"
            :hasAudio="mapDeviceRow.enableAudio === '1'"
            :isMute="mapDeviceRow.enableAudio === '1'"
            :isLive="mapIsLive"
            :videoUrl="mapWsUrl"
            @ptz="handleMapPtz"/>
      </div>

      <el-tabs v-model="mapTabActiveName"
               type="card"
               :stretch="true"
               v-if="easyPlayerOpen"
               style="margin-top: 10px;">
        <el-tab-pane label="实时视频" name="media">
          <el-row :gutter="10">
            <el-col :span="3"><span style="width: 80px; line-height: 40px; text-align: right;">播放地址：</span></el-col>
            <el-col :span="21">
              <el-input v-model="mapFlvUrl" :disabled="true">
                <template slot="prepend">flv地址
</template>

<script>
import { ElMessage, ElLoading } from 'element-plus'
import screenFull from 'screenfull'
import LeftTop from '../../components/home/left-top.vue'
import TopCenter from '../../components/home/top-center.vue'
import RightTop from '../../components/home/right-top.vue'
import LeftBottom from '../../components/home/left-bottom.vue'
import BottomCenter from '../../components/home/bottom-center.vue'
import RightBottom from '../../components/home/right-bottom.vue'
import RegionTree from '@/views/components/common/RegionTree.vue'
import GroupTree from '@/views/components/common/GroupTree.vue'
import EasyPlayer from '@/components/nvr/EasyPlayer'
import StreamDropdown from '@/components/nvr/Channel/streamDropdown.vue'
import MediaInfo from '@/components/nvr/Channel/mediaInfo.vue'
import { getDeviceStatistics, getSystemInfo } from '@/api/nvr/system'
import { getMediaLoad } from '@/api/nvr/zlm'
import { getDevice, getVideoSnapshot, updateDevice, startPtz, endPtz, getPresetList, setPreset, gotoPreset, deletePreset } from '@/api/nvr/device'
import { queryRegionForDevice } from '@/api/nvr/region'
import { queryGroupForDevice } from '@/api/nvr/group'
import { getConfigKey } from '@/api/system/config'
import { streamPullPlay, rtpPlay, streamPullPush, startGb28181Play, startJt1078Play, loadRecord } from '@/api/nvr/zlm'

export default {
  name: 'video',
  data() {
    return {
      currentTime: '',
      currentDate: '',
      splitCount: 4,
      centerTab: 'video',
      videoUrls: [],
      videoTips: [],
      enableAudio: [],
      deviceRows: [],
      playerIdx: 0,
      currentPlayerIndex: 0,
      activeResourceTab: 'cpu',
      tabKey: 0,
      showRegion: false,
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isQuality: true,
      isLive: true,
      easyPlayerOpen: false,
      mapDeviceRow: {},
      mapRtcUrl: '',
      mapFlvUrl: '',
      mapWsUrl: '',
      mapSharedIframe: '',
      mapTabActiveName: 'media',
      mapStreamInfo: {},
      mapQuality: ['普清', '高清', '超清'],
      mapDefaultQuality: '高清',
      mapIsPtz: true,
      mapIsQuality: true,
      mapIsLive: true,
      mapControSpeed: 5,
      mapControSpeedMax: 10,
      mapLastPtzCommand: 'up',
      mapIsPresetSupported: true,
      openPosition: false,
      formPosition: {},
      mapPresetList: [],
      mapSelectedPresetIndex: null,
      mapPresetDialogVisible: false,
      mapPresetFormRef: null,
    }
  },
  mounted() {
    document.documentElement.classList.add('dark')
      
      updateTime()
      timer = window.setInterval(updateTime, 1000)
      
      loadData()
      dataTimer = window.setInterval(loadData, 5000)
      
      while (this.videoUrls.length < this.splitCount) {
        this.videoUrls.push('')
        this.videoTips.push('')
        this.enableAudio.push('')
        this.deviceRows.push(null)
      }
      
      // 暴露全局方法（按照 map/index.vue 的方式）
      (window as any).handlePlay = (id) => {
        channelMap.forEach(async (channel) => {
          if (String(channel.id) === id) {
            if (channel) {
              if (currentOpenInfoWindow) {
                currentOpenInfoWindow.closeInfoWindow()
              }
              await mapPlay(channel.id)
            }
          }
        })
      }
      
      (window as any).handlePosition = (id) => {
        channelMap.forEach((item) => {
          if (String(item.id) === id) {
            if (item) {
              handleEdit({
                id: item.id,
                type: "position"
              })
            }
          }
        })
      }
  },
  beforeDestroy() {
    document.documentElement.classList.remove('dark')
      if (timer) {
        clearInterval(timer)
      }
      if (dataTimer) {
        clearInterval(dataTimer)
      }
      if (typeof window !== 'undefined') {
        delete (window as any).handlePlay
        delete (window as any).handlePosition
      }
  },
  methods: {
    initMap() {
      const res = await getConfigKey("sys.map.param")
        
        nextTick(async () => {
          if (!res.msg || res.msg === '') {
            proxy.$modal.msgError("请配置地图默认参数！")
            return
          }
          const [lng, lat, zoom] = res.msg.split(',').map(Number)
          mapCenterConfig = { lng, lat, zoom }
          
          map = new T.Map('dashboard-map', {
            projection: 'EPSG:4326'
          })
          let center = new T.LngLat(lng, lat, zoom)
          // 设置显示地图的中心点和级别
          map.centerAndZoom(center, zoom)
      
          // 创建缩放平移控件对象
          var control = new T.Control.Zoom()
          // 添加缩放平移控件
          map.addControl(control)
          // 创建比例尺控件对象
          var scale = new T.Control.Scale()
          // 添加比例尺控件
          map.addControl(scale)
      
          // 创建对象
          var ctrl = new T.Control.MapType()
          // 添加控件
          map.addControl(ctrl)
      
          var menu = new T.ContextMenu({
            width: 100
          })
          var txtMenuItem = [
            {
              text: '放大',
              callback: function () {
                map.zoomIn()
              }
            },
            {
              text: '缩小',
              callback: function () {
                map.zoomOut()
              }
            },
            {
              text: '查看全国',
              callback: function () {
                map.setZoom(4)
              }
            }
          ]
      
          for (var i = 0; i < txtMenuItem.length; i++) {
            // 添加菜单项
            var menuItem = new T.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback)
            menu.addItem(menuItem)
            if (i == 1) {
              // 添加分割线
              menu.addSeparator()
            }
          }
          // 添加右键菜单
          map.addContextMenu(menu)
      
          mapInitialized = true
          await queryForDeviceFun()
        })
    },
    refreshMap() {
      if (!map || !mapCenterConfig) return
        
        nextTick(() => {
          if (typeof map.handleResize === 'function') {
            map.handleResize()
          } else if (typeof map.resize === 'function') {
            map.resize()
          }
          setTimeout(() => {
            map.centerAndZoom(new T.LngLat(mapCenterConfig.lng, mapCenterConfig.lat, mapCenterConfig.zoom), mapCenterConfig.zoom)
            queryForDeviceFun()
          }, 100)
        })
    },
    refreshData() {
      loadData()
        ElMessage.success('数据已刷新')
    },
    loadData() {
      getSystemInfo().then(res => {
          proxy.$refs.rightTopRef?.setData?.(res.data.cpu)
          proxy.$refs.leftBottomRef?.setData?.(res.data.net)
          proxy.$refs.bottomCenterRef?.setData?.(res.data.mem)
          proxy.$refs.rightBottomRef?.setData?.(res.data.disk)
        })
        
        getDeviceStatistics().then(res => {
          proxy.$refs.leftTopRef?.setData?.(res.data)
          this.deviceStats = {
            total: res.data.totalDeviceCount || 0,
            online: res.data.totalOnlineCount || 0,
            offline: res.data.totalOfflineCount || 0
          }
        })
    },
    goBack() {
      window.location.href = '/'
    },
    toggleFullScreen() {
      if (screenFull.isEnabled) {
          screenFull.toggle()
        }
    },
    handleSplitChange() {
      // 确保所有数组长度足够
        while (this.videoUrls.length < this.splitCount) {
          this.videoUrls.push('')
          this.videoTips.push('')
          this.enableAudio.push('')
          this.deviceRows.push(null)
        }
    },
    handleTreeTypeChange() {
      // 切换树形组件类型
        if (this.centerTab === 'map' && map) {
          queryForDeviceFun()
        }
    },
    escapeHtml(str) {
      if (typeof str !== 'string') return str == null ? '' : String(str)
        return str.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
    },
    queryForDeviceFun() {
      if (!map) return
        
        map.clearOverLays()
        markerMap.clear()
      
        let res = {}
        if (this.showRegion) {
          res = await queryRegionForDevice()
        } else {
          res = await queryGroupForDevice()
        }
      
        let data = res.data
        if (data.length > 0) {
          channelMap = JSON.parse(JSON.stringify(data))
      
          for (let i = 0; i < data.length; i++) {
            var icon = {}
            if (data[i].ptzType) {
              // 球机
              if (data[i].ptzType === 1) {
                icon = new T.Icon({
                  iconUrl: "https://ruoyi-wvp-1308576884.cos.ap-guangzhou.myqcloud.com/ruoyi-wvp/upload/%E7%90%83%E6%9C%BA.png",
                  iconSize: new T.Point(30, 27),
                  iconAnchor: new T.Point(10, 25)
                });
      
                // 半球或者遥控半球
              } else if (data[i].ptzType === 2 || data[i].ptzType === 5) {
                icon = new T.Icon({
                  iconUrl: "https://ruoyi-wvp-1308576884.cos.ap-guangzhou.myqcloud.com/ruoyi-wvp/upload/%E5%8D%8A%E7%90%83.png",
                  iconSize: new T.Point(30, 27),
                  iconAnchor: new T.Point(10, 25)
                });
      
                // 固定枪机或遥控枪机
              } else if (data[i].ptzType === 3 || data[i].ptzType === 4) {
                icon = new T.Icon({
                  iconUrl: "https://ruoyi-wvp-1308576884.cos.ap-guangzhou.myqcloud.com/ruoyi-wvp/upload/%E6%9E%AA%E6%9C%BA.png",
                  iconSize: new T.Point(30, 27),
                  iconAnchor: new T.Point(10, 25)
                });
              } else {
                icon = new T.Icon({
                  iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
                  iconSize: new T.Point(20, 27),
                  iconAnchor: new T.Point(10, 25)
                });
              }
            } else {
              icon = new T.Icon({
                iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
                iconSize: new T.Point(20, 27),
                iconAnchor: new T.Point(10, 25)
              });
            }
      
            //创建信息窗口对象
            let marker = new T.Marker(new T.LngLat(data[i].longitude, data[i].latitude), {icon: icon});
            map.addOverLay(marker);
            marker._channel = data[i]
            markerMap.set(data[i].id, marker);
            marker.addEventListener("click", function (e) {
              if (currentOpenInfoWindow) {
                currentOpenInfoWindow.closeInfoWindow();
              }
              const channel = this._channel
              var infoWin1 = new T.InfoWindow();
      
              const sContent = `
                    <div style="
                      width: 240px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 13px;
                      color: #333;
                      line-height: 1.6;
                    ">
                      <div style="
                        font-size: 15px;
                        font-weight: 700;
                        color: #1a202c;
                        padding-bottom: 8px;
                        margin-bottom: 8px;
                        border-bottom: 1px solid rgba(0,0,0,0.06);
                        display: flex;
                        align-items: center;
                        gap: 6px;
                      ">
                        <span style="
                          width: 6px;
                          height: 6px;
                          border-radius: 50%;
                          background: ${channel.status === 'ON' ? '#52c41a' : '#ff4d4f'};
                          display: inline-block;
                        "></span>
                        ${escapeHtml(channel.name)}
                      </div>
                      <div style="color: #555;">
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">IP</span>
                          <span style="font-weight: 500;">${escapeHtml(channel.ipAddress || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">厂商</span>
                          <span>${escapeHtml(channel.manufacturer || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">地址</span>
                          <span>${escapeHtml(channel.address || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">状态</span>
                          <span style="color: ${channel.status === 'ON' ? '#52c41a' : '#ff4d4f'}; font-weight: 600;">${channel.status === 'ON' ? '在线' : '离线'}</span>
                        </div>
                      </div>
                      <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end;">
                        <button
                          ${channel.status !== 'ON' ? 'disabled' : ''}
                          onclick="window.handlePlay('${channel.id}')"
                          style="
                            padding: 5px 14px;
                            font-size: 12px;
                            border: none;
                            border-radius: 6px;
                            background: #409EFF;
                            color: white;
                            cursor: ${channel.status === 'ON' ? 'pointer' : 'not-allowed'};
                            opacity: ${channel.status === 'ON' ? 1 : 0.45};
                            font-weight: 500;
                            transition: all 0.25s ease;
                          "
                          onmouseover="if(!this.disabled){this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(64,158,255,0.35)';}"
                          onmouseout="this.style.transform='';this.style.boxShadow='';">
                          ▶ 播放
                        </button>
                      </div>
                    </div>
                    `.trim();
              infoWin1.setContent(sContent);
              this.openInfoWindow(infoWin1);
      
              currentOpenInfoWindow = marker
            });
          }
        }
    },
    handleDeviceClick(data) {
      // 检查是否是叶子节点（设备）
        if (!data || !data.leaf) {
          return
        }
        // 如果当前在视频标签页，直接在分屏播放
        if (this.centerTab === 'video') {
          if (data.id) {
            treeChannelClickEvent(data.id)
          }
        } else {
          // 如果在地图标签页，跳转到设备位置并显示信息窗口
          if (data.id) {
            navigateToMapAndShowInfo(data.id)
          }
        }
    },
    treeChannelClickEvent(id) {
      sendDevicePush(id);
    },
    navigateToMapAndShowInfo(id) {
      // 安全检查
        if (!id || typeof id !== 'string' && typeof id !== 'number') {
          console.error('Invalid device id:', id)
          return
        }
        await getDevice(id).then((res) => {
          let data = res.data
          if (!data.longitude || data.longitude < 0 || !data.latitude || data.latitude < 0) {
            proxy.$modal.msgError("无位置信息")
            return
          }
          let lnglat = new T.LngLat(data.longitude, data.latitude);
          map.panTo(lnglat, 15)
      
          var infoWin1 = new T.InfoWindow();
          const sContent = `
                    <div style="
                      width: 240px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 13px;
                      color: #333;
                      line-height: 1.6;
                    ">
                      <div style="
                        font-size: 15px;
                        font-weight: 700;
                        color: #1a202c;
                        padding-bottom: 8px;
                        margin-bottom: 8px;
                        border-bottom: 1px solid rgba(0,0,0,0.06);
                        display: flex;
                        align-items: center;
                        gap: 6px;
                      ">
                        <span style="
                          width: 6px;
                          height: 6px;
                          border-radius: 50%;
                          background: ${data.deviceStatus === 'ON' ? '#52c41a' : '#ff4d4f'};
                          display: inline-block;
                        "></span>
                        ${escapeHtml(data.deviceName || data.name)}
                      </div>
                      <div style="color: #555;">
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">IP</span>
                          <span style="font-weight: 500;">${escapeHtml(data.ipAddress || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">厂商</span>
                          <span>${escapeHtml(data.manufacturer || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">地址</span>
                          <span>${escapeHtml(data.address || '未知')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                          <span style="color: #888;">状态</span>
                          <span style="color: ${data.deviceStatus === 'ON' ? '#52c41a' : '#ff4d4f'}; font-weight: 600;">${data.deviceStatus === 'ON' ? '在线' : '离线'}</span>
                        </div>
                      </div>
                      <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end;">
                        <button
                          ${data.deviceStatus !== 'ON' ? 'disabled' : ''}
                          style="
                            padding: 5px 14px;
                            font-size: 12px;
                            border: none;
                            border-radius: 6px;
                            background: #409EFF;
                            color: white;
                            cursor: ${data.deviceStatus === 'ON' ? 'pointer' : 'not-allowed'};
                            opacity: ${data.deviceStatus === 'ON' ? 1 : 0.45};
                            font-weight: 500;
                            transition: all 0.25s ease;
                          "
                          onmouseover="if(!this.disabled){this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(64,158,255,0.35)';}"
                          onmouseout="this.style.transform='';this.style.boxShadow='';"
                          onclick="window.handlePlay('${data.id}')"
                        >▶ 播放</button>
                      </div>
                    </div>
                    `.trim();
          infoWin1.setContent(sContent);
          let marker = markerMap.get(id)
          marker.openInfoWindow(infoWin1);
          currentOpenInfoWindow = marker
        })
    },
    mapPlay(id) {
      // 安全检查
        console.log('mapPlay called with id:', id)
        if (!id || typeof id !== 'string' && typeof id !== 'number') {
          console.error('Invalid device id for mapPlay:', id)
          return
        }
        getDevice(id).then((res) => {
          console.log('getDevice response:', res)
          let row = res.data
          console.log('Device row:', row)
      
          const loading = ElLoading.service({
            lock: true,
            text: '请求中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })
      
          if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
            let data = {
              deviceId: row.id,
              app: '',
              stream: row.deviceCode,
              url: row.liveAddress,
              enable_audio: false,
              enable_mp4: false,
              rtp_type: '1',
              timeOut: 10,
            } as PullConfig;
      
            if (row.type === '1') {
              data.app = "rtsp"
            } else if (row.type === '2') {
              data.app = "rtmp"
            } else if (row.type === '3') {
              data.app = "flv"
            } else if (row.type === '4') {
              data.app = "hls"
            } else if (row.type === '5') {
              data.app = "onvif"
            }
      
            if (row.type === '3' && row.flvType === 'ws') {
              if (row.liveAddress != null) {
                data.url = convertWsToHttp(row.liveAddress)
              }
            }
      
            if (row.protocol === 'UDP') {
              data.rtp_type = '0'
            } else if (row.protocol === 'TCP') {
              data.rtp_type = '1'
            }
      
            if (row.enableAudio === '1') {
              data.enable_audio = true
            }
      
            if (row.enableMp4 === '1') {
              data.enable_mp4 = true
            }
      
            streamPullPlay(data).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9';
                this.mapIsPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12';
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '6') {
            loadRecord(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9';
                this.mapIsPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12';
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
      
                getVideoSnapshot(row.id);
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '7' || row.type === '8' || row.type === '9') {
            let data = {
              app: "haikang",
              streamId: row.deviceCode,
              tcpMode: "0",
              type: row.type,
              id: row.id
            } as RTPServerParam;
      
            if (row.type === '7') {
              data.app = "haikang"
            } else if (row.type === '8') {
              data.app = "haikang_isup"
            } else if (row.type === '9') {
              data.app = "dahua"
            }
      
            rtpPlay(data).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9';
                this.mapIsPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12';
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '13') {
            streamPullPush(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9';
                this.mapIsPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12';
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '12') {
            startGb28181Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9';
                this.mapIsPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12';
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '14') {
            startJt1078Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.mapFlvUrl = res.data.https_flv;
                  this.mapRtcUrl = res.data.rtcs;
                  this.mapWsUrl = res.data.wss_flv;
                } else {
                  this.mapFlvUrl = res.data.flv;
                  this.mapRtcUrl = res.data.rtc;
                  this.mapWsUrl = res.data.ws_flv;
                }
                this.mapSharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.mapWsUrl) + '"></iframe>';
      
                this.mapStreamInfo = res.data;
                this.mapQuality = []
                this.mapDefaultQuality = ''
                this.mapIsPtz = true;
                this.mapIsPresetSupported = false;
                this.mapIsQuality = false
                this.mapIsLive = true
                this.mapDeviceRow = row
                console.log('Setting this.easyPlayerOpen = true')
                
                await nextTick()
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['mapEasyPlayerRef']) {
                  proxy.$refs['mapEasyPlayerRef'].play(this.mapWsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          }
      
        })
    },
    sendDevicePush(id) {
      const idxTmp = this.playerIdx
        this.videoTips[idxTmp] = '正在拉流...'
      
        getDevice(id).then((res) => {
          let row = res.data
      
          if (row.type === '1' || row.type === '2' || row.type === '3' || row.type === '4' || row.type === '5') {
            let data = {
              deviceId: row.id,
              app: '',
              stream: row.deviceCode,
              url: row.liveAddress,
              enable_audio: false,
              enable_mp4: false,
              rtp_type: '1',
              timeOut: 10,
            } as PullConfig;
      
            if (row.type === '1') {
              data.app = "rtsp"
            } else if (row.type === '2') {
              data.app = "rtmp"
            } else if (row.type === '3') {
              data.app = "flv"
            } else if (row.type === '4') {
              data.app = "hls"
            } else if (row.type === '5') {
              data.app = "onvif"
            }
      
            if (row.type === '3' && row.flvType === 'ws') {
              if (row.liveAddress != null) {
                data.url = convertWsToHttp(row.liveAddress)
              }
            }
      
            if (row.protocol === 'UDP') {
              data.rtp_type = '0'
            } else if (row.protocol === 'TCP') {
              data.rtp_type = '1'
            }
      
            if (row.enableAudio === '1') {
              data.enable_audio = true
            }
      
            if (row.enableMp4 === '1') {
              data.enable_mp4 = true
            }
      
            streamPullPlay(data).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          } else if (row.type === '6') {
            loadRecord(row.id).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          } else if (row.type === '7' || row.type === '8' || row.type === '9') {
            let data = {
              app: "haikang",
              streamId: row.deviceCode,
              tcpMode: "0",
              type: row.type,
              id: row.id
            } as RTPServerParam;
      
            if (row.type === '7') {
              data.app = "haikang"
            } else if (row.type === '8') {
              data.app = "haikang_isup"
            } else if (row.type === '9') {
              data.app = "dahua"
            }
      
            rtpPlay(data).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          } else if (row.type === '13') {
            streamPullPush(row.id).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          } else if (row.type === '12') {
            startGb28181Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          } else if (row.type === '14') {
            startJt1078Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                let videoUrl
                if (location.protocol === 'https:') {
                  videoUrl = res.data.wss_flv
                } else {
                  videoUrl = res.data.ws_flv
                }
      
                console.log('播放地址:', videoUrl)
      
                // 更新播放相关属性
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12'
                this.isQuality = false
                this.isLive = true
      
                // 先清空，再设置新的 URL
                this.videoUrls[idxTmp] = ''
                this.videoTips[idxTmp] = ''
                
                await nextTick()
                
                setPlayUrl(videoUrl, idxTmp)
                setEnableAudio(row.enableAudio, idxTmp)
                this.deviceRows[idxTmp] = row
      
                await nextTick()
                const playerRef = proxy.$refs[`dashboard-player${idxTmp}`]
                console.log('playerRef:', playerRef)
                if (playerRef && playerRef.length > 0) {
                  console.log('开始播放')
                  playerRef[0].play(videoUrl)
                }
              })
            }).catch(err => {
              console.error('拉流失败:', err)
              this.videoTips[idxTmp] = '播放失败'
            })
          }
        })
    },
    setPlayUrl(url, idx) {
      this.videoUrls[idx] = url
    },
    setEnableAudio(audio, idx) {
      this.enableAudio[idx] = audio
    },
    deleteClick(index) {
      this.videoUrls[index] = ''
        this.videoTips[index] = ''
        this.enableAudio[index] = ''
        this.deviceRows[index] = null
    },
    handleResourceTabChange(tabName) {
      this.tabKey++
        // 延迟更新数据，确保组件重新渲染后再设置
        setTimeout(() => {
          getSystemInfo().then(res => {
            if (tabName === 'cpu') {
              proxy.$refs.rightTopRef?.setData?.(res.data.cpu)
            } else if (tabName === 'net') {
              proxy.$refs.leftBottomRef?.setData?.(res.data.net)
            } else if (tabName === 'mem') {
              proxy.$refs.bottomCenterRef?.setData?.(res.data.mem)
            } else if (tabName === 'disk') {
              proxy.$refs.rightBottomRef?.setData?.(res.data.disk)
            } else if (tabName === 'media') {
              getMediaLoad().then(res => {
                proxy.$refs.topCenterRef?.setData?.(res.data)
              })
            }
          })
        }, 50)
    },
    async loadMapPresetList() {
      if (!this.mapIsPresetSupported || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return
        }
        try {
          const res = await getPresetList(this.mapDeviceRow.id, this.mapDeviceRow.channel);
          if (res && res.data) {
            this.mapPresetList = res.data;
          }
        } catch (err) {
          console.error('加载预置点失败:', err);
        }
    },
    handleMapPresetSelect(index) {
      this.mapSelectedPresetIndex = index;
        if (index) {
          mapPresetForm.index = index;
          const preset = this.mapPresetList.find(p => p.index === index);
          if (preset) {
            mapPresetForm.name = preset.name || '';
          }
        }
    },
    openMapSetPresetDialog() {
      mapPresetForm.index = 1;
        mapPresetForm.name = '';
        if (this.mapSelectedPresetIndex) {
          const preset = this.mapPresetList.find(p => p.index === this.mapSelectedPresetIndex);
          if (preset) {
            mapPresetForm.index = preset.index;
            mapPresetForm.name = preset.name || '';
          }
        }
        this.mapPresetDialogVisible = true;
        nextTick(() => {
          this.mapPresetFormRef?.resetFields();
        })
    },
    async handleMapSetPreset() {
      if (!this.mapIsPresetSupported || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return;
        }
        if (!this.mapPresetFormRef) return;
        await this.mapPresetFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await setPreset(this.mapDeviceRow.id, this.mapDeviceRow.channel, mapPresetForm.index, mapPresetForm.name);
              proxy.$modal.msgSuccess('设置预置点成功');
              this.mapPresetDialogVisible = false;
              await loadMapPresetList();
            } catch (err) {
              console.error('设置预置点失败:', err);
            }
          }
        })
    },
    async handleMapGotoPreset() {
      if (!this.mapIsPresetSupported || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return;
        }
        const presetIndex = this.mapSelectedPresetIndex || mapPresetForm.index;
        if (!presetIndex) {
          proxy.$modal.msgWarning('请选择预置点');
          return;
        }
        try {
          await gotoPreset(this.mapDeviceRow.id, this.mapDeviceRow.channel, presetIndex);
          proxy.$modal.msgSuccess('调用预置点成功');
        } catch (err) {
          console.error('调用预置点失败:', err);
        }
    },
    async handleMapDeletePreset() {
      if (!this.mapIsPresetSupported || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return;
        }
        const presetIndex = this.mapSelectedPresetIndex || mapPresetForm.index;
        if (!presetIndex) {
          proxy.$modal.msgWarning('请选择预置点');
          return;
        }
        try {
          await deletePreset(this.mapDeviceRow.id, this.mapDeviceRow.channel, presetIndex);
          proxy.$modal.msgSuccess('删除预置点成功');
          this.mapSelectedPresetIndex = null;
          await loadMapPresetList();
        } catch (err) {
          console.error('删除预置点失败:', err);
        }
    },
    async handleMapPtzStart(command) {
      if (!this.mapIsPtz || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return;
        }
        this.mapLastPtzCommand = command;
        try {
          await startPtz(this.mapDeviceRow.id, this.mapDeviceRow.channel, command, this.mapControSpeed);
        } catch (err) {
          console.error('云台控制失败:', err);
        }
    },
    async handleMapPtzStop() {
      if (!this.mapIsPtz || !this.mapDeviceRow || !this.mapDeviceRow.id) {
          return;
        }
        try {
          await endPtz(this.mapDeviceRow.id, this.mapDeviceRow.channel, this.mapLastPtzCommand);
        } catch (err) {
          console.error('停止云台控制失败:', err);
        }
    },
    ptzMapCamera(command) {
      if (command === 'stop') {
          handleMapPtzStop();
        } else {
          handleMapPtzStart(command);
        }
    },
    convertWsToHttp(wsUrl) {
      if (!wsUrl) return wsUrl;
        const regex = /^wss?:\/\//;
        if (regex.test(wsUrl)) {
          if (wsUrl.startsWith('wss://')) {
            return wsUrl.replace(regex, 'https://');
          } else {
            return wsUrl.replace(regex, 'http://');
          }
        }
        return wsUrl;
    },
  },
}
</script>

<style scoped lang="scss">
.dashboard-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 10px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: -1;
  }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 100%);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  margin-bottom: 10px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.05) inset;
  height: 70px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -1px;
    width: 120px;
    height: 32px;
    border: 2px solid #3b82f6;
  }
  
  &::before {
    left: -1px;
    border-right: none;
    border-bottom: none;
    border-radius: 16px 0 0 0;
  }
  
  &::after {
    right: -1px;
    border-left: none;
    border-bottom: none;
    border-radius: 0 16px 0 0;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  
  .el-icon {
    font-size: 22px;
    color: white;
  }
}

.header-title {
  h1 {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #60a5fa, #34d399, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    margin: 2px 0 0 0;
    letter-spacing: 2px;
  }
}

.header-center {
  display: flex;
  gap: 12px;
}

.stat-card {
  min-width: 100px;
  text-align: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6);
  }
  
  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: white;
    line-height: 1.2;
    
    &.online {
      color: #10b981;
      text-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
    }
    
    &.offline {
      color: #ef4444;
      text-shadow: 0 0 16px rgba(239, 68, 68, 0.5);
    }
  }
  
  .stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 2px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-time {
  text-align: right;
  
  .time-date {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .time-clock {
    font-size: 20px;
    font-weight: 700;
    color: white;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }
}

.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
  transition: all 0.3s;
  font-size: 13px;
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-1px);
  }
}

.dashboard-content {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1.5fr 320px;
  gap: 10px;
  overflow: hidden;
}

.dashboard-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}

.panel-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  }
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
  
  .title-icon {
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 14px;
      color: #60a5fa;
    }
  }
  
  span {
    font-size: 14px;
    font-weight: 600;
    color: white;
    letter-spacing: 1px;
  }
}

.panel-tools {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
  
  :deep(.el-tabs--card > .el-tabs__header) {
    border: none;
    margin: 0;
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav-wrap) {
    padding: 0;
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
    border: none;
    border-radius: 6px;
    background: rgba(59, 130, 246, 0.1);
    padding: 2px;
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px 16px;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
    background: rgba(59, 130, 246, 0.3);
    color: #60a5fa;
    font-weight: 500;
  }
  
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item:hover) {
    color: #60a5fa;
  }
}

.split-tools-inline {
  :deep(.el-radio-group) {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 6px;
    padding: 2px;
  }
  
  :deep(.el-radio-button__inner) {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    padding: 4px 10px;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
  
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: rgba(59, 130, 246, 0.3);
    color: #60a5fa;
    font-weight: 500;
  }
  
  :deep(.el-radio-button__inner:hover) {
    color: #60a5fa;
  }
}

.panel-body {
  flex: 1;
  padding: 10px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.device-stats-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.device-stats-wrapper > div {
  width: 100% !important;
  height: 100% !important;
}

.resource-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  :deep(.el-tabs__header) {
    margin: 0 0 10px 0;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  
  :deep(.el-tabs__item) {
    color: rgba(255, 255, 255, 0.5);
    padding: 0 14px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    font-weight: 500;
    
    &.is-active {
      color: #60a5fa;
      font-weight: 600;
    }
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  :deep(.el-tabs__active-bar) {
    background: linear-gradient(90deg, #3b82f6, #10b981);
    height: 2px;
    border-radius: 1px;
  }
  
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
    padding: 0;
  }
  
  :deep(.el-tab-pane) {
    height: 100%;
  }
}

.resource-item-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.resource-item-wrapper > div {
  width: 100% !important;
  height: 100% !important;
}

.video-card {
  flex: 1;
}

.video-grid {
  height: 100%;
}

.video-item {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%);
  border-radius: 12px;
  border: 2px solid rgba(59, 130, 246, 0.15);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
  }
  
  &.active {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(59, 130, 246, 0.3);
  }
}

.no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.no-video-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.1);
  
  .el-icon {
    color: rgba(255, 255, 255, 0.4);
  }
}

.no-video span {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.video-player {
  width: 100%;
  height: 100%;
  position: relative;
}

.easy-player {
  width: 100% !important;
  height: 100% !important;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  opacity: 0;
  
  &:hover {
    background: #dc2626;
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
  }
}

.split-radio-group {
  :deep(.el-radio-button__inner) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

.video-item:hover .close-btn {
  opacity: 1;
}

#dashboard-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.device-list {
  ::v-deep .device-tree-container,
  ::v-deep .region-tree-container,
  ::v-deep .group-tree-container {
    background: transparent;
  }
  ::v-deep .tree-content {
    background: transparent;
  }
  ::v-deep .el-tree {
    background: transparent;
  }
  ::v-deep .el-tree-node__label {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  ::v-deep .el-tree-node__content:hover {
    background: rgba(64, 158, 255, 0.15) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  }
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.18) 0%, rgba(64, 158, 255, 0.12) 100%) !important;
    color: #409eff !important;
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2) !important;
  }
  ::v-deep .panel-header {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%) !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.15) !important;
  }
  ::v-deep .switch-container {
    background: transparent !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.15) !important;
  }
  ::v-deep .panel-header span {
    color: rgba(255, 255, 255, 0.95) !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
  }
  ::v-deep .header-icon-wrap {
    background: rgba(59, 130, 246, 0.3) !important;
    color: #60a5fa !important;
  }
  ::v-deep .header-accent {
    background: linear-gradient(to bottom, #3b82f6, #10b981) !important;
  }
  ::v-deep .el-switch__label {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  ::v-deep .el-switch__label.is-active {
    color: rgba(255, 255, 255, 0.9) !important;
  }
  ::v-deep .el-tree-node__expand-icon {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  ::v-deep .el-tree-node__expand-icon.is-leaf {
    color: transparent !important;
  }
  /* 搜索框适配 */
  ::v-deep .search-area {
    padding: 0 0 12px;
  }
  ::v-deep .search-input {
    .el-input__wrapper {
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2) inset;
      
      &:focus-within {
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5) inset, 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
      
      .el-input__inner {
        color: rgba(255, 255, 255, 0.85);
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      
      .el-input__prefix,
      .el-input__suffix {
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .el-input-group__prepend {
      background: rgba(30, 41, 59, 0.8) !important;
      border-color: rgba(59, 130, 246, 0.2) !important;
      
      .refresh-btn {
        background: rgba(30, 41, 59, 0.8) !important;
        color: rgba(255, 255, 255, 0.7) !important;
        
        &:hover {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #60a5fa !important;
        }
      }
    }
    
    .el-input-group__append {
      background: rgba(30, 41, 59, 0.8) !important;
      border-color: rgba(59, 130, 246, 0.2) !important;
      
      .index-checkbox {
        .el-checkbox__label {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      }
    }
  }
  /* 搜索结果适配 */
  ::v-deep .result-item {
    background: rgba(30, 41, 59, 0.6) !important;
    border-color: rgba(59, 130, 246, 0.15) !important;
    
    &:hover {
      background: rgba(59, 130, 246, 0.15) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
    }
    
    &.is-active {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
    }
  }
  ::v-deep .result-icon-wrap {
    background: rgba(30, 41, 59, 0.8) !important;
  }
  ::v-deep .device-id-badge {
    background: rgba(59, 130, 246, 0.2) !important;
  }
  ::v-deep .result-name {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  ::v-deep .result-id {
    color: rgba(255, 255, 255, 0.5) !important;
  }
}

/* 视频播放弹窗深色模式适配 */
:global(.dashboard-video-dialog) {
  & .el-dialog {
    background: rgba(30, 41, 59, 0.95) !important;
    border: 1px solid rgba(59, 130, 246, 0.3) !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(10px);
  }
  
  & .el-dialog__header {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%);
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  & .el-dialog__title {
    color: rgba(255, 255, 255, 0.95) !important;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  & .el-dialog__headerbtn {
    .el-dialog__close {
      color: rgba(255, 255, 255, 0.7) !important;
      
      &:hover {
        color: #60a5fa !important;
      }
    }
  }
  
  & .el-dialog__body {
    color: rgba(255, 255, 255, 0.85);
    
    span {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    
    p {
      color: rgba(255, 255, 255, 0.75) !important;
    }
  }
  
  & .el-tabs {
    .el-tabs__header {
      border-color: rgba(59, 130, 246, 0.2);
    }
    
    .el-tabs__nav-wrap::after {
      background-color: rgba(59, 130, 246, 0.2);
    }
    
    .el-tabs__item {
      color: rgba(255, 255, 255, 0.6) !important;
      
      &:hover {
        color: #60a5fa !important;
      }
      
      &.is-active {
        color: #60a5fa !important;
        background: rgba(59, 130, 246, 0.15) !important;
        border-color: rgba(59, 130, 246, 0.3) !important;
      }
    }
    
    .el-tabs__active-bar {
      background-color: #3b82f6 !important;
    }
  }
  
  & .el-tab-pane {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  & .el-input {
    .el-input__wrapper {
      background: rgba(15, 23, 42, 0.8) !important;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2) inset !important;
    }
    
    .el-input__inner {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    
    .el-input-group__prepend,
    .el-input-group__append {
      background: rgba(15, 23, 42, 0.8) !important;
      border-color: rgba(59, 130, 246, 0.2) !important;
      color: rgba(255, 255, 255, 0.7) !important;
    }
    
    .el-button {
      background: rgba(59, 130, 246, 0.2) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
      color: #60a5fa !important;
      
      &:hover {
        background: rgba(59, 130, 246, 0.3) !important;
      }
    }
  }
  
  & .el-row {
    span {
      color: rgba(255, 255, 255, 0.8) !important;
    }
  }
  
  & .el-select-dropdown,
  & .el-dropdown-menu {
    background: rgba(15, 23, 42, 0.95) !important;
    border-color: rgba(59, 130, 246, 0.2) !important;
    
    .el-select-dropdown__item,
    .el-dropdown-menu__item {
      color: rgba(255, 255, 255, 0.8) !important;
      
      &:hover {
        background: rgba(59, 130, 246, 0.2) !important;
        color: #60a5fa !important;
      }
      
      &.selected {
        color: #60a5fa !important;
        font-weight: 600;
      }
    }
  }
}

:global(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(4px);
}

/* MediaInfo 组件深色模式适配 */
.dashboard-video-dialog .media-info-wrapper,
.dashboard-video-dialog .media-info {
  background: rgba(15, 23, 42, 0.8) !important;
  border-radius: 8px;
}

.dashboard-video-dialog .media-info-wrapper .media-info,
.dashboard-video-dialog .media-info {
  padding: 12px 16px;
}

.dashboard-video-dialog .media-info-wrapper .media-info .title,
.dashboard-video-dialog .media-info .title {
  color: rgba(255, 255, 255, 0.95) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .refresh-btn,
.dashboard-video-dialog .media-info .refresh-btn {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .refresh-btn:hover,
.dashboard-video-dialog .media-info .refresh-btn:hover {
  color: #60a5fa !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .stat-label,
.dashboard-video-dialog .media-info .stat-label {
  color: rgba(255, 255, 255, 0.6) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .stat-value,
.dashboard-video-dialog .media-info .stat-value {
  color: rgba(255, 255, 255, 0.9) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .detail-section,
.dashboard-video-dialog .media-info .detail-section {
  border-top-color: rgba(59, 130, 246, 0.2) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .block-label,
.dashboard-video-dialog .media-info .block-label {
  color: rgba(255, 255, 255, 0.8) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .tag,
.dashboard-video-dialog .media-info .tag {
  color: rgba(255, 255, 255, 0.8) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .tag.success,
.dashboard-video-dialog .media-info .tag.success {
  color: #10b981 !important;
  background: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .tag.warning,
.dashboard-video-dialog .media-info .tag.warning {
  color: #f59e0b !important;
  background: rgba(245, 158, 11, 0.1) !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .tag.danger,
.dashboard-video-dialog .media-info .tag.danger {
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1) !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .el-tag,
.dashboard-video-dialog .media-info .el-tag {
  background: rgba(15, 23, 42, 0.6) !important;
  border-color: rgba(59, 130, 246, 0.2) !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .el-tag--success,
.dashboard-video-dialog .media-info .el-tag--success {
  color: #10b981 !important;
  background: rgba(16, 185, 129, 0.15) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .el-tag--primary,
.dashboard-video-dialog .media-info .el-tag--primary {
  color: #3b82f6 !important;
  background: rgba(59, 130, 246, 0.15) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}

.dashboard-video-dialog .media-info-wrapper .media-info .el-empty__description,
.dashboard-video-dialog .media-info .el-empty__description {
  color: rgba(255, 255, 255, 0.5) !important;
}
</style>
