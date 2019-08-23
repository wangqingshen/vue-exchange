<template>
    <div class="balance-wrapper" v-title="pageTitle">
        <div class="balance-box">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list v-model="loading" :finished="finished" :offset="offset" @load="loadMore" >
                    <div class="list-item" v-for="(item, index) in walletData" :key="index">
                        <div class="item-l">
                            <div class="item-detail">{{item.name}}</div>
                            <div class="time">{{item.create_time}}</div>
                        </div>
                        <div class="item-r">
                            <div class="account" v-if="item.state == 1">+{{item.amount}}元</div>
                            <div class="account" v-else-if="item.state == 2">-{{item.amount}}元</div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <!-- 底线 -->
        <noMore :finished="finished"></noMore>
    </div>
</template>

<script>
    import noMore from '@/components/no-more'
    export default {
        name: 'balance',
        data(){
            return {
                pageTitle: '余额明细',
                member_id: '',
                isLoading: false,
                loading: false,//加载中提示，加载过程中不触发load事件
                finished: false,//加载完成，加载完成后不再触发load事件
                offset:50,//滚动条与底部距离小于offset触发loading
                page: '1',
                page_size: '20',
                isMore: false,
                noMore: false,
                walletData: [],
            }
        },
        components: {
            noMore
        },
        methods:{
            //上拉加载
            loadMore() {
               if(!this.finished && this.isMore){
                   if(this.walletData.length < 10){
                    //    关闭加载提示
                       this.loading = false
                       this.noMore = true
                       return
                   }else{
                       this.page++
                       setTimeout(()=>{
                           this.walletlist({page: this.page, page_size: 20})
                       }, 500);
                   }
               }
            },
            //下拉刷新
            onRefresh() {
                setTimeout(() => {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                    this.page = 1;
                    this.isMore = false
                    this.noMore = false
                    this.finished = false
                    this.walletData = []
                    this.walletlist()
                }, 500);
            },
            walletlist({page=1, page_size=20}={}){
                // 加载中提示
                this.loading = true
                this.$api.walletlist({
                    cmd:{
                        wallet:'memberbalance'
                    },
                    data:{
                        member_id:this.member_id,
                        page: page,
                        page_size: page_size,
                    }
                    }).then(res=>{
                        console.log(res)
                        if(res.code===1){
                            this.walletData = [...this.walletData,...res.data]
                            //更多
                            this.isMore = true
                            //关闭加载提示
                            this.loading = false
                            if(res.data.length < 10){
                                this.noMore = true
                                this.$toast.success('没有更多了')
                                //加载完成
                                this.finished = true
                            }
                        }
                })
            },
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.walletlist()
        },
    }
</script>

<style lang="scss" type="text/scss">
    .balance-wrapper{
        .balance-box{
            background: #fff;
            padding: 0 15px;
            color: #353535;
            .list-item{
                height: 50px;
                border-bottom: 1px solid #DEDEDE;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 10px;
                font-size: 13px;
                .item-l{
                    padding-top: 7px;
                }
            }
        }
        // .no-more{
        //     padding:26px 0;
        //     text-align: center;
        //     font-size: 14px;
        //     color: #353535;
        // }
    }
</style>
