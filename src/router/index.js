import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
// import notFound from '@/views/index/404'
import shopCarRouter from './shopCar'
import orderRouter from './order'
import ownRouter from './own'
import goodsRouter from './goods'
import searchRouter from './search'
import messageRouter from './message'
import leagueRouter from './league'
import walletRouter from './wallet'
import mapRouter from './map'
// import sellerRouter from './seller'

Vue.use(Router)
export default new Router({
    // mode:'history',
    // base: '/exchange/',
    routes: [
        {
            path:"*",
            redirect:'/index'

        },
        {
            path: '/index',
            name: 'index',
            component: index,
        },
        // {
        //     path: '/notFound',
        //     name: 'notFound',
        //     component: notFound
        // },

        ...shopCarRouter,
        ...ownRouter,
        ...goodsRouter,
        ...searchRouter,
        ...orderRouter,
        ...messageRouter,
        ...leagueRouter,
        ...walletRouter,
        ...mapRouter,
        // ...sellerRouter,
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
})
