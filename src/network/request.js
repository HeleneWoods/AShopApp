import axios from 'axios';

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:5678',
        timeout: 5000
    })
    axios.interceptors.request.use(config => {
        console.log(config);
        return config
    }, err => {
        console.log(err);
    })

    axios.interceptors.response.use(res => {
        console.log(res);
        return res
    }, err => {
        console.log(err);
    })

    return instance(config);
}