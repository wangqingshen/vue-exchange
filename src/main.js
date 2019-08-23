import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index'
import Vant from 'vant'
import wxSDK from 'weixin-js-sdk'
import 'vant/lib/index.css'
import './assets/scss/base.scss'
import './assets/scss/reset.scss'
import { Lazyload } from 'vant'
import * as filters from './filters/index'
import {parseQueryString,checkBrowser,userinfo} from './lib/cmmon'
import share from './wxShare/index'
import defaultPic from '@/assets/images/default-pic@2x.png'
// import VueNativeSock from 'vue-native-websocket'
// import {
//     SOCKET_ONOPEN,
//     SOCKET_ONCLOSE,
//     SOCKET_ONERROR,
//     SOCKET_ONMESSAGE,
//     SOCKET_RECONNECT,
//     SOCKET_RECONNECT_ERROR
// } from './store/mutation-types'

// const mutations = {
//     SOCKET_ONOPEN,
//     SOCKET_ONCLOSE,
//     SOCKET_ONERROR,
//     SOCKET_ONMESSAGE,
//     SOCKET_RECONNECT,
//     SOCKET_RECONNECT_ERROR
// }
Vue.use(Vant)
Vue.use(Lazyload,{
    error: defaultPic,
    loading: defaultPic
})
// Vue.use(VueNativeSock, 'ws://localhost:8080', { store: store,mutations: mutations ,format: 'json'})
Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$api', { value: api})
Vue.prototype.$parseQueryString = parseQueryString
Vue.prototype.$userinfo = userinfo
Vue.prototype.$checkBrowser = checkBrowser
Vue.prototype.$share = share
Vue.prototype.$wxSdk = wxSDK
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key])
})
Vue.directive('title', {
    update: function (el, binding) {
        document.title = binding.value
    },
    inserted: function (el, binding) {
        document.title = binding.value
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

