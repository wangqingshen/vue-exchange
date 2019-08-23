<template>
    <div class="Editaddress-wrapper" v-title="pageTitle">
        <div class="Editaddress-inner">
            <div class="edit-hd">
                <van-cell-group>
                    <van-cell-group>
                        <van-field v-model="true_name" label="收货人" placeholder="名字"  maxlength="10"/>
                    </van-cell-group>
                     <van-cell-group>
                        <van-field v-model="mobile" type="text" label="联系电话" placeholder="手机或固定电话"  maxlength="11"/>
                    </van-cell-group>
                    <van-field  v-model="address" label="收货地址"  type="textarea"  placeholder="请填写相关信息" rows="1" autosize maxlength="60" icon="location" />
                </van-cell-group>
            </div>
            <div class="edit-fd">
                <div class="save" @click="save">保存</div>
                <div class="cancel" @click="cancel">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name:'editAddress',
        data(){
            return{
                pageTitle:'收货地址',
                z:'0',
                userInfo: {},
                member_id:'',
                address_id: '',
                true_name: '',
                mobile: '',
                address: '',
            }
        },
        methods:{
            save(){
                if(!this.true_name){
                    this.$toast({
                        message: '请填写收货人姓名',
                        duration: 3000
                    })
                    return false
                }
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                if(!reg.test(this.mobile)){
                    this.$toast({
                        message: '请输入正确的手机号',
                        duration: 3000,
                    })
                    this.mobile = '';
                    return false
                }
                if(!this.address){
                    this.$toast({
                        message: '请填写地址',
                        duration: 3000,
                    })
                    return false
                }
                let addressData = {}
                addressData.member_id = this.member_id
                addressData.true_name = this.true_name
                addressData.mobile = this.mobile
                addressData.address = this.address
                if(this.address_id){
                    addressData.address_id = this.address_id
                }
                this.$api.editAddress({
                    cmd:{
                        member:"editAddress"
                    },
                    data:addressData
                }).then(res=>{
                    if(res.code ===1){
                        this.$toast.success({
                            duration: 0,
                            forbidClick: true,
                            loadingType: 'spinner',
                            message: '保存成功'
                        })
                        let second = 2;
                        const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer);
                            this.$toast.clear();
                            this.$router.replace({name:'addressList'})
                        }
                        }, 1000);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            cancel(){
                this.$router.replace({name:'addressList'})
            },
        },
        created(){
            //实例创建完成，完成属性绑定后
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id;
            this.address_id = this.$route.params.address_id
            this.true_name = this.$route.params.true_name
            this.mobile = this.$route.params.mobile
            this.address = this.$route.params.address
        },
    }
</script>
<style lang="scss" type="text/scss">
    .Editaddress-wrapper{
        .Editaddress-inner{
            .edit-hd{
                margin-top: 10px;
                background: #fff;
                padding-left: 15px;
                .van-cell-group{
                    .van-cell:not(:last-child){
                        height: 50px;
                        line-height: 50px;
                        padding-top: 0;
                        padding-bottom: 0;
                        .van-cell__title{
                            font-size: 16px;                   
                        }
                    }
                }
            }
            .edit-fd{
                margin-top: 160px;
                display: flex;
                width:90%;
                flex-direction: column;
                font-size: 18px;
                margin-left: 5%;
                .save{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background:#F32D16;
                    border-radius: 5px;
                    height: 44px;
                    color: #fff;
                    margin-bottom: 15px;
                }
                .cancel{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #fff;
                    border:1px solid #ededed;
                    border-radius: 5px;
                    height: 44px;
                }
            }
        }
    }
</style>
