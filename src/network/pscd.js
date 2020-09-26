import { request } from './request';

// 发送按钮
export function sendBtnReq(value) {
    return request({
        url: '/node_a',
        params: {
            v_data: value
        }
    })
}

// 获取按钮
export function getBtnReq() {
    return request({
        url: '/node_b',
    })
}
// 批量添加商品
export function insertGoods(_goodsInfo) {
    return request({
        url: '/insertgoods',
        method: 'post',
        data: _goodsInfo
    })
}
// 获取商品列表
export function getGoodsCategory() {
    return request({
        url: '/getGoodsCategory'
    })
}

export function getCategoryGoodsList(_category) {
    return request({
        url: '/getCategoryGoodsList',
        params: {
            category: _category
        }
    })
}

export function getImgUrls() {
    return request({
        url: '/getImgUrls'
    })
}