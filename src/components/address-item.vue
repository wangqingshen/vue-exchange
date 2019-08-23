<template>
    <div class="addressItem-component">
        <div class="addressItem-item" v-for="(item, index) in addressData" :key="index">
            <div class="addressItem-inner">
                <!-- 信息面板 -->
                <div class="info" @click="copy(item,index)">
                    <div class="top">
                        <div class="name">
                            <div class="txt">{{item.true_name}}</div>
                            <div class="" v-show="item.is_default" :class="[item.is_default == 1 ? 'active' : '']">默认</div>
                        </div>
                        <div class="mobile">{{item.mobile}}</div>
                    </div>
                    <div class="address">{{item.address}}</div>
                </div>
                <!-- 底部编辑栏 -->
                <div class="handle">
                    <!-- 默认地址 选择 -->
                    <div class="handle-l">
                        <div class="choose" @click="setDefault(item)" v-if="!isSel">
                            <div class="pic" v-if="item.is_default == 1">
                                <img src="../assets/images/icon-xuanzhong@2x.png" />
                            </div>
                            <div class="pic" v-else>
                                <img src="../assets/images/icon-xuanze@2x.png" />
                            </div>
                            <div class="txt" v-if="item.is_default == 1">默认地址</div>
                            <div class="txt" v-else>设为默认</div>
                        </div>
                        <div class="choose" @click="selAddressFun(item,index)" v-if="isSel">
                            <div class="pic" v-if="selIndex == index">
                                <img src="../assets/images/icon-xuanzhong@2x.png" />
                            </div>
                            <div class="pic" v-else>
                                <img src="../assets/images/icon-xuanze@2x.png" />
                            </div>
                            <div class="txt" :class="[selIndex == index ? 'active' : '']">选择</div>
                        </div>
                    </div>
                    <!-- 编辑 删除 -->
                    <div class="handle-r">
                        <div class="edit" @click="editAddress(item)">
                            <div class="pic">
                                <img src="../assets/images/icon-bianji@2x.png" />
                            </div>
                            <div class="txt">编辑</div>
                        </div>
                        <div class="delete" @click="deleteAddress(item)">
                            <div class="pic">
                                <img src="../assets/images/icon-shanchu@2x.png" alt="">
                            </div>
                            <div class="txt">删除</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addressItem-component',
        props: {
            isDefault: false,
            addressData:{
                type: Array,
            },
            isSel:{

            },
            member_id:{
            }
        },
        data(){
            return{
                addressData2:this.addressData,
                selIndex:-1
            }
        },
        methods:{
            editAddress(item){
                this.$router.replace({name: 'editAddress', params:{address_id: item.address_id,true_name: item.true_name, mobile: item.mobile, address: item.address, }})
            },
            deleteAddress(item){
                this.$dialog.confirm({
                    message: '确认删除该地址吗？'
                }).then(() => {
                    this.$api.deleteAddress({
                        cmd: {
                            member: 'deleteAddress'
                        },
                        data:{
                            address_id: item.address_id
                        }
                        }).then(res => {
                            if(res.code === 1){
                                this.$emit('reGetAddressList')
                            }
                    });
                }).catch(() => {});
            },
            setDefault(item){
                this.addressData.forEach(item => {
                    return item.is_default = 0
                });
                item.is_default = 1;
                this.$api.setDefaultAddress({
                    cmd:{
                        member:'setDefaultAddress'
                    },
                    data:{
                        member_id: item.member_id,
                        address_id : item.address_id,
                    }
                }).then(res=>{
                    if(res.code ===1){
                    }
                })
            },
            selAddressFun(item,index){
                this.$store.commit('SET_SEL_ADDRESS_INDEX',index)
                localStorage.setItem('isSelIndex', index)
                this.$store.dispatch('setAddress',item).then(res=>{
                    this.selIndex = index
                    this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '设置中'
                    })
                    let second = 2;
                    const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer)
                            this.$toast.clear()
                            this.$router.replace({name:'submitOrder'})
                        }
                    }, 1000)
                })

            },
            copy(item,index){//点击面板选择
                if(!this.isSel) return
                this.selAddressFun(item,index)
            },

            setIsSelIndex(){
                for(var i in this.addressData) {
                    if(this.$store.state.isSelIndex == '-1') {
                        if(localStorage.getItem('isSelIndex') == undefined) {
                            if(this.addressData[i].is_default == 1) this.selIndex = i
                        }else{
                            this.selIndex = localStorage.getItem('isSelIndex')
                        }
                    }else{
                        this.selIndex = this.$store.state.isSelIndex
                    }
                }
            }

        },
        created(){
            if(this.isSel) this.setIsSelIndex()
        },
    }
</script>

<style lang="scss" type="text/scss">
    .addressItem-component{
        .addressItem-item{
            height: 145px;
            background: #fff;
            margin-top: 10px;
            .addressItem-inner{
                height: 100%;
                padding-left: 15px;
                .info{
                    padding: 15px 15px 15px 0;
                    border-bottom: 1px solid #ededed;
                    height: 102px;
                    .top{
                        display: flex;
                        justify-content: space-between;
                        font-size: 17px;
                        color: #353535;
                        font-weight: 500;
                        .name{
                            display: flex;
                            align-items: center;
                                .active{
                                    font-size: 11px;
                                    background: #F32D16;
                                    color: #fff;
                                    border-radius: 8px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    margin-left: 12px;
                                    padding: 0 5px;
                                }
                        }
                    }
                    .address{
                        font-size: 13px;
                        line-height: 15px;
                        color: #888;
                        padding-top: 10px;
                        word-break: break-word;
                    }
                }
                .handle{
                    height: 43px;
                    padding: 15px 15px 15px 0;
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    color: #353535;
                    .handle-l{
                        .choose{
                            display: flex;
                            align-items: center;
                            .pic{
                                width: 15px;
                                height: 15px;
                                margin-right: 10px;
                            }
                            .txt{
                                &.active{
                                    color: #FC441A;
                                }
                            }
                        }
                    }
                    .handle-r{
                        display: flex;
                        // align-items: center;
                        .edit{
                            display: flex;
                            align-items: center;
                            .pic{
                                width: 15px;
                                height: 15px;
                                margin-right: 10px;
                            }
                        }
                        .delete{
                            display: flex;
                            align-items: center;
                            margin-left: 20px;
                            .pic{
                                width: 15px;
                                height: 15px;
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
    .van-dialog{
        .van-dialog__message{
            text-align: center;
        }
    }
</style>
