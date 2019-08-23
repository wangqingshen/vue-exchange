<template>
    <div class="secKill-wrapper" v-title="pageTitle">
        <div class="secKill-inner">
            <div class="no-data" v-if="noData2">
                <div class="pic"></div>
                <div class="">秒杀活动暂未开启</div>
            </div>
            <van-tabs sticky @change="changeList" :line-width="lineWidth" v-model="tabCardNum" v-else>
                <van-tab v-for="(item,index) in ChannelLists" :key="index">
                    <div slot="title" class="menu">
                        <div class="time">{{item.seckill_time_start_time.substring(0,5)}}</div>
                        <div class="txt">{{item.is_start === 1 && item.is_tomorrow === 0 ? '抢购中' : '即将开始'}}</div>
                    </div>
                    <div class="secKill-countDown">
                        <div class="tit">全场爆款，限时抢购</div>
                        <count-down temp="3" :timeProps="item.time" :isStart="item.is_start" v-if="index === 0 && is_tomorrow !== 1"></count-down>
                        <div class="static_time_box" v-if="index !== 0 || is_tomorrow === 1">
                            <div class="static_time">
                                <div class="box h">{{item.seckill_time_start_time.substring(0,2)}}</div>
                                <div class="box box2">:</div>
                                <div class="box m">{{item.seckill_time_start_time.substring(3,5)}}</div>
                                <div class="box box2">:</div>
                                <div class="box s">{{item.seckill_time_start_time.substring(6,8)}}</div>
                            </div>
                            <div class="">准时开抢</div>
                        </div>
                    </div>
                    <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="offset">
                        <div class="secKill-list">
                            <div class="secKill-item vux-1px-b" v-for="(secItem,index2) in secKillData" :key="index2" @click="goDetails(secItem)">
                                <div class="pic">
                                    <img v-lazy="secItem.goods_img" alt="">
                                </div>
                                <div class="info" :class="{'g':is_tomorrow === 1 || !is_start}">
                                    <div class="desc">{{secItem.goods_name}}</div>
                                    <div class="price">
                                        <div class="newP">￥{{secItem.seckill_price}}</div>
                                        <div class="oldP">原价￥{{secItem.goods_price}}</div>
                                    </div>
                                    <div class="bottom">
                                        <div class="pro" v-if="is_tomorrow === 0 && is_start">
                                            <div class="pro-bar">
                                                <div class="bar" :style="{width:secItem.goods_sell_percent+'%'}"></div>
                                            </div>
                                            <div class="txt">已售{{secItem.goods_sell_percent | toFixedTwo}}%</div>
                                        </div>
                                        <div class="pro" v-if="is_tomorrow === 1 || !is_start">{{seckill_time_start_time}}准时开抢</div>
                                        <div class="secKill-btn">立刻抢购</div>
                                    </div>
                                </div>
                            </div>
                            <div class="" v-if="secKillData.length > 5">
                                <noMore :finished="finished"></noMore>
                            </div>

                        </div>
                        <div class="no-data" v-if="noData">
                            <div class="pic"></div>
                            <div class="">秒杀活动暂未开启</div>
                        </div>
                    </van-list>
                </van-tab>
            </van-tabs>
            
        </div>
    </div>
</template>
<script>
    import countDown from '@/components/countDown'
    import noMore from '@/components/no-more'
    export default {
        name: 'secKill',
        data() {
            return {
                pageTitle:'限时秒杀',
                list: [],
                offset:50,
                lineWidth:0.001,
                loading: false,
                finished: false,
                noData:false,
                isMore:false,
                page:1,
                total:'',
                timeObj:{},
                time:'',
                isCountDown:true,
                interval:null,
                seckill_time_id:'',
                ChannelLists:[],
                secKillData:[],
                is_start:1,
                seckill_time_end_time:'',
                seckill_time_start_time:'',
                noData2:false,
                is_tomorrow:0,
                tabCardNum:0

            }
        },
        components: {
            countDown,
            noMore
        },
        computed: {

        },
        watch: {},
        methods: {
            changeList(index){
                this.finished = false
                this.secKillData = []
                this.seckill_time_id = this.ChannelLists[index].seckill_time_id
                this.page = 1
                this.seckill_time_id = this.ChannelLists[index].seckill_time_id
                this.is_start = this.ChannelLists[index].is_start
                this.seckill_time_end_time = this.ChannelLists[index].seckill_time_end_time
                this.seckill_time_start_time = this.ChannelLists[index].seckill_time_start_time
                this.getSecKillList({page:this.page,seckill_time_id:this.seckill_time_id})
                this.is_tomorrow = this.ChannelLists[index].is_tomorrow
                console.log(this.is_tomorrow, this.is_start, '000')
            },
            loadMore(){
                if(!this.finished && this.isMore){
                    if(this.secKillData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getSecKillList({page:this.page,seckill_time_id:this.seckill_time_id})
                        },500)
                    }

                }
            },
            getSecKillList({page = 1,type = 1,seckill_time_id}={}){
                this.$api.getSecKillList({
                    cmd:{
                        seckill:'seckillgoodslists'
                    },
                    data:{
                        page:page,
                        type:type,
                        seckill_time_id:seckill_time_id,
                        pageNum:10
                    }
                }).then(res=>{
                    console.log(res.data)
                    if(res.code === 1){
                        this.loading = false
                        this.noData = false
                        this.isMore = true
                        if(this.page) {
                            this.secKillData = res.data
                        }else{
                            this.secKillData = [...this.secKillData,...res.data]
                        } 
                        if(this.secKillData.length === 0){
                            this.noData = true
                            this.finished = true
                        }

                        if(res.data.length < 10){
                            this.finished = true
                            if(this.page>=2){
                                setTimeout(()=>{
                                    console.log(this.page)
                                    this.$toast.success('没有更多了')
                                },500)
                            }

                        }
                    }
                }).catch(err=>{

                })
            },
            goDetails(item){
                this.$store.dispatch('setSecKill',true)
                this.$router.push({name:'goodsDetails',params:{spu_id:item.spu_id,is_tomorrow:this.is_tomorrow}})
            }


        },
        created() {
            this.$api.getSecKillChannel({
                cmd:{
                    seckill:'getseckillphaselist'
                }
            }).then(res=>{
                console.log(res, 456)
                if(res.code===1){
                    this.ChannelLists = res.data
                    
                    if(this.ChannelLists.length === 0 ){
                        this.noData2 = true
                    }
                    this.seckill_time_id = this.ChannelLists[0].seckill_time_id
                    this.is_tomorrow = this.ChannelLists[0].is_tomorrow
                    this.ChannelLists.forEach(item=>{
                        item.time = item.time * 1000
                    })

                }
                return {
                    seckill_time_id:this.ChannelLists[0].seckill_time_id
                }
            }).then(res=>{
                this.getSecKillList({seckill_time_id:res.seckill_time_id})
                console.log(this.is_tomorrow)
            })
        },
        mounted() {

        },

    }
</script>
<style lang="scss" type="text/scss">
.secKill-wrapper{
    .secKill-inner{
        .no-data{
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
        .van-tab{
            line-height:normal ;
            font-size: 14px;
            color: #353535;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.van-tab--active{
                color: #F22A15;
            }
        }
        .van-tabs__content{
            padding-top: 25px;
        }

        .secKill-countDown{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #DCDCDC;
            padding-right: 10px;
            position: fixed;
            left: 0;
            width: 100%;
            top: 44px;
            z-index: 2;
            .tit{
                border-left:10px solid #F22A15;
                height: 25px;
                line-height: 25px;
                color: #F22A15;
                font-size: 13px;
                padding-left: 5px;
            }
            .static_time_box{
                display: flex;
                align-items: center;
            }
            .static_time{
                display: flex;
                align-items: center;
                margin: 0 2px;
                .box{
                    text-align: center;
                    &.h,&.m,&.s{
                        background: #F22A15;
                        border-radius: 5px;
                        width: 20px;
                        height: 15px;
                        color: #fff;
                        font-size: 12px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    &.box2{
                        width: auto;
                        height: 15px;
                        line-height: 15px;
                        margin: 0 2px;
                    }
                }
            }

        }
        .secKill-list{
            background: #fff;
            .secKill-item{
                position: relative;
                display: flex;
                justify-content: space-between;
                flex-grow: 1;
                padding: 15px;
                .pic{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f5f5f5;
                    width: 90px;
                    height: 90px;
                    border-radius: 5px;
                    margin-right: 30px;
                    flex-shrink: 0;
                    img {
                        height: 100%;
                    }
                }
                .info{
                    display: flex;
                    flex-direction: column;
                    color: #F22A15;
                    justify-content: space-between;
                    font-size: 12px;
                    flex-grow: 1;
                    &.g{
                        color: #00B700;
                        .bottom{
                            .secKill-btn{
                                background: #00B700;
                            }
                        }

                    }
                    .desc{
                        font-size: 14px;
                        display: -webkit-box;
                        white-space: normal;
                        word-break: break-all;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp:2;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        height: 38px;
                        color: #353535;
                    }
                    .price{
                        display: flex;
                        line-height: 1;
                        .newP{
                            font-size: 18px;
                            margin-right: 5px;
                        }
                        .oldP{
                            color: #888;
                            align-self: center;
                        }
                    }
                    .bottom{
                        display: flex;
                        justify-content: space-between;
                        .pro{
                            display: flex;
                            align-items: center;
                            align-self: flex-end;
                            .txt{
                                color: #888;
                            }
                        }
                        .pro-bar{
                            width: 65px;
                            border: 1px solid #F22A15;
                            height: 10px;
                            border-radius: 5px;
                            margin-right: 10px;
                            overflow: hidden;
                            .bar{
                                width: 0;
                                background: #F22A15;
                                border-radius: 0 5px 5px 0;
                                height: 10px;
                            }
                        }
                        .secKill-btn{
                            height: 25px;
                            width: 65px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                            background: #F22A15;
                            border-radius: 5px;
                        }
                    }
                }
            }

        }
    }

}
</style>
