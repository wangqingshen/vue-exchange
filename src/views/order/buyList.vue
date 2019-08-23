<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="buyList-inner">
            <div class="orderStatus-bar">
                <div class="bar-inner">
                    <div class="items">
                        <div class="item" v-for="(item, index) in orderType" :key="index" :class="{'active':stepIndex === item.state }" @click="changebuyList({order_state: item.state})">
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="line" :class="stepClass"></div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="buyList" :offset="offset" v-if="!noData">
                <div class="buyList-item" v-for="(item,index) in buyListData" :key='index'>
                    <div class="hd vux-1px-b">
                        <div class="store-name">
                            <div class="member_avatar" v-if="item.member_avatar">
                                <img :src="item.member_avatar" />
                            </div>
                            <div class="shop-icon" v-else></div>
                            <div class="txt">{{item.order_type !== 3 ? item.store_name : item.member_nick_name}}</div>
                        </div>
                        <div class="status-txt">{{item.order_state | orderStatus}}</div>
                    </div>
                    <div class="bd">
                        <div class="goods-list" @click="PageOrderDetail(item)">
                            <!-- <orderItem :orderItemData="item.order_goods"></orderItem> -->
                            <!-- <div class="orderItem-item vux-1px-b" v-for="(item,index) in orderItemData" :key="index"> -->
                            <div class="orderItem-item vux-1px-b" v-for="(goodItem,index) in item.order_goods" :key="index">
                                <div class="orderItem-inner">
                                    <div class="pic">
                                        <img v-lazy="goodItem.goods_img">
                                    </div>
                                    <div class="info">
                                        <div class="name">{{goodItem.spu_name}}</div>
                                        <div class="b">
                                            <div class="price">￥{{item.goods_amount|toFixedTwo}}</div>
                                            <div class="num">x{{goodItem.goods_num}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="order-num vux-1px-b">订单编号：{{item.order_sn}}</div>
                    </div>
                    <div class="ft">
                        <div class="total">
                            <span>共{{item.total_num}}件商品</span> <span>小计：￥{{item.order_amount | toFixedTwo}}</span> <span>（含运费￥{{item.shipping_fee}}）</span>
                        </div>
                        <div :class="(item.order_state === 1 || item.order_state === 3 || item.order_state === 4 || item.order_type === 3) ? 'btns vux-1px-t' : ''">
                            <div class="style-default" v-if="item.order_type === 3" @click="connect(item.sell_member_id)">联系卖家</div>
                            <div class="style-default" v-if="item.order_state === 1" @click="cancelOrderFun(item)">取消订单</div>
                            <div class="style-default red" @click="payFun(item)" v-if="item.order_state === 1">付款</div>
                            <div class="style-default" @click="gol(item)" v-if="(item.order_state === 3 || item.order_state === 4)&& item.delivery_way == 1" >查看物流</div>
                            <div class="style-default red" @click="confirm(item)" v-if="item.order_state === 3">确认收货</div>
                        </div>
                    </div>
                </div>
                <noMore :finished="finished"></noMore>
            </van-list>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="">暂无我买到的订单信息</div>
            </div>
        </div>
    </div>
</template>
<script>
    // import orderItem from '@/components/order-item'
    import noMore from '@/components/no-more'
    export default{
        name:'buyList',
        data(){
            return{
                pageTitle:'我买到的',
                orderType: [
                    {name: '全部', state: 0},
                    {name: '待付款', state: 1},
                    {name: '待发货', state: 2},
                    {name: '待收货', state: 3},
                    {name: '已完成', state: 4},
                ],
                loading: false,
                finished: false,
                stepIndex:0,
                offset:50,
                orderItemData:[
                ],
                member_id:'',
                buyListData:[],
                page:1,
                isMore:false,
                order_state:0,
                noData:false
            }
        },
        components:{
            // orderItem,
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
            gol(item){
                this.$router.push({name:'logistics',params:{order_id:item.order_id}})
            },

            connect(uid){
                this.$router.push({name:'chat', params: {to_user_id: uid}})
            },

            loadMore() {
                if(!this.finished && this.isMore){
                    if(this.buyListData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.buyList({page:this.page,page_size:10,order_state:this.order_state})
                        },500)
                    }

                }

            },
            changebuyList({order_state = 0} = {}){
                if(order_state == this.stepIndex) return
                this.stepIndex = order_state
                this.order_state = order_state
                this.buyListData = []
                this.page = 1
                this.isMore = false
                this.finished = false
                this.buyList({page:this.page,order_state:this.order_state})
                let status = this.$store.state.tabCard_status
                status.buyList = this.order_state
                this.$store.dispatch('setTabCardStatus',status)
            },
            buyList({page = 1,page_size = 10,order_state = 0} = {}){
                this.$api.buyOrderList({//买到订单列表
                    cmd:{
                        order:'orderList'
                    },
                    data:{
                        member_id:this.member_id,
                        page:page,
                        page_size:page_size,
                        order_state:order_state
                    },
                }).then(res=>{
                    console.log(res.data,'buylist')
                    if(res.code===1){
                        if(this.page == 1) {
                            this.buyListData = res.data
                        }else{
                            this.buyListData = [...this.buyListData,...res.data]
                        }
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.length < 10){
                            this.finished = true
                        }
                        if(this.buyListData.length === 0){
                            this.noData = true
                        }
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
                        this.buyListData = res.data
                        this.loading = false
                    }
                })

            },
            payFun(orderItem){
                let order_id =orderItem.order_id
                let payWay = {
                    type:'order_id',
                    goodsType:0
                }
                this.$store.dispatch('setPayWay',payWay)
                this.$router.push({name:'payCashier',params:{order_num:order_id}})
            },
            cancelOrderFun(orderItem){
                this.$api.cancelOrder({//取消订单
                    cmd:{
                        order:'cancelOrder'
                    },
                    data:{
                        order_id:orderItem.order_id
                    }
                }).then(res=>{
                    console.log(res,'取消成功')
                    if(res.code===1){

                        this.getInitList()
                        setTimeout(()=>{
                            this.$toast.success({
                                forbidClick: true,
                                message:'取消订单成功'
                            })
                        },1000)

                    }
                })
            },
            PageOrderDetail(item){
                this.$router.push({name:'orderDetails',params:{order_id:item.order_id}})
            },
            confirm(item){
                this.$dialog.confirm({
                    title: '',
                    message: `确定收货吗？`
                }).then(() => {
                    this.$api.confirmOrder({//确认收货
                        cmd:{
                            order:'confirmorder'
                        },
                        data:{
                            order_id:item.order_id
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.code===1){
                            this.$toast.success({
                                duration: 2000,
                                forbidClick: true,
                                message:'收货成功'
                            })
                            setTimeout(()=>{
                                this.getInitList()
                            },1000)
                        }
                    })
                }).catch(() => {

                })


            }

        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            if(this.$store.state.tabCard_status.buyList) {
                this.stepIndex = this.$store.state.tabCard_status.buyList
            }
            this.buyList({order_state:this.stepIndex})
        },
        mounted(){
        }

    }
</script>
<style lang="scss" type="text/scss">
    .buyList-inner{
        padding-top: 50px;
        .shop-icon{
            background: url(../../assets/images/shop_icon.png) no-repeat;
            background-size: contain;
            width: 18px;
            height: 16px;
            margin-right: 5px;
        }
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
        }
        .orderStatus-bar{
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            padding: 0 15px;
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
                width: 20%;
                background: #f22a15;
                bottom: 0;
                transition: transform 0.2s ease-in;
                transform: translateX(0);
                &.line-step1{
                    transform: translateX(100%);
                }
                &.line-step2{
                    transform: translateX(200%);
                }
                &.line-step3{
                    transform: translateX(300%);
                }
                &.line-step4{
                    transform: translateX(400%);
                }
            }
        }
        .buyList{
            margin-top: 10px;
            .buyList-item{
                background: #fff;
                margin-bottom: 10px;
                .hd{
                    height:44px;
                    padding:  0 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                }
                .store-name{
                    display: flex;
                    align-items: center;
                    .member_avatar{
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 5px;
                    }
                }
                .status-txt{
                    color: #F22A15;
                }
                .bd{
                    .goods-list{
                        .orderItem-item{
                            padding: 10px 15px;
                            background: #fff;
                            &:last-child:after{
                                content: none;
                            }
                            .orderItem-inner{
                                display: flex;
                                .pic{
                                    width: 100px;
                                    height: 100px;
                                    border-radius: 4px;
                                    flex-shrink: 0;
                                    margin-right: 7px;
                                    border-radius: 4px;
                                    overflow: hidden;
                                    background: #f5f5f5;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    img {
                                        width: auto;
                                        height: 100%;
                                    }
                                }
                                .info{
                                    display: flex;
                                    flex-grow: 1;
                                    justify-content: space-between;
                                    .name{
                                        font-size: 14px;
                                        color: #333;
                                        display: -webkit-box;
                                        white-space: normal;
                                        word-break: break-all;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        -webkit-box-orient: vertical;
                                        -webkit-line-clamp:2;
                                        height: 35px;
                                    }
                                    .b{
                                        display: flex;
                                        flex-direction: column;
                                        .price{
                                            font-size: 16px;
                                        }
                                        .num{
                                            font-size: 12px;
                                            color: #999;
                                            text-align: right;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .order-num{
                        color: #888;
                        font-size: 10px;
                        padding:10px 15px;
                    }
                }
                .ft{
                    .total{
                        font-size: 10px;
                        color: #353535;
                        text-align: right;
                        height: 32px;
                        line-height: 32px;
                        padding:0 15px;
                        :first-child{
                          margin-right: 4px;
                        }
                    }
                    .btns{
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        padding: 10px 0;
                    }
                    .style-default{
                        width: 71px;
                        height: 25px;
                        border-radius:15px;
                        border: 1px solid #ccc;
                        font-size: 14px;
                        text-align: center;
                        line-height: 25px;
                        margin-right: 10px;
                        color: #666;
                        &.red{
                            border-color: #f22a15;
                            color: #f22a15;
                        }
                    }
                }
            }
        }
    }
</style>
