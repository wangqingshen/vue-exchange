<template>
    <div class="address-wrapper" v-title="pageTitle">
        <div class="address-list" v-if="this.addressData.length>0">
            <address-item :isSel='isSel' :addressData="addressData"  @emitDeleteAddress="deleteAddress" @emitEditAddress="editAddress" @reGetAddressList="getAddressList" :member_id='member_id'></address-item>
        </div>
        <div class="default-info" v-else>
            <div class="pic">
                <img src="../../assets/images/pic_massage@2x.png">
            </div>
            <div class="info">
               目前还没有自己的收货地址哟~
            </div>
        </div>
        <div class="add" @click="addAdressPage">
           <!--  <div class="bg"></div> -->
            <div class="txt">新增收货地址</div>
        </div>
    </div>
</template>

<script>
    import addressItem from '@/components/address-item'
    export default {
        name: 'addressList',
        data(){
            return {
                pageTitle: '收货地址',
                addressData:[],
                // addressData2:[],
                member_id: '',
                isSel:false
            }
        },
        components:{
            addressItem,
        },
        methods:{
            addAdressPage(){
                this.$router.replace({name: 'editAddress',params: {member_id:this.member_id}})
            },
            getAddressList(member_id){
                this.$api.getAddressList({
                    cmd:{
                        member:'addressList'
                    },
                    data:{
                       member_id: this.member_id,
                    },
                }).then(res=>{
                    if(res.code ===1){
                        this.addressData = [...res.data.data]
                    }
                })
            },
            deleteAddress(item){
                this.getAddressList(item)
            },
            editAddress(item){
                this.getAddressList(member_id)
            }

        },
        created(){
            if(typeof(this.$store.state.isSel) == 'string') {
                this.isSel = localStorage.getItem('isSel') == 'true' ? true : false
            }else{
                this.isSel = this.$store.state.isSel
            }
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            this.getAddressList()
        },
    }
</script>

<style lang="scss" type="text/scss">
    .address-wrapper{
        .address-list{
            padding-bottom: 50px;
        }
        .add{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 50px;
            background: #F32D16;
            color: #fff;
            font-size: 17px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .default-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50%;
            color: #888;
            font-size: 15px;
            .pic{
                width: 160px;
                height: 155px;
            }
            .info{
                padding-top: 25px;
            }
        }
    }
</style>
