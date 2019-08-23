<template>
    <div class="league-apply-wrapper" v-title="pageTitle">
        <div class="apply-hd">
            <div class="bg" :class="colse ? 'active' : ''">
                <div class="pic"></div>
                <div class="cell">
                    <div class="fun-btn" @click="closeInfo"></div>
                    <div class="info">
                        <div class="title">入驻须知：</div>
                        <div class="txt">
                            <p>1、认真填好个人信息。</p>
                            <p>2、以下信息都为必填信息。</p>
                            <p>3、姓名、号码具有真实性。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="apply-bd">
            <div class="content">
                <div class="content-item">
                    <div class="txt">店主姓名</div>
                    <div class="val">
                        <input type="text" v-model="account_holder" placeholder="请输入店主姓名" maxlength="10">
                    </div>
                </div>
                <div class="content-item">
                    <div class="txt">手机号</div>
                    <div class="val">
                        <input type="text" v-model="mobile" placeholder="请输入手机号" maxlength="11" >
                    </div>
                </div>
                <div class="content-item">
                    <div class="txt">开户银行</div>
                    <div class="val">
                        <input type="text" v-model="store_bank" placeholder="请输入店主开户银行" maxlength="20">
                    </div>
                </div>
                <div class="content-item">
                    <div class="txt">银行账户</div>
                    <div class="val">
                        <input type="text" v-model="store_bank_account" placeholder="请输入店主银行卡号" maxlength="20">
                    </div>
                </div>
            </div>
        </div>
        <div class="apply-ft">
            <div class="next" @click="next">
                <div class="info">下一步</div>
            </div>
        </div>
    </div>
</template>
<script>

    export default{
        name:'league',
        data(){
            return{
                pageTitle:'合作加盟申请填写',
                account_holder: '',
                mobile: '',
                store_bank: '',
                store_bank_account: '',
                member_id:'',
                store_id: '',
                leagueData:{},
                colse: false,
            }
        },
        methods:{
            closeInfo(){
             this.colse = !this.colse
            },
            next(){
                if(!this.account_holder){
                    this.$toast({message: '请输入店主姓名',duration: 2000,})
                    return false
                }
                let reg1 = /^[1][3,4,5,7,8][0-9]{9}$/
                 if(!reg1.test(this.mobile)){
                    this.$toast({message: '请输入正确的手机号',duration: 2000,})
                    this.mobile = '';
                    return false
                }
                if(!this.store_bank){
                    this.$toast({message: '请输入开户银行',duration: 2000,})
                    return false
                }
                let reg2 = /^[0-9]{1,20}$/
                if(!reg2.test(this.store_bank_account)){
                    this.$toast({message: '请输入正确的银行账户',duration: 2000,})
                    return false
                }
                this.leagueData.account_holder = this.account_holder
                this.leagueData.mobile = this.mobile
                this.leagueData.store_bank = this.store_bank
                this.leagueData.store_bank_account = this.store_bank_account
                this.leagueData.store_id = this.store_id
                this.$router.push({name: 'submit', params:{league_data: JSON.stringify(this.leagueData)}})
            },
        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.store_id = this.$route.params.store_id
            if(this.store_id){
                this.$api.getLeagueById({//重新获取加盟信息
                    cmd:{
                        member:'getLeagueById'
                    },
                    data:{
                        member_id: this.member_id,
                        store_id: this.store_id
                    }
                }).then(res=>{
                    console.log(res)                       
                    if(res.code===1){
                        this.leagueData = res.data
                        this.account_holder = this.leagueData.account_holder
                        this.mobile = this.leagueData.mobile                  
                        this.store_bank = this.leagueData.store_bank                  
                        this.store_bank_account = this.leagueData.store_bank_account                  
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        mounted(){
            //模板编译挂载后

        }

    }
</script>
<style lang="scss" type="text/scss">
    .league-apply-wrapper{
        background: #FFF;
        .apply-hd{
            display: flex;
            justify-content: center;
            .bg{
                width: 100%;
                height: 110px;
                display: flex;
                align-items: center;
                margin: 8px 0 12px 15px;
                &.active{
                    display: none;
                }
                .pic{
                    width: 46px;
                    height: 68px;
                    background-image: url(../../assets/images/bulb@2x.png);
                    background-size: cover;
                    z-index: 99;
                }
                .cell{
                    width: 232px;
                    height: 100%;
                    background: #FFEEEC;
                    border-radius: 4px;
                    position: relative;
                    padding-left: 34px; 
                    display: flex;
                    align-items: center;
                    margin-left: -16px;
                    .fun-btn{
                        width: 21px;
                        height: 21px;
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background-image: url(../../assets/images/btn_close@2x.png);
                        background-size: cover;
                    }
                    .info{
                        color: #F32D16;
                        .title{
                            font-size: 16px;
                            font-weight: 600;
                        }
                        .txt{
                            padding-top: 14px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .apply-bd{
            .content{
                padding: 0 15px;
                .content-item{
                    height: 44px;
                    display:flex;
                    align-items: center;
                    border-bottom: 1px solid #EDEDED;
                    font-size: 14px;
                    .txt{
                        color: #333;
                        width: 70px;
                    }
                    .val{
                        display: flex;
                        flex: 1;
                        color: #999;
                        input{
                            width: 100%;
                            border:0;
                            text-align: right;
                        }
                        input::-webkit-input-placeholder {
                            color:#999;
                        }
                    }
                }

            }
        }
        .apply-ft{
            margin-top: 49px;
            display: flex;
            justify-content: center;
            .next{
                width: 92%;
                height: 44px;
                background: #F32D16;
                border-radius: 21px;
                color: #fff;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
