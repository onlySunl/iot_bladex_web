<template>
  <div class="snapshot-panel">
    <div class="snapshot-header">
      <el-button type="primary" @click="handleSnapshot" :loading="snapshotLoading">
        <el-icon>
          <Camera/>
        </el-icon>
        抓图
      </el-button>
      <el-button @click="handleDownloadSnapshot" :disabled="!currentSnapshot">
        <el-icon>
          <Download/>
        </el-icon>
        下载
      </el-button>
      <el-button @click="handleClearSnapshot" :disabled="!currentSnapshot">
        <el-icon>
          <Delete/>
        </el-icon>
        清空
      </el-button>
    </div>

    <div class="snapshot-content">
      <div v-if="currentSnapshot" class="snapshot-image-wrapper">
        <el-image
            :src="currentSnapshot"
            :preview-src-list="[currentSnapshot]"
            fit="contain"
            class="snapshot-image"
        />
        <div class="snapshot-info">
          <span class="snapshot-time">{{ snapshotTime }}</span>
        </div>
      </div>
      <div v-else class="snapshot-empty">
        <el-icon class="empty-icon">
          <Picture/>
        </el-icon>
        <p>暂无抓图</p>
        <p class="empty-tip">点击"抓图"按钮获取当前画面</p>
      </div>
    </div>

    <div v-if="snapshotHistory.length > 0" class="snapshot-history">
      <div class="history-title">历史抓图</div>
      <div class="history-list">
        <div
            v-for="(item, index) in snapshotHistory"
            :key="index"
            class="history-item"
            :class="{ active: currentSnapshot === item.url }"
            @click="handleSelectSnapshot(item)"
        >
          <el-image :src="item.url" fit="cover" class="history-image"/>
          <div class="history-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * SnapshotPanel - 抓图面板
 * 负责视频流抓图、下载、历史管理
 */
import { ref } from 'vue'
import { Camera, Download, Delete, Picture } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  streamInfo: { type: Object, default: () => ({}) }
})

// Emits
const emit = defineEmits(['snapshot', 'download', 'clear', 'select'])

// 状态
const snapshotLoading = ref(false)
const currentSnapshot = ref('')
const snapshotTime = ref('')
const snapshotHistory = ref([])

// 抓图
const handleSnapshot = async () => {
  snapshotLoading.value = true
  try {
    emit('snapshot', {
      onSuccess: (url) => {
        const time = new Date().toLocaleString()
        currentSnapshot.value = url
        snapshotTime.value = time
        snapshotHistory.value.unshift({ url, time })
        // 保留最近 20 张
        if (snapshotHistory.value.length > 20) {
          snapshotHistory.value = snapshotHistory.value.slice(0, 20)
        }
      },
      onComplete: () => {
        snapshotLoading.value = false
      }
    })
  } catch (e) {
    snapshotLoading.value = false
  }
}

// 下载
const handleDownloadSnapshot = () => {
  emit('download', currentSnapshot.value)
}

// 清空
const handleClearSnapshot = () => {
  currentSnapshot.value = ''
  snapshotTime.value = ''
  snapshotHistory.value = []
  emit('clear')
}

// 选择历史抓图
const handleSelectSnapshot = (item) => {
  currentSnapshot.value = item.url
  snapshotTime.value = item.time
  emit('select', item)
}

// 暴露数据给父组件
defineExpose({
  currentSnapshot,
  snapshotHistory,
  handleSnapshot
})
</script>

<style scoped lang="scss">
.snapshot-panel {
  .snapshot-header {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }

  .snapshot-content {
    min-height: 200px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    overflow: hidden;
  }

  .snapshot-image-wrapper {
    position: relative;

    .snapshot-image {
      width: 100%;
      height: 200px;
      display: block;
    }

    .snapshot-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      padding: 8px 12px;

      .snapshot-time {
        color: #fff;
        font-size: 12px;
      }
    }
  }

  .snapshot-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--el-text-secondary);

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .empty-tip {
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .snapshot-history {
    margin-top: 16px;

    .history-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--el-text-primary);
    }

    .history-list {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .history-item {
      flex-shrink: 0;
      width: 80px;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: var(--el-color-primary-light-3);
      }

      &.active {
        border-color: var(--el-color-primary);
      }

      .history-image {
        width: 80px;
        height: 50px;
        display: block;
      }

      .history-time {
        font-size: 10px;
        padding: 2px 4px;
        text-align: center;
        color: var(--el-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
