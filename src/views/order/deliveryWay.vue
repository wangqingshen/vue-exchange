<template>
    <div class="express-fill-wrapper" v-title="pageTitle">
        <div class="inner">
            <div class="info">
                <div class="item">
                    <div class="title">物流单号</div>
                    <div class="txt">
                        <input type="number" v-model="shipping_code" placeholder="请输入物流单号"  oninput="if(value.length>20)value=value.slice(0,20)">
                    </div>
                </div>
                <div class="item" @click="logistics">
                    <div class="title">快递公司</div>
                    <div class="txt">
                        <input type="text" v-model="company_name" placeholder="请填写快递公司" maxlength="10" readonly>
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="fun-btn" @click="btnEvt">确定</div>
        </div>
         <!-- 弹出确认发货 -->
        <van-popup v-model="delivery_show" class="delivery-popup" overlay-class="delivery-modal">
            <div class="cell">
                <p>确认是否发货
                    <span class="tips">一经发货则无法修改快递信息</span>
                </p>
                <div class="fun-btn">
                    <div class="btn-item" @click="delivery_show = false ">再想想</div>
                    <div class="btn-item face" @click="confirm">确认发货</div>
                </div>
            </div>
        </van-popup>
        <!-- 弹出物流选择 -->
        <van-popup v-model="logistic_show" class="logistic-popup" overlay-class="logistic-modal">           
            <van-picker :columns="columns" @change="onChange" />
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: 'modifyPrice',
        data(){
            return {
                pageTitle: '发货快递信息填写',
                shipping_code: '',
                company_name: '',
                delivery_show: false,
                Data:{},
                logistic_show: false,
                columns: []
            }
        },
        methods: {
            btnEvt(){
                if(!this.shipping_code){
                    this.$toast('请输入物流单号')
                    return false
                }
                if(!this.company_name){
                    this.$toast('请选择快递公司')
                    return false
                }
                this.delivery_show = !this.delivery_show
            },
            logistics(){
                this.logistic_show = !this.logistic_show
                this.$api.logisticsList({//物流公司列表
                        cmd:{
                            Logistics:'LogisticsCompanyList'
                        },
                        data:this.Data
                    }).then(res=>{
                        console.log(res,'logistics')
                        if(res.code === 1){
                            this.columns = res.data.map((item)=>{
                                return item.company_name
                            })
                        }
                    }).catch(() => {

                })
            },
            onChange(picker, value, index) {
                // console.log(`当前值：${value}, 当前索引：${index}`);
                this.company_name = value
                this.Data.company_id = index + 1
            },
            // thinkTwice(){
            //     this.delivery_show = false
            // },
            confirm(){               
                this.Data.shipping_code = this.shipping_code
                this.Data.shipping_express_code = ''
                // console.log(this.Data)
                this.$api.deliverWay({//设置发货
                        cmd:{
                            order:'SetDeliveryWay'
                        },
                        data:this.Data
                    }).then(res=>{
                        if(res.code === 1){
                            if(this.$route.params.state == 1) {
                                this.$router.push({name:'orderDetails',params:{order_id:this.Data.order_id}})
                            }else{
                                this.$router.replace({name: 'sellList'})
                            } 
                        }
                    }).catch(() => {

                })
                this.delivery_show = false
            },
        },
        created(){
            this.Data = JSON.parse(this.$route.params.delivery_info)
            console.log(this.Data)
        },
    }
</script>

<style lang="scss" type="text/css">
   .express-fill-wrapper{
       .inner{
            padding: 0 15px;
            .info{
                .item{
                    height: 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #333;
                    font-size: 14px;
                    border-bottom: 1px solid #D8D8D8;
                    .txt{
                        display: flex;
                        align-items: center;
                        input{
                            border: 0;
                            background: transparent;
                            text-align: right;
                            &::-webkit-input-placeholder{
                                color: #999;
                            }
                        }
                        span{
                            width: 12px;
                            height: 12px;
                            background-image: url(../../assets/images/ic_order_rightarrow.png);
                            background-size: contain;  
                            margin-left: 6px;
                        }
                    }
                }
            }
            .fun-btn{
                height: 44px;
                background: #F32D16;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                color: #FFF;
                border-radius: 21px;
                margin-top: 65px;
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
                    .tips{
                        color: #F32D16;
                        font-size: 12px;
                    }
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
        .logistic-popup{
            width: 80%;
            border-radius: 4px;
        }
   }
</style>
