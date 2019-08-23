<template>
    <div class="modify-price-wrapper" v-title="pageTitle">
        <div class="inner">
            <div class="info">
                <div class="item">
                    <div class="title">价格</div>
                    <input type="number" v-model="order_amount" placeholder="请输入价格" oninput="if(value.length>9)value=value.slice(0,9)">
                </div>
                <div class="item">
                    <div class="title">邮费</div>
                    <input type="number" v-model="shipping_fee" placeholder="请输入邮费" oninput="if(value.length>7)value=value.slice(0,7)">
                </div>
                <div class="tips" v-show="commission">
                    <div class="txt">平台将从交易金额中抽成{{commission}}%，请合理设置价格</div>
                </div>
            </div>
            <div class="fun-btn" @click="btnEvt">确定</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modifyPrice',
        data(){
            return {
                pageTitle: '修改价格',
                order_amount: '',
                shipping_fee: '',
                commission: '',
                Data: {},
            }
        },
        methods: {
            btnEvt(){
                let reg1 = /^[1-9][0-9]{0,6}(\.{0,1}[0-9]{0,2})$/
                if(!reg1.test(this.order_amount)){
                    this.$toast('请输入正确的价格')
                    this.order_amount = ''
                    return false
                }
                let reg2 = /^[0-9]{1,7}$/
                if(!reg2.test(this.shipping_fee)){
                    this.$toast('请输入正确的邮费')
                    this.shipping_fee = ''
                    return false
                }
                this.Data.order_amount = this.order_amount
                this.Data.shipping_fee = this.shipping_fee
                console.log(this.Data)
                this.$api.modifyOrder({
                        cmd:{
                            order:'ExchangeModifyOrder'
                        },
                        data:this.Data
                    }).then(res=>{
                        console.log(res,'res')
                        if(res.code === 1){
                            this.$toast.success({
                                duration: 0,
                                forbidClick: true,
                                loadingType: 'spinner',
                                message: '修改成功'
                            })
                            let second = 2;
                            const timer = setInterval(() => {
                            second--;
                            if (second) {

                            } else {
                                clearInterval(timer);
                                this.$toast.clear();
                                this.$router.replace({name:'sellList'})
                            }
                            }, 1000);
                        }else{
                            this.$toast.fail({
                                duration: 0,
                                forbidClick: true,
                                loadingType: 'spinner',
                                message: '修改失败'
                            })
                            let second = 2;
                            const timer = setInterval(() => {
                            second--;
                            if (second) {

                            } else {
                                clearInterval(timer);
                                this.$toast.clear();
                                this.$router.replace({name:'sellList'})
                            }
                            }, 1000);
                        }
                    }).catch(() => {

                })
            },
            Commission(){
                this.$api.getCommonSet({//佣金比列
                    cmd:{
                        "member":"getCommonSet"
                    },
                    data:{
                        'param_type': '1'
                    }
                }).then(res=>{
                    console.log(res,'commission')
                    if(res.code === 1){
                        this.commission = res.data.commission_ratio
                    }
                }).catch(err=>{

                })
            },
        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.Data.member_id = this.userInfo.member_id;
            this.Data.order_id = this.$route.params.order_id
            this.Commission()
            console.log(this.Data)
        },
        mounted(){

        },
    }
</script>

<style lang="scss" type="text/css">
    .modify-price-wrapper{
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
                    input{
                        border: 0;
                        background: transparent;
                        text-align: right;
                        &::-webkit-input-placeholder{
                            color: #999;
                        }
                    }
                }
                .tips{
                    padding-top: 10px;
                    color: #F32D16;
                    font-size: 12px;
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
    }
</style>
