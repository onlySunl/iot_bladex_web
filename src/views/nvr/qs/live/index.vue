<template>
  <div class="app-container">
    <el-row :gutter="20">
      <splitpanes class="default-theme">
        <pane size="20">
          <el-col>
            <DeviceTree @clickEvent="clickEvent" :isContextmenu="false" />
          </el-col>
        </pane>

        <pane size="80">
          <el-col>
            <div id="live" class="live-container">
              <div v-loading="loading" class="live-content" element-loading-text="拼命加载中">
                <div class="video-container">
                  <div class="control-bar">
                    <div class="split-controls">
                      <span class="split-label">
                        <el-icon><Monitor /></el-icon>
                        分屏
                      </span>
                      <div class="split-grid">
                        <div
                            v-for="(item, index) in SPLIT_OPTIONS"
                            :key="item.value"
                            class="split-item"
                            :class="{ active: spiltIndex === index }"
                            @click="handleSplitChange(index)"
                        >
                          <div class="split-preview" :data-split="item.label">
                            <div v-for="i in Number(item.label)" :key="i" class="preview-dot"></div>
                          </div>
                          <span class="split-text">{{ item.label }}屏</span>
                        </div>
                      </div>
                    </div>

                    <div class="toolbar-right">
                      <el-tooltip content="一键清空" placement="top">
                        <el-button circle @click="handleClearAll" :icon="Delete" class="toolbar-btn danger" />
                      </el-tooltip>
                      <el-tooltip content="保存布局" placement="top">
                        <el-button circle @click="handleSaveLayout" :icon="Document" class="toolbar-btn" />
                      </el-tooltip>
                      <el-tooltip content="恢复布局" placement="top">
                        <el-button circle @click="handleRestoreLayout" :icon="RefreshLeft" class="toolbar-btn" />
                      </el-tooltip>
                      <el-tooltip content="全屏" placement="top">
                        <el-button circle @click="triggerFullScreen" :icon="FullScreen" class="toolbar-btn" />
                      </el-tooltip>
                    </div>
                  </div>

                  <div class="player-container">
                    <div ref="playBoxRef" class="play-grid" :style="liveStyle">
                      <div
                          v-for="idx in totalSplitCount"
                          :key="idx"
                          class="play-box"
                          :class="{ active: playerIdx === idx - 1 }"
                          @click="playerIdx = idx - 1"
                      >
                        <div v-if="!videoUrl[idx - 1]" class="no-signal">
                          <div class="no-signal-icon">
                            <el-icon size="32"><VideoPlay /></el-icon>
                          </div>
                          <span>{{ videoTip[idx - 1] || "无信号" }}</span>
                        </div>
                        <div v-else class="player-wrapper">
                          <div class="close-btn" @click.stop="closeSinglePlayer(idx - 1)">
                            <el-icon size="16"><Close /></el-icon>
                          </div>
                          <EasyPlayer
                              :ref="el => setPlayerRef(el, idx - 1)"
                              class="easy-player"
                              width="100"
                              height="100"
                              :isPercentage="true"
                              :quality="quality"
                              :defaultQuality="defaultQuality"
                              :isPtz="currentPlayerSupportPtz"
                              :isQuality="isQuality"
                              :hasAudio="enableAudio[idx - 1] === '1'"
                              :isMute="enableAudio[idx - 1] === '1'"
                              :isLive="isLive"
                              :videoUrl="videoUrl[idx - 1]"
                              @ptz="cmd => handlePtz(cmd, idx - 1)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>
  </div>
</template>