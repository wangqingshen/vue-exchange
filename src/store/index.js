import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const SET_USER_INFO = 'SET_USER_INFO'
const SET_PAY_WAY = 'SET_PAY_WAY'
const SET_ADDRESS = 'SET_ADDRESS'
const SET_ORDER_GOODS = 'SET_ORDER_GOODS'
const SET_IS_SEL_ADDRESS = 'SET_IS_SEL_ADDRESS'
const SET_SEARCH_HISTORY = 'SET_SEARCH_HISTORY'
const SET_GOODS_HISTORY = 'SET_GOODS_HISTORY'
const SET_SHARE_ICON = 'SET_SHARE_ICON'
const SET_SECKILL = 'SET_SECKILL'
const SET_SHOPCARNUM = 'SET_SHOPCARNUM'
const SET_CLASSIFY_TYPE = 'SET_CLASSIFY_TYPE'
const SET_TABCARD_STATUS = 'SET_TABCARD_STATUS'
const SET_SEL_ADDRESS_INDEX = 'SET_SEL_ADDRESS_INDEX'
const SET_GEO_LOCATION = 'SET_GEO_LOCATION'
const SET_LEAGUE_DATA = 'SET_LEAGUE_DATA'
const SET_NOTICE_STATUS = 'SET_NOTICE_STATUS'
const SET_SHOPPING_STATUS = 'SET_SHOPPING_STATUS'
// var StorageUserInfo=JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')) : {}
// Dispatch 触发 Action 通过 Commit 触发 Mutations 从而改变State 更新Vue视图 commit同步('方法名',值),dispatch异步('方法名',值)
export default new Vuex.Store({
    state: {
        userInfo:'',
        payWay:'',
        address:'',
        order_goods:'',
        isSel:'',
        isSelIndex: '-1',
        search_history: '',
        goods_history: '',
        share_icon: false,
        is_secKill:false,
        shopCar_num:0,
        classify_type: '',
        notice_status: 0,
        shopping_status: 0,
        tabCard_status:{
            couponList:'',
            groupList:'',
            secKillList:'',
            ownGroupList:'',
            messageList: '',
            buyList:'',
            wantList:'',
            publishList:''
        },
        geoLocation: {
            city_name: '',
            adcode: '',
            longitude: '',
            latitude: ''
        },
        leagueData: {
            name: '',
            lng: '',
            lat: '',
            adcode: ''
        }
    },
    mutations: {//转变
        [SET_USER_INFO](state,userInfo){//这里的state对应上面export default里的state
            state.userInfo = userInfo//这里执行操作改变state
        },
        [SET_PAY_WAY](state,payWay){
            state.payWay = payWay
        },
        [SET_ADDRESS](state,address){
            state.address = address
        },
        [SET_ORDER_GOODS](state,order_goods){
            state.order_goods = order_goods
        },
        [SET_IS_SEL_ADDRESS](state,isSel){
            state.isSel = isSel
        },
        [SET_SEARCH_HISTORY](state,search_history){
            state.search_history = search_history
        },
        [SET_GOODS_HISTORY](state,goods_history){
            state.goods_history = goods_history
        },
        [SET_SHARE_ICON](state,share_icon){
            state.share_icon = share_icon
        },
        [SET_SECKILL](state,is_secKill){
            state.is_secKill = is_secKill
        },
        [SET_SHOPCARNUM](state,shopCar_num){
            state.shopCar_num = shopCar_num
        },
        [SET_CLASSIFY_TYPE](state, classify_type) {
            state.classify_type = classify_type
        },
        [SET_TABCARD_STATUS](state,tabCard_status){
            state.tabCard_status =  tabCard_status
        },
        [SET_SEL_ADDRESS_INDEX](state,isSelIndex){
            state.isSelIndex = isSelIndex
        },
        [SET_GEO_LOCATION](state, geoLocation){
            state.geoLocation = geoLocation
        },
        [SET_LEAGUE_DATA](state, leagueData){
            state.leagueData = leagueData
        },
        [SET_NOTICE_STATUS](state, notice_status){
            state.notice_status = notice_status
        },
        [SET_SHOPPING_STATUS](state, shopping_status){
            state.shopping_status = shopping_status
        },
    },
    actions:{
        setUserInfo({commit},userInfo){//用$store.commit('SET_USER_INFO')来触发mutations中的SET_USER_INFO方法
            commit('SET_USER_INFO',userInfo)
        },
        setPayWay({commit},payWay){
            commit('SET_PAY_WAY',payWay)
        },
        setAddress({commit},address){
            return new Promise((resolve, reject)=>{
                resolve(commit('SET_ADDRESS',address))
            })
        },
        setOrderGoods({commit},order_goods){
            commit('SET_ORDER_GOODS',order_goods)
        },
        setSelAddress({commit},isSel){
            commit('SET_IS_SEL_ADDRESS',isSel)
        },
        setSearchHistory({commit},search_history){
            commit('SET_SEARCH_HISTORY',search_history)
        },
        setGoodsHistory({commit},goods_history){
            commit('SET_GOODS_HISTORY',goods_history)
        },
        setShareIcon({commit},share_icon){
            commit('SET_SHARE_ICON',share_icon)
        },
        setSecKill({commit},is_secKill){
            commit('SET_SECKILL',is_secKill)
        },
        setShopCarNum({commit},shopCar_num){
            commit('SET_SHOPCARNUM',shopCar_num)
        },
        setTabCardStatus({commit},tabCard_status){
            commit('SET_TABCARD_STATUS',tabCard_status)
        },
        setGeoLocation({commit},geoLocation){
            commit('SET_GEO_LOCATION',geoLocation)
        },
        setLeagueData({commit},leagueData){
            commit('SET_LEAGUE_DATA',leagueData)
        },
    },
    getters:{
        getUserInfo:function (state) {
            return state.userInfo
        },
        getPayWay:function (state) {
            return state.payWay
        },
        getAddress:function (state) {
            return state.address
        },
        getOrderGoods(state){
            return state.order_goods
        },
        getSearchHistory(state){
            return state.search_history
        },
        getShareIcon(state){
            return state.share_icon
        },
        getShopNum(state){
            return state.shopCar_num
        },
        getClassifyType(state) {
            return state.classify_type
        },
        getIsSelIndex(state) {
            return state.isSelIndex
        },
        getGeoLocation(state) {
            return state.geoLocation
        },
        getLeagueData(state) {
            return state.leagueData
        }
    },
    modules:{

    }

})
