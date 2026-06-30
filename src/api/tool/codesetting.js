import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-develop/code-setting/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const getDetail = id => {
  return request({
    url: '/api/blade-develop/code-setting/detail',
    method: 'get',
    params: {
      id,
    },
  });
};

export const remove = ids => {
  return request({
    url: '/api/blade-develop/code-setting/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = row => {
  return request({
    url: '/api/blade-develop/code-setting/submit',
    method: 'post',
    data: row,
  });
};

export const update = row => {
  return request({
    url: '/api/blade-develop/code-setting/submit',
    method: 'post',
    data: row,
  });
};

export const enable = id => {
  return request({
    url: '/api/blade-develop/code-setting/enable',
    method: 'post',
    params: {
      id,
    },
  });
};

export const getEnableDetail = () => {
  return request({
    url: '/api/blade-develop/code-setting/enable-detail',
    method: 'get',
    params: {},
  });
};
