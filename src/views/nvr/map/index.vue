<template>

  <div class="app-container">
    <el-row :gutter="20">
      <splitpanes class="default-theme">
        <pane size="25">
          <el-col>
            <DeviceTree ref="deviceTree"
                        @clickEvent="treeChannelClickEvent"
                        :isContextmenu="true"
                        @playChannel="playChannelFun"
                        @updatePosition="updatePositionFun"
                        @change="deviceTreeChange"
            ></DeviceTree>
          </el-col>
        </pane>

        <pane size="80" style="width: 100%">
          <el-col>
            <div id="Map" style="width: 100%" :style="'height:' + height + 'min-width:' + width"></div>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <!--修改设备位置-->
    <el-dialog draggable title="修改设备位置" v-model="openPosition" width="500px" append-to-body>
      <el-form ref="formPositionRef" :model="formPosition" label-width="85px">
        <el-form-item label="经度">
          <el-input v-model="formPosition.longitude" placeholder="请输入经度">
            <template slot="append">
              <el-button @click="selectMapPositionFun">
                选择
              </el-button>
            
</template>

<script>
import EasyPlayer from "@/components/nvr/EasyPlayer";
import StreamDropdown from "@/components/nvr/Channel/streamDropdown.vue";
import MediaInfo from "@/components/nvr/Channel/mediaInfo.vue";
import DeviceTree from '@/components/nvr/DeviceTree'
import SelectMapPosition from '@/components/nvr/SelectMapPosition'
import {Pane, Splitpanes} from "splitpanes"
import "splitpanes/dist/splitpanes.css"
import {getConfigKey} from "@/api/system/config";
import {queryRegionForDevice} from "@/api/nvr/region";
import {queryGroupForDevice} from "@/api/nvr/group";
import {getDevice, getVideoSnapshot, updateDevice, startPtz, endPtz, getPresetList, setPreset, gotoPreset, deletePreset} from "@/api/nvr/device";
import {PullConfig, RTPServerParam} from "@/types/api";
import {loadRecord, rtpPlay, streamPullPlay, streamPullPush, startGb28181Play, startJt1078Play} from "@/api/nvr/zlm";
import {ElLoading} from "element-plus";

export default {
  name: 'media',
  data() {
    return {
      height: document.documentElement.clientHeight - 150 + "px;",
      width: document.documentElement.clientWidth - 600 + "px;",
      openPosition: false,
      formPosition: {},
      easyPlayerOpen: false,
      deviceRow: {},
      rtcUrl: "",
      flvUrl: "",
      wsUrl: '',
      tabActiveName: 'media',
      streamInfo: {},
      quality: ['普清', '高清', '超清'],
      defaultQuality: '高清',
      isPtz: true,
      isPresetSupported: true,
      isQuality: true,
      isLive: true,
      controSpeed: 5,
      controSpeedMax: 10,
      lastPtzCommand: 'up',
      presetList: [],
      selectedPresetIndex: null,
      newPresetIndex: 1,
      newPresetName: '',
      presetDialogVisible: false,
      presetFormRef: null,
      sharedIframe: null,
    }
  },
  methods: {
    temp() {
      this.height = document.documentElement.clientHeight - 150 + "px;"
          // this.width = document.documentElement.clientWidth - 200 + "px;"
        }
        const res = await getConfigKey("sys.map.param")
      
        nextTick(async () => {
          if (res.msg === null || res.msg === '') {
            proxy.$modal.msgError("请配置地图默认参数！")
            return
          }
          const [lng, lat, zoom] = res.msg.split(',').map(Number);
          map = new T.Map('Map', {
            projection: 'EPSG:4326'
          });
          let center = new T.LngLat(lng, lat, zoom);
          //设置显示地图的中心点和级别
          map.centerAndZoom(center, zoom);
      
          //创建版权控件对象
          // var copyControl = new T.Control.Copyright({position: T_ANCHOR_TOP_LEFT});
          // map.addControl(copyControl);
          // var bs = map.getBounds();   //返回地图可视区域
          // copyControl.addCopyright({
          //   id: 1,
          //   content: "<a href='https://www.tianditu.gov.cn' target='_blank' style='font-size:14px;background:yellow'>自定义的版权控件</a>",
          //   bounds: bs
          // });
      
          //创建缩放平移控件对象
          var control = new T.Control.Zoom();
          //添加缩放平移控件
          map.addControl(control);
          //创建比例尺控件对象
          var scale = new T.Control.Scale();
          //添加比例尺控件
          map.addControl(scale);
      
          var miniMap = new T.Control.OverviewMap({
            isOpen: true,
            size: new T.Point(150, 150)
          });
          map.addControl(miniMap);
      
          //创建对象
          var ctrl = new T.Control.MapType();
          //添加控件
          map.addControl(ctrl);
      
          var menu = new T.ContextMenu({
            width: 100
          });
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
          ];
      
          for (var i = 0; i < txtMenuItem.length; i++) {
            //添加菜单项
            var menuItem = new T.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback);
            menu.addItem(menuItem);
            if (i == 1) {
              //添加分割线
              menu.addSeparator();
            }
          }
          //添加右键菜单
          map.addContextMenu(menu);
      
          await queryForDeviceFun()
        })
    },
    deviceTreeChange(data) {
      await queryForDeviceFun()
    },
    queryForDeviceFun() {
      if (map) {
          map.clearOverLays()
        }
      
        let res = {}
        if (proxy.$refs["deviceTree"].showRegion) {
          res = await queryRegionForDevice();
        } else {
          res = await queryGroupForDevice();
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
                          onmouseout="this.style.transform='';this.style.boxShadow='';"
                          onclick="window.handlePlay('${channel.id}')"
                        >▶ 播放</button>
                        <button
                          style="
                            padding: 5px 14px;
                            font-size: 12px;
                            border: none;
                            border-radius: 6px;
                            background: #f0f0f0;
                            color: #555;
                            cursor: pointer;
                            font-weight: 500;
                            transition: all 0.25s ease;
                          "
                          onmouseover="this.style.transform='translateY(-2px)';this.style.background='#e8e8e8';"
                          onmouseout="this.style.transform='';this.style.background='#f0f0f0';"
                          onclick="window.handlePosition('${channel.id}')"
                        >📍 位置</button>
                      </div>
                    </div>
                    `.trim();
              infoWin1.setContent(sContent);
              this.openInfoWindow(infoWin1);
      
      
              currentOpenInfoWindow = marker
            }); // 将标注添加到地图中
          }
        }
    },
    updatePositionFun(data, type) {
      handleEdit({
          id: data.id,
          type: "position"
        })
    },
    handleEdit(row) {
      getDevice(row.id).then((res) => {
          this.formPosition = {
            id: res.data.id,
            longitude: res.data.longitude,
            latitude: res.data.latitude,
          }
          this.openPosition = true
        })
    },
    selectMapPositionFun() {
      proxy.$refs["selectMapPositionRef"].openDialog({
          lat: this.formPosition.latitude,
          lng: this.formPosition.longitude,
        })
    },
    selectMapPositionSubmit(data) {
      this.formPosition.longitude = data.lng
        this.formPosition.latitude = data.lat
    },
    formPositionSubmit() {
      updateDevice(this.formPosition).then(async () => {
          proxy.$modal.msgSuccess('修改成功');
          this.openPosition = false
          if (currentOpenInfoWindow) {
            currentOpenInfoWindow.closeInfoWindow();
          }
          await queryForDeviceFun()
        }).catch(() => {
        })
    },
    treeChannelClickEvent(id) {
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
                        ${escapeHtml(data.deviceName)}
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
                        <button
                          style="
                            padding: 5px 14px;
                            font-size: 12px;
                            border: none;
                            border-radius: 6px;
                            background: #f0f0f0;
                            color: #555;
                            cursor: pointer;
                            font-weight: 500;
                            transition: all 0.25s ease;
                          "
                          onmouseover="this.style.transform='translateY(-2px)';this.style.background='#e8e8e8';"
                          onmouseout="this.style.transform='';this.style.background='#f0f0f0';"
                          onclick="window.handlePosition('${data.id}')"
                        >📍 位置</button>
                      </div>
                    </div>
                    `.trim();
          infoWin1.setContent(sContent);
          let marker = markerMap.get(id)
          marker.openInfoWindow(infoWin1);
        })
    },
    escapeHtml(str) {
      if (typeof str !== 'string') return str == null ? '' : String(str)
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    },
    playChannelFun(data, type) {
      await treeChannelClickEvent(data.id)
        await play(data.id)
    },
    play(id) {
      getDevice(id).then((res) => {
          let row = res.data
          if (!row.longitude || row.longitude < 0 || !row.latitude || row.latitude < 0) {
            return
          }
      
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
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9'; // 支持云台的设备类型
                this.isPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12'; // 支持预置点的设备类型
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '6') {
            loadRecord(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9'; // 支持云台的设备类型
                this.isPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12'; // 支持预置点的设备类型
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
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
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9'; // 支持云台的设备类型
                this.isPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12'; // 支持预置点的设备类型
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          }else if (row.type === '13') {
            streamPullPush(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9'; // 支持云台的设备类型
                this.isPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12'; // 支持预置点的设备类型
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '12') {
            startGb28181Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = row.type === '5' || row.type === '12' || row.type === '7' || row.type === '8' || row.type === '9'; // 支持云台的设备类型
                this.isPresetSupported = row.type === '5' || row.type === '7' || row.type === '8' || row.type === '9' || row.type === '12'; // 支持预置点的设备类型
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          } else if (row.type === '14') {
            startJt1078Play(row.id).then(async (res: any) => {
              await nextTick(async () => {
                if (location.protocol === "https:") {
                  this.flvUrl = res.data.https_flv;
                  this.rtcUrl = res.data.rtcs;
                  this.wsUrl = res.data.wss_flv;
                } else {
                  this.flvUrl = res.data.flv;
                  this.rtcUrl = res.data.rtc;
                  this.wsUrl = res.data.ws_flv;
                }
                this.sharedIframe = '<iframe src="' + window.location.origin + '/easyPlayer?url=' + encodeURIComponent(this.wsUrl) + '"></iframe>';
      
                this.streamInfo = res.data;
                this.quality = []
                this.defaultQuality = ''
                this.isPtz = true; // JT1078 支持云台
                this.isPresetSupported = false; // JT1078 不支持预置点
                this.isQuality = false
                this.isLive = true
                this.deviceRow = row
                this.easyPlayerOpen = true
      
                await nextTick()
                if (proxy.$refs['EasyPlayerRef']) {
                  proxy.$refs['EasyPlayerRef'].play(this.wsUrl)
                }
              })
            }).finally(() => {
              loading.close()
            })
          }
      
        })
    },
    async ptzCamera(command) {
      console.log(command);
        console.log(this.deviceRow);
        
        if (!this.deviceRow || !this.deviceRow.id) {
          proxy.$modal.msgError('请先选择设备');
          return;
        }
        
        if (!this.isPtz) {
          proxy.$modal.msgWarning('当前设备不支持云台控制');
          return;
        }
        
        try {
          if (command !== 'stop') {
            // 开始云台控制
            await startPtz(this.deviceRow.id, command, this.controSpeed);
          } else {
            // 结束云台控制，这里我们传入一个默认的方向或者上一个方向
            // 为了简单，我们传入 'up' 作为方向，但实际上后端可能只需要 id 和速度
            await endPtz(this.deviceRow.id, 'up', this.controSpeed);
          }
        } catch (error) {
          console.error('云台控制失败:', error);
          proxy.$modal.msgError('云台控制失败');
        }
    },
    async handlePtz(data) {
      console.log('handlePtz', data);
        if (!this.deviceRow || !this.deviceRow.id) {
          proxy.$modal.msgError('请先选择设备');
          return;
        }
        
        if (!this.isPtz) {
          proxy.$modal.msgWarning('当前设备不支持云台控制');
          return;
        }
        
        try {
          if (data === 'stop') {
            // 结束云台控制，使用上一次保存的命令
            await endPtz(this.deviceRow.id, this.lastPtzCommand, this.controSpeed);
          } else {
            // 保存当前命令
            this.lastPtzCommand = data;
            // 开始云台控制
            await startPtz(this.deviceRow.id, data, this.controSpeed);
          }
        } catch (error) {
          console.error('云台控制失败:', error);
          proxy.$modal.msgError('云台控制失败');
        }
    },
    async loadPresetList() {
      if (!this.isPresetSupported || !this.deviceRow || !this.deviceRow.id) {
          return;
        }
        try {
          const res = await getPresetList(this.deviceRow.id, this.deviceRow.channel);
          if (res && res.data) {
            this.presetList = res.data;
          }
        } catch (error) {
          console.error('获取预置点列表失败:', error);
          proxy.$modal.msgError('获取预置点列表失败');
        }
    },
    handlePresetSelect(index) {
      this.selectedPresetIndex = index;
        if (index) {
          this.newPresetIndex = index;
          const preset = this.presetList.find(p => p.index === index);
          if (preset) {
            this.newPresetName = preset.name || '';
          }
        }
    },
    openSetPresetDialog() {
      // 如果没有选择预置点也没有输入预置点编号，默认设为 1
        presetForm.index = this.newPresetIndex || 1;
        presetForm.name = '';
        // 如果选择了预置点，自动填充名称
        if (this.selectedPresetIndex) {
          const preset = this.presetList.find(p => p.index === this.selectedPresetIndex);
          if (preset) {
            presetForm.index = preset.index;
            presetForm.name = preset.name || '';
          }
        }
        this.presetDialogVisible = true;
        // 重置表单校验
        nextTick(() => {
          this.presetFormRef?.resetFields();
        });
    },
    async handleSetPreset() {
      if (!this.deviceRow || !this.deviceRow.id) {
          proxy.$modal.msgError('请先选择设备');
          return;
        }
        // 校验表单
        if (!this.presetFormRef) return;
        await this.presetFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await setPreset(this.deviceRow.id, this.deviceRow.channel, presetForm.index, presetForm.name);
              proxy.$modal.msgSuccess('设置预置点成功');
              this.presetDialogVisible = false;
              await loadPresetList();
            } catch (error) {
              console.error('设置预置点失败:', error);
              proxy.$modal.msgError('设置预置点失败');
            }
          }
        });
    },
    async handleGotoPreset() {
      if (!this.deviceRow || !this.deviceRow.id) {
          proxy.$modal.msgError('请先选择设备');
          return;
        }
        const presetIndex = this.selectedPresetIndex || this.newPresetIndex;
        if (!presetIndex) {
          proxy.$modal.msgWarning('请先选择或输入预置点');
          return;
        }
        try {
          await gotoPreset(this.deviceRow.id, this.deviceRow.channel, presetIndex);
          proxy.$modal.msgSuccess('调用预置点成功');
        } catch (error) {
          console.error('调用预置点失败:', error);
          proxy.$modal.msgError('调用预置点失败');
        }
    },
    async handleDeletePreset() {
      if (!this.deviceRow || !this.deviceRow.id) {
          proxy.$modal.msgError('请先选择设备');
          return;
        }
        const presetIndex = this.selectedPresetIndex || this.newPresetIndex;
        if (!presetIndex) {
          proxy.$modal.msgWarning('请先选择或输入预置点');
          return;
        }
        try {
          await proxy.$modal.confirm('确定要删除该预置点吗？');
          await deletePreset(this.deviceRow.id, this.deviceRow.channel, presetIndex);
          proxy.$modal.msgSuccess('删除预置点成功');
          this.selectedPresetIndex = null;
          await loadPresetList();
        } catch (error) {
          if (error !== 'cancel') {
            console.error('删除预置点失败:', error);
            proxy.$modal.msgError('删除预置点失败');
          }
        }
    },
    async handleCopy(text) {
      if (!text) {
          proxy.$modal.msgError('内容为空，无法复制');
          return;
        }
      
        try {
          await toClipboard(text)
          proxy.$modal.msgSuccess('成功拷贝到粘贴板');
        } catch (e) {
          console.error(e)
        }
    },
  },
}
</script>

<style scoped>
::v-deep(.el-icon) {
  height: auto !important;
}

/* ========== 云台控制区域 ========== */
.control-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 100%;
  margin-top: 24px;
  margin-left: 8px;
  float: left;
  filter: drop-shadow(0 2px 8px rgba(64, 158, 255, 0.15));
}

.control-btn {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 44%;
  height: 44%;
  border-radius: 5px;
  border: 1px solid rgba(64, 158, 255, 0.5);
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
}

.control-btn:hover {
  cursor: pointer;
  border-color: #409EFF;
  background: rgba(64, 158, 255, 0.08);
  transform: scale(1.08);
  box-shadow: 0 0 16px rgba(64, 158, 255, 0.25);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn .icon {
  width: 100%;
  font-size: 20px;
  color: #409EFF;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.3s;
}

.control-btn:hover .icon {
  color: #409EFF;
}

.control-zoom-btn {
  color: #409EFF;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.control-zoom-btn:hover {
  cursor: pointer;
  transform: scale(1.15);
  filter: drop-shadow(0 0 6px rgba(64, 158, 255, 0.4));
}

.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: #fff;
  border-radius: 100%;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
}

.control-round-inner {
  position: absolute;
  left: 13%;
  top: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  font-size: 40px;
  color: #409EFF;
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 100%;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: centerPulse 3s ease-in-out infinite;
}

@keyframes centerPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.15);
    border-color: rgba(64, 158, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(64, 158, 255, 0.05);
    border-color: rgba(64, 158, 255, 0.5);
  }
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fafafa;
}

.control-top {
  top: -12px;
  left: 27%;
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .icon {
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
  left: -1px;
  bottom: 0;
  border-top: 1px solid rgba(64, 158, 255, 0.4);
  border-right: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 0 100% 0 0;
}

.control-top .fa {
  transform: rotate(45deg) translateY(-7px);
}

.control-left {
  top: 27%;
  left: -12px;
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
}

.control-left .icon {
  transform: rotate(-45deg);
}

.control-left .control-inner {
  right: -1px;
  top: -1px;
  border-bottom: 1px solid rgba(64, 158, 255, 0.4);
  border-left: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 0 0 0 100%;
}

.control-left .fa {
  transform: rotate(-45deg) translateX(-7px);
}

.control-right {
  top: 27%;
  right: -12px;
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-right .icon {
  transform: rotate(-45deg);
}

.control-right .control-inner {
  left: -1px;
  bottom: -1px;
  border-top: 1px solid rgba(64, 158, 255, 0.4);
  border-right: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 0 100% 0 0;
}

.control-right .fa {
  transform: rotate(-45deg) translateX(7px);
}

.control-bottom {
  left: 27%;
  bottom: -12px;
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
}

.control-bottom .icon {
  transform: rotate(-45deg);
}

.control-bottom .control-inner {
  top: -1px;
  left: -1px;
  border-bottom: 1px solid rgba(64, 158, 255, 0.4);
  border-right: 1px solid rgba(64, 158, 255, 0.4);
  border-radius: 0 0 100% 0;
}

.control-bottom .fa {
  transform: rotate(-45deg) translateY(7px);
}

.ptz-btn-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 32px;
  height: 48px;
  line-height: 64px;
}

/* ========== 预置点面板 ========== */
.preset-panel {
  padding: 20px;
  animation: panelFadeIn 0.4s ease-out;
}

@keyframes panelFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.preset-select {
  width: 100%;
  margin-bottom: 16px;
}

.preset-select :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.preset-buttons .el-button {
  flex: 1;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.preset-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.refresh-btn {
  padding: 8px 0;
  transition: all 0.3s;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

/* ========== 对话框动画 ========== */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 12px 20px;
  border-top: 1px solid #ebeef5;
}

/* 视频播放对话框标签页 */
:deep(.el-tabs__nav) {
  border-radius: 8px;
}

:deep(.el-tabs__item) {
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

/* 云台标签页 */
.ptz-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}

/* 滑块 */
.contro-speed :deep(.el-slider__runway) {
  margin: 8px 0;
}

.contro-speed :deep(.el-slider__button) {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.contro-speed :deep(.el-slider__button:hover) {
  transform: scale(1.3);
}

/* 复制按钮 */
:deep(.el-input-group__append .el-button) {
  transition: all 0.3s;
}

:deep(.el-input-group__append .el-button:hover) {
  transform: scale(1.05);
}

/* 暗黑模式适配 */
html.dark .control-btn {
  background: rgba(30, 30, 40, 0.6);
  border-color: rgba(64, 158, 255, 0.35);
}

html.dark .control-btn:hover {
  background: rgba(64, 158, 255, 0.12);
  box-shadow: 0 0 16px rgba(64, 158, 255, 0.3);
}

html.dark .control-round {
  background: rgba(30, 30, 40, 0.8);
}

html.dark .control-round-inner {
  color: #409EFF;
  border-color: rgba(64, 158, 255, 0.35);
}

html.dark .control-inner-btn {
  background: rgba(20, 20, 30, 0.5);
}
</style>
