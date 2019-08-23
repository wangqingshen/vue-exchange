<template>
    <div class="goodList-wrapper" v-title="pageTitle">
        <!-- 搜索 -->
        <div class="search">
            <div class="search-inner">
                <div class="box" @click="PageSearch">
                    <div class="icon"></div>
                    <div class="content" v-show="searchTxt">
                        <div class="txt">{{searchTxt}}</div>
                        <div class="empty">×</div>
                    </div>
                </div>
                <div class="fun-btn" @click="PageCategory"></div>
            </div>
        </div>
       <!-- 控制栏 -->
        <div class="filter-bar">
            <!-- 全国 -->
            <div class="filter-item" :class="filterIndex === 1 ? 'active' : ''" @click="current(1)">
                <div class="txt">{{currentArea ? currentArea : '全国'}}</div>
                <div class="arrow" :class="area_show && filterIndex === 1? 'active' : ''"></div>
            </div>
            <!-- 综合排序 -->
            <div class="filter-item" :class="filterIndex === 2 ? 'active' : ''" @click="current(2)">
                <div class="txt" v-if="sortIndex === 0">综合排序</div>
                <div class="txt" v-if="sortIndex === 1">价格从低到高</div>
                <div class="txt" v-if="sortIndex === 2">价格从高到低</div>
                <div class="txt" v-if="sortIndex === 3">最新发布</div>
                <div class="arrow" :class="synthesis_show && filterIndex === 2? 'active' : ''"></div>
            </div>
            <!-- 筛选 -->
            <div class="filter-item" :class="filterIndex === 3 ? 'active' : ''" @click="current(3)">
                <div class="txt">筛选</div>
                <div class="arrow" :class="filtrate_show && filterIndex === 3? 'active' : ''"></div>
            </div>
        </div>
        <!-- 缺省图 -->
        <div class="default" v-if="!goodList.length">
            <div class="default-pic">
                <img src="../../assets/images/pic_goods@2x.png">
            </div>
            <div class="default-info">暂未发现相关商品</div>
        </div>
        <!-- 商品列表 -->
        <van-pull-refresh v-model="refreshLoading" @refresh="refresh" pulling-text="下拉刷新" loosing-text="释放刷新" loading-text="刷新中" v-else><!-- 下拉加载 -->
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="goodList">
                <div v-for="(item, index) in goodList" :key="index" class="good-item" @click="PageGooddetails(item)">
                    <div class="good-pic">
                        <img v-lazy="item.goods_img" />
                    </div>
                    <!-- 自营 商家 -->
                    <div class="good-info" v-show="item.goods_type === 1 || item.goods_type === 2">
                        <div class="info-head">
                            <div class="good-name">
                                <span v-if="item.goods_type ===1">严选</span>{{item.goods_name}}</div>
                        </div>
                        <div class="info-body">
                            <div class="pirce">￥{{item.goods_price}}</div>
                        </div>
                        <div class="info-footer">
                            <div class="brand-label">
                                <div class="label-item" v-for="(labelItem, index) in item.label_info" :key="index"><img :src="labelItem.label_icon" /></div>
                            </div>
                            <div class="sale">销量 {{item.goods_sold_out_num}}</div>
                        </div>
                    </div>
                    <!-- 个人 -->
                    <div class="good-info" v-show="item.goods_type === 3">
                        <div class="info-head">
                            <div class="good-name"><span class="green">个人</span>{{item.goods_name}}</div>
                        </div>
                        <div class="info-body">
                            <div class="price">￥{{item.goods_price}}</div>
                            <div class="brand-label">
                                <div class="label-item" v-for="(labelItem, index) in item.label_info" :key="index"><img :src="labelItem.label_icon" /></div>
                            </div>
                        </div>
                        <div class="info-footer">
                            <div class="member">
                                <div class="portrait">
                                    <img :src="item.member_avatar" />
                                </div>
                                <div class="nick-name">{{item.member_nick_name | filterName}}</div>
                            </div>
                            <div class="address">{{item.goods_cityname.city}} {{item.goods_cityname.district}}</div>
                        </div>
                    </div>
                </div>
                <!-- 底线 -->
                <noMore :finished="finished"></noMore>
            </van-list>
        </van-pull-refresh>
        <!-- 全国弹出 -->
        <van-popup v-model="area_show" position="left" :overlay="true" class="area-popup" overlay-class="area-modal">
            <div class="province">
                <div class="city-item geoCity" @click="selectGeoArea(1)">{{geoArea}}</div>
                <div class="city-item" v-for="(item, index) in provinceList"  :class="currentAreaLevel === 1 && selectAreaIndex== index ? 'active' : ''"  :key="index" @click="selectArea(1,item,index)">{{item.cityName}}</div>
            </div>
            <div class="city">
                <div class="city-item geoDist" v-for="(item, index) in cityList1" @click="selectGeoArea(2,item,index)">{{item.cityName}}</div>
                <div class="city-item" v-for="(item, index) in cityList" :class="currentAreaLevel === 2 && selectAreaIndex== index ? 'active' : ''" :key="index" @click="selectArea(2,item,index)">{{item.cityName}}</div>
            </div>
            <div class="district">
                <div class="city-item" v-for="(item, index) in districtList" :key="index" :class="currentAreaLevel === 3 && selectAreaIndex== index ? 'active' : ''" @click="selectArea(3,item,index)">{{item.cityName}}</div>
            </div>
        </van-popup>
        <!-- 综合弹出 -->
        <van-popup v-model="synthesis_show" :overlay="true" class="synthesis-popup" overlay-class="synthesis-modal">
            <div class="synthesis-item" :class="sortIndex == 0 ? 'active': ''" @click="sortord(0)">
                <div class="txt">综合排序</div>
                <div class="select" v-show="sortIndex == 0"></div>                
            </div>
            <div class="synthesis-item" :class="sortIndex == 1 ? 'active': ''" @click="sortord(1)">
                <div class="txt">价格从低到高</div>
                <div class="select" v-show="sortIndex == 1"></div>
            </div>
            <div class="synthesis-item" :class="sortIndex == 2 ? 'active': ''" @click="sortord(2)">
                <div class="txt">价格从高到低</div>
                <div class="select" v-show="sortIndex == 2"></div>
            </div>
            <div class="synthesis-item" :class="sortIndex == 3 ? 'active': ''" @click="sortord(3)">
                <div class="txt">最新发布</div>
                <div class="select" v-show="sortIndex == 3"></div>                
            </div>
        </van-popup>
        <!-- 筛选弹出 -->
        <van-popup v-model="filtrate_show" position="right" :overlay="true" class="filtrate-popup" overlay-class="filtrate-modal">
            <div class="filtrate-bd">
                <div class="filtrate-item">
                    <div class="item-title">价格区间(元)</div>
                    <div class="item-content item-range">
                        <input type="number" placeholder="最低价" v-model="minNum"/>
                        <div class="line"></div>
                        <input type="number" placeholder="最高价"  v-model="maxNum"/>                        
                    </div>
                </div>
                <div class="filtrate-item" v-show="goods_label.length">
                    <div class="item-title">商品标签</div>
                    <div class="item-content">
                        <div class="label-item" :class="[item.checked ? 'active' : '']" v-for="(item, index) in goods_label" :key="index" @click="changeLabelFun(index, item)">
                            {{item.label_name}}
                        </div>
                    </div>
                </div>
                <div class="filtrate-item">
                    <div class="item-title">商品售卖来源</div>
                    <div class="item-content">
                        <div class="label-item" :class="[item.checked ? 'active' : '']" v-for="(item, index) in store_attr" :key="index" @click="changeStoreFun(index, item)">
                            {{item.name}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="filtrate-ft">
                <div class="reset" @click="resetData">重置</div>
                <div class="confirm" @click="confirmData">确认</div>
            </div>
        </van-popup>       
    </div>
</template>

<script>
    import noMore from '@/components/no-more'
    export default {
        name: 'goodList',
        data(){
            return {
                pageTitle: '商品列表',
                searchTxt: '',
                refreshLoading: '',//下拉刷新
                loading: false,//加载状态
                finished: false,//加载完不再触发loading
                isMore: false,
                offset: 50,
                imageList: [],
                filterIndex: 2,
                lastIndex: '',
                area_show: false,//地区
                synthesis_show: false,//综合弹出
                filtrate_show: false,//筛选弹出
                areaSelect: false,
                synthesisSelect: false,                
                sortIndex: 0 ,
                storeSelect: false,
                minNum: '',
                maxNum: '',
                price_between:0,
                goods_type: '',
                store_attr: [{name: '严选', checked: false, id: 1},{name: '商家', checked: false, id: 2},{name: '个人', checked: false, id: 3}],
                page: 1,//默认
                queryData: {//查询条件
                    page: '',
                },
                goodList: [],//搜索结果
                goods_label:[],//标签
                provinceList: '',
                cityList: '',
                districtList: '',
                currentAreaLevel: '',
                selectAdcode: '',
                selectLevel: '',
                selectAreaIndex: '',
                currentArea: '',
                replaceArea: '',
                geoAdCode: '',
                geoArea: '',
                cityList1: '',
            }
        },
        components: {
            noMore
        },
        computed: {
            changeObj(){
                let checkItem  = this.goods_label.filter((item)=>{
                    return item.checked
                }).map((item)=>{
                    return item.id
                })
                checkItem = checkItem.length === 0 ? '' : checkItem.join(',')
                let priceRange = []
                priceRange.push(this.minNum, this.maxNum)
                if(this.minNum === '' && this.maxNum === ''){
                    priceRange = ''
                }
                let storeItem = this.store_attr.filter((item)=>{
                    return item.checked
                }).map((item)=>{
                    return item.id
                })
                storeItem = storeItem.length === 0 ? '': storeItem.join(',')
                let goods_type = storeItem
                return {
                    goods_type: goods_type,
                    priceRange: priceRange,
                    checkItem: checkItem,
                }
            }
        },
        methods: {
            PageSearch(){
                this.$router.push({name: 'search'})
            },
            PageCategory(){
                this.$router.push({name: 'category'})
            },
            PageGooddetails(item){
                this.$router.push({name: 'goodsDetails',params: {spu_id: item.spu_id}})
            },
            //过滤条
            current(index){
                this.lastIndex = this.filterIndex
                this.filterIndex = index
                // 全国
                if(index === 1){
                    this.area_show = !this.area_show
                    this.synthesis_show = false
                    this.cityList = ''
                    this.districtList = ''
                    this.selectAdcode = 0
                    this.selectLevel = 'province'
                    console.log(this.selectAdcode,this.selectLevel)
                    this.getRegionList()
                }
                // 综合排序
                if(index === 2){
                    this.synthesis_show = !this.synthesis_show
                    this.area_show = false
                }
                // 筛选
                if(index === 3){
                    this.filtrate_show = !this.filtrate_show
                    this.synthesis_show = false
                    this.area_show = false
                }
            },
            //城市定位
            selectGeoArea(id, item, index){
                this.cityList = ''//清空三联城市搜索
                console.log(id, item, index,'selectGeoArea')
                if(id === 1){
                    this.selectAdcode = this.geoAdCode
                    this.selectLevel = 'district'
                    this.getRegionList()
                    if(this.currentAreaLevel === 2){
                        this.currentAreaLevel = 3
                        this.districtList = ''
                    }
                }else{
                    this.currentArea = item.cityName
                    this.queryData.latitude = item.lat
                    this.queryData.longitude = item.lng
                    this.queryData.goods_adcode = item.adcode
                    if(!this.queryData.price && !this.queryData.newest){
                        this.queryData.syn = 1
                    }
                    this.getGoodList()
                    this.area_show = false
                }   
            },
            //选地区
            selectArea(level,item,index){
                // console.log(level,item,index)
                this.cityList1 = ''
                this.currentAreaLevel = level
                if(level === 1){
                    this.cityList = ''//清空之前
                    this.districtList = ''
                    this.selectAdcode = item.adcode
                    this.selectLevel = 'city'
                    this.getRegionList(item)
                }else if(level === 2){
                    this.selectAdcode = item.adcode
                    this.selectLevel = 'district'
                    this.getRegionList(item)
                }else if(level === 3){
                    this.filterArea(item)  
                }
                this.selectAreaIndex = index
            },
            filterArea(item){
                this.page = 1
                this.queryData.latitude = item.lat
                this.queryData.longitude = item.lng
                this.queryData.goods_adcode = item.adcode
                this.currentArea = item.cityName
                if(!this.queryData.price && !this.queryData.newest){
                    this.queryData.syn = 1
                }
                this.getGoodList()
                this.area_show = false
            },
            //排序
            sortord(index){
                this.sortIndex = index
                //清空搜索列表
                this.finished = false
                this.goodList = []
                this.page = 1
                if(this.sortIndex === 0){//综合
                    this.queryData.syn = 1                    
                    this.queryData.price = ''
                    this.queryData.newest = ''
                    this.getGoodList()
                }else if(this.sortIndex === 1){//价格从低到高
                    this.queryData.price = 1
                    this.queryData.syn = ''
                    this.queryData.newest = ''
                    this.getGoodList()
                }else if(this.sortIndex === 2){//价格从高到低
                    this.queryData.price = 2
                    this.queryData.syn = ''
                    this.queryData.newest = ''
                    this.getGoodList()
                }else if(this.sortIndex === 3){//最新
                    this.queryData.newest = 1
                    this.queryData.price = ''
                    this.queryData.syn = ''
                    this.getGoodList()
                }
                // console.log(this.queryData,this.sortIndex)
                this.synthesis_show = false
            },           
            changeLabelFun(index, item){
               item.checked = !item.checked;
            },
            changeStoreFun(index, item){
                item.checked = !item.checked
            },
            //重置
            resetData(){
                this.minNum = '',
                this.maxNum = '',
                this.goods_label.forEach(v=>{
                    return v.checked = false
                })
                this.store_attr.forEach(v=>{
                    return v.checked = false
                })
            },
            //确认
            confirmData(){
                this.goodList = []
                this.queryData.page = 1
                this.finished = false
                this.queryData.price_between = this.changeObj.priceRange
                this.queryData.goods_label = this.changeObj.checkItem
                this.queryData.goods_type = this.changeObj.goods_type
                // console.log(this.page,this.finished)
                // console.log(this.queryData)
                if(Number(this.minNum) > Number(this.maxNum) && this.maxNum){
                    this.$toast.fail('请输入正确的价格')
                    this.minNum = ''
                    this.maxNum = ''
                    return false
                }
                this.getGoodList(this.queryData)
                this.$store.dispatch('setGoodsHistory', this.queryData)
                this.filtrate_show = false;
                // console.log('page',this.queryData.page)
            },
            checkSearchInfo(){
                this.queryData.goods_name = ''
                let searchHistory = this.$store.state.search_history//关键词
                if(!searchHistory) {
                    searchHistory = localStorage.getItem('search_gc_name')
                }
                if(localStorage.getItem('gc_id_1') != undefined && !this.$route.params.discount_id) {
                    this.queryData.gc_id_1 = localStorage.getItem('gc_id_1')
                }
                if(localStorage.getItem('gc_id_2') != undefined && !this.$route.params.discount_id) {
                    this.queryData.gc_id_2 = localStorage.getItem('gc_id_2')
                }
                if(localStorage.getItem('gc_id_3') != undefined && !this.$route.params.discount_id) {
                    this.queryData.gc_id_3 = localStorage.getItem('gc_id_3')

                }
                if(localStorage.getItem('gc_id_1') == undefined){
                    this.queryData.gc_id_1 = ''
                }
                if(!this.queryData.gc_id_2 && !this.queryData.gc_id_3 && !this.queryData.gc_id_1){
                    this.queryData.goods_name = searchHistory
                }
                this.searchTxt = searchHistory;
                if(this.$route.params.discount_id){//优惠券使用                 
                    localStorage.removeItem('gc_id_1')
                    localStorage.removeItem('gc_id_2')
                    localStorage.removeItem('gc_id_3')
                    this.queryData.goods_name = ''
                    this.searchTxt = ''
                    this.queryData.discount_id = this.$route.params.discount_id
                }
                
                if(this.$route.params.goods_type != undefined) {
                    let typeArr = JSON.parse(this.$route.params.goods_type)
                    for(var i in typeArr) {
                        this.store_attr[typeArr[i]-1].checked = true
                    }
                    this.queryData.goods_type = typeArr.join(',')
                }
                if(this.$route.params.price_between != undefined) {
                    let priceArr = JSON.parse(this.$route.params.price_between)
                    this.minNum = priceArr[0]
                    this.maxNum = priceArr[1]
                    this.queryData.price_between = priceArr
                }
                if(this.$route.params.goods_label != undefined) {
                    let labelArr = JSON.parse(this.$route.params.goods_label)
                    labelArr.filter((item, index)=>{
                        this.goods_label.forEach(v=>{
                           if(item == v.id) {
                                v.checked = true
                           }
                        })
                    })
                    this.queryData.goods_label = labelArr.join(',')
                }
                if(this.$route.params.goods_sort !== undefined) {
                    this.sortIndex = Number(this.$route.params.goods_sort)
                    this.queryData.syn = ''                    
                    this.queryData.price = ''
                    this.queryData.newest = ''
                    if(this.sortIndex === 0){//综合
                        this.queryData.syn = 1                    
                    }else if(this.sortIndex === 1){//价格从低到高
                        this.queryData.price = 1
                    }else if(this.sortIndex === 2){//价格从高到低
                        this.queryData.price = 2
                    }else if(this.sortIndex === 3){//最新
                        this.queryData.newest = 1
                    }
                }

                 console.log(this.$route.params, this.queryData)

                this.getGoodList() 
                
                // console.log(this.store_attr)
            },
            //下拉刷新
            refresh(){
                this.page = 1
                this.finished = false
                setTimeout(() => {
                    this.getGoodList({page: this.page})
                }, 500)
            },
            //上拉加载
            loadMore(){
                //加载未完 有更多
                if(!this.finished && this.isMore){
                    // 数据<10
                    if(this.goodList.length<10){
                        // 关闭加载提示
                        this.loading = false
                        return
                    }else{
                        // 页数+
                        this.page++
                        setTimeout(() => {
                            this.getGoodList({page: this.page})
                        }, 500);
                    }
                }
            },
            getGoodList({page=1} = {}){//商品列表
                this.queryData.page = page
                //默认综合排序
                if(!this.queryData.price && !this.queryData.newest){
                    this.queryData.syn = 1
                }
                //向后台发数据
                this.$api.goodList({//商品列表
                    cmd: {
                        goods: 'lists'
                    },
                    data: this.queryData
                }).then(res => {
                   console.log(res,'list')
                    //响应成功
                    if(res.code === 1){
                        //返回数据和现有数据合并
                        if(this.page == 1) {
                            this.goodList = res.data
                        }else{
                            this.goodList = [...this.goodList,...res.data]
                        }
                        //更多
                        this.isMore = true
                        //关闭加载提示
                        this.loading = false
                        this.refreshLoading = false
                        //返回空数据
                        if(res.data.length < 10 ){
                            this.finished = true
                        }
                    }
                });
            },
            getGoodLabel() {
                this.$api.getGoodLabel({//商品标签
                    cmd: {
                        goods: 'getgoodslabel'
                    },
                    data: {
                        goods_label: ''
                    }
                }).then(res => {
                    console.log(res,'label')
                    if(res.code === 1){
                        this.goods_label = res.data;
                        this.goods_label.forEach(v=>{
                            return this.$set(v, 'checked', false)
                        })   
                    }
                    if(this.$store.state.goods_history) {//记录商品标签
                        this.queryData = this.$store.state.goods_history
                        if(this.$store.state.goods_history.price_between) {
                            this.minNum = this.$store.state.goods_history.price_between[0]
                            this.maxNum = this.$store.state.goods_history.price_between[1]
                        }else{
                            this.minNum = ''
                            this.maxNum = ''
                        }
                        if(this.$store.state.goods_history.goods_type){
                            let goods_type_arr = this.$store.state.goods_history.goods_type.split(',')
                            this.queryData.goods_type = this.$store.state.goods_history.goods_type
                            this.store_attr.map((item)=>{
                                for(var i in goods_type_arr){
                                    if(item.id == goods_type_arr[i]) {
                                        item.checked = true
                                    }
                                }
                                
                            })
                        }
                        if(this.$store.state.goods_history.goods_label) {
                            let goods_label_arr = this.$store.state.goods_history.goods_label.split(',')
                            this.queryData.goods_label = this.$store.state.goods_history.goods_label
                            this.goods_label.map((item)=>{
                                for(var i in goods_label_arr){
                                    if(item.id == goods_label_arr[i]) {
                                        item.checked = true
                                    }
                                }
                                
                            })
                        }
                        
                        
                    } 
                    this.checkSearchInfo()
                });
            },
            getRegionList(item){
                this.$api.getCityRegion({//城市三联
                    cmd:{
                        "region":"getCityRegion"
                    },
                    data:{
                        adcode: this.selectAdcode,
                        level: this.selectLevel
                    }
                }).then(res=>{
                    if(res.code === 1){
                        // console.log(this.currentAreaLevel,res,'area')
                        if(!res.data.length){//特别行政区
                            this.filterArea(item)
                        }
                        if(!this.selectAdcode){//省市区
                            this.provinceList = res.data
                        }else if(this.selectAdcode && this.currentAreaLevel === 1){
                            this.cityList = res.data
                        }else if(this.selectAdcode && this.currentAreaLevel === 2){
                            this.districtList = res.data
                        }else{
                            this.cityList1 = res.data
                            console.log(this.cityList1,111)
                        }      
                    }
                }).catch(err=>{
    
                })
            },
            shareEvt() {
                let shareData = {}
                shareData.linkName = `goods.list`
                shareData.desc = `掐指一算，这里有很多商品值得购买，进来看一看`
                shareData.title = '我在拥军换换上发现许多好东西，赶紧来看看'
                shareData.imgUrl = 'http://wuxing.mszjsm.cn/pic/wuxingadmin/20180905/f5fd725805a79e3711e4e3644eed3f3b.jpg'
                this.$share.api(shareData)
            },
            //高德定位
            getGeoInfo(){
                let _this = this
                AMap.plugin('AMap.CitySearch', function() {
                    var citySearch = new AMap.CitySearch()
                    citySearch.getLocalCity(function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                        // 查询成功，result即为当前所在城市信息
                            console.log(result,'city')
                            _this.geoArea = result.city
                            _this.geoAdCode = result.adcode
                        }
                    })
                })
            },
        },
        created(){   
            this.shareEvt()
            this.getGoodLabel()
            this.getGeoInfo()
        },
        filters: {
            filterName(member_nick_name){
                return member_nick_name.length > 9 ? member_nick_name.slice(0, 8) + '...' : member_nick_name;                
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    .goodList-wrapper{
        .search{
            height: 46px;
            width: 100%;
            background: #F2F2F2;
            padding: 5px 15px;
            position: fixed;
            top: 0;
            z-index: 99;
            .search-inner{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .box{
                    width: 90%;
                    height: 36px;
                    background: #FFF;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    color: #999;
                    font-size: 12px;
                    .icon{
                        margin: 0 7px 0 10px;
                        width: 15px;
                        height: 15px;
                        background: url('../../assets/images/icon_search_hui@2x.png') no-repeat;
                        background-size: contain;
                        flex-shrink: 0;
                    }
                    .content{
                        background: #D7D7D7;
                        color: #999;
                        border-radius: 10px;
                        height: 20px;
                        padding: 5px 7px;
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        overflow: hidden;
                        .txt{
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        }
                        .empty{
                            margin-left: 5px;
                        }
                    }
                }
                .fun-btn{
                    width: 22px;
                    height: 22px;
                    background-image: url('../../assets/images/icon_list@2x.png');
                    background-size: contain;
                }
            }
        }
        .filter-bar{
            height: 40px;
            width: 100%;
            background: #FFF;
            display: flex;
            justify-content: space-around;
            font-size: 14px;
            position: fixed;
            top:46px; 
            z-index: 99;
            .filter-item{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                .arrow{
                    width: 0;
                    height: 0;
                    border: 4px solid transparent;
                    border-top: 4px solid #000; 
                    margin-top: 8px;
                    margin-left: 3px;                  
                }
                &.active{
                    color: #F32D16;
                    .arrow{
                        border-top: 4px solid #F32D16; 
                        &.active{
                            border: 4px solid transparent;
                            margin-top: 0;
                            border-bottom: 4px solid #F32D16; 
                        }
                    }
                }
            }
        }
        .van-pull-refresh{
            padding-top: 86px;
            .goodList{
                .good-item{
                    margin-top: 10px;
                    height: 120px;
                    background: #FFF;
                    display: flex;
                    padding: 10px 13px 10px 15px;
                    .good-pic{
                        width: 100px;
                        height: 100px;
                        border-radius: 4px;
                        overflow: hidden;
                        flex-shrink: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #f5f5f5;
                        img {
                            height: 100%;
                        }
                    }
                    .good-info{
                        display: flex;
                        width: 100%;
                        flex-direction: column;
                        justify-content: space-between;
                        padding-left: 10px;
                        .info-head{
                            display: flex;
                            font-size: 14px;
                            word-break: break-word;
                            white-space: normal;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            span{
                                background: #F32D16;
                                color: #FFF;
                                padding: 3px 6px; 
                                display: inline-block;
                                font-size: 12px;
                                transform: scale(0.8);
                                transform-origin: left;
                                &.green{
                                    background: #4BCD63;
                                }
                            }
                        }
                        .info-body{
                            display: flex;
                            align-items: center;
                            font-size: 16px;
                            color: #F32D16;
                            .brand-label{
                                display: flex;
                                padding-left: 10px;
                                .label-item{
                                    width: 30px;
                                    height: 15px;
                                    margin-left: 5px;
                                }
                            }
                        }
                        .info-footer{
                            display: flex;
                            justify-content: space-between;
                            font-size: 12px;
                            color: #999;
                            .member{
                                display: flex;
                                .portrait{
                                    width: 20px;
                                    height: 20px;
                                    border-radius: 10px;
                                    overflow: hidden;
                                    margin-right: 5px;
                                    flex-shrink: 0;
                                }
                                .nick-name{
                                    display: -webkit-box;
                                    white-space: normal;
                                    word-break: break-all;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 1;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                            }
                            .address{
                                display: -webkit-box;
                                white-space: normal;
                                word-break: break-all;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 1;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .brand-label{
                                display: flex;
                                .label-item{
                                    width: 30px;
                                    height: 15px;
                                    margin-left: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .default{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50%;
            .default-pic{
                width: 130px;
                height: 92px;
            }
            .default-info{
                padding-top: 10px;
                width: 148px;
                color: #666;
                font-size: 14px;
                text-align: center;
            }
        }
        .area-popup{
            width: 100%;
            height: 40%;
            position: fixed;
            top: 86px;
            display: flex;
            font-size: 12px;
            transform: unset;
            .province,.city,.district{
                flex: 1;
                overflow: auto;
                .city-item{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    height: 44px;
                    padding: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    &.active{
                        background: #F2F2F2;
                    }
                }
                .geoCity{
                    position: relative;
                    &::after{
                        content: '';
                        width: 12px;
                        height: 12px;
                        background: url(../../assets/images/icon_location@2x.png) no-repeat;
                        background-size: contain;
                        position: absolute;
                        right: 15%;
                    }
                }
            }
        }
        .synthesis-popup{
            width: 100%;
            position: fixed;
            top: 174px;
            padding: 0 15px;
            .synthesis-item{
                height: 44px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: #333;
                &.active{
                    .select{
                        width: 12px;
                        height: 12px;
                        background: url(../../assets/images/Shape@2x.png) no-repeat;
                        background-size: contain;
                    }
                }
            }
        }
        .filtrate-popup{
            width: 75%;
            height: 100%;
            display: flex;
            flex-direction: column; 
            justify-content: space-between;
            .filtrate-bd{
                .filtrate-item{
                    font-size: 12px;
                    padding: 8px 7px 11px 7px;
                    border-bottom: 1px solid #F4F4F4;
                    &:first-child{
                        padding-bottom: 14px;
                        .item-content{
                            margin-top: 7px;
                        }
                    }
                    &:last-child{
                        border-bottom: none;
                    }
                    .item-title{
                        color: #666;
                    }
                    .item-content{
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        padding-top: 6px;
                        input{
                            width: 112px;
                            height: 28px;
                            background: #EEE;
                            border: 0; 
                            border-radius: 15px;
                            text-align: center;     
                        }
                        .line{
                            width: 15px;
                            height: 2px;
                            background: #EEE;
                        }
                        .label-item{
                            height: 44px;
                            width: 30%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-right: 5%;
                            background: #F4F4F4;
                            font-size: 12px;
                            color: #333;
                            margin-top: 7px;
                            border-radius: 4px;
                            &:nth-child(3n){
                                margin-right: 0;
                            }
                            &.active{
                                color: #FFF;
                                background: #F32D16;
                            }
                        }
                    }
                    .item-range{
                        justify-content: space-between;
                    }
                }
            }
            .filtrate-ft{
                display: flex;
                width: 100%;
                height: 44px;
                .reset,.confirm{
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #FFF;
                    font-size: 16px;
                }
                .reset{
                    background: #FFB30D;
                }
                .confirm{
                    background: #F32D16;
                }
            }
        }
        .area-modal{
            background-color: rgba(0, 0, 0, .5);    
            position: fixed;
            top: 86px;     
        }
        .synthesis-modal{
            background-color: rgba(0, 0, 0, .5); 
            position: fixed;
            top: 86px;
        }
        .filtrate-modal{
            background-color: rgba(0, 0, 0, .5) 
        }
    }
</style>
