import {QsGroup} from "@/types/api";
import {AjaxResult} from "@/types";
import request from "@/axios";

/**
 * 添加分组
 *
 * @param data
 */
export function addGroup(data) {
    return request({
        url: '/qs/group/add',
        method: 'post',
        data
    })
}

/**
 * 更新分组
 *
 * @param data
 */
export function updateGroup(data) {
    return request({
        url: '/qs/group/update',
        method: 'post',
        data
    })
}

/**
 * 删除分组
 *
 * @param id
 */
export function deleteGroup(id) {
    return request({
        url: '/qs/group/delete/' + id,
        method: 'delete',
    })
}

// 查询分组
export function queryForGroupQuery(query) {
    return request({
        url: `/qs/group/tree/query`,
        method: 'get',
        params
    })
}

// 查询分组节点
export function queryForGroupTree(query) {
    return request({
        url: `/qs/group/tree/list`,
        method: 'get',
        params
    })
}

// 查询分组节点设备
export function queryGroupForDevice() {
    return request({
        url: `/qs/group/device/list`,
        method: 'get',
    })
}
