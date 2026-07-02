import {AjaxResult} from "@/types";
import request from '@/axios';
import {QsRegion} from "@/types/api";

/**
 * 添加区域
 *
 * @param data
 */
export const addRegion = (data: QsRegion) => {
    return request({
        url: '/qs/region/add',
        method: 'post',
        data: data
    })
}

/**
 * 更新区域
 *
 * @param data
 */
export const updateRegion = (data: QsRegion) => {
    return request({
        url: '/qs/region/update',
        method: 'post',
        data: data
    })
}

/**
 * 删除区域
 *
 * @param id
 */
export const deleteRegion = (id) => {
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
export const queryForRegionTree = (query) => {
    return request({
        url: '/qs/region/tree/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询区域节点设备
 *
 * @param id
 */
export const queryRegionForDevice = () => {
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
export const queryForRegionQuery = (query) => {
    return request({
        url: '/qs/region/tree/query',
        method: 'get',
        params: query
    })
}

/**
 * 获取所属的行政区划下的行政区划
 *
 * @param parent
 */
export const getAllChild = (parent: String) => {
    return request({
        url: '/qs/region/base/child/list',
        method: 'get',
        params: parent
    })
}
