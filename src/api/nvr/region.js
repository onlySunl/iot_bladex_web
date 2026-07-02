import {AjaxResult} from "@/types";
import request from "@/router/axios";
import {QsRegion} from "@/types/api";

/**
 * 添加区域
 *
 * @param data
 */
export function addRegion(data) {
    return request({
        url: '/qs/region/add',
        method: 'post',
        data
    })
}

/**
 * 更新区域
 *
 * @param data
 */
export function updateRegion(data) {
    return request({
        url: '/qs/region/update',
        method: 'post',
        data
    })
}

/**
 * 删除区域
 *
 * @param id
 */
export function deleteRegion(id) {
    return request({
        url: '/qs/region/delete/' + id,
        method: 'delete',
    })
}

/**
 * 查询区域节点
 *
 * @param id
 */
export function queryForRegionTree(query) {
    return request({
        url: '/qs/region/tree/list',
        method: 'get',
        params
    })
}

/**
 * 查询区域节点设备
 *
 * @param id
 */
export function queryRegionForDevice() {
    return request({
        url: '/qs/region/device/list',
        method: 'get',
    })
}

/**
 * 查询区域节点设备
 *
 * @param id
 */
export function queryForRegionQuery(query) {
    return request({
        url: '/qs/region/tree/query',
        method: 'get',
        params
    })
}

/**
 * 获取所属的行政区划下的行政区划
 *
 * @param parent
 */
export function getAllChild(parent) {
    return request({
        url: '/qs/region/base/child/list',
        method: 'get',
        params
    })
}
