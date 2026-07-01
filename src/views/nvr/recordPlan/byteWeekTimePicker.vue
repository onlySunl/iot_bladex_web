<template>
  <div class="weektime">
    <div class="weektime-main">
      <div class="weektime-hd">
        <div class="weektime-hd-title">时间段</div>
        <div class="weektime-hd-con">
          <div class="weektime-hd-con-top">
            <div class="weektime-date-cell" v-for="(item, index) in timeTextList" :key="index">
              {{ item.split(':')[0] }}
            </div>
          </div>
          <div class="weektime-hd-con-bottom">
            <div class="weektime-date-cell" v-for="(item, index) in timeTextList" :key="index">
              {{ item.split(':')[1] }}
            </div>
          </div>
        </div>
        <div class="weektime-date-range" v-for="(item, index) in weekDays" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="weektime-bd">
        <div class="week-body">
          <div class="week-item" v-for="(item, index) in weekDays" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="time-area" @mousedown="handleMousedown" @mousemove="handleMousemove" @mouseup="handleMouseup">
          <div class="time-cell" v-for="(item, index) in list" :key="index" :data-index="index"
            :class="{'active': item === '1', 'pre-active': preViewIndex.includes(index), 'disable': disableTimes.includes(index)}">
          </div>
        </div>
        <div class="time-body">
          <div class="time-cell" v-for="(item, index) in list" :key="index" :data-index="index"
            :class="{'active': item === '1', 'pre-active': preViewIndex.includes(index), 'disable': disableTimes.includes(index)}">
          </div>
        </div>
      </div>
    </div>
    <div class="weektime-help">
      <div class="weektime-help-tx">
        <div class="weektime-help-week-tx">已选时间段</div>
        <div class="weektime-help-ft" @click="clearAll">清空</div>
      </div>
      <div class="weektime-help-bd">
        <span class="color-box color-active"></span>
        <span class="text-box">已选</span>
        <span class="color-box"></span>
        <span class="text-box">未选</span>
      </div>
      <div class="weektime-help-select" v-for="(item, index) in showTimeText" :key="index">
        {{ weekDays[index] }}：{{ item || '未选择' }}
      </div>
    </div>
  </div>
</template>

<script>
const DayTimes = 24 * 2;

export default {
  name: 'ByteWeekTimePicker',
  props: {
    value: String,
    startTime: {
      type: Number,
      default: -1
    },
    endTime: {
      type: Number,
      default: -1
    },
    customDisableTimes: {
      type: Array,
      default: function() { return []; }
    }
  },
  data() {
    return {
      isMove: false,
      list: [],
      weekTimes: 7 * DayTimes,
      weekDays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      timeTextList: [],
      startIndex: 0,
      axis: {},
      preViewIndex: [],
      showTimeText: []
    };
  },
  computed: {
    disableTimes() {
      if (Array.isArray(this.customDisableTimes) && this.customDisableTimes.every(function(num) { return typeof num === 'number'; })) {
        return this.customDisableTimes;
      }
      if (this.startTime > -1 && this.endTime > -1) {
        var disabled = [];
        for (var index = 0; index < this.weekTimes; index++) {
          var firstIdx = index % DayTimes;
          if (this.startTime > firstIdx || this.endTime < firstIdx) {
            disabled.push(index);
          }
        }
        return disabled;
      }
      return [];
    }
  },
  watch: {
    value: function(newVal) {
      this.timeTextList = this.initTimeText();
      this.initList(newVal);
    }
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.resetMousemove);
  },
  methods: {
    tiptxt(index) {
      var timeIndex = index % DayTimes;
      var weekIndex = ~~(index / DayTimes);
      return this.weekDays[weekIndex] + ' ' + this.timeTextList[timeIndex] + '~' + this.timeTextList[timeIndex + 1];
    },
    initTimeText() {
      var timeTextList = [];
      var hours = [];
      var minutes = ['00', '30'];
      for (var i = 0; i <= 24; i++) {
        i < 10 ? hours.push('0' + i) : hours.push(i.toString());
      }
      for (var h = 0; h < hours.length; h++) {
        for (var m = 0; m < minutes.length; m++) {
          timeTextList.push(hours[h] + ':' + minutes[m]);
        }
      }
      return timeTextList;
    },
    handleMousedown(event) {
      this.startIndex = event.target.getAttribute('data-index');
      if (this.disableTimes.includes(~~this.startIndex)) return;
      this.isMove = true;
      this.axis.startx = this.startIndex % DayTimes;
      this.axis.starty = ~~(this.startIndex / DayTimes);
    },
    handleMouseup(event) {
      this.handleMousemove(event);
      this.resetMousemove();
    },
    handleMousemove(event) {
      if (!this.isMove) return;
      var index = event.target.getAttribute('data-index');
      this.axis.endx = index % DayTimes;
      this.axis.endy = ~~(index / DayTimes);
      this.preViewIndex = this.getSelectIndex();
    },
    resetMousemove() {
      if (!this.isMove) return;
      this.setSelectIndex(this.preViewIndex);
      this.isMove = false;
      this.axis = {};
      this.preViewIndex = [];
    },
    getSelectIndex() {
      var indexList = [];
      var newAxis = {
        startx: Math.min(this.axis.startx, this.axis.endx),
        starty: Math.min(this.axis.starty, this.axis.endy),
        endx: Math.max(this.axis.startx, this.axis.endx),
        endy: Math.max(this.axis.starty, this.axis.endy)
      };
      for (var y = newAxis.starty; y <= newAxis.endy; y++) {
        for (var x = newAxis.startx; x <= newAxis.endx; x++) {
          indexList.push(x + y * DayTimes);
        }
      }
      return indexList.filter(function(v) { return !this.disableTimes.includes(v); }.bind(this));
    },
    setSelectIndex(indexList) {
      if (!Array.isArray(indexList)) return;
      var listLength = indexList.length;
      var newData = this.list[this.startIndex] === '1' ? '0' : '1';
      for (var i = 0; i < listLength; i++) {
        this.list.splice(indexList[i], 1, newData);
      }
      var inputValue = this.list.join('');
      this.$emit('input', inputValue);
      this.showSelectTime(this.list);
    },
    showSelectTime(list) {
      if (!Array.isArray(list)) return;
      var weeksSelect = [];
      var listlength = list.length;
      this.showTimeText = [];
      if (listlength === 0) return;
      for (var i = 0; i < listlength; i += DayTimes) {
        weeksSelect.push(list.slice(i, i + DayTimes));
      }
      var self = this;
      weeksSelect.forEach(function(item) {
        self.showTimeText.push(self.getTimeText(item));
      });
    },
    getTimeText(arrIndex) {
      if (!Array.isArray(arrIndex)) return '';
      var timeLength = arrIndex.length;
      var isSelect = false;
      var timeText = '';
      var self = this;
      arrIndex.forEach(function(value, index) {
        if (value === '1') {
          if (!isSelect) {
            timeText += self.timeTextList[index];
            isSelect = true;
          }
          if (index === timeLength - 1) {
            timeText += '~' + self.timeTextList[index + 1] + '、';
          }
        } else {
          if (isSelect) {
            timeText += '~' + self.timeTextList[index] + '、';
            isSelect = false;
          }
        }
      });
      return timeText.slice(0, -1);
    },
    initList(value) {
      var reg = new RegExp('^[01]{' + this.weekTimes + '}$');
      if (value && reg.test(value)) {
        this.list = value.split('');
        return this.showSelectTime(this.list);
      }
      this.list = new Array(this.weekTimes).fill('0');
      this.$emit('input', this.list.join(''));
      this.showSelectTime(this.list);
    },
    clearAll() {
      this.list = new Array(this.weekTimes).fill('0');
      this.$emit('input', this.list.join(''));
      this.showSelectTime(this.list);
    }
  }
};
</script>

<style lang="scss" scoped>
div,
span,
p {
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: normal;
  vertical-align: baseline;
  -webkit-tap-highlight-color: transparent;
  -ms-tap-highlight-color: transparent;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.weektime {
  width: 658px;
  font-size: 14px;
  line-height: 32px;
  color: #606266;
  user-select: none;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.weektime .weektime-main {
  border: 1px solid rgba(217, 217, 217, 0.8);
  border-radius: 12px;
  overflow: hidden;
  background: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  transition: all 0.3s ease;
}

.weektime .weektime-hd {
  display: flex;
  background: #f5f7fa;
}

.weektime .weektime-hd-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  width: 80px;
  height: 65px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.weektime .weektime-hd-con {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.weektime .weektime-hd-con-top {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.weektime .weektime-date-range {
  width: 288px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-left: 1px solid #ebeef5;
  font-size: 12px;
  font-weight: 500;
  color: #909399;
}

.weektime .weektime-hd-con-bottom {
  display: flex;
}

.weektime .weektime-date-cell {
  width: 24px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-left: 1px solid #ebeef5;
  font-size: 11px;
  color: #909399;
  transition: all 0.2s ease;
}

.weektime .weektime-date-cell:hover {
  color: #409EFF;
  background: #ebeef5;
}

.weektime .weektime-bd {
  display: flex;
}

.weektime .week-body {
  width: 80px;
  flex-shrink: 0;
}

.weektime .week-item {
  border-top: 1px solid #ebeef5;
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #303133;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.weektime .week-item:hover {
  color: #409EFF;
  background: #f5f7fa;
}

.weektime .time-body {
  width: 576px;
  height: 210px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.weektime .time-cell {
  position: relative;
  width: 12px;
  height: 30px;
  border-left: 1px solid #f2f6fc;
  border-top: 1px solid #f2f6fc;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline-width: 0;
  cursor: pointer;
  border-radius: 2px;
}

.weektime .time-cell:hover:not(.disable) {
  background: #ebeef5;
  transform: scale(1.15);
  z-index: 10;
  border-radius: 4px;
}

.weektime .time-cell.active {
  background: linear-gradient(135deg, #409EFF, #79bbff);
  animation: cellPulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
}

@keyframes cellPulse {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.15);
  }
}

.weektime .time-cell.disable {
  cursor: no-drop;
  background: #fafafa;
  opacity: 0.5;
}

.weektime .time-cell::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  opacity: 0.4;
  transition: all 0.2s ease;
  z-index: 99999;
  border-radius: 2px;
}

.weektime .pre-active::after {
  background: #79bbff;
  animation: preActiveFade 0.2s ease;
}

@keyframes preActiveFade {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 0.4;
    transform: scale(1);
  }
}

.weektime .disable::after {
  background: #c0c4cc;
}

.time-area {
  width: 576px;
  height: 210px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background: transparent;
}

.weektime .weektime-help {
  width: 658px;
  border: 1px solid rgba(217, 217, 217, 0.8);
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  animation: fadeInUp 0.4s ease-out 0.1s backwards;
}

.weektime .weektime-help-tx {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.weektime .weektime-help-week-tx {
  color: #909399;
  font-weight: 500;
}

.weektime .weektime-help-bd {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 0;
}

.weektime .weektime-help .color-box {
  width: 16px;
  height: 16px;
  background: #fafafa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: block;
  margin-right: 6px;
  transition: all 0.3s ease;
}

.weektime .weektime-help-bd .color-box.color-active {
  background: linear-gradient(135deg, #409EFF, #79bbff);
  border-color: #409EFF;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.25);
}

.weektime .weektime-help .text-box {
  margin-right: 15px;
  color: #606266;
  font-weight: 500;
}

.weektime .weektime-help .weektime-help-ft {
  color: #409EFF;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 6px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;

  &:hover {
    color: #79bbff;
    background: #ebeef5;
    border-color: #dcdfe6;
    transform: translateY(-1px);
  }
}

.weektime-help-select {
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}
</style>
