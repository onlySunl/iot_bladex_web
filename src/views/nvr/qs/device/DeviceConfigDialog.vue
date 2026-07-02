<template>
  <el-dialog v-model="visible" title="设备配置管理" width="800px" append-to-body @close="handleClose">
    <div class="config-container">
      <!-- 配置列表 -->
      <div class="config-list">
        <el-table :data="configList" v-loading="loading" border>
          <el-table-column label="配置名称" prop="configName" align="center" />
          <el-table-column label="配置值" prop="configValue" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 新增配置表单 -->
      <div class="config-form" v-if="showForm">
        <el-divider content-position="left">{{ formTitle }}</el-divider>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="配置名称" prop="configName">
            <el-input v-model="form.configName" placeholder="请输入配置名称" />
          </el-form-item>
          <el-form-item label="配置值" prop="configValue">
            <el-input v-model="form.configValue" type="textarea" :rows="3" placeholder="请输入配置值" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="cancelForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 新增按钮 -->
      <div class="add-btn" v-if="!showForm">
        <el-button type="primary" icon="Plus" @click="handleAdd">新增配置</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="DeviceConfigDialog">
import { ref, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

interface DeviceConfig {
  id?: number;
  deviceId?: number;
  configName: string;
  configValue: string;
  remark?: string;
}

interface QsDevice {
  id: number;
  deviceName: string;
  [key: string]: any;
}

const props = defineProps<{
  modelValue: boolean;
  device?: QsDevice;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'load-configs', deviceId: number): void;
  (e: 'add-config', config: DeviceConfig): void;
  (e: 'update-config', config: DeviceConfig): void;
  (e: 'delete-config', config: DeviceConfig): void;
}>();

const configList = ref<DeviceConfig[]>([]);
const loading = ref(false);
const showForm = ref(false);
const formTitle = ref('新增配置');
const formRef = ref<FormInstance>();

const form = ref<DeviceConfig>({
  configName: '',
  configValue: '',
  remark: ''
});

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const rules: FormRules = {
  configName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  configValue: [{ required: true, message: '请输入配置值', trigger: 'blur' }]
};

// 监听设备变化，加载配置
watch(() => props.device, (newDevice) => {
  if (newDevice) {
    loadConfigs(newDevice.id);
  }
}, { immediate: true });

// 加载配置列表
const loadConfigs = (deviceId: number) => {
  loading.value = true;
  emit('load-configs', deviceId);
};

// 设置配置列表
const setConfigList = (list: DeviceConfig[]) => {
  configList.value = list;
  loading.value = false;
};

// 新增配置
const handleAdd = () => {
  formTitle.value = '新增配置';
  form.value = {
    configName: '',
    configValue: '',
    remark: ''
  };
  showForm.value = true;
};

// 编辑配置
const handleEdit = (row: DeviceConfig) => {
  formTitle.value = '编辑配置';
  form.value = { ...row };
  showForm.value = true;
};

// 删除配置
const handleDelete = (row: DeviceConfig) => {
  ElMessageBox.confirm('确定要删除该配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('delete-config', row);
  }).catch(() => {});
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      const configData = {
        ...form.value,
        deviceId: props.device?.id
      };
      
      if (form.value.id) {
        emit('update-config', configData);
      } else {
        emit('add-config', configData);
      }
      
      showForm.value = false;
      loadConfigs(props.device!.id);
    }
  });
};

// 取消表单
const cancelForm = () => {
  showForm.value = false;
  formRef.value?.resetFields();
};

// 关闭对话框
const handleClose = () => {
  configList.value = [];
  showForm.value = false;
  visible.value = false;
};

// 设置加载状态
const setLoading = (value: boolean) => {
  loading.value = value;
};

// 暴露方法
defineExpose({
  setConfigList,
  setLoading,
  loadConfigs
});
</script>

<style scoped lang="scss">
.config-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-list {
  min-height: 200px;
}

.config-form {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.add-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
