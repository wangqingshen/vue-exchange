<template>
    <div class="groupList-wrapper" v-title="pageTitle">
        <div class="groupList-inner">
            <div class="default" v-if="!ChannelLists.length">
                <div class="pic"></div>
                <div>拼团活动暂未开启</div>
            </div>
            <van-tabs sticky @change="changeList" v-model="tabCardNum" v-else>
                <van-tab v-for="(item,index) in ChannelLists" :title="item.title" :key="index">
                    <van-list v-model="loading" :finished="finished" @load="loadMore" class="goods-list" :offset="offset" v-if="!noData">
                        <div class="goods-item vux-1px-b" v-for="(goodsItem,index2) in goodsItemData" @click="goDetailsPage(goodsItem)" :key='index2'>
                            <div class="pic">
                                <img v-lazy="goodsItem.goods_img" alt="">
                            </div>
                            <div class="details">
                                <div class="desc">{{goodsItem.goods_name}}</div>
                                <div class="info">
                                    <div class="info-l">
                                        <div class="price">￥{{goodsItem.sku_price}}</div>
                                        <div class="num">{{goodsItem.group_people_num}}人团</div>
                                    </div>
                                    <div class="info-r">
                                        <div class="spell-btn" :class="{dis:goodsItem.inventory_status === 0}">{{goodsItem.inventory_status === 1 ? '立即拼团' : '已抢完'}}</div>
                                    </div>
                                </div>
                                <div class="bottom">
                                    <div class="price">单买价￥{{goodsItem.goods_price}}</div>
                                    <div class="num">{{goodsItem.user_num}}人已拼团</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="goodsItemData.length > 5">
                            <noMore :finished="finished"></noMore>
                        </div>
                    </van-list>
                    <div class="no-data" v-if="noData">
                        <div class="pic"></div>
                        <div>暂未发现相关产品</div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import noMore from '@/components/no-more'
    export default {
        name: 'groupGoodsList',
        data() {
            return {
                pageTitle:'超值秒拼',
                ChannelLists:[],
                goodsItemData:[],
                list: [],
                offset:50,
                loading: false,
                finished: false,
                page:1,
                channel_id:'',
                isMore:false,
                total:'',
                noData:false,
                tabCardNum:0
            }
        },
        components: {
            noMore
        },
        computed: {

        },
        watch: {},
        methods: {
            goDetailsPage(item){
                if(item.inventory_status === 1){
                    this.$router.push({name:'goodsDetails',params:{spu_id:item.goods_spu_id}})
                }

            },
            loadMore() {
                if(!this.finished && this.isMore){

                    if(this.goodsItemData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getGroupList({page:this.page,channel_id:this.channel_id})
                        },500)
                    }

                }

            },

            changeList(index){
                this.finished = false
                this.goodsItemData = []
                this.page = 1
                this.channel_id = this.ChannelLists[index].id
                this.getGroupList({page:this.page,channel_id:this.channel_id})

            },
            getChannelLists({channel_id = 0} = {}){
                this.$api.getChannelLists({
                    cmd:{
                        group:'ChannelLists'
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
                        res.data.unshift({id:0,title:'全部拼团'})
                        this.ChannelLists = res.data
                        return this.ChannelLists[0].id
                    }

                }).then(res=>{
                    this.getGroupList({page:1,channel_id:channel_id})
                })

            },
            getGroupList({page = 1,channel_id} = {}){
                this.loading = true
                this.$api.getGroupGoodsList({
                    cmd:{
                        group:'GroupBuyLists'
                    },
                    data:{
                        channel_id:channel_id,
                        page:page
                    }
                }).then(res=>{
                    console.log(res, 123)
                    if(res.code===1){
                        this.noData = false
                        if(page == 1) {
                            this.goodsItemData = res.data.data
                        }else{
                            this.goodsItemData = [...this.goodsItemData,...res.data.data]
                        }
                        this.isMore = true
                        this.total = res.data.total
                        this.loading = false
                        if(this.goodsItemData.length === 0){
                            this.noData = true
                            this.finished = true
                        }

                        if(this.total === this.goodsItemData.length){
                            this.finished = true
                            if(this.page>=2){
                                setTimeout(()=>{
                                    this.$toast.success('没有更多了')
                                },500)
                            }

                        }
                    }

                })
            }
        },
        created() {
            this.getChannelLists()

        },
        mounted() {

        },

    };
</script>

<style lang="scss" type="text/scss">
.groupList-wrapper{   
    .groupList-inner{
        .default{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: contain;
                margin-bottom: 10px;
            }
        }
        .van-tabs__line{
            height: 4px;
        }
        .van-tabs__content{
            padding-top: 10px;
        }
        .van-tabs__wrap {
            height: 50px;
            .van-tab{
                line-height: 50px;
            }
        }
        .no-data{
            font-size:15px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
        }
        .goods-list{
            background: #fff;
            .goods-item{
                display: flex;
                padding: 15px;
                font-size: 14px;
                color: #353535;
                .pic{
                    width: 90px;
                    height: 90px;
                    border-radius: 10px;
                    background: #f5f5f5;
                    margin-right: 30px;
                    flex-shrink: 0;
                    overflow: hidden;
                    img{
                        height: 100%;
                    }
                }
                .details{
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
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
                    .info{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .info-l{
                        display: flex;
                        .price{
                            color: #F22A15;
                            font-size: 20px;
                            line-height: 1;
                            align-self: flex-end;
                            margin-right: 15px;
                        }
                        .num{
                            padding: 1px 2px;
                            color: #FF5E1E;
                            font-size: 12px;
                            border-radius: 5px;
                            border: 1px solid #FF5E1E;
                            padding: 2px 5px;
                        }
                    }
                    .spell-btn{
                        padding: 2px 5px;
                        background:#FF5E1E;
                        border-radius:5px;
                        text-align: center;
                        font-size: 12px;
                        color: #fff;
                        &.dis{
                            background: #B2B2B2;
                        }
                    }
                    .bottom{
                        display: flex;
                        justify-content: space-between;
                        color: #888;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
</style>
