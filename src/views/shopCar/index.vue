<template>
    <div class="shopcar-wrapper" :class="!noData?'bg':''">
        <div class="shopCar-inner">
            <MyLoading :isloading="isloading"></MyLoading>
            <div class="shop-store-list" v-if="!noData">
                <div class="shop-store-item" v-for="(storeItem,index) in shopCarData" :key="index">
                    <div class="store">
                        <div class="store-hd">
                            <div class="store-hd-l">
                                <div class="check-box" @click="storeAllCheckFun(index,storeItem)">
                                    <input type="checkbox" v-model="storeItem.checked" :class="storeItem.checked?'checked':''"/>
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
                                <div class="" v-for="(spuItem,index2) in storeItem.spu" :key="index2">
                                    <div class="store-goods-item" v-for="(goodsItem,index3) in spuItem.sku" :key="index3">
                                        <div class="check-box" @click="checkItemFun(index, goodsItem)">
                                            <input type="checkbox" v-model="goodsItem.checked" :class="goodsItem.checked?'checked':''"/>
                                        </div>
                                        <div class="goods-info">
                                            <div class="pic lazy-img">
                                                <img v-lazy="goodsItem.goods_img" alt="">
                                            </div>
                                            <div class="info">
                                                <div class="desc">{{goodsItem.goods_name}}</div>
                                                <div class="type" v-if="goodsItem.sku_name">商品规格：{{goodsItem.sku_name}}</div>
                                                <div class="total">
                                                    <div class="price">￥{{goodsItem.goods_price}}</div>
                                                    <div class="input-number">
                                                        <van-stepper :integer="true" v-model="goodsItem.goods_num" :max="goodsItem.goods_stock" min="1"/>
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
            </div>
            <div class="no-data" v-else>
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
                            <input type="checkbox" v-model="allChecked" :class="allChecked?'checked':''"><span>全选</span></input>
                        </div>
                    </div>
                    <div class="total-price">
                        <div class="txt">合计：<span class="price">￥{{total}}</span></div>
                        <div class="desc">不含运费</div>
                    </div>
                </div>
                <div class="bar-r">
                    <div class="pay-btn" @click='goPayFun' :class="[submitIsTotal ? '' : 'dis']">去结算</div>
                </div>
            </div>
            <div class="fixed-shopCarBar" v-else>
                <div class="bar-l">
                    <div class="all-check" @click="allCheckFun">
                        <div class="check-box">
                            <input type="checkbox" v-model="allChecked" :class="allChecked?'checked':''"><span>全选</span></input>
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
    import MyLoading from '@/components/my-loading'
    export default{
        name:'shoppingCar',
        data(){
            return{
                member_id:'',
                select:'shopCar',
                allChecked:false,
                isTotal:false,
                isEdit:false,
                submitIsTotal: false,
                userInfo:'',
                shopCarData:[],
                noData:true,
                shopCarNum:0,
                isloading: true
            }
        },
        components:{MyLoading},
        computed:{
            isTotalComputed(){
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
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
                this.submitIsTotal = this.mergePrice()
                let allGoodsItem = this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
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
            mergePrice(){
                let allGoodsItemArr = [],
                    arr = [],
                    arr1 = [],
                    status = true
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })
                allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        let spuId = item.spu_id
                        let flag = true 
                        this.shopCarData.map((_item,_index)=>{
                            if(_item.spu[spuId] != undefined && Object.keys(_item.spu[spuId].wholesale_set).length){
                                let flag = true 
                                for(var i in arr) {
                                    if(arr[i].id == spuId) {
                                        arr[i].num += item.goods_num
                                        return false
                                    }
                                }
                                if(flag == true) {
                                    let obj = {}
                                    obj.id = spuId
                                    obj.num = item.goods_num
                                    obj.wholesale_set = _item.spu[spuId].wholesale_set
                                    arr.push(obj)
                                }
                            }else if(_item.spu[spuId] != undefined && !Object.keys(_item.spu[spuId].wholesale_set).length){
                                arr1.push(item)
                            }   
                        })
                    }
                })
                if(arr.length) {
                    arr.map((item, index)=>{
                        let num = item.num,
                            id = item.id,
                            mode = item.wholesale_set.price_mode,
                            wholesaleNum = item.wholesale_set.wholesale_set
                        if(mode == 1) {
                            let price
                            wholesaleNum.forEach((item, index)=>{
                                if(num>= item.num) {
                                    price = item.price
                                }
                            })
                            if(num < wholesaleNum[0].num) {
                                price =  wholesaleNum[0].price   
                                status = false
                            }
                            this.shopCarData.map((_item,_index)=>{
                                if(_item.spu[id] != undefined) {
                                    _item.spu[id].sku.map((skuItem,skuIndex)=>{
                                        skuItem.goods_price = price
                                    })
                                }
                                
                            })

                        }else if(mode == 2){
                            if(num<wholesaleNum) status = false
                        }
                    })
                }else if(!arr1.length) {
                    status = false
                }

                return status
            },
            goPage(url){
                this.select = url
                this.$router.replace({path:`/${url}`})
            },
            goGoodsList(){
                this.$router.replace({name:'category'})
            },
            storeAllCheckFun(index,storeItem){
                storeItem.checked = !storeItem.checked
                let checkedFlag = this.shopCarData[index].checked ? true : false
                for(var i in this.shopCarData[index].spu){
                    this.shopCarData[index].spu[i].sku.map(item =>{
                        item.checked = checkedFlag
                    })
                }
                this.isStoreAllCheck()

            },
            isStoreAllCheck(){
                let storeAllCheck = true
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map(_item=>{
                            if(!_item.checked) {
                                storeAllCheck = false
                                return
                            }
                        })
                    }
                })
                this.allChecked = storeAllCheck
            },
            checkItemFun(index, goodsItem){
                let isAllCheck = true
                goodsItem.checked = !goodsItem.checked
                console.log(this.shopCarData[index], goodsItem.checked)
                for(var i in this.shopCarData[index].spu){
                    this.shopCarData[index].spu[i].sku.map(item=>{
                        console.log(item.checked)
                        if(item.checked === false) isAllCheck = false
                    })
                }
                this.shopCarData[index].checked = isAllCheck
                this.isStoreAllCheck()
            },
            allCheckFun(){
                this.allChecked = !this.allChecked
                this.shopCarData.forEach(item=>{
                    item.checked = this.allChecked
                    for(var i in item.spu) {
                        item.spu[i].sku.map(_item=>{
                            _item.checked = this.allChecked
                        })
                    }
                })
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
                        setTimeout(()=>{
                            this.isloading = false
                        },500)
                        this.shopCarData = res.data.good
                        if(this.shopCarData.length === 0){
                            this.noData = true
                        }else{
                            this.noData = false
                        }
                    }
                }).then(res=>{
                    this.shopCarData.map((item,index)=>{
                        this.$set(item,'checked',false)
                        for(var i in item.spu) {
                            item.spu[i].sku.forEach((item, index)=>{
                                this.$set(item,'checked',false)
                            })
                        }
                    })

                }).catch(err=>{

                })
            },
            goPayFun(){
                if(!this.submitIsTotal) return
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })

                let checkItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        return item
                    }
                }).map(item=>{
                    return {
                        sku_id:item.sku_id,
                        goods_num:item.goods_num
                    }
                })

                let order_goods = JSON.stringify(checkItem)
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

            },
            changeCarNum() {
                let carItemKeyArr = []
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            carItemKeyArr.push(item)
                        })
                    }
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
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
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

    .shopcar-wrapper{
        min-height: 100vh;
        background: #fff;
        &.bg{
            background: #f5f5f5;
        }
        .shopCar-inner{
            padding-bottom: 60px;
            .no-data{
                font-size:14px;
                color: #666;
                display: flex;
                flex-direction: column;
                align-items: center;
                // padding-top: 120px;
                padding-top: 50%;
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
                margin-top: 4px;
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
                    border-bottom: 1px solid #f5f5f5;
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
                        border-bottom: 1px solid #f5f5f5;
                    }
                    .pic{
                        height: 84px;
                        width: 84px;
                        border-radius: 3px;
                        overflow: hidden;
                        flex-shrink: 0;
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
                        align-items: flex-end;
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
            border-top: 1px solid #f5f5f5;
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
        .check-box{
            display: flex;
            justify-content: center;
            align-items: center;
            input[type="checkbox"]{
                display: inline-block;
                width: 20px;
                height: 20px;
                color: transparent;
                text-align: center;
                line-height: inherit;
                box-sizing: border-box;
                border: 1px solid #e5e5e5;
                -webkit-transition: .2s;
                transition: .2s;
                border-radius: 100%;
                &:checked{
                    position: relative;
                    background-color: #d0021b;
                    border-color: #d0021b;
                    font: 14px/1 vant-icon;
                    font-size: inherit;
                    text-rendering: auto;
                    -webkit-font-smoothing: antialiased;
                    &:after{
                        display: inline-block;
                        top: 50%;
                        position: absolute;
                        left: 50%;
                        -webkit-transform: translate(-50%,-50%);
                        transform: translate(-50%,-50%);
                        content: "\F0C1";
                        color: #fff;
                        font-size: 14px;
                    }
                }
            }
            >span{
                color: #323233;
                margin-left: 10px;
            }
        }
    }


</style>
