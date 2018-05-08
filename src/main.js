import Vue from 'vue'
import Router from 'vue-router'

import App from './App.vue'
import Detail from './components/Detail.vue'
import List from './components/List.vue'
import ErrorPage from './components/Error.vue'

// install router
Vue.use(Router);

const routes = [
    {
        path: '/list',
        name: 'list',
        redirect: '/'
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: Detail
    },
    {
        path: '/:id(\\d+)',
        name: 'detail',
        component: Detail
    },
    {
        path: '/',
        name: 'list',
        component: List,
    },
    {
        path: 'error',
        name: 'error',
        component: ErrorPage,
    },
    {
        path: '*',
        name: 'error',
        component: ErrorPage
    }
]



var router = new Router({
    base: "blog/",
    routes: routes,
    mode: 'history'
})

// router.beforeEach(function () {
//     window.scrollTo(0, 0);
// })

// router.redirect({
//     '*': '/list'
// })

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
