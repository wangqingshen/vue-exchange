<template>
    <div class="userInfo-wrapper" v-title="pageTitle">
        <div class="info-box">
                <div class="info-item itemTop">
                    <div class="item-l">
                        <div class="tex">头像</div>
                    </div>
                    <div class="item-r">
                        <div class="pic" v-if="userInfo.member_avatar">
                            <img :src="member_avatar"/>
                        </div>
                        <div class="pic" v-else>
                            <img src="../../assets/images/head@2x.png"/>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="item-l">
                        <div class="tex">昵称</div>
                    </div>
                    <div class="item-r">
                        <div v-if="userInfo" class="txt">{{member_nick_name}}</div>
                        <div v-else class="txt">您的昵称</div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="item-l">
                        <div class="tex">性别</div>
                    </div>
                    <div class="item-r">
                        <div v-if="userInfo" class="txt">{{member_sex == 1 ? '男' : '女'}}</div>
                        <div v-else class="txt">您的性别</div>
                    </div>
                </div>
                <div class="info-item" @click="showDialog" v-if="member_mobile">
                    <div class="item-l">
                        <div class="tex">手机号</div>
                    </div>
                    <div class="item-r">
                        <div class="txt">{{member_mobile | filterCellNum}}</div>
                        <div class="arrow-right">
                            <img src="../../assets/images/ic_order_rightarrow.png" />
                        </div>
                    </div>
                </div>
                <div class="info-item"  @click="showDialog" v-else>
                    <div class="item-l">
                        <div class="tex">手机号</div>
                    </div>
                    <div class="item-r">
                        <div class="txt"></div>
                        <div class="arrow-right">
                            <img src="../../assets/images/ic_order_rightarrow.png" />
                        </div>
                    </div>
                </div>
                <div class="info-item"  @click="clearLocal">
                    <div class="item-l">
                        <div class="tex">清除缓存</div>
                    </div>
                    <div class="item-r">
                        <div class="txt"></div>
                        <div class="arrow-right">
                            <img src="../../assets/images/ic_order_rightarrow.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-box">
                <div class="info-item" @click="goAddressPage()">
                    <div class="item-l">
                        <div class="tex">收货地址</div>
                    </div>
                    <div class="item-r">
                        <div class="arrow-right">
                            <img src="../../assets/images/ic_order_rightarrow.png" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 弹出层 -->
            <van-dialog v-model="show" show-cancel-button  @confirm="confirm" >
                <van-field v-model="cellNum" label="绑定手机号" placeholder="请输入手机号" :title="title" maxlength="11"/>
            </van-dialog>
    </div>
</template>
<script>
    export default{
        name:'userInfo',
        data(){
            return{
                pageTitle:'个人信息',
                show: false,
                title: '绑定手机号',
                cellNum: '',
                member_avatar:'',
                member_nick_name:'',
                member_sex:'',
                member_mobile:'',
                member_id: '',
            }
        },
        methods:{
            clearLocal(){
                window.localStorage.removeItem('userInfo')
                window.localStorage.removeItem('isShow')
            },
            goAddressPage(){
                localStorage.setItem('isSel', false)
                this.$router.push({name: 'addressList', params:{member_id:this.member_id}})
                this.$store.dispatch('setSelAddress',false)
            },
            showDialog(){
                this.show = !this.show;
                this.cellNum = '';
            },
            confirm(){
                let str = this.cellNum;
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                if(!reg.test(str)){
                    this.$toast({
                        message: '请输入正确的手机号',
                        duration: 2000,
                    })
                    this.cellNum = '';
                    this.show = !this.show;
                }else{
                    this.member_mobile = str
                    let userinfoArr = JSON.parse(window.localStorage.getItem('userInfo'))
                    userinfoArr.member_mobile  = this.member_mobile;
                    window.localStorage.setItem('userInfo',JSON.stringify(userinfoArr))
                    this.$api.editMobile({
                        cmd:{
                            member:'editMobile'
                        },
                        data:{
                            member_id: this.member_id,
                            mobile: this.member_mobile
                        },
                        }).then(res=>{
                    })
                }
            },
        },
        created(){
            //实例创建完成，完成属性绑定后
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id;
            this.member_avatar = this.userInfo.member_avatar;
            this.member_nick_name = this.userInfo.member_nick_name;
            this.member_sex = this.userInfo.member_sex;
            this.member_mobile = this.userInfo.member_mobile;
        },
    }
</script>
<style lang="scss" type="text/scss">
    .userInfo-wrapper{
        .info-box{
                background: #FFF;
                padding-left: 15px;
                margin-top: 10px;
                color: #353535;
                .info-item{
                    height: 50px;
                    border-bottom: 1px solid #EDEDED;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    padding-right: 15px;
                   .item-l{
                       display: flex;
                       align-items: center;
                       .tex{
                           padding-left: 8px;
                       }
                   }
                   .item-r{
                       display: flex;
                       align-items: center;
                       .pic{
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        overflow: hidden;
                       }
                       .arrow-right{
                            width: 12px;
                            height: 12px;
                            margin-left: 10px;
                       }
                   }
                   &:last-child{
                       border: 0;
                   }
                }
                .itemTop{
                    //height: 60px;
                }
        }
        .van-dialog{
            .van-dialog__content{
                padding: 10px;
                .van-cell{
                    flex-direction: column;
                    .van-cell__title{
                        display: flex;
                        justify-content: center;
                        font-size: 18px;
                        color: #000;
                        max-width: 100%;
                        padding-bottom:10px;
                    }
                }
            }
            .van-dialog__footer {
                .van-dialog__confirm{
                    //color: #F22A15;
                }
            }
        }
        .van-modal{
            background: rgba(0, 0, 0, .5)
        }
    }
</style>
