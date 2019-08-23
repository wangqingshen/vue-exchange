<template>
    <div class="wrapper" v-title="pageTitle" v-show="showPage">
        <div class="shopCar-inner" >
            <div class="shop-store-list" v-if="!noData">
                <div class="shop-store-item" v-for="(storeItem,index) in shopCarData" :key="index">
                    <div class="store">
                        <div class="store-hd">
                            <div class="store-hd-l">
                                <div class="check-box" @click="storeAllCheckFun(index)">
                                    <van-checkbox v-model="storeItem.checked"></van-checkbox>
                                </div>
                                <div class="store-name">
                                    <div class="shop-icon"></div>
                                    <div class="name">{{storeItem.store_name}}</div>
                                </div>
                            </div>
                            <div class="store-hd-r" @click="isEdit = !isEdit">{{isEdit ? '完成': '编辑'}}</div>
                        </div>
                        <div class="store-bd">
                            <div class="store-goods-list">
                                <div class="store-goods-item" v-for="(goodsItem,index2) in storeItem.goods" :key="index2">
                                    <div class="check-box" @click="checkItemFun(index,index2)">
                                        <van-checkbox v-model="goodsItem.checked"></van-checkbox>
                                    </div>
                                    <div class="goods-info">
                                        <div class="pic">
                                            <img v-lazy="goodsItem.goods_img" alt="">
                                        </div>
                                        <div class="info">
                                            <div class="desc">{{goodsItem.goods_name}}</div>
                                            <div class="type">商品规格：{{goodsItem.sku_name}}</div>
                                            <div class="total">
                                                <div class="price">￥{{goodsItem.goods_price}}</div>
                                                <div class="input-number">
                                                    <van-stepper :integer="true" v-model="goodsItem.goods_num" :max="goodsItem.goods_stock"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="">购物车是空的~</div>
                <div class="g-btn" @click="goGoodsList">去逛逛</div>
            </div>
        </div>

        <transition name="animation" v-if="!noData">
            <div class="fixed-shopCarBar" v-if="!isEdit">
                <div class="bar-l">
                    <div class="all-check" @click="allCheckFun">
                        <div class="check-box">
                            <van-checkbox v-model="allChecked">全选</van-checkbox>
                        </div>
                    </div>
                    <div class="total-price">
                        <div class="txt">合计：<span class="price">￥{{total}}</span></div>
                        <div class="desc">不含运费</div>
                    </div>
                </div>
                <div class="bar-r">
                    <div class="pay-btn" @click='goPayFun' :class="[isTotalComputed ? '' : 'dis']">去结算</div>
                </div>
            </div>
        </transition>

        <transition name="animation" v-if="!noData">
            <div class="fixed-shopCarBar" v-if="isEdit">
                <div class="bar-l">
                    <div class="all-check" @click="allCheckFun">
                        <div class="check-box">
                            <van-checkbox v-model="allChecked">全选</van-checkbox>
                        </div>
                    </div>
                </div>
                <div class="bar-r">
                    <div class="pay-btn" @click="removeArrFun" :class="[isTotalComputed ? '' : 'dis']">删除</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default{
        name:'ownIndex',
        data(){
            return{
                member_id:'',
                pageTitle:'购物车',
                select:'shopCar',
                allChecked:false,
                isTotal:false,
                isEdit:false,
                userInfo:'',
                shopCarData:[{"store_name":"回归测试店铺","goods":[{"cart_id":12,"sku_id":4,"goods_num":1,"sku_name":"黑色,xl","goods_price":"0.01","goods_stock":100,"spu_id":9,"goods_name":"回归测试拼团商品1","goods_img":"http://wuxing.wsyjcs.cn/pic/wuxingadmin/20181011/5435946d015b3c47eda2f79919c11bef.jpg","store_id":2,"store_name":"回归测试店铺"}]}],
                noData:true,
                showPage: false,
                shopCarNum:0
            }
        },
        components:{},
        computed:{
            isTotalComputed(){
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    item.goods.forEach(item=>{
                        allGoodsItemArr.push(item)
                    })
                })
                let someCheckItem = allGoodsItemArr.some((item,index)=>{
                    return item.checked
                })

                if(someCheckItem){
                    this.isTotal = true
                    return true
                }else {
                    this.isTotal = false
                    return false
                }
            },

            total(){
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    item.goods.forEach(item=>{
                        allGoodsItemArr.push(item)
                    })
                })
                let checkItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        return item
                    }
                })

                let price = checkItem.reduce((prev, curr) => {
                    return curr.goods_price * curr.goods_num + prev
                }, 0)
                return price.toFixed(2)
            }
        },
        watch:{

        },
        methods:{
            goPage(url){
                this.select = url
                this.$router.replace({path:`/${url}`})
            },
            goGoodsList(){
                this.$router.replace({name:'category'})
            },
            storeAllCheckFun(index){
                if(this.shopCarData[index].checked){
                    this.shopCarData[index].goods.forEach(item=>{
                        item.checked = true
                    })
                }else {
                    this.shopCarData[index].goods.forEach(item=>{
                        item.checked = false
                    })
                }
                this.isStoreAllCheck()

            },
            isStoreAllCheck(){
                let storeAllCheck = this.shopCarData.every(item=>{
                    return item.checked
                })
                if(storeAllCheck){
                    this.allChecked = true
                }else {
                    this.allChecked = false
                }
            },
            checkItemFun(index,index2){
                let isAllCheck = this.shopCarData[index].goods.every((item,index)=>{
                    return item.checked === true
                })
                if(isAllCheck){
                    this.shopCarData[index].checked = true
                }else {
                    this.shopCarData[index].checked = false
                }
                this.isStoreAllCheck()
            },
            allCheckFun(){
                if(this.allChecked){
                    this.shopCarData.forEach((item,index)=>{
                        item.checked = true
                        item.goods.forEach((item,index)=>{
                            item.checked = true
                        })
                    })
                }else {
                    this.shopCarData.forEach((item,index)=>{
                        item.checked = false
                        item.goods.forEach((item,index)=>{
                            item.checked = false
                        })
                    })
                }
            },
            getCarList(){
                this.$api.cartList({
                    cmd:{
                        cart:"cartlist"
                    },
                    data:{
                        member_id:this.member_id
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
                        this.shopCarData = res.data.good
                        if(this.shopCarData.length === 0){
                            this.noData = true
                        }else{
                            this.noData = false
                        }
                        this.showPage = true
                    }
                }).then(res=>{
                    this.shopCarData.map((item,index)=>{
                        this.$set(item,'checked',false)
                        item.goods.forEach((item,index)=>{
                            this.$set(item,'checked',false)
                        })
                    })

                }).catch(err=>{

                })
            },
            goPayFun(){
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    item.goods.forEach(item=>{
                        allGoodsItemArr.push(item)
                    })
                })

                let checkItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        return item
                    }
                }).map(item=>{
                    return {
                        sku_id:item.sku_id,
                        goods_num:item.goods_num,
                        activity_type:item.activity_type||''
                    }
                })
//                let o ={}
//                for( let i of checkItem){
//                    o[i.sku_id] = i.goods_num
//                }
//                let submitOrderId = o
                let order_goods = JSON.stringify(checkItem)
                if(this.isTotal){
                    this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '提交订单中'
                    })
                    let second = 2;
                    const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer)
                            this.$toast.clear()
                            let payWay = {
                                type:'order_sn',
                                goodsType:0
                            }
                            this.$store.dispatch('setPayWay',payWay)
                            this.$store.dispatch('setOrderGoods',order_goods)
                            this.$store.dispatch('setSelAddress',false)
                            this.$store.commit('SET_SEL_ADDRESS_INDEX','-1')
                            localStorage.removeItem('isSelIndex')
                            this.$router.push({name:'submitOrder',params:{order_goods:order_goods}})
                        }
                    }, 1000)

                }
            },
            changeCarNum() {
                let carItemKeyArr = []
                this.shopCarData.forEach((item)=>{
                    item.goods.forEach((item)=>{
                        carItemKeyArr.push(item)
                    })
                })
                carItemKeyArr = carItemKeyArr.map((item=>{
                    let {cart_id,goods_num} = item
                    return {
                        cart_id,
                        goods_num
                    }
                }))
                let o ={}
                for( let i of carItemKeyArr){
                    o[i.cart_id] = i.goods_num
                }
                return o
            },
            removeArrFun(){
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    item.goods.forEach(item=>{
                        allGoodsItemArr.push(item)
                    })
                })
                let checkItemIdArr = allGoodsItemArr.filter((item)=>{
                    if(item.checked){
                        return item
                    }
                }).map((item)=>{
                    return item.cart_id
                })
                if(this.isTotal){
                    this.$dialog.confirm({
                        title: '',
                        message: `确定删除${checkItemIdArr.length}件商品吗？`
                    }).then(() => {
                        this.$api.removeShopItem({
                            cmd:{
                                cart:"delcart"
                            },
                            data:{
                                cart_id:checkItemIdArr
                            },
                            method:'POST'
                        }).then(res=>{
                            this.getCarList()
                            console.log(res)
                        }).catch(err=>{

                        })
                    }).catch(() => {

                    })
                }

            }

        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.getCarList()
        },
        mounted(){
            //模板编译挂载后

        },
        destroyed(){
            let carIdArr = this.changeCarNum()
            this.$api.changeCarGoodsNum({
                cmd:{
                    cart:"changegoodsnum"
                },
                data:{
                    cart:carIdArr
                },
            }).then(res=>{
                console.log(res)
            }).catch(err=>{
            })
        },


    }
</script>
<style lang="scss" type="text/scss">
    .animation-enter-active, .animation-leave-active {
        transition: all .5s;
    }
    .animation-enter,.animation-leave-to{
        transform: translateY(200%);
        opacity: 0;
    }
    .animation-enter-to,.animation-leave{
        transform: translateY(0);
        opacity: 1;
    }

    .shopCar-inner{
        padding-bottom: 50px;
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
               background: url(../../assets/images/pic_shop@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
            .g-btn{
                width:80px;
                height:35px;
                font-size: 15px;
                line-height: 35px;
                text-align: center;
                background:#fff;
                border:1px solid #888;
                border-radius:6px;
                margin-top: 25px;
            }
        }
        .shop-icon{
            background: url(../../assets/images/shop_icon.png) no-repeat;
            width: 18px;
            height: 18px;
            background-size: contain;
        }
        .shop-store-item{
            margin-bottom: 12px;
            background: #fff;
            color: #000;
            .store-hd{
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;
                font-size: 14px;
                border-bottom: 1px solid #ededed;
            }
            .store-hd-l{
                display: flex;
                align-items: center;
                flex-grow: 1;
            }
            .store-name{

                font-weight: 700;
                display: flex;
                align-items: center;
                margin-left: 10px;
                flex-grow: 1;
                .name{
                    margin-left: 6px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 240px;
                    text-align:left;
                }
            }
            .store-hd-r{
                color: #F32D16;
                flex-shrink: 0;
            }
            .store-goods-list{
                padding-left: 15px;
                //padding-bottom: 15px;
            }
            .store-goods-item{
                display: flex;
                align-items: center;
                .goods-info{
                    display: flex;
                    margin-left: 10px;
                    padding: 15px 15px 15px 0;
                    flex-grow: 1;
                }
                &:not(:last-child) {
                    border-bottom: 1px solid #ededed;
                }
                .pic{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f5f5f5;
                    height: 84px;
                    width: 84px;
                    border-radius: 3px;
                    overflow: hidden;
                    flex-shrink: 0;
                    img {
                        width: auto;
                    }
                }
                .info{
                    margin-left:10px;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .desc{
                    font-size:13px;
                    color: #000;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp:2;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    height: 35px;
                    text-align:left;
                }
                .type{
                    font-size: 10px;
                    color: #888;
                    text-align:left;
                }
                .total{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .price{
                    color: #F32D16;
                    font-size: 18px;
                    line-height: 1;
                }
            }
        }
    }
    .fixed-shopCarBar{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        display: flex;
        height: 50px;
        .bar-l{
            padding: 0 8px 0 15px;
            font-size: 13px;
            color: #353535;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-grow: 1;
            .all-check{
                height: 50px;
                display: flex;
                align-items: center;
            }
        }
        .total-price{
            text-align: right;
            .txt{
                font-size: 14px;
                color: #000;
                font-weight: 700;
            }
            .price{
                color: #F32D16;
                font-size: 17px;
            }
            .desc{
                font-size: 11px;
                color: #353535;
            }
        }
        .bar-r{
            .pay-btn{
                width: 120px;
                height: 50px;
                background: #F32D16;
                line-height: 50px;
                color: #FFF;
                text-align: center;
                font-size: 17px;
                &.dis{
                    background: #ededed;
                }
            }
        }
    }


</style>
