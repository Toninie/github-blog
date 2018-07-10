import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

import App from './App.vue'
import nav from './components/nav.vue'

// 路由
Vue.use(Router);

const router = new Router({
    base: "",
    routes: routes,
    mode: 'history'
});

// 导航栏
Vue.use((Vue) => {
    Vue.component("app-nav", nav);
});

const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
