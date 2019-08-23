<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="payCashier-inner">
            <div class="pay-countDown">支付剩余时间
                <!--<span class="date">30:20</span>-->
                <div class="timeBox">
                    <countDown :timeProps="time" temp="2"  @emitCountDownFun="countDownEvt" v-if="async_flag"></countDown>
                </div>

            </div>
            <div class="payCashier-info">
                <div class="cell">
                    <div class="">订单时间</div>
                    <div class="r">{{cashierData.create_time}}</div>
                </div>
                <div class="cell">
                    <div class="">订单编号</div>
                    <div class="r">{{cashierData.order_sn}}</div>
                </div>
            </div>
            <div class="pay-way">
               <div class="hd vux-1px-b">支付方式</div>
                <div class="way-list">
                    <van-radio-group v-model="radio">
                        <div class="way-item vux-1px-b">
                            <div class="label">
                                <div class="wx-icon"></div>
                                <div class="">微信支付</div>
                            </div>
                            <van-radio name="wx"></van-radio>
                        </div>
                    </van-radio-group>
                </div>
            </div>
        </div>
        <div class="payCashier-ft">
            <div class="l">￥{{cashierData.order_amount | toFixedTwo}}</div>
            <div class="r" @click="payFun" >支付</div>
        </div>
    </div>
</template>
<script>
    import countDown from '@/components/countDown'
    export default{
        name:'',
        data(){
            return{
                pageTitle:'支付',
                radio:'wx',
                order_num:'',
                openid:'',
                payWay:'',
                disabledState: false,
                cashierData:{},
                userInfo:'',
                time: 0,
                async_flag: false
            }
        },
        components:{
            countDown
        },
        computed:{

        },
        watch:{

        },
        methods:{
            getPayTime(){
                this.$api.getCommonSet({//用户支付时长
                    cmd:{
                        "member":"getCommonSet"
                    },
                    data:{
                        'param_type': 3
                    }
                }).then(res=>{
                    if(res.code === 1){
                        this.async_flag = true
                        var time = res.data.time - new Date(this.cashierData.create_time.replace(/-/g,'/')).getTime()/1000
                        if(time > res.data.pay_time) {
                            this.$toast({message: '支付超时，返回订单列表页'})
                            this.$router.replace({name: 'buyList'})
                        }else{
                            this.time = (res.data.pay_time - time)*1000
                        }
                    }
                }).catch(err=>{

                })
            },
            payFun(){
                let order_sn = {
                    openid:this.openid,
                    order_sn:this.order_num
                }
                let order_id = {
                    openid:this.openid,
                    order_id:this.order_num
                }
                if(this.payWay.type ==='order_id'){
                    this.payWayFun(order_id)
                }else {
                    this.payWayFun(order_sn)
                }

            },
            payWayFun(payWayType){
                if(this.disabledState) return
                this.disabledState = true
                this.$api.payMoney({
                    cmd:{
                        order:"wxpay"
                    },
                    data:payWayType
                }).then(res=>{
                    console.log(res,'发起支付')
                    let data = JSON.parse(res.data)
                    console.log(data)
                    return data
                }).then(res=>{
                    console.log('支付中', res)
                    this.$wxSdk.chooseWXPay({
                        timestamp:res.timeStamp,
                        nonceStr:res.nonceStr,
                        package:res.package,
                        signType:res.signType,
                        paySign:res.paySign,
                        success:()=>{
                            this.$toast.success('支付成功哦')
                            this.$router.replace({name:'orderPayStatus',query:{status:'success',order_num: this.cashierData.order_sn}})
                        },
                        cancel:()=>{
                            this.$router.replace({name:'orderPayStatus',query:{status:'err'}})
                        },

                    })


                })
            },
            getCashier(payWayType){
                this.$api.cashier({
                    cmd:{
                        order:"wxpay"
                    },
                    data:payWayType,
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.cashierData = res.data
                        this.getPayTime()
                    }
                })

            },

            countDownEvt(){
                this.$toast({message: '支付超时，返回订单列表页'})
                this.$router.replace({name: 'buyList'})
            }

        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.payWay = this.$store.state.payWay
            this.order_num = this.$route.params.order_num
            this.openid = this.userInfo.mini_openid
            //ogxTM1K7AWnQ3kXetzwkli0DNUOY
            let order_sn = {
                openid:this.openid,
                order_sn:this.order_num
            }
            let order_id = {
                openid:this.openid,
                order_id:this.order_num
            }
            if(this.payWay.type ==='order_id'){
                this.getCashier(order_id)
            }else {
                this.getCashier(order_sn)
            }
            this.$share.api()
        },
        mounted(){

        },
        destroyed(){

        }
    }
</script>
<style lang="scss" type="text/scss">
    .payCashier-inner{
        color: #353535;
        .pay-countDown{
            font-size: 18px;
            text-align: center;
            margin: 15px 0;
            .date{
                color: #F22A15;
            }
            .timeBox{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .payCashier-info{
            margin: 0 15px;
            background: #fff;
            font-size: 15px;
            padding: 15px 10px;
            border-radius: 5px;
            .cell{
                display: flex;
                justify-content: space-between;
                &:first-child{
                    margin-bottom: 10px;
                }
                .r{
                    color: #888;
                }
            }
        }
        .pay-way{
            margin: 10px 15px 0;
            background: #fff;
            font-size: 15px;
            padding: 0 10px;
            border-radius: 5px;
            .hd{
                font-size: 17px;
                height: 40px;
                line-height: 40px;
            }
            .way-item{
                display: flex;
                justify-content: space-between;
                height: 40px;
                align-items: center;
                &:last-child{
                    &:after{
                        content: normal;
                    }
                }
                .label{
                    display: flex;
                    align-items: center;
                }
                .wx-icon{
                    background: url('../../assets/images/icon-weixin@2x.png') no-repeat;
                    width: 15px;
                    height: 15px;
                    background-size: contain;
                    margin-right: 5px;
                }
            }
            .van-radio{
                height: 20px;
                overflow: inherit;
                display: flex;
                .van-icon{
                    background-color: #F22A15 !important;
                    border-color: #F22A15 !important;
                }
            }
        }

    }
    .payCashier-ft{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        display: flex;
        z-index: 99;
        font-size: 20px;
        .l{
            background: #fff;
            color:#F22A15 ;
            height: 50px;
            line-height: 50px;
            text-align: center;
            flex-grow: 1;
            width: 50%;
        }
        .r{
            background: #f22a15;
            color: #fff;
            height: 50px;
            line-height: 50px;
            text-align: center;
            flex-grow: 1;
            width: 50%;
        }
    }
</style>
