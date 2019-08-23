<template>
    <div class="apply-submit" v-title="pageTitle">
        <div class="apply-bd">
            <div class="content">
                <div class="content-item">
                    <div class="txt">店铺名称</div>
                    <div class="val">
                        <input type="text" v-model="store_name" placeholder="请输入店铺名称" maxlength="15">
                    </div>
                </div>
                <div class="content-item">
                    <div class="txt">期望登录名</div>
                    <div class="val">
                        <input type="text" v-model="user_login" placeholder="请输入期望登录名" maxlength="20" >
                    </div>
                </div>
                <div class="content-item">
                    <div class="txt">设置店铺密码</div>
                    <div class="val">
                        <input type="text" v-model="user_pass" placeholder="请输入店铺密码" maxlength="20">
                    </div>
                </div>
                <div class="content-item" @click="PageAddress">
                    <div class="txt">店铺地址</div>
                    <div class="val">
                        <input type="text" v-model="store_address" placeholder="请选择店铺地址" readonly>
                        <img src="../../assets/images/ic_order_rightarrow.png" />
                    </div>
                </div>
                <div class="intro">
                    <div class="txt">店铺简介</div>
                    <div class="val">
                        <textarea type="text" v-model="remark" placeholder="请输入店铺简介" maxlength="300"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="apply-ft">
            <div class="submit" @click="submit">
                <div class="info">提交</div>
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
                content:{},
                store_name: '',
                user_login: '',
                user_pass: '',
                store_address: '',
                remark: '',
                member_id:'',
                account_holder: '',
                mobile: '',
                store_bank: '',
                store_bank_account: '',
                store_adcode: '',
                store_latitude: '',
                store_longitude: '',
                leagueData: ''
            }
        },
        methods:{
            submit(){
                let content = {}
                if(!this.store_name){
                    this.$toast({message: '请输入店铺名称',duration: 2000,})
                    return false
                }
                 if(!(this.user_login)){
                    this.$toast({message: '请输入期望登录名',duration: 2000,})
                    return false
                }
                if(!this.user_pass){
                    this.$toast({message: '请输入店铺密码',duration: 2000,})
                    return false
                }
                if(!this.store_address){
                    this.$toast({message: '请选择店铺地址',duration: 2000,})
                    return false
                }
                if(!this.remark){
                    this.$toast({message: '请输入店铺简介',duration: 2000,})
                    return false
                }
                content.member_id = this.member_id
                content.store_id = this.store_id
                content.store_bank = this.store_bank
                content.store_bank_account = this.store_bank_account
                content.store_name = this.store_name
                content.store_address = this.store_address
                content.remark = this.remark
                content.account_holder = this.account_holder
                content.mobile = this.mobile
                content.user_login = this.user_login
                content.user_pass = this.user_pass
                content.store_longitude = this.store_longitude
                content.store_latitude = this.store_latitude
                content.store_adcode = this.store_adcode
                this.$api.submitLeague({
                    cmd:{
                        member:'submitLeague'
                    },
                    data:content
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
                        this.$toast.success({
                            duration: 0,
                            forbidClick: true,
                            loadingType: 'spinner',
                            message: '请等待审核'
                        })
                        let second = 2;
                        const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer);
                            this.$toast.clear();
                            this.$router.replace({name:'ownIndex'})
                        }
                        }, 1000);
                    }else{
                        this.$toast.fail({
                            duration: 0,
                            forbidClick: true,
                            loadingType: 'spinner',
                            message: res.msg
                        })
                        let second = 2;
                        const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer);
                            this.$toast.clear();
                        }
                        }, 1000);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            PageAddress(){
                this.leagueData.store_name = this.store_name 
                this.leagueData.user_login = this.user_login
                this.leagueData.user_pass = this.user_pass
                this.leagueData.remark = this.remark
                console.log(this.leagueData,111)
                this.$router.push({name: 'map', params: {league_data: JSON.stringify(this.leagueData)}})
            }
        },
        created(){
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.leagueData = JSON.parse(this.$route.params.league_data)
            this.account_holder = this.leagueData.account_holder
            this.mobile = this.leagueData.mobile
            this.store_bank = this.leagueData.store_bank
            this.store_bank_account = this.leagueData.store_bank_account
            this.store_id = this.leagueData.store_id
            this.store_name = this.leagueData.store_name
            this.user_pass = this.leagueData.user_pass
            this.user_login = this.leagueData.user_login
            // this.store_address = this.$route.params.store_address
            this.remark = this.leagueData.remark        
            if(this.$store.state.leagueData.adcode) {
                this.store_longitude = this.$store.state.leagueData.lng
                this.store_latitude = this.$store.state.leagueData.lat
                this.store_adcode = this.$store.state.leagueData.adcode
                this.store_address = this.$store.state.leagueData.name
            }    
            // console.log('params：',this.member_id,this.account_holder,this.mobile,this.store_bank,this.store_bank_account,this.store_id,this.store_name,this.user_login,this.store_address,this.remark,)
        },
    }
</script>
<style lang="scss" type="text/scss">
    .apply-submit{
        height: 100vh;
        background: #fff;
        .apply-bd{
            .content{
                .content-item{
                    padding: 0 15px;
                    height: 44px;
                    display:flex;
                    align-items: center;
                    border-bottom: 1px solid #EDEDED;
                    background: #FFF;
                    font-size: 14px;
                    &:last-child{
                        border-bottom: 0;
                    }
                    .txt{
                        color: #333;
                        padding-right: 10px;
                    }
                    .val{
                        display: flex;
                        align-items: center;
                        flex: 1;
                        input{
                            width: 100%;
                            border:0;
                            text-align: right;
                            color: #999;
                        }
                        input::-webkit-input-placeholder {
                            color:#999;
                        }
                        img{
                            margin-left: 7px;
                            width: 10px;
                            height: 16px;
                        }
                    }
                }
                .intro{
                    padding: 0 15px;
                    height: 260px;
                    font-size: 14px;
                    background: #f7f7f7;
                    .txt{
                        display: flex;
                        align-items: center;
                        height: 44px;
                        color: #333;
                    }
                    .val{
                        width: 100%;
                        color: #999;
                        textarea{
                            border:0;
                            width: 100%;
                            height: 200px;
                            background: transparent;
                        }
                        textarea::-webkit-input-placeholder {
                            color:#999;
                        }
                    }
                }
            }
        }
        .apply-ft{
            display: flex;
            justify-content: center;
            background: #FFF;
            .submit{
                width: 92%;
                height: 44px;
                background: #FF2A15;
                border-radius: 21px;
                color: #fff;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 33%;
            }
        }
    }
</style>
