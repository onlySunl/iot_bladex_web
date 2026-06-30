<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      ref="crud"
      v-model="form"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          v-if="userInfo.role_name.includes('admin')"
          @click="handleDelete"
          >删 除
        </el-button>
      </template>
      <template slot-scope="{row}" slot="status">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
      <template slot-scope="{row}" slot="apiKey">
        <el-tag>{{ row.apiKey }}</el-tag>
      </template>
      <template slot-scope="{row}" slot="expireTime">
        <el-tag>{{ row.expireTimeInfo }}</el-tag>
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-circle-check"
          v-if="row.status === -1 && userInfo.role_name.includes('admin')"
          @click.stop="handleEnable(row)"
          >启用
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-circle-close"
          v-if="row.status === 1 && userInfo.role_name.includes('admin')"
          @click.stop="handleDisable(row)"
          >禁用
        </el-button>
      </template>
      <!-- 访问权限动态表单 -->
      <template slot-scope="{type}" slot="apiPathForm">
        <el-row
          v-for="(item, index) in apiPathList"
          :key="index"
          :gutter="8"
          type="flex"
          style="margin-bottom: 8px"
        >
          <el-col :span="22">
            <el-input
              v-model="apiPathList[index]"
              placeholder="请输入URL路径"
              :disabled="type === 'view'"
            />
          </el-col>
          <el-col :span="2" v-if="type !== 'view'">
            <el-button type="text" size="small" icon="el-icon-delete" @click="removeApiPath(index)" circle />
          </el-col>
        </el-row>
        <el-row v-if="type !== 'view'" :gutter="8">
          <el-col :span="8">
            <el-button type="text" size="small" icon="el-icon-circle-plus" @click="addApiPath"
              >添加路径</el-button
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 8px">
          <span style="color: #909399; font-size: 12px;">
            <i class="el-icon-warning"></i>
            提示: 支持 Ant 风格路径匹配，如 /** 匹配所有、/api/* 匹配单层、/api/** 匹配多层。
          </span>
        </el-row>
      </template>
      <!-- 扩展参数动态表单 -->
      <template slot-scope="{type}" slot="extParamsForm">
        <el-row
          v-for="(item, index) in extParamsList"
          :key="index"
          :gutter="8"
          type="flex"
          style="margin-bottom: 8px"
        >
          <el-col :span="8">
            <el-input v-model="item.key" placeholder="参数名" :disabled="type === 'view'" />
          </el-col>
          <el-col :span="14">
            <el-input v-model="item.value" placeholder="参数值" :disabled="type === 'view'" />
          </el-col>
          <el-col :span="2" v-if="type !== 'view'">
            <el-button type="text" size="small" icon="el-icon-delete" @click="removeExtParam(index)" circle />
          </el-col>
        </el-row>
        <el-row v-if="type !== 'view'" :gutter="8">
          <el-col :span="8">
            <el-button type="text" size="small" icon="el-icon-circle-plus" @click="addExtParam"
              >添加参数</el-button
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 8px">
          <span style="color: #909399; font-size: 12px;">
            <i class="el-icon-warning"></i>
            提示: 可配置 deptId、postId、roleId 等参数自定义 API Key 属性。
          </span>
        </el-row>
      </template>
    </avue-crud>

    <!-- API Key 创建成功弹框 -->
    <el-dialog
      append-to-body
      v-model="apiKeyDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="620px"
      title=""
    >
      <div style="text-align: center;">
        <i class="el-icon-circle-check" style="font-size: 48px; color: #10b981;"></i>
      </div>
      <div style="text-align: center; margin-top: 16px;">
        <span style="font-size: 16px; font-weight: bold;">API Key 创建成功</span>
      </div>
      <div style="margin-top: 24px;">
        <el-divider content-position="left">
          <span style="color: #409EFF; font-weight: bold;">密钥信息</span>
        </el-divider>
      </div>
      <div style="margin-top: 12px;">
        <el-card
          shadow="never"
          style="width: 100%; background: #f5f7fa"
          :body-style="{ textAlign: 'center', padding: '12px' }"
        >
          <code style="word-break: break-all;">{{ createdApiKey }}</code>
        </el-card>
      </div>
      <div style="text-align: center; margin-top: 12px;">
        <span style="display: inline-flex; align-items: center;">
          <i class="el-icon-time" style="color: #3b82f6; font-size: 16px; margin-right: 6px;"></i>
          <span style="font-size: 12px;" v-if="createdExpireTime">过期时间：{{ createdExpireTime }}</span>
          <span style="font-size: 12px;" v-else>过期时间：永久有效</span>
        </span>
      </div>
      <div style="text-align: center; margin-top: 12px;">
        <span style="display: inline-flex; align-items: center;">
          <i class="el-icon-warning" style="color: #f59e0b; font-size: 16px; margin-right: 6px;"></i>
          <span style="font-size: 12px; color: #E6A23C;">请尽快复制保存，关闭后将无法再次查看</span>
        </span>
      </div>
      <div style="margin-top: 24px;">
        <el-divider content-position="left">
          <span style="color: #409EFF; font-weight: bold;">使用说明</span>
        </el-divider>
      </div>
      <div style="margin-top: 12px;">
        <span style="color: #909399; font-size: 12px;"> 在调用 API 时，需要在请求头中携带以下信息： </span>
      </div>
      <div style="margin-top: 12px;">
        <el-card
          shadow="never"
          style="width: 100%; background: #f5f7fa"
          :body-style="{ padding: '12px' }"
        >
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <span style="font-size: 12px; word-break: break-all;">
              <span style="color: #409EFF; font-weight: bold;">Blade-Auth:</span> {{ createdApiKey }}
            </span>
            <span style="font-size: 12px; margin-top: 8px;">
              <span style="color: #409EFF; font-weight: bold;">Blade-Requested-With:</span> BladeHttpRequest
            </span>
          </div>
        </el-card>
      </div>
      <div style="margin-top: 16px;">
        <span style="color: #909399; font-size: 12px;">cURL 调用示例：</span>
      </div>
      <div style="margin-top: 8px;">
        <el-card
          shadow="never"
          style="width: 100%; background: #1e1e1e"
          :body-style="{ padding: '12px' }"
        >
          <code
            style="
              color: #a6e3a1;
              word-break: break-all;
              white-space: pre-wrap;
              font-family: 'Courier New', monospace;
              line-height: 1.6;
              font-size: 12px;
            "
            >{{ curlCommand }}</code
          >
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" size="medium" @click="copyAndCloseDialog" style="margin-right: 12px;">
            <i class="el-icon-document-copy"></i>
            <span>复制 API Key</span>
          </el-button>
          <el-button size="medium" @click="copyCurlCommand">
            <i class="el-icon-document-copy"></i>
            <span>复制 cURL 命令</span>
          </el-button>
        </div>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, remove, add, update, enable, disable } from '@/api/system/apikey';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      apiPathList: [],
      extParamsList: [],
      apiKeyDialogVisible: false,
      createdApiKey: '',
      createdExpireTime: '',
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 32,
        dialogWidth: 700,
        menuWidth: 300,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: 'API Key',
            prop: 'apiKey',
            slot: true,
            addDisplay: false,
            editDisplay: false,
            span: 24,
            width: 280,
          },
          {
            label: '密钥名称',
            prop: 'name',
            search: true,
            editDisabled: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入密钥名称',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '绑定用户',
            prop: 'userId',
            type: 'select',
            dicUrl: '/api/blade-system/user/user-list',
            filterable: true,
            editDisabled: true,
            props: {
              label: 'name',
              value: 'id',
              desc: 'account',
            },
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请选择用户',
                trigger: 'change',
              },
            ],
          },
          {
            label: '过期时间',
            prop: 'expireTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            span: 24,
            width: 180,
            slot: true,
          },
          {
            label: '状态',
            prop: 'status',
            type: 'select',
            slot: true,
            search: true,
            dicData: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ],
            value: 1,
            span: 24,
            display: false,
            width: 80,
          },
          {
            label: '访问权限',
            labelTip: '配置允许访问的 API 路径，留空则表示不限制访问路径',
            prop: 'apiPath',
            formslot: true,
            hide: true,
            span: 24,
          },
          {
            label: '扩展参数',
            labelTip: '配置扩展参数，可用于自定义 API Key 属性',
            prop: 'extParams',
            formslot: true,
            hide: true,
            span: 24,
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
    curlCommand() {
      if (!this.createdApiKey) return '';
      return `curl -X GET 'https://api.bladex.cn/blade-system/user/info' \\
  -H 'Blade-Auth: ${this.createdApiKey}' \\
  -H 'Blade-Requested-With: BladeHttpRequest'`;
    },
  },
  methods: {
    copyAndCloseDialog() {
      this.copyToClipboard(this.createdApiKey)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'API Key 已复制到剪贴板',
          });
          this.apiKeyDialogVisible = false;
          this.createdApiKey = '';
          this.createdExpireTime = '';
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '复制失败，请手动复制',
          });
        });
    },
    copyCurlCommand() {
      this.copyToClipboard(this.curlCommand)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'cURL 命令已复制到剪贴板',
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '复制失败，请手动复制',
          });
        });
    },
    copyToClipboard(text) {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for older browsers
      return new Promise((resolve, reject) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
          resolve();
        } catch (err) {
          textArea.remove();
          reject(err);
        }
      });
    },
    showApiKeyDialog(apiKey, expireTime) {
      this.createdApiKey = apiKey;
      this.createdExpireTime = expireTime || '';
      this.apiKeyDialogVisible = true;
    },
    addApiPath() {
      this.apiPathList.push('');
    },
    removeApiPath(index) {
      this.apiPathList.splice(index, 1);
    },
    parseApiPath(apiPath) {
      if (!apiPath) return [];
      return apiPath
        .split(',')
        .map(path => path.trim())
        .filter(path => path.length > 0);
    },
    buildApiPath() {
      const paths = this.apiPathList.filter(path => path && path.trim());
      return paths.length > 0 ? paths.join(',') : '';
    },
    addExtParam() {
      this.extParamsList.push({ key: '', value: '' });
    },
    removeExtParam(index) {
      this.extParamsList.splice(index, 1);
    },
    parseExtParams(extParams) {
      if (!extParams) return [];
      try {
        const obj = typeof extParams === 'string' ? JSON.parse(extParams) : extParams;
        return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
      } catch (e) {
        return [];
      }
    },
    buildExtParams() {
      const result = {};
      this.extParamsList.forEach(item => {
        if (item.key && item.key.trim()) {
          result[item.key.trim()] = item.value;
        }
      });
      return Object.keys(result).length > 0 ? JSON.stringify(result) : '';
    },
    rowSave(row, done, loading) {
      const data = {
        ...row,
        apiPath: this.buildApiPath(),
        extParams: this.buildExtParams(),
      };
      add(data).then(
        res => {
          this.onLoad(this.page);
          done();
          // 显示 API Key 弹框
          this.showApiKeyDialog(res.data.data, row.expireTime);
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      const data = {
        ...row,
        apiPath: this.buildApiPath(),
        extParams: this.buildExtParams(),
      };
      update(data).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
    },
    handleEnable(row) {
      this.$confirm('确定启用该 API Key?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return enable(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '启用成功!',
          });
        });
    },
    handleDisable(row) {
      this.$confirm('确定禁用该 API Key?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return disable(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '禁用成功!',
          });
        });
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (['add'].includes(type)) {
        this.apiPathList = [];
        this.extParamsList = [];
      }
      if (['edit', 'view'].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
          this.apiPathList = this.parseApiPath(this.form.apiPath);
          this.extParamsList = this.parseExtParams(this.form.extParams);
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
  },
};
</script>
