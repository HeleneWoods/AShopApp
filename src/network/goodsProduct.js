import { request } from './request'

export function getGoodsInfo(_goodsId, _collectionName) {
    return request({
        url: '/getGoodsInfo',
        params: {
            _id: _goodsId,
            _c: _collectionName
        }
    })
}