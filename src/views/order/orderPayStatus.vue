<template>
    <div class="wrapper">
        <div class="pay-status">
            <div class="icon">
                <van-icon name="checked" v-if="status === 'success'"/>
                <van-icon class="err" name="clear" v-if="status === 'err' "/>
            </div>
            <div class="txt">{{status === 'success' ? '支付成功' : '支付失败'}}</div>
            <div class="btn" @click="goPage">返回</div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'orderPayStatus',
        data(){
            return{
                status:'success',
                order_num: ''
            }
        },
        methods:{
            goPage(){
                this.$router.replace({name:'buyList'})
            },

            searchOrderStatus(){
                this.$api.orderQuery({//查询订单支付状态
                    cmd:{
                        "order":"OrderQuery"
                    },
                    data:{
                        'order_sn': this.order_num
                    }
                }).then(res=>{
                    
                }).catch(err=>{})
            }
        },
        created(){
            this.status = this.$route.query.status
            if(this.status == 'success') {
                this.order_num = this.$route.query.order_num
                this.searchOrderStatus()
            }
        }
    }
</script>
<style lang='scss' type="text/scss">
    .pay-status{
        height: 100vh;
        text-align: center;
        padding-top: 50px;
        .icon{
           .van-icon{
               font-size: 100px;
               color: #00B700;
               &.err{
                   color: #f22a15;
               }
           }
        }
        .txt{
            font-size: 20px;
            color: #000;
            margin-top: 45px;
        }
        .btn{
            height: 44px;
            margin:45px 15px 0;
            line-height: 44px;
            font-size: 20px;
            background: #00B700;
            text-align: center;
            color: #fff;
            border-radius: 5px;
        }
    }
</style>
