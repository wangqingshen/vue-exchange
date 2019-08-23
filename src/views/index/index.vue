<template>
    <div class="index-wrapper" v-title="pageTitle">
        <!-- 搜索框 -->
        <div class="search">
            <div class="search-inner" @click="PageSearch">
                <div class="icon"></div>
                <p>搜索商城物品</p>
            </div>
        </div>
        <!-- 轮播 -->
        <van-swipe class="banner" :autoplay="3000">
            <van-swipe-item v-for="(item, index) in banners" :key="index" class="lazy-img">
                <img v-lazy="item.banner_img" @click="bannerClickEvt(item)"/>
            </van-swipe-item>
        </van-swipe>
        <!-- 导航 -->
        <div class="nav">
            <div class="nav-inner">
                <!-- 导航icon -->
                <van-swipe :loop=false v-if="icon_style == 1">
                    <van-swipe-item v-for="(item, index) in navList" :key="index">
                        <ul>
                            <li v-for="(_item, _index) in item.list" :key="_index" @click="bannerClickEvt(_item)" :class="'col-icon-'+icon_cols">
                                <div class="lazy-img" v-if="icon_show == 1">
                                     <img v-lazy="_item.icon_img"  />
                                </div>
                                <span v-if="icon_describe_show == 1">{{_item.icon_describe}}</span>
                            </li>
                        </ul>
                    </van-swipe-item>
                </van-swipe>
                <div class="nav-vertical-list" v-else-if="icon_style == 2">
                    <div class="nav-vertical-item" v-for="(item, index) in navList" :key="index" @click="bannerClickEvt(item)">
                        <div class="item-l">
                            <div class="item-icon">
                                <div class="lazy-img" v-if="icon_show == 1">
                                     <img v-lazy="item.icon_img"  />
                                </div>
                            </div>
                            <div class="txt" v-if="icon_describe_show == 1">{{item.icon_describe}}</div>
                        </div>
                        <div class="item-r">
                            <div class="arrow-right">
                                <img src="../../assets/images/ic_order_rightarrow.png" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 功能模块 -->
                <div class="module" >
                    <div class="module-inner">
                        <div class="img-item" v-for="(item, index) in moduleList" :key="index">
                            <div class="lazy-img">
                                <img v-lazy="item.banner_img"  @click="bannerClickEvt(item)"/>
                            </div>
                            
                        </div>
                        <!-- <img :src="item.banner_img" v-for="(item, index) in moduleList" :key="index"  @click="moduleClick(index)"> -->
                    </div>
                </div>
                <div class="home-ad">
                    <div class="lazy-img">
                        <div v-lazy:background="item.banner_img" v-for="(item, index) in adList" :key="index" @click="bannerClickEvt(item)"></div>
                    </div>
                   
                </div>
            </div>
        </div>
        <!-- 买二手换钱 -->
        <div class="recommend">
            <div class="txt">买二手换钱</div>
            <div class="inner">
                <div class="img-item" v-for="(item, index) in buyList" :key="index">
                    <div class="lazy-img">
                        <img v-lazy="item.banner_img"  @click="bannerClickEvt(item)"/>
                    </div> 
                </div>
            </div>
        </div>
        <!-- 买严选正品 -->
        <div class="recommend">
            <div class="txt">买严选正品</div>
            <div class="inner">
                <div class="img-item" v-for="(item, index) in yxList" :key="index">
                    <div class="lazy-img">
                        <img v-lazy="item.banner_img"  @click="bannerClickEvt(item)"/>
                    </div> 
                </div>
            </div>
        </div>
        <!-- 购物车 -->
        <div class="shopping-car" @click="PageShopcar">
            <div class="red-dot" v-show="shopCarData"></div>
            <img src="../../assets/images/icon_shopping_normal@2x.png" />
        </div>
        <!-- 底部横栏-->
        <Footer :pageIndex="pageIndex"/>
    </div>
</template>

<script>
    import Footer from '@/components/Footer.vue'
    export default{
        name:'index',
        data(){
            return{
                pageTitle:'首页',
                pageIndex: 0,
                banners: [],
                navList: [
                    // {icon: require('../../assets/images/home_nav/icon_nav_1.png'), name: '拼团'},
                    // {icon: require('../../assets/images/home_nav/icon_nav_2.png'), name: '服饰',category: 1},
                    // {icon: require('../../assets/images/home_nav/icon_nav_3.png'), name: '鞋靴',category: 2},
                    // {icon: require('../../assets/images/home_nav/icon_nav_4.png'), name: '军品',category: 4},
                    // {icon: require('../../assets/images/home_nav/icon_nav_5.png'), name: '箱包',category: 5},
                    // {icon: require('../../assets/images/home_nav/icon_nav_6.png'), name: '礼品',category: 202},
                    // {icon: require('../../assets/images/home_nav/icon_nav_7.png'), name: '数码',category: 203},
                    // {icon: require('../../assets/images/home_nav/icon_nav_8.png'), name: '全部',category: 0},
                ],
                moduleList: [],
                adList: [],
                buyList: [],
                yxList: [],
                shopCarData: false,
                icon_style: '', //icon排列方式，1横铺，2竖列
                icon_cols: '', //icon列数
                icon_total: '', //icon总个数
                icon_page_num: '', //icon每页展示个数
                icon_page: '', //横铺分页
                icon_show: '', //是否显示图标
                icon_describe_show: '' //是否显示图标名称
            }
        },
        components:{
            Footer,
        },
        methods:{
            PageSearch(){
                this.$router.push({name: 'search'})
            },
            bannerClickEvt(item){
                let type = item.link_type || item.icon_link_type //0无跳转，1商品详情，2商品列表，3外链，4发布二手，5拼团，6秒杀，7购物车，8个人中心，9分类
                if(type == 0) {
                    return false
                }else if(type == 1){
                    this.$router.push({name: 'goodsDetails', params: {spu_id: item.link_params}})
                }else if(type == 2){
                    this.$store.dispatch('setSearchHistory', '')
                    let gc_id_1 = item.link_params.class[0],
                        gc_id_2 = item.link_params.class[1],
                        gc_id_3 = item.link_params.class[2],
                        params = {}
                    localStorage.setItem('gc_id_1', gc_id_1)
                    localStorage.setItem('gc_id_2', gc_id_2)
                    localStorage.setItem('gc_id_3', gc_id_3)
                    localStorage.removeItem('search_gc_name')
                    if(item.link_params.price_between.length) {
                        this.$set(params, 'price_between', JSON.stringify(item.link_params.price_between))
                    }
                    if(item.link_params.goods_label.length) {
                        this.$set(params, 'goods_label', JSON.stringify(item.link_params.goods_label))
                    }
                    if(item.link_params.goods_type.length) {
                        this.$set(params, 'goods_type', JSON.stringify(item.link_params.goods_type))
                    }
                    this.$set(params, 'goods_sort', item.link_params.goods_sort)
                    this.$router.push({name: 'goodList', params: params})
                }else if(type == 3){
                    window.location.href = item.link_params
                }else if(type == 4){
                    this.$router.push({name: 'publish', params:{spu_id: '-1'}})
                }else if(type == 5){
                    this.$router.push({name: 'groupList'})
                }else if(type == 6){
                    this.$router.push({name: 'secKill'})
                }else if(type == 7){
                    this.$router.push({name: 'shopCar'})
                }else if(type == 8){
                    this.$router.push({name: 'ownIndex'})
                }else if(type == 9){
                    this.$router.push({name: 'category'})
                }
            },
            PageCategory(index, item){
                if(index == 0) {
                    this.$router.push({name: 'groupList'})
                }else{
                    let category = item.category,
                        name = item.name
                    localStorage.removeItem('gc_id_2')
                    localStorage.removeItem('gc_id_3')
                    localStorage.setItem('gc_id_1', 0)
                    localStorage.setItem('search_gc_name', name)
                    this.$store.dispatch('setSearchHistory', name)
                    if(this.$store.state.goods_history){
                        this.$store.state.goods_history.goods_type = ''
                        this.$store.state.goods_history.goods_label = ''
                    }
                    localStorage.setItem('gc_id_1', category)
                    this.$router.push({name: 'goodList', params:{gc_id_1: category}})
                }
                
                // if(index === 9){
                //     this.$router.push({name: 'goodList', params:{gc_id_1: 0}})
                // }else if(index === 0){//个人
                //     this.$router.push({name: 'goodList', params:{gc_id_1: 0, store_attr_id: 3}})
                // }else if(index === 5){//商家 店铺自营
                //     this.$router.push({name: 'goodList', params:{gc_id_1: 0, store_attr_id: 12}})
                // }else if(index>=1 && index<5){
                //     localStorage.setItem('gc_id_1', index)
                //     this.$router.push({name: 'goodList', params:{gc_id_1: index}})
                // }else{
                //     localStorage.setItem('gc_id_1', index-1)
                //     this.$router.push({name: 'goodList', params:{gc_id_1: index-1}})
                // }
            },
            PageShopcar(){
                this.$router.push({name: 'shopCar'})
            },
            getIndexIcon(){
                this.$api.indexIcon({//首页
                    cmd:{
                        "index":"icon"
                    },
                    data:{}
                }).then(res=>{
                    if(res.code == 1){
                        console.log(res.data, 111)
                        this.icon_style = res.data.show_style
                        this.icon_show = res.data.show_icon
                        this.icon_describe_show = res.data.show_describe
                        this.icon_total = res.data.show_detail.length
                        this.icon_cols = res.data.show_cols
                        this.icon_page_num = res.data.show_cols*res.data.show_rows
                        if(this.icon_style == 1) {
                            this.icon_page = Math.ceil(this.icon_total/this.icon_page_num)
                            for(var i=0; i<this.icon_page; i++){
                                let obj = {},
                                    list = []
                                res.data.show_detail.map((item, index)=>{
                                    if(index < (i+1)*this.icon_page_num && index >= i*this.icon_page_num){
                                        list.push(item)
                                    }
                                })
                                this.$set(obj, 'list', list)
                                this.navList.push(obj)
                            }
                            console.log(this.navList, 222)
                        }else{
                           this.navList = res.data.show_detail
                        }
                    }
                }).catch(res=>{

                })
            },
            getIndexPic(){
                this.$api.indexPic({//首页
                    cmd:{
                        "shop":"banner"
                    },
                    data:{}
                }).then(res=>{
                    if(res.code===1){
                        for(var i in res.data) {
                            let num = res.data[i].num,
                                len = res.data[i].list.length
                            if(i == 1 && !len) {
                                let obj = {banner_img: '', link_type: 0}
                                res.data[i].list.push(obj)
                            }else if(i != 1 && len < num) {
                                for(var j=0;j<(num-len);j++) {
                                    let obj = {banner_img: '', link_type: 0}
                                    res.data[i].list.push(obj)
                                }
                            }
                            
                        }
                        console.log(res.data)
                        this.banners = res.data[1].list
                        this.moduleList = res.data[2].list
                        this.adList = res.data[3].list
                        this.buyList = res.data[4].list
                        this.yxList = res.data[5].list
                    }
                })
            },
            getCarList(){
                this.$api.cartList({//购物车
                    cmd:{
                        cart:"cartlist"
                    },
                    data:{
                        member_id:this.member_id
                    }
                }).then(res=>{
                    // console.log(res,'shopcar')
                    if(res.code === 1){
                        if(res.data.good.length>0){
                            this.shopCarData = !this.shopCarData
                        }        
                    }
                })
            },
            shareEvt() {
                let shareData = {}
                shareData.linkName = `index`
                shareData.desc = `掐指一算，这里有很多商品值得购买，进来看一看`
                shareData.title = '我在拥军换换上发现许多好东西，赶紧来看看'
                shareData.imgUrl = 'http://wuxing.mszjsm.cn/pic/wuxingadmin/20180905/f5fd725805a79e3711e4e3644eed3f3b.jpg'
                this.$share.api(shareData)
            },
        },
        created(){
            this.shareEvt()
            this.getIndexPic()
            this.getIndexIcon()
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.getCarList()
        },
        mounted(){
    
        }
    }

</script>

<style lang="scss" type="text/scss">
    .index-wrapper{
        padding-top: 46px;
        padding-bottom: 70px;
        .banner{
            height: 175px;
            .van-swipe__indicators{
                .van-swipe__indicator{
                    width: 4px;
                    height: 3px;
                    background: rgba(255,255,255,0.3);
                    &.van-swipe__indicator--active{
                        width: 11px;
                        background: #fff;
                    }
                }
            }
        }
        .search{
            width: 100%;
            height: 46px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            background: #EDEDED;
            padding: 0 15px;
            z-index: 100;
            .search-inner{
                width: 100%;
                height: 36px;
                background: #fff;
                border-radius: 18px;
                display: flex;
                align-items: center;
                color: #999;
                font-size: 14px;
                .icon{
                    margin: 0 5px 0 10px;
                    width: 15px;
                    height: 15px;
                    background-image: url('../../assets/images/icon_search_hui@2x.png');
                    background-size: contain;
                }
            }
        }
        .nav{
            background: #FFF;
            .nav-inner{
                .van-swipe__indicators{
                    .van-swipe__indicator{
                        width: 4px;
                        height: 3px;
                        background: #E8E8E8;
                        &.van-swipe__indicator--active{
                            width: 11px;
                            background: #999999;
                        }
                    }
                }
                ul{
                    display: flex;
                    // justify-content: space-between;
                    flex-wrap: wrap;
                    padding-top: 15px;
                    li{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 25%;
                        padding-bottom: 20px;
                        color: #333;
                        font-size: 12px;
                        span{
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            white-space: normal;
                            word-break: break-all;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            padding: 0 5px;
                            line-height: 20px;
                        }
                        .lazy-img{
                            background: transparent;
                        }
                        img{
                            border-radius: 100%;
                            margin-bottom: 5px;
                            &[lazy="error"], &[lazy="loading"]{
                                background: #f5f5f5;
                            }
                        }
                        &.col-icon-2{
                            width: calc(100%/2);
                            img{
                                width: 64px;
                                height: 64px;
                            }
                        }
                        &.col-icon-3{
                            width: calc(100%/3);
                            img{
                                width: 60px;
                                height: 60px;
                            }
                        }
                        &.col-icon-4{
                            width: calc(100%/4);
                            img{
                                width: 50px;
                                height: 50px;
                            }
                        }
                        &.col-icon-5{
                            width: calc(100%/5);
                            img{
                                width: 40px;
                                height: 40px;
                            }
                        }
                    }
                }
                .nav-vertical-list{
                    .nav-vertical-item{
                        height: 60px;
                        border-bottom: 1px solid #E5E5E5;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        padding-right: 15px;
                        .item-l{
                            display: flex;
                            align-items: center;
                            padding-left: 15px;
                            flex: 1;
                            .item-icon{
                                width: 32px;
                                height: 32px;
                            }
                            .txt{
                                flex: 1;
                                padding-left: 10px;
                                color: #333;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 1;
                                white-space: normal;
                                word-break: break-all;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                        .item-r{
                            display: flex;
                            align-items: center;
                            .arrow-right{
                                width: 8px;
                                height: 12px;
                                margin-left: 10px;
                            }
                        }
                    }
                }
                .module{
                    width: 100%;
                    overflow: auto;
                    padding: 0 15px;
                    .module-inner{
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                        .img-item{
                            width: 50%;
                            height: 130px;
                            &:first-child{
                                padding-right: 5px;
                            }
                            &:last-child{
                                padding-left: 5px;
                            }
                        }
                    }
                }
                .home-ad{
                    padding: 10px 15px;
                    div {
                        width: 100%;
                        height: 60px;
                        background-repeat: no-repeat !important;
                        background-position: center !important;
                        &[lazy="error"], &[lazy="loading"]{
                            width: 60px;
                            height: 50px;
                            background-size: contain !important;
                        }
                        &[lazy="loaded"] {
                            width: 100%;
                            height: 100%;
                            background-size: cover !important;
                        }
                    }
                }
            }
        }
        .ad{
            margin: 10px 15px;
            display: flex;
            justify-content: space-between;
            img{
                width: 49%;
                height: 180px;
            }
        }
        .recommend{
            margin-top: 10px;
            padding: 20px 15px;
            background: #FFF;
            font-size: 16px;
            font-weight: 700;
            color: #333;
            .inner{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 10px;
                .img-item{
                    width: 50%;
                    height: 130px;
                    &:first-child{
                        padding-right: 5px;
                    }
                    &:last-child{
                        padding-left: 5px;
                    }
                }
            }
            .pic{
                height: 181px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                .pic-left{
                    width: 49%;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .pic-right{
                    width: 49.5%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    img{
                        height: 88px;
                    }
                }
            }
        }
        .shopping-car{
            width: 46px;
            height: 46px;
            border-radius: 50%;
            position: fixed;
            right: 15px;
            bottom: 30%;
            .red-dot{
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #f94232;
                position: absolute;
                top: 22%;
                right: 20%;
            }
            img{
                width: 100%;
            }
        }
    }
</style>
