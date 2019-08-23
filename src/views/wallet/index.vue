<template>
    <div class="wallet-wrapper"  v-title="pageTitle">
        <div class="wallet-hd">
            <div class="hd-box">
                <div class="hd-title">可提现金额（元）</div>
                <div class="hd-num">{{can_apply_cash ? can_apply_cash : '0.00'}}</div>
            </div>
        </div>
        <div class="wallet-bd">
            <div class="details" v-if="walletData.length">
                <div class="title">余额明细</div>
                <div class="list-content">
                    <div class="list-item" v-for="(item, index) in walletData" :key="index">
                        <div class="item-l">
                            <div class="item-detail">{{item.name}}</div>
                            <div class="time">{{item.create_time}}</div>
                        </div>
                        <div class="item-r">
                            <!-- <div class="account" v-if="item.state == 1">+{{item.amount}}元</div>
                            <div class="account" v-else-if="item.state == 2">-{{item.amount}}元</div> -->
                            <div class="account">{{item.state === 1 ? '+'+item.amount : '-'+item.amount}}元</div>
                        </div>
                    </div>
                    <div class="list-more" v-show="moreEven" @click="lookMore">查看更多</div>
                </div>
            </div>
            <div class="default" v-else>
                <div class="default-pic">
                    <img src="../../assets/images/pic_money@2x.png">
                </div>
                <div class="default-info">钱包空空</div>
            </div>
        </div>
        <div class="wallet-ft" @click="goWithdrawPage">
            <div class="withdraw">提现</div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageTitle: '钱包',
                member_id:'',           
                can_apply_cash: '',
                moreEven: false,//更多
                walletData: [],
            }
        },
        methods: {
            goWithdrawPage(){
                this.$router.push({name: 'withdraw', params: {can_apply_cash: this.can_apply_cash}})
            },
            lookMore(){
                this.$router.push({name:'balance'})
            },
            memberInfo(){
                this.$api.memberInfo({//用户信息
                    cmd:{
                        wallet:'memberinfo'
                    },
                    data:{
                        member_id:this.member_id,
                    }
                    }).then(res=>{
                        console.log(res,'memberInfo')
                        if(res.code ===1){
                            this.can_apply_cash = res.data.can_apply_cash     
                        }
                })
            },
            walletlist(){
                this.$api.walletlist({//钱包收支明细
                    cmd:{
                        wallet:'memberbalance'
                    },
                    data:{
                        member_id:this.member_id,
                    }
                    }).then(res=>{
                        console.log(res,'banlance')
                        if(res.code === 1){
                            if(res.data.length > 5){
                                this.moreEven = true
                            }
                            this.dataLength = res.data.length
                            this.walletData = res.data.slice(0,5)                            
                        }
                })
            }
        },
        created() {
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            console.log('member_id',this.member_id)
            if(this.member_id){
                this.memberInfo()
                this.walletlist()
            }
        },
    }
</script>

<style lang="scss" type="text/css">
    .wallet-wrapper{
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        .wallet-hd{  
            height: 200px;
            width: 100%;
            background-image: url(../../assets/images/own_center@2x.png);
            background-size: cover;
            .hd-box{
                height: 100%;            
                color: #fff;
                text-align: center;
                padding-top: 37px; 
                font-size: 14px;
                .hd-num{
                    font-size: 50px;
                    font-weight: 600;
                    padding-top: 18px;
                }
            }   
        }
        .wallet-bd{
            padding: 0 15px;
            padding-bottom: 50px;
            .details{
                background: #fff;
                border-radius: 5px;
                margin-top: -44px;
                color: #353535;
                height: 340px;
                .title{
                    height: 44px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #DEDEDE;
                    padding-left: 12px;
                    font-size: 14px;
                }
                .list-content{
                    padding-left: 12px;
                    font-size: 13px;
                    .list-item{
                        height: 50px;
                        border-bottom: 1px solid #DEDEDE;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-right: 10px;
                        .item-l{
                            padding-top: 7px;
                        }
                    }
                    .list-more{
                        height: 50px;
                        text-align: center;
                        line-height: 50px;
                    }
                }
            }
            .default{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 50%;
                    .default-pic{
                        width: 130px;
                        height: 92px;
                    }
                    .default-info{
                        padding-top: 10px;
                        width: 148px;
                        color: #666;
                        font-size: 14px;
                        text-align: center;
                    }
                }
        }
        .wallet-ft{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 44px;
            background: #F32D16;
            text-align: center;
            font-size: 16px;
            color: #fff;
            line-height: 50px;
        }
    }
</style>
