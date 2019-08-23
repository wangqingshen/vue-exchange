<template>
    <div class="wrap" v-title="pageTitle" v-show="pageShow">
        <div class="submitOrder-inner">
            <div class="address-box" @click="selAddressFun">
                <div class="sel-address-box" v-if="!addressFlag">
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
                    <div class="arrow-icon">
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="no-address" v-if="addressFlag">
                    <div class="inner">
                        <div class="location-icon">
                            <img src="../../assets/images/icon_coordinates@2x.png" />
                        </div>
                        <div class="txt">选择收货地址</div>
                    </div>
                </div>
            </div>
            <div class="person-orderList" v-if="payWay.goodsType === 3">
                <div class="person-order-head">
                    <img :src="goods_member_avatar" />
                    <span class="username">{{goods_member_name}}</span>
                </div>
                <section>
                    <div class="goods-img">
                        <img v-lazy="orderData.goods_img" />
                    </div>
                    <div class="goods-name">{{orderData.goods_name}}</div>
                    <div class="goods-info">
                        <div class="goods-price">￥{{orderData.goods_price}}</div>
                        <div class="goods-num">x{{orderData.goods_num}}</div>
                    </div>
                </section>
                <div class="person-foot">
                    <div class="row1">
                        <div>配送方式</div>
                        <div>快递物流</div>
                    </div>
                    <div class="row2">
                        <div class="num">共{{orderData.goods_num}}件商品</div>
                        <div>小计：<span class="price">￥{{orderData.goods_amount|toFixedTwo}}</span></div>
                    </div>
                </div>
            </div>
            <div class="store-orderList" v-if="payWay.goodsType !== 3">
                <div class="store-orderItem" v-for="(item,index) in orderData.order_goods" :key="index">
                    <div class="storeItem-hd vux-1px-b">
                        <div class="store-name">
                            <div class="shop-icon"></div>
                            <div class="name">{{item.store_name}}</div>
                        </div>
                    </div>
                    <div class="storedItem-bd">
                        <orderItem :orderItemData="item.order_goods"></orderItem>
                    </div>

                    <div class="storedItem-ft">
                        <div class="row1 vux-1px-b">
                            <div>配送方式</div>
                            <div>快递物流</div>
                        </div>
                        <div class="row2">
                            <div class="num">共{{item.goods_num}}件商品</div>
                            <div>小计：<span class="price">￥{{item.goods_amount|toFixedTwo}}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sel-coupons" @click="couponIsDialog = !couponIsDialog" v-if="payWay.goodsType === 0">
                <van-cell-group>
                    <van-cell>
                        <div class="label" slot="title">
                            <div class="">优惠券</div>
                            <div class="c-tag" v-if="checkCouponItem.length > 0">已选{{checkCouponItem.length}}张</div>
                        </div>
                        <div slot="right-icon"  class="right-icon">
                            <div class="value">优惠￥{{total.couponSale}}</div>
                            <van-icon name="arrow"/>
                        </div>
                    </van-cell>
                </van-cell-group>
            </div>
            <div class="total-box">
                <div class="cell">
                    <div class="key">商品总价</div>
                    <div class="value">￥{{orderData.goods_amount|toFixedTwo}}</div>
                </div>
                <div class="cell">
                    <div class="key">运费</div>
                    <div class="value">+￥{{orderData.shipping_fee|toFixedTwo}}</div>
                </div>
                <div class="cell" v-if="payWay.goodsType !== 3">
                    <div class="key">优惠劵</div>
                    <div class="value">-￥{{total.couponSale}}</div>
                </div>
            </div>

            <div class="submit-total">
                <div class="">合计：<span class="red">￥{{(payWay.goodsType !== 3 ? total.orderPrice : (Number(orderData.goods_amount) + Number(orderData.shipping_fee)))|toFixedTwo}}</span></div>
                <div class="submit-btn" @click="submitOrder">提交订单</div>
            </div>
        </div>
        <van-popup v-model="couponIsDialog" position="bottom" :overlay="true" class="couponDialog_order">
            <div class="hd">
                <div class="cell">
                    <div class="tit">优惠券</div>
                    <div class="close-icon" @click="couponIsDialog = !couponIsDialog">
                         <img src="../../assets/images/icon-select@2x.png" />
                    </div>
                </div>
                <div class="selCoupon-bar">
                    <div class="bar-inner">
                        <div class="items">
                            <div class="item" :class="{active:tabCardIndex === 0}" @click="tabCardIndex = 0">
                                <div class="txt">可用优惠券</div>
                                <div class="line"></div>
                            </div>
                            <div class="item" :class="{active:tabCardIndex === 1}" @click="tabCardIndex = 1">
                                <div class="txt">不可用优惠券</div>
                                <div class="line"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sub-txt">请选择优惠券</div>
            </div>
            <div class="bd">
                <div class="" v-if="tabCardIndex === 0">
                    <couponItem type="submitOrder" @emitCheckCoupon="checkCouponFun" :isCheck='true' :couponItemData="couponItemData" v-if="!noData"></couponItem>
                    <div class="no-data" v-if="noData">
                        <div class="pic"></div>
                        <div class="">暂无可使用优惠券~</div>
                    </div>
                </div>
                <div class="" v-if="tabCardIndex === 1">
                    <couponItem type="submitOrder" :isCheck='true' :couponItemData="couponItemData2" :state="couponState" v-if="!noData2"></couponItem>
                    <div class="no-data" v-if="noData2">
                        <div class="pic"></div>
                        <div class="">暂无可使用优惠券~</div>
                    </div>
                </div>
            </div>
            <div class="ft">
                <div class="l">已选{{checkCouponItem.length}}张，共抵扣<span class="p">{{total.couponSale}}</span>元</div>
                <div class="r" @click="couponIsDialog=!couponIsDialog">确认</div>
            </div>
        </van-popup>
    </div>
</template>
<script>
    import orderItem from '@/components/order-item'
    import addressItem from '@/components/address-item'
    import couponItem from '@/components/couponItem'
    export default{
        name:'ownIndex',
        data(){
            return{
                pageShow: false,
                pageTitle:'确认订单',
                addressFlag:false,
                order_id:'',
                member_id:'',
                userInfo:'',
                orderItemData:[
                    {pic:'../tempImg/img1.png',desc:'春款荷叶边拼接雪纺花瓣袖春款荷叶边拼接雪荷叶边拼接春款荷叶边拼接雪纺花瓣袖春款荷叶边拼接雪荷叶边拼接',type:'s,白色，套餐一',price:200.66,num:1},
                    {pic:'../tempImg/img1.png',desc:'辣鸡商品哦',type:'辣鸡商品哦',price:25.7,num:1}
                ],
                orderData:{},
                addressObj:{},
                couponIsDialog:false,
                orderPrice:'',
                couponItemData:[],
                couponItemData2:[],
                tabCardIndex:0,
                checkCouponItem:[],
                storeTotal:[],
                discount_id:[],
                payWay:'',
                noData:false,
                noData2:false,
                couponState:4,
                goods_member_name: '',
                goods_member_avatar: '',
                pay_btn_state: false
            }

        },
        components:{
            orderItem,
            addressItem,
            couponItem
        },
        computed:{
            total(){
                let assignArr = []
                this.storeTotal.forEach(item2=>{
                    this.checkCouponItem.forEach(item1=>{
                        if(item2.store_id === item1.store_id){
                            let assignObj = Object.assign({},item2,item1)
                            assignArr.push(assignObj)
                        }
                    })
                })
                let sale1sum = 0
                let sale2sum = 0
                let saleSum = 0

                this.discount_id = assignArr.map(item=>{
                    let {store_id, goods_amount, id} = item
                    return{
                        store_id,
                        id

                    }
                })

                assignArr.forEach(item=>{
                    if(item.discount_type === 2){
                        if(item.discount_highest_reduction !== '0.00'){
                            let sale = Math.abs((item.discount_rate/10)*item.goods_amount)
                            if(sale > Math.abs(item.discount_highest_reduction)){
                                console.log(sale,'2222')
                                sale1sum+= Math.abs(item.discount_highest_reduction)
                            }else {
                                sale1sum += Math.abs(item.goods_amount)-sale
                                if(sale1sum>Math.abs(item.discount_highest_reduction)){
                                    sale1sum = Math.abs(item.discount_highest_reduction)
                                }
                            }
                        }else {
                            sale1sum += Math.abs(item.goods_amount) - Math.abs((item.discount_rate/10)*item.goods_amount)
                        }


                    }else {
                        if(item.goods_amount<item.discount_price){
                            sale2sum += item.goods_amount

                        }else {
                            sale2sum += Math.abs(item.discount_price)
                        }

                    }

                })
                saleSum = sale1sum+sale2sum
                let orderPrice = this.orderData.order_amount - saleSum <= 0 ? 0: this.orderData.order_amount - saleSum
                return {
                    couponSale:parseFloat(saleSum).toFixed(2),
                    orderPrice:orderPrice
                }
            }
        },
        watch:{

        },
        methods:{
            isEmptyObject(arr) {
                var t
                for (t in arr)
                    return !1
                return !0
            },
            submitOrder(){
                if(Object.keys(this.addressObj).length !== 0){
                    this.pay_btn_state = true
                    this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '生成订单中'
                    })
                    if(this.pay_btn_state) {
                        this.$api.createOrder({
                            cmd:{
                                order:"createorder"
                            },
                            data:{
                                member_id:this.member_id,
                                order_goods:this.order_goods,
                                address_id:this.addressObj.address_id,
                                discount_id:this.discount_id
                            },
                        }).then(res=>{
                            this.$toast.clear()
                            if(res.code == 1) {
                                this.$router.replace({name:'payCashier',params:{order_num:res.data}})
                            }else{
                                console.log(res)
                                this.pay_btn_state = false
                                this.$toast.fail(res.msg)
                            }
                            
                        })
                    }
                    
                }else {
                    this.$toast.fail('请选择地址')
                }


            },
            selAddressFun(){
                localStorage.setItem('isSel', true)
                this.$router.replace({name:"addressList"})
                this.$store.dispatch('setSelAddress',true)
            },
            checkCouponFun(item,index){
                if(!item.dis){
                    if(!item.checked){
                        item.checked = true
                        let items = this.couponItemData.filter((couponItem,couponindex)=>{
                            if(item.store_id === couponItem.store_id && index !== couponindex){
                                return item
                            }
                        })
                        items.forEach(item=>{
                            item.dis= true
                        })
                    }else {
                        item.checked = false
                        let items = this.couponItemData.filter((couponItem,couponindex)=>{
                            if(item.store_id === couponItem.store_id && index !== couponindex){
                                return item
                            }
                        })
                        items.forEach(item=>{
                            item.dis= false
                        })
                    }
                }
                this.checkCouponItem = this.couponItemData.filter(couponItem=>{
                    if(couponItem.checked){
                        return item
                    }
                })
            },

            personConfirmInfo() {
                this.$api.goPay({//购物车结算
                    cmd:{
                        cart:"orderconfirm"
                    },
                    data:{
                        member_id:this.member_id,
                        order_goods:this.order_goods
                    },
                }).then(res=>{
                    console.log(res)
                    if(res.code == 1) {
                        this.pageShow = true
                        this.orderData = res.data
                        let {address} = res.data
                        if(Object.keys(address).length === 0 && Object.keys(this.$store.state.address).length === 0){
                            this.addressFlag = true
                        }else if(Object.keys(address).length === 0 && Object.keys(this.$store.state.address).length !== 0){
                            this.addressObj = this.$store.state.address
                        } else {
                            if(Object.keys(address).length !== 0){
                                this.addressObj = address
                            }
                            if(Object.keys(this.$store.state.address).length !== 0 && this.$store.state.isSel && Object.keys(address).length !== 0){
                                this.addressObj = this.$store.state.address
                            }
                        }
                        this.goods_member_name = res.data.goods_member.member_nick_name
                        this.goods_member_avatar = res.data.goods_member.member_avatar
                    }else{
                        this.pageShow = false
                        this.$dialog.alert({
                            message: res.msg + '，返回详情页'
                        }).then(() => {
                            this.$router.go(-1)
                        });

                    }
                }).catch(res=>{
                })
            },

            normalConfirmInfo() {
                this.$api.goPay({//购物车结算
                    cmd:{
                        cart:"orderconfirm"
                    },
                    data:{
                        member_id:this.member_id,
                        order_goods:this.order_goods
                    },
                }).then(res=>{
                    console.log(res, 444)
                    if(res.code ===1){
                        this.pageShow = true
                        this.orderData = res.data
                        let {address} = res.data
                        if(Object.keys(address).length === 0 && Object.keys(this.$store.state.address).length === 0){
                            this.addressFlag = true
                        }else if(Object.keys(address).length === 0 && Object.keys(this.$store.state.address).length !== 0){
                            this.addressObj = this.$store.state.address
                        } else {
                            if(Object.keys(address).length !== 0){
                                this.addressObj = address
                            }
                            if(Object.keys(this.$store.state.address).length !== 0 && this.$store.state.isSel && Object.keys(address).length !== 0){
                                this.addressObj = this.$store.state.address
                            }
                        }
                        this.storeTotal = this.orderData.order_goods.reduce((cur,prev)=>{
                            return cur.concat(prev)
                        },[])

                        let couponSpu_idArr = []
                        this.orderData.order_goods.forEach(item=>{
                            item.order_goods.forEach(item=>{
                               couponSpu_idArr.push(item.spu_id)
                            })
                        })

                        couponSpu_idArr = Array.from(new Set(couponSpu_idArr))
                        let amountArr = this.orderData.order_goods.map(item=>{
                            let {store_id,goods_amount} = item
                            return item.order_goods.map(item=>{
                                return {
                                    store_id,
                                    goods_amount,
                                    spu_id:item.spu_id
                                }
                            })
                        })

                        amountArr = amountArr.reduce(function(cur, next) {
                            return cur.concat(next)
                        }, [])
                        let obj = {}
                        amountArr = amountArr.reduce((cur,next) => {
                            obj[next.spu_id] ? "" : obj[next.spu_id] = true && cur.push(next)
                            return cur
                        },[])

                        return {couponSpu_idArr,amountArr}
                    }else{
                        this.pageShow = false
                        let msg = '详情页'
                        if(this.payWay.goodsType == 1) {
                            msg = '拼团列表页'
                        }else if(this.payWay.goodsType == 2){
                            msg = '秒杀列表页'
                        }
                        this.$dialog.alert({
                            message:  res.msg+'，返回'+msg
                        }).then(() => {
                            if(this.payWay.goodsType == 2) {
                                this.$router.push({name: 'secKill'})
                            }else if(this.payWay.goodsType == 1){
                                this.$router.push({name: 'groupList'})
                            }else{
                                this.$router.go(-1)
                            } 
                        });

                    }
                }).then(res=>{
                    this.$api.getOrderCoupon({
                        cmd:{
                            discount:'getorderdiscount'
                        },
                        data:{
                            member_id:this.member_id,
                            spu_id:res.couponSpu_idArr,
                            amount:res.amountArr
                        }
                    }).then(res=>{
                        console.log(res.data,'店铺优惠券')
                        this.couponItemData = res.data.doing.data
                        this.couponItemData.forEach(item=>{
                            this.$set(item,'checked',false)
                            this.$set(item,'dis',false)
                        })
                        this.couponItemData2 = res.data.noUse.data
                        if(this.couponItemData.length === 0){
                            this.noData = true
                        }
                        if(this.couponItemData2.length === 0){
                            this.noData2 = true
                        }

                    })
                }).catch(err=>{
                    
                })
            }


        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.payWay = this.$store.state.payWay
            if(Object.keys(this.$route.params).length === 0){
                this.order_goods =JSON.parse(this.$store.getters.getOrderGoods)
            }else {
                this.order_goods = JSON.parse(this.$route.params.order_goods)
            }

            if(this.payWay.goodsType == 3) {
                this.personConfirmInfo()
            }else{
                this.normalConfirmInfo()
            }

        },
        mounted(){

        },
        destroyed(){
        }


    }
</script>
<style lang="scss" type="text/scss">
    .submitOrder-inner{
        padding-bottom: 60px;
        .shop-icon{
            background: url(../../assets/images/shop_icon.png) no-repeat;
            width: 18px;
            height: 18px;
            background-size: contain;
            margin-right: 5px;
        }
        .address-box{
            position: relative;
            margin-bottom: 10px;
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
                // background: -webkit-repeating-linear-gradient( 135deg, #FFC5BC 0, #FFC5BC 20%, transparent 0, transparent 25%, #85C1FF 0, #85C1FF 45%, transparent 0, transparent 50% );
                // background: repeating-linear-gradient( -45deg, #FFC5BC 0, #FFC5BC 20%, transparent 0, transparent 25%, #85C1FF 0, #85C1FF 45%, transparent 0, transparent 50% );
                // background-size: 80px;
            }
        }
        .sel-address-box{
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size:14px;
            color: #353535;
            padding: 25px 15px;
            .location-icon{
                width: 30px;
                height: 30px;
                margin-right:18px;
            }
            .arrow-icon{
                width: 12px;
                height: 12px;
                margin-left:10px;
                .van-icon{
                    font-size: 12px;
                    color: #888;
                }
            }
            .address-info{
                flex-grow: 1;
            }
            .info{
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .area{
                font-size: 12px;
                color: #888;
                display: -webkit-box;
                white-space: normal;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }
        }
        .no-address{
            padding: 15px;
            .inner{
                border: 1px dashed #b2b2b2;
                display: flex;
                align-items: center;
                height: 62px;
                font-size:14px;
                color: #888;
                justify-content: center;
                .location-icon{
                    width: 18px;
                    height: 18px;
                    margin-right:10px;
                    .van-icon{
                        font-size: 18px;
                        color: #888;
                    }
                }
            }
        }
        .person-orderList {
            padding: 0 15px 10px;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 10px;
            .person-order-head {
                display: flex;
                align-items: center;
                padding: 10px 0;
                img {
                    width: 30px;
                    height: 30px;
                    margin-right: 5px;
                    border-radius: 50%;
                }
            }
            section {
                padding: 10px 0;
                display: flex;
                justify-content: space-between;
                .goods-img {
                    display: flex;
                    width: 100px;
                    height: 100px;
                    background: #f5f5f5;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    img {
                        height: 100%;
                    }
                }
                .goods-name {
                    margin-left: 8px;
                    margin-right: 30px;
                    overflow:hidden; 
                    text-overflow:ellipsis;
                    display:-webkit-box; 
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2; 
                    font-size: 14px;
                    line-height: 20px;
                    color: #333;
                    max-height: 40px;
                    flex: 1;
                }
                .goods-price {
                    font-size: 16px;
                    color:#333;
                    line-height: 20px;
                }
                .goods-num {
                    font-size: 12px;
                    color: #999;
                    line-height: 20px;
                    text-align:right;
                }
            }
            .person-foot {
                font-size: 12px;
                color: #333;
                .row1{
                    display: flex;
                    justify-content: space-between;
                    height: 30px;
                    align-items: center;
                }
                .row2{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 30px;
                    .num{
                        margin-right: 10px;
                    }
                    .price{
                        line-height: 1;
                        font-size: 14px;
                    }

                }
            }
        }
        .store-orderItem{
            margin-bottom: 10px;
            background: #fff;
            .storeItem-hd{
                padding: 0 15px;
                .store-name{
                    height: 44px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                }
                .name{
                    flex-grow: 1;
                    width: 240px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .storedItem-ft{

                font-size: 11px;
                color: #353535;
                .row1{
                    display: flex;
                    justify-content: space-between;
                    height: 30px;
                    align-items: center;
                    padding: 0 15px;
                }
                .row2{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 32px;
                    padding: 0 15px;
                    .num{
                        margin-right: 10px;
                    }
                    .price{
                        color: #f22a15;
                        line-height: 1;
                        font-size: 15px;
                    }

                }
            }
        }
        .sel-coupons{
            font-size:14px;
            margin-bottom: 10px;
            .label{
                display: flex;
                align-items: center;
                color: #353535;
                .c-tag{
                    border: 1px solid #FC441A;
                    border-radius: 5px;
                    padding:1px 2px ;
                    font-size: 10px;
                    color: #F22A15;
                    margin-left: 10px;
                }
            }
            .right-icon{
                display: flex;
                align-items: center;
                .van-icon{
                    font-size: 12px;
                    color: #888;
                }
                .value{
                    color: #888;
                    margin-right: 5px;
                }
            }
        }
        .total-box{
            padding: 10px 15px;
            background: #fff;
            font-size: 14px;
            color: #353535;
            .cell{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                &:last-child{
                    margin-bottom: 0;
                }
                .value{
                    flex-grow: 1;
                    text-align: right;
                }
            }
        }
        .submit-total{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            position: fixed;
            height: 50px;
            left: 0;
            bottom: 0;
            background: #fff;
            z-index: 99;
            padding-left:15px;
            font-size: 14px;
            color: #353535;
            .red{
                font-size: 18px;
                font-weight: 900;
                color: #f22a15;
            }
            .submit-btn{
                width: 118px;
                background: #F32D16;
                color: #fff;
                font-size: 17px;
                text-align: center;
                height: 50px;
                line-height: 50px;
            }
        }
    }
    .couponDialog_order{
        font-size: 14px;
        color: #353535;
        .no-data{
            font-size:15px;
            color: #888;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 40px;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 160px;
                height: 120px;
                background-size: 100%;
                margin-bottom: 15px;
            }
        }
        .hd{

            .cell{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 45px;
                padding: 0 15px;
                .close-icon{
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 45px;
                    font-size: 20px;
                    color: #888;
                    img {
                        width: 13px;
                        height: 13px;
                    }
                }
                .tit{
                    font-size: 18px;
                    color: #000;
                    font-weight: 900;
                }

            }
            .selCoupon-bar{

                .bar-inner{
                    position: relative;
                }
                .items{
                    display: flex;
                    align-items: center;
                    .item{
                        width: 50%;
                        height: 45px;
                        text-align: center;
                        line-height: 45px;
                        position: relative;
                        .txt{
                            margin-top: -4px;
                        }
                        .line{
                            height: 2px;
                            width: 100%;
                            background: transparent;
                        }
                        &.active{
                            color: #f22a15;
                            .line{
                                background: #F22A15;
                            }
                        }
                    }

                }

            }
            .sub-txt{
                font-size: 12px;
                color: #888;
                padding:  0 45px;
                height: 30px;
                line-height: 30px;
            }

        }
        .bd{
            background: #f4f4f4;
            height:300px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        .ft{
            display: flex;
            height: 50px;
            font-size: 15px;
            color: #353535;
            background: #fff;
            .l{
                flex-grow: 1;
                height: 50px;
                line-height: 50px;
                text-align: center;
                .p{
                    color: #F22A15;
                }

            }
            .r{
                width: 120px;
                background: #F22A15;
                color: #fff;
                height: 50px;
                line-height: 50px;
                text-align: center;

            }
        }
    }
</style>
