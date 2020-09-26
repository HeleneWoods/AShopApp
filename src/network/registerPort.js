import { request } from './request';

export function register_post(_obj) {
    return request({
        url: '/register',
        method: 'post',
        data: _obj
    })
}