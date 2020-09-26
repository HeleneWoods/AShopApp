import Vue from 'vue'
import Router from 'vue-router'
import ProShopCartDemo from '@/components/ProShopCartDemo'
import Register from '@/components/Register';
import UserLogin from '@/components/UserLogin';
import GoodsType from '@/components/GoodsType';
import GoodsProduct from '@/components/GoodsProduct';
import Cart from '@/components/Cart';
import UserAccount from '@/components/UserAccount';

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'ProShopCartDemo',
            component: ProShopCartDemo
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/login',
            name: 'UserLogin',
            component: UserLogin
        },
        {
            path: '/goodstype',
            name: 'GoodsType',
            component: GoodsType
        },
        {
            path: '/goodspoduct',
            name: 'GoodsProduct',
            component: GoodsProduct
        },
        {
            path: '/cart',
            name: 'Cart',
            component: Cart
        },
        {
            path: '/useraccount',
            name: 'UserAccount',
            component: UserAccount
        },
    ]
})

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}