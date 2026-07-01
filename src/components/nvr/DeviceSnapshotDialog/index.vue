<template>
  <el-dialog title="设备抓图" :visible.sync="dialogVisible" width="800px" @close="handleClose">
    <div class="snapshot-container">
      <div v-loading="loading" class="snapshot-list">
        <el-row :gutter="10">
          <el-col v-for="item in snapshotList" :key="item.id" :span="6" style="margin-bottom: 10px;">
            <div class="snapshot-item">
              <el-image :src="item.snapshotUrl" fit="contain" :preview-src-list="[item.snapshotUrl]" style="width: 100%; height: 120px;">
                <div slot="error" class="image-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="snapshot-info">
                <span>{{ item.createTime }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-empty v-if="snapshotList.length === 0" description="暂无抓图"></el-empty>
      </div>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="queryParams.pageNum"
        :page-size.sync="queryParams.pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadSnapshots"
        style="text-align: center; margin-top: 10px;"
      />
    </div>
  </el-dialog>
</template>

<script>
import { listSnapshot, delSnapshot } from '@/api/nvr/snapshot'

export default {
  name: 'DeviceSnapshotDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deviceId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      loading: false,
      snapshotList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        deviceId: null
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.deviceId) {
        this.queryParams.deviceId = this.deviceId
        this.loadSnapshots()
      }
    }
  },
  methods: {
    async loadSnapshots() {
      this.loading = true
      try {
        var res = await listSnapshot(this.queryParams)
        if (res.data) {
          this.snapshotList = res.data.rows || []
          this.total = res.data.total || 0
        }
      } catch (e) {
        console.error('加载抓图失败', e)
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this.snapshotList = []
      this.total = 0
      this.queryParams.pageNum = 1
    }
  }
}
</script>

<style scoped lang="scss">
.snapshot-container {
  max-height: 500px;
  overflow-y: auto;
}
.snapshot-item {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
}
.snapshotInfo {
  padding: 4px 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}
.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
