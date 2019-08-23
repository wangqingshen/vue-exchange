<template>
    <div class="wrapper" v-title="pageTitle">
        <myLoading :isloading="isloading"></myLoading>
        <div class="orderDetails-inner">
            <!-- 顶 -->
            <div class="orderDetails-top">
                <!-- 订单状态 -->
                <div class="order-status-box">
                    <div class="status-txt">
                        <div class="txt">{{statusTxt}}</div>
                        <div class="sub-txt">
                            <div class="row" v-if="orderDetailData.order_state===1">
                                <countDown :timeProps="orderDetailData.time_limit" @emitCountDownFun="countDownCancelOrder"></countDown>
                            </div>
                            <div class="row" v-if="orderDetailData.order_state===3 && async_flag">
                                <countDown :timeProps="confirm_time_limit" @emitCountDownFun="countDownCancelOrder" temp="4"></countDown>
                            </div>
                            <div class="cancel-txt" v-if="orderDetailData.order_state===5">超时未支付，系统自动取消</div>
                        </div>
                    </div>
                    <div class="status-icon">
                        <div :class="'status-icon'+orderDetailData.order_state"></div>
                    </div>
                </div>
                <!-- 物流 -->
                <div class="logistics-box vux-1px-b" v-show="orderDetailData.order_state === 3 || orderDetailData.order_state === 4">
                    <div :class="orderDetailData.delivery_way === 2 ? 'deal-icon2' : 'deal-icon1'"></div>
                    <div class="deal-info">
                        <div class="up">
                            <div class="way">交易方式：{{orderDetailData.delivery_way === 2 ? '线下当面交易' : '快递物流'}}</div>
                            <div class="company" v-show="orderDetailData.delivery_way !== 2">物流公司：{{orderDetailData.shipping_express_name}}</div>
                        </div>
                        <div class="below" v-show="orderDetailData.delivery_way !== 2">
                            <div class="order-num">快递单号：{{orderDetailData.shipping_code}}</div>
                        </div>
                    </div>
                </div>
                <!-- 地址 -->
                <div class="address-box">
                    <div class="location-icon">
                        <img src="../../assets/images/icon_coordinates@2x.png" />
                    </div>
                    <div class="address-info">
                        <div class="info">
                            <div class="name">收货人：{{addressObj.true_name}}</div>
                            <div class="phone">{{addressObj.mobile}}</div>
                        </div>
                        <div class="area">
                            <span>收货地址：</span>
                            <span>{{addressObj.address}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商品信息 中 -->
            <div class="orderDetails-md">
                <div class="orderDetails-info">                   
                    <div class="bd">
                        <orderItem :orderItemData="orderDetailData.order_goods"></orderItem>
                        <div class="sum">
                            <div class="sum-row">
                                <div class="cell">
                                    <div class="txt">商品总价</div>
                                    <div class="val">￥{{orderDetailData.goods_amount|toFixedTwo}}</div>
                                </div>
                                <div class="cell">
                                    <div class="txt">运费</div>
                                    <!-- <div class="val">￥{{orderDetailData.shipping_fee|toFixedTwo}}</div> -->
                                    <div class="val">￥{{orderDetailData.shipping_fee ? orderDetailData.shipping_fee : '0.00'}}</div>
                                </div>
                                <div class="cell" v-show="orderDetailData.preferential_amount">
                                    <div class="txt">优惠金额</div>
                                    <div class="val">-￥{{orderDetailData.preferential_amount|toFixedTwo}}</div>
                                </div>
                            </div>
                            <div class="sum-row2">
                                <div class="txt">订单总价</div>
                                <div class="val">￥{{orderDetailData.order_amount|toFixedTwo}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 订单信息 尾 -->
            <div class="orderDetails-ft">
                <div class="title">
                    <div class="txt">订单信息</div>
                </div>
                <div class="info-desc vux-1px-b">
                    <div class="li" v-if="orderDetailData.order_state !== 1 && orderDetailData.order_state !== 5">
                        <div class="label">支付方式：</div>
                        <div class="val">微信支付</div>
                    </div>
                    <div class="li">
                        <div class="label">订单编号：</div>
                        <div class="val">{{orderDetailData.order_sn}}</div>
                    </div>
                    <div class="li" v-if="orderDetailData.order_state===2 || orderDetailData.order_state===3 || orderDetailData.order_state===4">
                        <div class="label">支付单号：</div>
                        <div class="val">{{orderDetailData.pay_code}}</div>
                    </div>
                    <div class="li">
                        <div class="label">创建时间：</div>
                        <div class="val">{{orderDetailData.create_time|unixdate}}</div>
                    </div>
                    <div class="li" v-if="orderDetailData.order_state===2 || orderDetailData.order_state===3 || orderDetailData.order_state===4">
                        <div class="label">支付时间：</div>
                        <div class="val">{{orderDetailData.pay_time|unixdate}}</div>
                    </div>
                    <div class="li" v-if="orderDetailData.order_state===3 || orderDetailData.order_state===4">
                        <div class="label">发货时间：</div>
                        <div class="val">{{orderDetailData.shipping_time|unixdate}}</div>
                    </div>
                </div>
                <div class="store-type">
                    <div class="store-info">
                        <div class="icon" v-if="orderDetailData.order_deal_info === 2">
                            <img :src="!isCheckOwn ? orderDetailData.buy_member.member_avatar : orderDetailData.sell_member.member_avatar">
                        </div>
                        <div class="shop-icon" v-else></div>
                        <div class="name">{{orderDetailData.order_deal_info == 2 ? (!isCheckOwn ? orderDetailData.buy_member.member_nick_name : orderDetailData.sell_member.member_nick_name) : orderDetailData.store_name}}</div>
                    </div>
                    <div class="contact" v-show="orderDetailData.order_deal_info === 2" @click="contact()">
                        <div class="txt">{{!isCheckOwn? '联系买家' : '联系卖家'}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="orderDetails-btns">
            <div class="person-btn" v-if="orderDetailData.order_deal_info == 2">
                <div class="disabled-btn" v-if="isCheckOwn && orderDetailData.order_state===1" @click="cancelOrderFun">取消订单</div>
                <div class="confirm-btn" v-if="isCheckOwn && orderDetailData.order_state===1" @click="payFun">确认付款</div>
                <div class="confirm-btn" v-if="!isCheckOwn && orderDetailData.order_state===1" @click="modifyPrice">修改价格</div>
                <div class="confirm-btn" v-if="!isCheckOwn && orderDetailData.order_state===2" @click="delivery_show = !delivery_show">确认发货</div>
                <div :class="orderDetailData.order_state == 3 && isCheckOwn ? 'origin-btn' : 'confirm-btn'" v-if="orderDetailData.delivery_way===1 && (orderDetailData.order_state == 4 || orderDetailData.order_state == 3)" @click="PageLogistic">查看物流</div>
                <div class="confirm-btn" v-if="isCheckOwn && orderDetailData.order_state===3" @click="confirm">确认收货</div>
            </div>
            <div class="store-btns" v-else>
                <div class="logistics-btn" v-if="orderDetailData.order_state===1" @click="cancelOrderFun">取消订单</div>
                <div class="confirm-btn"  v-if="orderDetailData.order_state===1" @click="payFun">确认付款</div>
                <div class="logistics-btn" v-if="orderDetailData.order_state===3 || orderDetailData.order_state===4" @click="PageLogistic">查看物流</div>
                <div class="confirm-btn" v-if="orderDetailData.order_state===3" @click="confirm">确认收货</div>
            </div>
            
        </div>
         <!-- 弹出发货 -->
        <van-popup v-model="delivery_show" class="delivery-popup" overlay-class="delivery-modal">
            <div class="close" @click="delivery_show = false">
                <div class="pic"></div>
            </div>
            <div class="cell">
                <p>请选择发货方式</p>
                <div class="fun-btn">
                    <div class="btn-item" @click="PageDelivery">快递物流</div>
                    <div class="btn-item face" @click="faceToface">当面交易</div>
                </div>
            </div>
        </van-popup>
        <!-- 弹出当面交易 -->
        <van-popup v-model="face_show" class="delivery-popup" overlay-class="delivery-modal">
            <div class="cell">
                <p>请确认是否当面交易</p>
                <div class="fun-btn">
                    <div class="btn-item" @click="face_show = false">再想想</div>
                    <div class="btn-item face" @click="conformFace">确认当面交易</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
    import countDown from '@/components/countDown'
    import orderItem from '@/components/order-item'
    import myLoading from '@/components/my-loading'
    export default{
        name:'orderDetails',
        data(){
            return{
                pageTitle:'订单详情',
                orderItemData:[
                    {pic:'../tempImg/img1.png',desc:'春款荷叶边拼接雪纺花瓣袖春款荷叶边拼接雪荷叶边拼接春款荷叶边拼接雪纺花瓣袖春款荷叶边拼接雪荷叶边拼接',type:'s,白色，套餐一',price:200.66,num:1},
                    {pic:'../tempImg/img1.png',desc:'辣鸡商品哦',type:'辣鸡商品哦',price:25.7,num:1}
                ],
                order_id:'',
                userInfo: '',
                orderDetailData:{
                    shipping_code: '',//物流单号
                    sell_member: {
                        member_avatar: '',
                        member_nick_name: ''
                    },
                    buy_member: {
                        member_avatar: '',
                        member_nick_name: ''
                    },
                },
                addressObj:{},
                isloading:true,
                delivery_show: false,
                face_show: false,
                isCheckOwn: '',
                confirm_time_limit: 0,
                async_flag: false
            }
        },
        components:{
            countDown,
            orderItem,
            myLoading
        },
        computed:{
            statusTxt(){
                switch (this.orderDetailData.order_state){
                    case 1:
                        return '等待买家付款'
                        break;
                    case 2:
                        return '等待卖家发货'
                        break;
                    case 3:
                        return '卖家已发货'
                        break;
                    case 4:
                        return '订单已完成'
                        break;
                    case 5:
                        return '订单已取消'
                        break;
                    case 6:
                        return '已退款'
                        break;
                    case 7:
                        return '拼团中'
                        break;
                    case 8:
                        return '退款中'
                        break;
                }
            }
        },
        watch:{

        },
        methods:{
            orderDetails(){
                this.$api.orderDetail({//订单详情
                    cmd:{
                        order:'orderdetail',
                    },
                    data:{
                        order_id:this.order_id
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.orderDetailData = res.data
                        // console.log(this.orderDetailData.order_state)
                        setTimeout(()=>{
                            this.isloading = false
                        },500)
                        this.addressObj = this.orderDetailData.reciver_info || {}
                        if(res.data.order_state===3) {
                            this.getCommonSet(res.data.shipping_time)
                        }
                        let startTime = Math.round(new Date().getTime()/1000)
                        this.orderDetailData.time_limit = (this.orderDetailData.time_limit - startTime)*1000
                        if(res.data.order_deal_info == 2) {
                            this.userInfo.member_id == res.data.member_id ? this.isCheckOwn  = true : this.isCheckOwn = false
                        }
                    }
                }).then(res=>{

                }).catch(err=>{

                })
            },
            getCommonSet(t){
                this.$api.getCommonSet({//用户支付时长
                    cmd:{
                        "member":"getCommonSet"
                    },
                    data:{
                        'param_type': 4
                    }
                }).then(res=>{
                    if(res.code === 1){ 
                        this.async_flag = true
                        var time = res.data.time - t
                        if(time > res.data.confirm_time) {
                            this.$toast({message: '自动收货完成'})
                            // this.orderDetails()
                        }else{
                            this.confirm_time_limit = (res.data.confirm_time - time)*1000
                        }
                    }
                }).catch(err=>{

                })
            },
            contact(){
                if(this.isCheckOwn){
                    this.$router.push({name:'chat', params: {to_user_id: this.orderDetailData.sell_member_id}})
                }else{
                    this.$router.push({name:'chat', params: {to_user_id: this.orderDetailData.buy_member_id}})
                }
            },
            modifyPrice(){
                this.$router.push({name: 'modifyPrice', params: {order_id: this.orderDetailData.order_id}})
            },
            // delivery(){
            //     this.delivery_show = !this.delivery_show
            // },
            // cancel(){
            //     this.delivery_show = false
            // },
            PageDelivery(){
                let delivery_info = {
                    order_id: this.order_id, 
                    member_id: this.userInfo.member_id, 
                    delivery_way: 1
                }
                this.$router.push({name: 'deliveryWay', params: {delivery_info: JSON.stringify(delivery_info), state: 1}})
            },
            faceToface(){
                this.delivery_show = false
                this.face_show = !this.face_show
            },
            PageLogistic(){
                this.$router.push({name:'logistics',params:{order_id:this.orderDetailData.order_id}})
            },
            conformFace(){
                this.face_show = false
                this.$api.deliverWay({//设置发货
                        cmd:{
                            order:'SetDeliveryWay'
                        },
                        data: {
                            member_id: this.userInfo.member_id,
                            order_id: this.order_id,
                            delivery_way: 2
                        }
                    }).then(res=>{
                        console.log(res,'deliveryWay')
                        if(res.code === 1){
                            this.$toast.success({
                                duration: 2000,
                                forbidClick: true,
                                message:'发货成功'
                            })
                            this.orderDetails()
                        }
                    }).catch(() => {

                })
            },
            cancelOrderFun(){
                console.log(this.orderDetailData, 456)
                this.$api.cancelOrder({
                    cmd:{
                        order:'cancelOrder'
                    },
                    data:{
                        order_id:this.orderDetailData.order_id
                    }
                }).then(res=>{
                    console.log(res,'取消成功')
                    if(res.code===1){
                        setTimeout(()=>{
                            this.orderDetailData.order_state = 5
                            this.$toast.success({
                                forbidClick: true,
                                message:'取消订单成功'
                            })
                        },500)

                    }
                })
            },
            payFun(){
                let order_id =this.orderDetailData.order_id
                let payWay = {
                    type:'order_id',
                    goodsType:0
                }
                this.$store.dispatch('setPayWay',payWay)
                this.$router.push({name:'payCashier',params:{order_num:order_id}})
            },
            countDownCancelOrder(){
                this.orderDetails()
            },
            confirm(item){
                this.$dialog.confirm({
                    title: '',
                    message: `确定收货吗？`
                }).then(() => {
                    this.$api.confirmOrder({
                        cmd:{
                            order:'confirmorder'
                        },
                        data:{
                            order_id:this.orderDetailData.order_id
                        }
                    }).then(res=>{
                        if(res.code===1){
                            this.$toast.success({
                                duration: 2000,
                                forbidClick: true,
                                message:'收货成功'
                            })
                            this.orderDetailData.order_state = 4
                        }
                    })
                }).catch(() => {

                })
            }
        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.order_id = this.$route.params.order_id
            this.orderDetails()
        },
        mounted(){

        }
    }
</script>
<style lang="scss" type="text/scss">
    .orderDetails-inner{
        padding-bottom: 60px;
        color: #333;
        .orderDetails-top{
            margin-bottom: 10px;
            .order-status-box{
                background: url(../../assets/images/bg_top@2x.png) no-repeat;
                height:88px;
                background-size: cover;
                padding: 0 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                .status-txt{
                    font-size: 17px;
                    color: #fefefe;
                    .cancel-txt {
                        font-size: 14px;
                    }
                }
                .status-icon{
                    color: #fefefe;
                    .van-icon{
                        display: flex;
                        font-size: 27px;
                    }
                }
                .status-icon1{
                    height:55px;
                    width: 80px;
                    background: url(../../assets/images/daifukuan-bg.png) no-repeat;
                    background-size: contain;
                }
                .status-icon2{
                    height:60px;
                    width: 80px;
                    background: url(../../assets/images/dengfahuo-bg.png) no-repeat;
                    background-size: contain;
                }
                .status-icon3{
                    height:55px;
                    width: 75px;
                    background: url(../../assets/images/yifahuo-bg.png) no-repeat;
                    background-size: contain;
                }
                .status-icon4{
                    height:50px;
                    width: 50px;
                    background: url(../../assets/images/order-complete@2x.png) no-repeat;
                    background-size: contain;
                }
                .status-icon5{
                    height:50px;
                    width: 50px;
                    background: url(../../assets/images/order-cancel@2x.png) no-repeat;
                    background-size: contain;
                }
            }
             .logistics-box{
                display: flex;
                align-items: center;
                font-size:14px;
                padding: 15px;
                background: #fff;
                .deal-icon1{
                    width: 30px;
                    height: 30px;
                    background: url(../../assets/images/icon_logistics@2x.png) no-repeat;
                    background-size: contain;
                }
                .deal-icon2{
                    width: 30px;
                    height: 30px;
                    background: url(../../assets/images/icon_offline@2x.png) no-repeat;
                    background-size: contain;
                }
                .deal-info{
                    flex-grow: 1;
                    margin-left:18px;
                }
                .up{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                .below{
                    font-size: 12px;
                    word-break: break-all;
                }
            }
            .address-box{
                position: relative;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size:14px;
                padding: 15px;
                min-height: 1rem;
                &:after {
                    content: '';
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    position: absolute;
                    background: url('../../assets/images/pic_address@2x.png');
                    background-size: cover;
                    z-index: -1;
                    // background: -webkit-repeating-linear-gradient( 135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50% );
                    // background: repeating-linear-gradient( -45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50% );
                    // background-size: 80px;
                }
                .location-icon{
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                }
                .address-info{
                    flex-grow: 1;
                    margin-left: 18px;
                    .info{
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .area{
                        font-size: 12px;
                        word-break: break-all;
                        white-space: normal;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp:2;
                    }
                }
            }         
        }
        .orderDetails-md{
            margin-bottom: 10px;
            .orderDetails-info{
                background: #fff;
                .store-name{
                    display: flex;
                    align-items: center;
                    height: 44px;
                }
                .sum{
                    font-size:12px;
                    .sum-row{
                        padding: 10px 15px;
                    }
                    .cell{
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .sum-row2{
                        padding: 10px 15px;
                        padding-top: 0;
                        font-size: 14px;
                        display: flex;
                        justify-content: space-between;
                        .val{
                            font-size: 16px;
                            line-height: 1;
                        }
                    }
                }

            }
        }
        .orderDetails-ft{
            background: #fff;
            padding: 0 15px;
            .title{
                font-size: 14px;
                padding: 10px 0 5px 0;
            }
            .info-desc{
                font-size: 12px;
                color: #666;
                padding-bottom: 10px;
                .li{
                    display: flex;
                    margin-bottom: 5px;
                }
            }
            .store-type{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                .store-info{
                    display: flex;
                    font-size: 14px;
                    align-items: center;
                    .shop-icon{
                        width: 30px;
                        height: 30px;
                        background: url(../../assets/images/icon_shop@2x.png) no-repeat;
                        background-size: contain;
                    }
                    .icon{
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    .name{
                        margin-left: 5px;
                    }
                }
                .contact{
                    width: 71px;
                    height: 25px;
                    border: 1px solid #ccc;
                    border-radius: 15px;
                    color: #666;
                    font-size: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
    .orderDetails-btns{
        position: fixed !important;
        bottom: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        .store-btns {
            width: 100%;
            display: flex;
            .logistics-btn{
                width: 50%;
                flex-grow: 1;
                font-size: 17px;
                color: #888;
                background: #fff;
                height: 50px;
                line-height: 50px;
                text-align: center;
            }
            .confirm-btn{
                width: 50%;
                flex-grow: 1;
                font-size: 17px;
                color: #fff;
                background: #f22a15;
                height: 50px;
                line-height: 50px;
                text-align: center;
            }
        }
        
        .person-btn {
            display: flex;
            width: 100%;
            height: 50px;
            >div {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-size: 16px;
                color: #fff;
                &.disabled-btn {
                    background: #fff;
                    color: #999;
                }
                &.origin-btn {
                    background: #FFB30D;
                }
                &.confirm-btn {
                    background: #F32D16;
                }
            }
        }
    }
    .delivery-popup{
        width: 80%;
        background: transparent;
        .close{
            height: 51px;
            .pic{
                width: 21px;
                height: 21px;
                background-image: url(../../assets/images/btn_close_white@2x.png);
                background-size: contain; 
                position: absolute;
                right: 0;
            }
        }
        .cell{
            border-radius: 4px;
            background: #FFF;
            height: 160px;
            color: #333;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 116px;
                font-size: 16px;
            }
            .fun-btn{
                display: flex;
                font-size: 14px;
                .btn-item{
                    width: 50%;
                    height: 44px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #EDEDED;
                    &.face{
                        background: #F7F7F7;
                    }
                }
            }
        }
    }
</style>
