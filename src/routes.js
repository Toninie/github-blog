import Detail from './components/Detail.vue'
import List from './components/List.vue'
import ErrorPage from './components/Error.vue'

export default [
    {
        path: '/label/:label',
        name: 'list',
        component: List
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: Detail
    },
    {
        path: '/',
        name: 'list',
        component: List,
    },
    {
        path: '/error',
        name: 'error',
        component: ErrorPage,
    },
    {
        path: '*',
        name: 'error',
        component: ErrorPage
    }
]