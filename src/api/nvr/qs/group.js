import {QsGroup} from "@/types/api";
import {AjaxResult} from "@/types";
import request from '@/axios';

/**
 * 添加分组
 *
 * @param data
 */
export const addGroup = (data: QsGroup) => {
    return request({
        url: '/qs/group/add',
        method: 'post',
        data: data
    })
}

/**
 * 更新分组
 *
 * @param data
 */
export const updateGroup = (data: QsGroup) => {
    return request({
        url: '/qs/group/update',
        method: 'post',
        data: data
    })
}

/**
 * 删除分组
 *
 * @param id
 */
export const deleteGroup = (id) => {
    return request({
        url: '/qs/group/delete/' + id,
        method: 'delete',
    })
}

// 查询分组
export const queryForGroupQuery = (query) => {
    return request({
        url: `/qs/group/tree/query`,
        method: 'get',
        params: query
    })
}

// 查询分组节点
export const queryForGroupTree = (query) => {
    return request({
        url: `/qs/group/tree/list`,
        method: 'get',
        params: query
    })
}

// 查询分组节点设备
export const queryGroupForDevice = () => {
    return request({
        url: `/qs/group/device/list`,
        method: 'get',
    })
}
