<template>

  <el-dialog
      draggable
      v-model="showVideoDialog"
      width="1200px"
      append-to-body
      title="生成国标编码"
      top="2rem"
      center
      :close-on-click-modal="false"
      :destroy-on-close="false"
  >
    <el-tabs v-model="activeKey" style="padding: 0 1rem; margin: auto 0" @tab-click="getRegionList">
      <el-tab-pane name="0">
        <template slot="label">
          <div class="show-code-item">{{ allVal[0].val }}</div>
          <div style="text-align: center">{{ allVal[0].meaning }}</div>
        
</template>

<script>
import {getAllChild,} from "@/api/nvr/region";
import {

export default {
  name: '0',
  data() {
    return {
      showVideoDialog: false,
      activeKey: '0',
      allVal: [],
      regionList: [],
      deviceTypeList: [],
      industryCodeTypeList: [],
      networkIdentificationTypeList: [],
      endCallBck: null,
    }
  },
  methods: {
    openDialog(callBck, code, lockIndex, lockContent) {
      allVal = [{
          id: [1, 2],
          meaning: '省级编码',
          val: '11',
          type: '中心编码',
          lock: false,
        },
          {
            id: [3, 4],
            meaning: '市级编码',
            val: '01',
            type: '中心编码',
            lock: false,
          },
          {
            id: [5, 6],
            meaning: '区级编码',
            val: '01',
            type: '中心编码',
            lock: false,
          },
          {
            id: [7, 8],
            meaning: '基层接入单位编码',
            val: '01',
            type: '中心编码',
            lock: false,
          },
          {
            id: [9, 10],
            meaning: '行业编码',
            val: '00',
            type: '行业编码',
            lock: false,
          },
          {
            id: [11, 13],
            meaning: '类型编码',
            val: '132',
            type: '类型编码',
            lock: false,
          },
          {
            id: [14],
            meaning: '网络标识编码',
            val: '7',
            type: '网络标识',
            lock: false,
          },
          {
            id: [15, 20],
            meaning: '设备/用户序号',
            val: '000001',
            type: '序号',
            lock: false,
          }]
        showVideoDialog = true
        activeKey = '0';
        regionList = []
      
        getRegionList()
        if (typeof code != 'undefined' && code != null && code.length === 20) {
          allVal[0].val = code.substring(0, 2)
          allVal[1].val = code.substring(2, 4)
          allVal[2].val = code.substring(4, 6)
          allVal[3].val = code.substring(6, 8)
          allVal[4].val = code.substring(8, 10)
          allVal[5].val = code.substring(10, 13)
          allVal[6].val = code.substring(13, 14)
          allVal[7].val = code.substring(14)
        }
        if (typeof lockIndex != 'undefined') {
          allVal[lockIndex].lock = true
          allVal[lockIndex].val = lockContent
        }
        endCallBck = callBck;
    },
    getRegionList() {
      nextTick(() => {
          if (activeKey === '0' || activeKey === '1' || activeKey === '2') {
            let parent = ''
            if (activeKey === '1') {
              parent = allVal[0].val
            }
            if (activeKey === '2') {
              parent = allVal[0].val + allVal[1].val
            }
            if (activeKey !== '0' && parent === '') {
              this.$message.error('请先选择上级行政区划')
            }
            queryChildList(parent);
          } else if (activeKey === '4') {
            queryIndustryCodeList();
          } else if (activeKey === '5') {
            queryDeviceTypeList();
          } else if (activeKey === '6') {
            queryNetworkIdentificationTypeList();
          }
        })
    },
    queryChildList(parent) {
      regionList = []
      
        getAllChild({parent: parent}).then((res) => {
          regionList = res.data
        })
    },
    queryIndustryCodeList() {
      industryCodeTypeList = []
      
        getIndustryCodeList().then((res) => {
          industryCodeTypeList = res.data
        })
    },
    queryDeviceTypeList() {
      deviceTypeList = []
      
        getDeviceTypeList().then((res) => {
          deviceTypeList = res.data
        })
    },
    queryNetworkIdentificationTypeList() {
      networkIdentificationTypeList = []
      
        getNetworkIdentificationTypeList().then((res) => {
          networkIdentificationTypeList = res.data
        })
    },
    closeModel() {
      showVideoDialog = false
    },
    handleOk() {
      const code =
            allVal[0].val +
            allVal[1].val +
            allVal[2].val +
            allVal[3].val +
            allVal[4].val +
            allVal[5].val +
            allVal[6].val +
            allVal[7].val
        if (endCallBck) {
          endCallBck = code
        }
        showVideoDialog = false
        emit('handleOk', code);
    },
  },
}
</script>

<style>
.show-code-item {
  text-align: center;
  font-size: 3rem;
}
</style>
