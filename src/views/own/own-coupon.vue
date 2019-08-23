<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="ownCoupon-inner">
            <div class="ownCoupon-bar">
                <div class="ownCouponBar-inner">
                    <div class="list">
                        <div class="couponBar-item" v-for="(item, index) in couponBar" :index="index" :class="{'active':state === item.state }" @click="changeCoupon({state: item.state})">
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="line" :class="stepClass"></div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="orderList" :offset="offset" v-if="!noData">
                <couponItem type='2' :couponItemData="couponItemData" @emitUseIt="useImmediate" :state="state"></couponItem>
                <noMore :finished="finished"></noMore>
            </van-list>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="">暂无优惠券~</div>
            </div>
        </div>
    </div>
</template>
<script>
    import couponItem from '@/components/couponItem'
    import noMore from '@/components/no-more'
    export default{
        name:'coupon',
        data(){
            return{
                couponBar: [
                    {name: '未使用', state: 1},
                    {name: '已使用', state: 2},
                    {name: '已过期', state: 3},
                ],
                pageTitle:'我的优惠券',
                couponItemData:[],
                userInfo:'',
                loading: false,
                finished: false,
                offset:50,
                isMore:false,
                state:1,
                page:1,
                noData:false
            }
        },
        components:{
            couponItem,
            noMore
        },
        computed:{
            stepClass(){
                if(this.state === 1){
                    return false
                }else {
                    return `line-step${this.state}`
                }
            }
        },
        methods:{
            loadMore(){
                if(!this.finished && this.isMore){
                    if(this.couponItemData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getCoupons({page:this.page,type:this.state})
                        },500)
                    }

                }
            },
            changeCoupon({state = 1} = {}){
                if(this.state == state) return;
                this.state = state
                this.couponItemData = []
                this.finished = false
                this.isMore = false
                this.page = 1
                this.getCoupons({page:1,type:this.state})
                let status = this.$store.state.tabCard_status
                status.couponList = this.state
                this.$store.dispatch('setTabCardStatus',status)
            },
            useImmediate(item, index){
                if(item.discount_status === 1){
                    if(this.$store.state.goods_history){//清空筛选
                        this.$store.state.goods_history.goods_type = ''
                        this.$store.state.goods_history.goods_label = ''
                    }
                    this.$router.push({name: 'goodList', params: {discount_id: item.id}})
                }
            },
            getCoupons({page = 1,type = 1} = {}){
                this.$api.getOwnCoupon({
                    cmd:{
                        discount:'mydiscountlist'
                    },
                    data:{
                        member_id:this.member_id,
                        type:type,
                        page:page
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.couponItemData = [...this.couponItemData,...res.data]
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.length < 10){
                            this.finished = true
//                            if(this.page>=2){
//                                setTimeout(()=>{
//                                    this.$toast.success('没有更多了')
//                                },500)
//                            }
                        }
                        if(this.couponItemData.length === 0){
                            this.noData = true
                        }
                    }
                })
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            if(this.$store.state.tabCard_status.couponList) {
                this.state = this.$store.state.tabCard_status.couponList
            }
            this.getCoupons({type: this.state})
        },
    }
</script>
<style lang="scss" type="text/scss">
    .ownCoupon-inner{
        padding-top: 60px;
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
        }
        .ownCoupon-bar{
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            font-size: 14px;
            color: #353535;
            background: #fff;
            z-index: 99;
            .ownCouponBar-inner{
                position: relative;
            }
            .list{
                display: flex;
                align-items: center;
                .couponBar-item{
                    width: 33.33%;
                    flex-grow: 1;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .txt{
                        margin-top: -4px;
                    }
                    &.active{
                        color: #f22a15;
                    }
                }

            }
            .line{
                position: absolute;
                left: 0;
                height: 4px;
                width: 33.33%;
                background: #f22a15;
                bottom: 0;
                transition: transform 0.2s ease-in;
                transform: translateX(0);
                &.line-step2{
                    transform: translateX(100%);
                }
                &.line-step3{
                    transform: translateX(200%);
                }
            }
        }
    }
</style>
