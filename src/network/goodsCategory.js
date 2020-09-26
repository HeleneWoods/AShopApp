import { request } from './request'

// 分页时触发
export function getPageChange(_currentP, _c) {
    return request({
        url: '/getPageChange',
        params: {
            startNum: (_currentP - 1) * 2,
            c: _c
        }
    })
}