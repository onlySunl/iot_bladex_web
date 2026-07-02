<template>
  <div class="ptz-control">
    <el-row :gutter="16">
      <!-- 方向控制 -->
      <el-col :span="12">
        <div class="direction-control">
          <div class="direction-grid">
            <div class="direction-btn up" @mousedown="handleDirection('up', true)" @mouseup="handleDirection('up', false)" @mouseleave="handleDirection('up', false)">
              <el-icon><ArrowUp /></el-icon>
            </div>
            <div class="direction-btn left" @mousedown="handleDirection('left', true)" @mouseup="handleDirection('left', false)" @mouseleave="handleDirection('left', false)">
              <el-icon><ArrowLeft /></el-icon>
            </div>
            <div class="direction-btn center">
              <el-icon><Aim /></el-icon>
            </div>
            <div class="direction-btn right" @mousedown="handleDirection('right', true)" @mouseup="handleDirection('right', false)" @mouseleave="handleDirection('right', false)">
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="direction-btn down" @mousedown="handleDirection('down', true)" @mouseup="handleDirection('down', false)" @mouseleave="handleDirection('down', false)">
              <el-icon><ArrowDown /></el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 缩放/聚焦/光圈 -->
      <el-col :span="12">
        <div class="zoom-control">
          <div class="control-row">
            <span class="label">缩放</span>
            <el-button-group>
              <el-button size="small" @mousedown="handleZoom('in', true)" @mouseup="handleZoom('in', false)" @mouseleave="handleZoom('in', false)">
                <el-icon><ZoomIn /></el-icon>
              </el-button>
              <el-button size="small" @mousedown="handleZoom('out', true)" @mouseup="handleZoom('out', false)" @mouseleave="handleZoom('out', false)">
                <el-icon><ZoomOut /></el-icon>
              </el-button>
            </el-button-group>
          </div>
          <div class="control-row">
            <span class="label">聚焦</span>
            <el-button-group>
              <el-button size="small" @mousedown="handleFocus('near', true)" @mouseup="handleFocus('near', false)" @mouseleave="handleFocus('near', false)">
                近
              </el-button>
              <el-button size="small" @mousedown="handleFocus('far', true)" @mouseup="handleFocus('far', false)" @mouseleave="handleFocus('far', false)">
                远
              </el-button>
            </el-button-group>
          </div>
          <div class="control-row">
            <span class="label">光圈</span>
            <el-button-group>
              <el-button size="small" @mousedown="handleIris('open', true)" @mouseup="handleIris('open', false)" @mouseleave="handleIris('open', false)">
                开
              </el-button>
              <el-button size="small" @mousedown="handleIris('close', true)" @mouseup="handleIris('close', false)" @mouseleave="handleIris('close', false)">
                关
              </el-button>
            </el-button-group>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 速度控制 -->
    <div class="speed-control">
      <span class="label">速度:</span>
      <el-slider v-model="speed" :min="1" :max="10" :step="1" show-stops style="flex: 1" />
    </div>

    <!-- 预置位 -->
    <div class="preset-control" v-if="showPreset">
      <el-divider content-position="left">预置位</el-divider>
      <el-row :gutter="8">
        <el-col :span="6" v-for="i in 8" :key="i">
          <el-button size="small" style="width: 100%; margin-bottom: 8px" @click="handlePreset(i)">
            预置位 {{ i }}
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="DevicePtzControl">
import { ref } from 'vue';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Aim, ZoomIn, ZoomOut } from '@element-plus/icons-vue';

interface Props {
  deviceId: string;
  showPreset?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPreset: true
});

const emit = defineEmits<{
  (e: 'direction', direction: string, action: boolean, speed: number): void;
  (e: 'zoom', action: string, active: boolean, speed: number): void;
  (e: 'focus', action: string, active: boolean, speed: number): void;
  (e: 'iris', action: string, active: boolean, speed: number): void;
  (e: 'preset', presetIndex: number): void;
}>();

const speed = ref(5);

const handleDirection = (direction: string, active: boolean) => {
  emit('direction', direction, active, speed.value);
};

const handleZoom = (action: string, active: boolean) => {
  emit('zoom', action, active, speed.value);
};

const handleFocus = (action: string, active: boolean) => {
  emit('focus', action, active, speed.value);
};

const handleIris = (action: string, active: boolean) => {
  emit('iris', action, active, speed.value);
};

const handlePreset = (presetIndex: number) => {
  emit('preset', presetIndex);
};
</script>

<style scoped lang="scss">
.ptz-control {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.direction-control {
  display: flex;
  justify-content: center;
  align-items: center;
}

.direction-grid {
  display: grid;
  grid-template-areas:
    ". up ."
    "left center right"
    ". down .";
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
  gap: 4px;
}

.direction-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ecf5ff;
    border-color: #409eff;
    color: #409eff;
  }

  &:active {
    background: #409eff;
    color: #fff;
  }

  &.up {
    grid-area: up;
  }

  &.left {
    grid-area: left;
  }

  &.center {
    grid-area: center;
    background: #f5f7fa;
    cursor: default;

    &:hover {
      background: #f5f7fa;
      border-color: #dcdfe6;
      color: inherit;
    }
  }

  &.right {
    grid-area: right;
  }

  &.down {
    grid-area: down;
  }
}

.zoom-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .label {
    width: 40px;
    font-size: 13px;
    color: #606266;
  }
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;

  .label {
    font-size: 13px;
    color: #606266;
    white-space: nowrap;
  }
}

.preset-control {
  margin-top: 16px;
}
</style>
