<template>
    <div class="withdraw-wrapper"  v-title="pageTitle">
        <div class="info">
            <div class="info-box">
                <div class="info-item">
                    <div class="item-l">
                        <div class="txt">提现账号</div>
                    </div>
                    <div class="item-r">
                        <input type="text"  placeholder="微信" readonly>
                    </div>
                </div>
                <div class="info-item">
                    <div class="item-l">
                        <div class="txt">提现金额</div>
                    </div>
                    <div class="item-r">
                        <input type="number" v-model="amount" placeholder="请输入提现金额（元）">
                    </div>
                </div>
            </div>
            <div class="tips">
                <div class="tips-box">
                    <div class="canUse">本次可提现金额
                        <span>{{can_apply_cash}}元</span>
                    </div>
                    <div class="cannot" v-show="Number(amount) > Number(can_apply_cash)">
                        超出可提现金额
                    </div>
                </div>
            </div>
        </div>
        <div class="ft">
            <div class="btn" v-if="!amount || Number(amount) > Number(can_apply_cash)">确定提现</div>
            <div class="btn" :class="amount ? 'active' : ''" v-else @click="confirmCash">提现</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'withdraw',
        data(){
            return {
                pageTitle: '提现',
                member_id: '',
                seller_id: '',
                amount: '',
                can_apply_cash: '',
            }
        },
        computed:{

        },
        methods:{
            confirmCash(){
                this.$api.withdraw({//提现
                    cmd:{
                        wallet:'memberwithdraw'
                    },
                    data:{
                        member_id:this.member_id,
                        amount: this.amount
                    }
                    }).then(res=>{
                        console.log(res,'confirmCash')
                        if(res.code===1){
                            this.$toast.success({
                                duration: 0,       // 持续展示 toast
                                forbidClick: true, // 禁用背景点击
                                loadingType: 'spinner',
                                message: '提现申请成功'
                            });
                            let second = 2;
                            const timer = setInterval(() => {
                                second--;
                                if (second) {

                                } else {
                                    clearInterval(timer);
                                    this.$toast.clear();
                                    this.$router.replace({name: 'ownIndex'})
                                }
                            }, 1000);
                        }else{
                            this.$toast.fail(res.msg)
                        }
                })
            },
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.can_apply_cash = this.$route.params.can_apply_cash
            console.log(this.can_apply_cash)
        },
        mounted(){
            
        }
    }
</script>

<style lang="scss" type="text/scss">
    .withdraw-wrapper{
        background: #FFF;
        height: 100vh;
        .info{
            .info-box{
                width: 100%;
                padding: 0 15px;
                .info-item{
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #333;
                    border-bottom: 1px solid #D8D8D8;
                    .item-r{
                        input{
                            border: 0;
                            text-align: right;
                        }
                        input::-webkit-input-placeholder {
                            color: #999;
                        }
                    }
                }
            }
            .tips{
                padding-left:15px; 
                .tips-box{
                    margin: 10px 0;
                    height: 68px;
                    font-size: 12px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .canUse{
                        color: #888;
                    }
                    .cannot{
                        color: #F32D16;
                    }   
                }
            }
        }
        .ft{
            padding:0 15px;
            font-size: 16px;
            text-align: center;
            .btn{
                background: #B2B2B2;
                color: #fff;
                border-radius: 21px;
                height: 44px;
                line-height: 44px;
                &.active{
                    background: #F32D16;
                }
            }
        }
    }
</style>
