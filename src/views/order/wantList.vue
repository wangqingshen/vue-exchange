<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="wantList-inner">
            <div class="orderStatus-bar">
                <div class="bar-inner">
                    <div class="items">
                        <div class="item" v-for="(item, index) in orderType" :key="index" :class="{'active':stepIndex === item.state }" @click="changewantList({order_state: item.state})">
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="line" :class="stepClass"></div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="wantList" :offset="offset" v-if="!noData">
                <div class="wantList-item" v-for="(item,index) in wantListData" :key='index' :class="item.goods_state == 4 ? '':(item.goods_state == 3 ? (item.goods_num?'disabled xiajia':'disabled saled') : 'disabled delete')">
                    <div class="want-head">
                        <div class="pic">
                            <img :src="item.member_avatar" />
                        </div>
                        <div class="info">
                            <div class="user-name">{{item.member_nick_name}}</div>
                            <div class="area">{{item.goods_cityname.city}} {{item.goods_cityname.district}}</div>
                        </div>
                    </div>
                    <div class="good-imgs">
                        <div class="img-inner">
                            <img v-lazy="image" v-for="(image, index) in item.goods_img" :key="index"/>
                        </div>
                    </div>
                    <div class="goods-info">
                        <div class="goods-price" @click="btnEvt(3, item.goods_spu_id)">￥{{item.goods_price}}</div>
                        <div class="goods-name" @click="btnEvt(3, item.goods_spu_id)">{{item.goods_name}}</div>
                    </div>
                    <div class="btns" v-if="item.goods_state == 4">
                        <div class="style-default" @click="btnEvt(1, item.sell_member_id)">联系卖家</div>
                        <div class="style-default red" @click="btnEvt(2, item.sku_id)">马上买</div>
                    </div>
                </div>
                <noMore :finished="finished"></noMore>
            </van-list>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="">您还没有想要的宝贝</div>
            </div>
        </div>
    </div>
</template>
<script>
    import noMore from '@/components/no-more'
    export default{
        name:'wantList',
        data(){
            return{
                pageTitle:'我想要的',
                orderType: [
                    {name: '在线宝贝', state: 1},
                    {name: '失效宝贝', state: 2},
                ],
                loading: false,
                finished: false,
                stepIndex:1,
                offset:50,
                member_id:'',
                wantListData:[],
                page:1,
                isMore:false,
                order_state:0,
                noData:false
            }
        },
        components:{
            noMore
        },
        computed:{
            stepClass(){
                if(this.stepIndex === 0){
                    return false
                }else {
                    return `line-step${this.stepIndex}`
                }
            }
        },
        watch:{

        },
        methods:{
            btnEvt(type, id){
                if(type==1) {
                    this.$router.push({name: 'chat',params: {to_user_id: id}})
                }else if(type==2) {
                    let order_goods = ''
                    order_goods = [{sku_id: id, goods_num: 1, activity_type:3}]
                    order_goods = JSON.stringify(order_goods)
                    this.$store.dispatch('setOrderGoods',order_goods)
                    this.$store.dispatch('setSelAddress',false)
                    let payWay = {
                        type:'order_sn',
                        goodsType: 3
                    }
                    this.$store.commit('SET_SEL_ADDRESS_INDEX','-1')
                    localStorage.removeItem('isSelIndex')
                    this.$store.dispatch('setPayWay',payWay)
                    this.$router.push({name:'submitOrder',params:{order_goods:order_goods}})
                }else if(type==3) {
                    this.$router.push({name: 'goodsDetails',params: {spu_id: id}})
                }
                
            },

            loadMore() {
                if(!this.finished && this.isMore){
                    if(this.wantListData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getwantList({page:this.page,page_size:10,order_state:this.order_state})
                        },500)
                    }

                }

            },
            changewantList({order_state = 0} = {}){
                if(order_state == this.stepIndex) return
                this.stepIndex = order_state
                this.order_state = order_state
                this.wantListData = []
                this.page = 1
                this.isMore = false
                this.finished = false
                this.getwantList({page:this.page,order_state:this.order_state})
                let status = this.$store.state.tabCard_status
                status.wantList = this.order_state
                this.$store.dispatch('setTabCardStatus',status)
            },
            getwantList({page = 1,page_size = 10,order_state = 0} = {}){
                this.$api.getWamtLists({
                    cmd:{
                        member:'ExpectGoodsLists'
                    },
                    data:{
                        member_id:this.member_id,
                        page:page,
                        page_size:page_size,
                        state:order_state
                    },
                }).then(res=>{
                    if(res.code===1){
                        if(this.page == 1) {
                            this.wantListData = res.data.data
                        }else{
                            this.wantListData = [...this.wantListData,...res.data.data] 
                        }
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.data.length < 10){
                            this.finished = true
                        }
                        if(this.wantListData.length === 0){
                            this.noData = true
                        }
                    }else{
                        this.loading = false
                        this.noData = true 
                    }
                }).catch(err=>{

                })
            },
            getInitList(){
                this.page = 1
                this.finished = false
                this.$api.getOrderList({
                    cmd:{
                        order:'orderlist'
                    },
                    data:{
                        member_id:this.member_id,
                        page:this.page,
                        page_size:10,
                        order_state:this.order_state
                    },
                }).then(res=>{
                    if(res.code===1){
                        this.wantListData = res.data
                        this.loading = false
                    }
                })

            }

        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            if(this.$store.state.tabCard_status.wantList){
                this.stepIndex = this.$store.state.tabCard_status.wantList
            }
            this.getwantList({order_state:this.stepIndex})
        },
        mounted(){
        }

    }
</script>
<style lang="scss" type="text/scss">
    .wantList-inner{
        padding-top: 50px;
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_wuxiangyao@2x.png) no-repeat;
                width: 130px;
                height: 190px;
                background-size: 100%;
                margin-bottom: 10px;
            }
        }
        .orderStatus-bar{
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            font-size: 14px;
            color: #353535;
            background: #fff;
            z-index: 99;
            .bar-inner{
                position: relative;
            }
            .items{
                display: flex;
                align-items: center;
                .item{
                    width: 20%;
                    flex-grow: 1;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .txt{
                        margin-top: -4px;
                    }
                    &.active{
                        color: #f22a15;
                    }
                }

            }
            .line{
                position: absolute;
                left: 0;
                height: 4px;
                width: 50%;
                background: #f22a15;
                bottom: 0;
                transition: transform 0.2s ease-in;
                transform: translateX(0);
                &.line-step1{
                    transform: translateX(0);
                }
                &.line-step2{
                    transform: translateX(100%);
                }
            }
        }
        .wantList{
            margin-top: 10px;
            padding: 0 15px;
            box-sizing: border-box;
            .wantList-item{
                background: #fff;
                margin-top: 15px;
                padding-bottom: 15px;
                border-radius: 4px;
                .want-head {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    .pic {
                        margin-right: 5px;
                        img {
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                        }
                    }
                    .info {
                        .user-name {
                            font-size: 14px;
                            color: #333;
                            line-height: 20px;
                        }
                        .area{
                            font-size: 12px;
                            color: #666;
                            line-height: 18px;
                        }
                    }
                }
                .good-imgs {
                    width: 100%;
                    padding-bottom: 10px;
                    overflow: auto;
                    .img-inner {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        img {
                            background: #f5f5f5;
                            width: 70px;
                            height: 70px;
                            margin-left: 10px;
                            &:last-child{
                                margin-right: 10px;
                            }
                        }
                    }
                }
                .goods-info{
                    width: 100%;
                    padding: 0 10px;
                    box-sizing: border-box;
                    .goods-price {
                        font-size: 14px;
                        color:#F32D16;
                        line-height: 20px;
                    }
                    .goods-name{
                        font-size: 12px;
                        color: #666;
                        line-height: 18px;
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .btns{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding: 8px 10px 0;
                }
                .style-default{
                    width: 70px;
                    height: 25px;
                    border-radius:15px;
                    border: 1px solid #ccc;
                    font-size: 12px;
                    text-align: center;
                    line-height: 25px;
                    margin-left: 10px;
                    color: #666;
                    &.red{
                        border-color: #F32D16;
                        color: #F32D16;
                    }
                }
                &.disabled {
                    position: relative;
                    &:before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: rgba(105,105,105,0.6);
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: 100px;
                        border-radius: 4px;
                        z-index: 10;
                        left:0;
                        top:0;
                    }
                    &.saled:before{
                        background-image: url("../../assets/images/pic_sale@2x.png");
                    }
                    &.xiajia:before{
                        background-image: url("../../assets/images/pic_xiajia@2x.png");
                    }
                    &.delete:before{
                        background-image: url("../../assets/images/pic_delete@2x.png");
                    }
                }
            }
        }
    }
</style>
