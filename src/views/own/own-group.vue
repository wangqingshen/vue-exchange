<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="ownGroup-inner">
            <van-tabs sticky class="group-content" v-model="tabCardNum" :line-width="lineWidth" @change="changeList">
                <van-tab v-for="(item,index) in menu" :key="index" :title="item">
                    <!--<div slot="title" class="inline">{{item}}</div>-->
                    <van-list v-model="loading" :finished="finished" @load="loadMore"  :offset="offset" v-if="!noData" class="ownGroup-list">
                        <div class="ownGroup-item" v-for="(item,index) in groupListData" :key="index">
                            <div class="hd vux-1px-b">
                                <div class="pic">
                                    <img :src="item.goods_img" alt="">
                                </div>
                                <div class="info">
                                    <div class="desc">{{item.goods_name}}</div>
                                    <div class="num">已有{{item.team_num || 0}}人参团</div>
                                    <div class="price">￥{{item.sku_price}}</div>
                                    <div class="status-icon" :class="{success:team_status === 1,error:team_status === 2}"></div>
                                </div>
                            </div>
                            <div class="ft">
                                <div class="ft-btn" @click="goOrderPage(item)">查看订单</div>
                                <div class="ft-btn" v-if="item.order_state !== 1" @click="goGroupPage(item)">拼团进度</div>
                                <div class="ft-btn" v-if="item.order_state === 1" @click="goPayPage(item)">去付款</div>
                            </div>
                        </div>
                        <noMore :finished="finished"></noMore>
                    </van-list>
                    <div class="no-data" v-if="noData">
                        <div class="pic"></div>
                        <div class="">暂无相关拼团信息</div>
                    </div>

                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
    import noMore from '@/components/no-more'
    export default{
        name:'own-group',
        data(){
            return{
                pageTitle:'我的拼团',
                menu:['正在拼团','成功团','失败团'],
                lineWidth:65,
                offset:50,
                loading: false,
                finished: false,
                isMore:false,
                noData:false,
                userInfo:'',
                member_id:'',
                total:'',
                groupListData:[],
                page:1,
                team_status:0,
                tabCardNum:0
            }
        },
        components:{
            noMore
        },
        methods:{
            loadMore(){
                if(!this.finished && this.isMore){
                    if(this.groupListData.length < 3){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getGroupList({page:this.page,team_status:this.team_status})
                        },500)
                    }

                }
            },
            changeList(index){
                if(this.team_status == index) return;
                this.finished = false
                this.groupListData = []
                this.page = 1
                this.team_status = index
                this.getGroupList({page:this.page,team_status:this.team_status})
                let status = this.$store.state.tabCard_status
                status.ownGroupList = this.team_status
                this.$store.dispatch('setTabCardStatus',status)
            },
            getGroupList({page = 1,team_status = 0} ={}){
                this.loading = true
                this.$api.getOwnGroupList({
                    cmd:{
                        member:'MyGroupTeam'
                    },
                    data:{
                        member_id:this.member_id,
                        team_status:team_status,
                        page: page

                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
                        this.groupListData = [...this.groupListData,...res.data.data]
                        this.total = res.data.total
                        this.isMore = true
                        this.loading = false
                        this.noData = false
                        if(this.groupListData.length === 0){
                            this.noData = true
                            this.finished = true
                        }
                        if(this.total === this.groupListData.length){
                            this.finished = true
                        }
                    }else {
                        this.noData = true
                        this.loading = false
                    }

                })
            },
            goOrderPage(item){
                this.$router.push({name:'orderDetails',params:{order_id:item.user_order_id}})
            },
            goGroupPage(item){
                this.$router.push({name:'groupDetails',params:{team_id:item.team_id,spu_id:item.goods_spu_id}})
            },
            goPayPage(item){
                let payWay = {
                    type:'order_id',
                    goodsType:1
                }
                this.$store.dispatch('setPayWay',payWay)
                this.$router.push({name:'payCashier',params:{order_num:item.user_order_id}})
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            if(this.$store.state.tabCard_status.ownGroupList) {
                this.team_status = this.$store.state.tabCard_status.ownGroupList
                this.tabCardNum = this.$store.state.tabCard_status.ownGroupList
            }
            this.getGroupList({team_status: this.team_status})

        },
    }
</script>
<style lang="scss" type="text/scss">
    .ownGroup-inner{
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
        .group-content{
            .van-tabs__line{
                height: 4px;
            }
            .van-tabs__content{
                padding-top: 10px;
            }
            .van-ellipsis{
                display: inline;
                &:after{
                    content: '';
                    width: 0;
                    height: 16px;
                    top: 50%;
                    background: #888;
                    position: absolute;
                    right: 0;
                    transform: scaleX(0.5) translateY(-50%);
                }
            }
            .van-tabs__wrap {
                height: 50px;
                .van-tab{
                    line-height: 50px;
                    &:last-child{
                        .van-ellipsis{
                            &:after{
                                content: normal;
                            }
                        }
                    }
                }
            }
            

        }

        .ownGroup-list{
            .ownGroup-item{
                background: #fff;
                padding-left: 15px;
                padding-top: 15px;
                font-size: 13px;
                margin-bottom: 10px;
                .hd{
                    display: flex;
                    padding-bottom: 15px;
                    .pic{
                        width: 80px;
                        height: 80px;
                        border-radius: 5px;
                        background: #f5f5f5;
                        margin-right: 8px;
                        flex-shrink: 0;
                        overflow: hidden;
                        img{
                            height: 100%;
                        }
                    }
                    .info{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        flex-grow: 1;
                        .desc{
                            display: -webkit-box;
                            white-space: normal;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp:2;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            height: 38px;
                        }
                        .num{
                            font-size: 10px;
                            color: #888;
                            margin-bottom: 5px;
                        }
                        .price{
                            font-size: 14px;
                            color: #F22A15;
                            line-height: 1;
                        }
                        .status-icon{
                            position: absolute;
                            right: 0;
                            top: 0;
                            width: 115px;
                            height: 80px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            &.success{
                                background-image: url('../../assets/images/icon-pintuanchenggong@2x.png');
                            }
                            &.error{
                                background-image: url('../../assets/images/icon-pintuanshibai@2x.png');
                            }
                        }
                    }
                }
                .ft{
                    display: flex;
                    justify-content: flex-end;
                    padding: 10px 0;
                    .ft-btn{
                        margin-right: 15px;
                        width: 70px;
                        height: 25px;
                        border: 1px solid #b2b2b2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        line-height: 1;
                    }
                }
            }
        }
    }

</style>
