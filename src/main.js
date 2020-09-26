import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {
    Button,
    NavBar,
    Field,
    Dialog,
    Notify,
    Tab,
    Tabs,
    Tabbar,
    TabbarItem,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Sku,
    Stepper,
    SubmitBar,
    Toast,
    Sidebar,
    SidebarItem,
    Pagination,
    Search,
    Swipe,
    SwipeItem
} from 'vant';

Vue.use(Button).use(NavBar).use(Field)
    .use(Dialog).use(Notify)
    .use(Tab).use(Tabs).use(Tabbar).use(TabbarItem)
    .use(GoodsAction)
    .use(GoodsActionButton)
    .use(GoodsActionIcon).use(Sku).use(Stepper).use(SubmitBar)
    .use(Toast).use(Sidebar).use(SidebarItem).use(Pagination)
    .use(Search).use(Swipe).use(SwipeItem);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})