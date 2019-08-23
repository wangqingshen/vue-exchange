<template>
    <div class="sellList-wrapper" v-title="pageTitle">
            <!-- 列表 -->
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="sellList" :offset="offset" v-if="sellData.length">
                <div class="sell-item" v-for="(item, index) in sellData" :key="index">
                    <div class="order-status">{{item.order_state === 1?'拍下成功，待买家付款':(item.order_state === 2?'支付成功，待发货':(item.order_state === 3?'卖家已发货，买家待收货':(item.order_state === 4?'交易成功':'交易取消')))}}</div>
                    <div class="good-info" @click="PageOrderDetail(item.order_id)">
                        <div class="good-pic">
                            <img v-lazy="item.goods_img">
                        </div>
                        <div class="good-desc">
                            <div class="good_name">{{item.spu_name}}</div>
                            <div class="price">¥{{item.order_amount}}</div>
                        </div>
                    </div>
                    <div class="fun-btn">
                        <div class="btn-item" @click="buyer(item.buy_member_id)">联系买家</div>
                        <div class="btn-item active" v-show="item.order_state === 1 || item.order_state === 2 || (item.order_state === 3 && item.delivery_way ===1) || (item.order_state === 4 && item.delivery_way === 1)" @click="btnEvt(item,item.order_state)">{{item.order_state === 1?'修改价格':(item.order_state === 2?'确认发货': (item.order_state ===3 || item.order_state === 4?'查看物流':''))}}</div>
                    </div>
                </div>
                <noMore :finished="finished"></noMore>
            </van-list> 
            <!-- 缺省图    -->
            <div class="default" v-else>
                <div class="default-pic">
                    <img src="../../assets/images/pic_money@2x.png">
                </div>
                <div class="default-info">暂无卖出订单</div>
            </div>
            <!-- 弹出发货 -->
            <van-popup v-model="delivery_show" class="delivery-popup" overlay-class="delivery-modal">
                <div class="close" @click="delivery_show = false">
                    <div class="pic"></div>
                </div>
                <div class="cell">
                    <p>请选择发货方式</p>
                    <div class="fun-btn">
                        <div class="btn-item" @click="PageDelivery(currentItem.order_id)">快递物流</div>
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
                        <div class="btn-item face" @click="conformFace(currentItem)">确认当面交易</div>
                    </div>
                </div>
            </van-popup>
    </div>
</template>

<script>
    import noMore from '@/components/no-more'
    export default {
        data(){
            return {
                pageTitle: '我卖出的',
                loading: false,
                finished: true,
                offset: 50,
                isMore: false,
                noData: '',
                member_id: '',
                page: 1,
                sellData: [],
                delivery_show: false,
                face_show: false,
                currentItem: {},
            }
        },
        components: {
            noMore
        },
        methods:{
            PageOrderDetail(id){
                this.$router.replace({name: 'orderDetails', params:{order_id: id}})
            },
            buyer(id){
                this.$router.push({name: 'chat',params: {member_id: this.member_id, to_user_id: id}})
            },
            btnEvt(item,status){
                console.log(status)
                if(status === 1){
                    console.log(item.order_id)
                    this.$router.push({name: 'modifyPrice', params: {order_id: item.order_id}})
                }else if(status === 2){
                    this.delivery_show = !this.delivery_show
                    this.currentItem = item
                }else{
                    console.log('查看物流')
                    this.$router.push({name: 'logistics', params: {order_id: item.order_id}})
                }
            },
            // cancel(){
            //     this.delivery_show = false
            // },
            PageDelivery(id){
                let delivery_info = {
                    order_id: id,
                    member_id: this.member_id,
                    delivery_way: 1
                }
                this.$router.push({name: 'deliveryWay', params: {delivery_info: JSON.stringify(delivery_info), state: 2}})
            },
            faceToface(){
                this.delivery_show = false
                this.face_show = !this.face_show
            },
            // thinkTwice(){
            //     this.face_show = false
            // },
            conformFace(currentItem){
                this.face_show = false
                console.log(currentItem)
                this.$api.deliverWay({//设置发货
                        cmd:{
                            order:'SetDeliveryWay'
                        },
                        data: {
                            member_id: this.member_id,
                            order_id: currentItem.order_id,
                            delivery_way: 2
                        }
                    }).then(res=>{
                        console.log(res,'deliveryWay')
                        if(res.code === 1){
                            this.sellList()
                        }
                    }).catch(() => {

                })
            },
            loadMore(){
                if(!this.finished && this.isMore){
                    if(this.sellList.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.sellList({page:this.page})
                        },500)
                    }

                }
            },
            sellList({page = 1} = {}){
                this.$api.sellOrerList({
                    cmd:{
                        order:'getMemberSellOrder'
                    },
                    data:{
                        member_id: this.member_id,
                        page: this.page
                    },
                }).then(res=>{
                    console.log(res,'res')
                    if(res.code===1){
                        if(this.page == 1) {
                            this.sellData = res.data.data
                        }else{
                            this.sellData = [...this.sellData,...res.data]
                        }
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.length < 10){
                            this.finished = true
                        }
                        if(this.sellData.length === 0){
                            this.noData = true
                        }
                        // console.log(this.sellData,'sellData')
                    }
                }).catch(err=>{

                })
            },
        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id;
            this.sellList()
        },
        mounted() {
            
        },
    }
</script>

<style lang="scss" type="text/scss">
    .sellList-wrapper{
        .sellList{
            padding: 0 15px;
            .sell-item{
                height: 180px;
                background: #FFF;
                margin-top: 10px;
                padding: 0 10px;
                font-size: 14px;
                color: #333;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                .good-info{
                    display: flex;
                    .good-pic{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100px;
                        height: 100px;
                        background: #f5f5f5;
                        border-radius: 4px;
                        flex-shrink: 0;
                        margin-right: 12px;
                        img {
                            height: 100%;
                        }
                    }
                    .good-desc{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .good_name{
                            white-space: normal;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                        }
                        .price{
                            color: #F32D16;
                        }
                    }
                }         
                .fun-btn{
                    display: flex;
                    align-self: flex-end;
                    .btn-item{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 71px;
                        height: 25px;
                        border-radius: 15px;
                        border: 1px solid #ccc;
                        color: #666;
                        font-size: 12px;
                        margin-left: 10px;
                        &.active{
                            color: #F32D16;
                            border: 1px solid #F32D16;
                        }
                    }
                }
            }
        }
        .default{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 50%;
            font-size: 14px;
            color: #666;
            .default-pic{
                width: 130px;
                height: 90px;
                margin-bottom: 10px;
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
    }
</style>
