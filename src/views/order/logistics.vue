<template>
    <div class="wrapper">
        <div class="logistics-inner" v-show="pageShow">
            <div class="logistics-desc">
                <div class="pic">
                    <img :src="logisticsData.goods_img" alt="">
                </div>
                <div class="info">
                    <div class="tit">运输中</div>
                    <div class="dd">订单编号：{{logisticsData.order_sn}}</div>
                    <div class="dd">物流方式：快递物流</div>
                    <div class="dd">{{logisticsData.company}}：{{logisticsData.nu}}</div>
                </div>
            </div>
            <div class="logistics-list" v-if="logisticsData.data.length">
                <div class="item" v-for="(item,index) in logisticsData.data" :key="index">
                    <div class="time">
                        <div class="year">{{item.ftime.year}}</div>
                        <div class="hour">{{item.ftime.hour}}</div>
                    </div>
                    <div class="icon">
                        <div class="line"></div>
                        <van-icon :name="index===0 ? 'checked' : 'check'" />
                    </div>
                    <div class="text">{{item.context}}</div>
                </div>

            </div>
            <div class="logistics-nodata" v-else>
                暂无物流详情
            </div>
            <div class="mark">发货备注:{{logisticsData.logistics_remark || '暂无'}}</div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'logistics',
        data(){
            return{
                logisticsData:{},
                order_id:'',
                pageShow: false
            }
        },
        components:{

        },
        computed:{

        },
        watch:{

        },
        methods:{

        },
        created(){
            (async()=>{
                this.order_id = this.$route.params.order_id
                let result
                try{
                    result = await this.$api.logistics({
                        cmd:{
                            logistics:'searchlogistics'
                        },
                        data:{
                            order_id:this.order_id
                        }

                    })
                    console.log(result)
                    if(result.code===1){
                        this.pageShow = true
                        this.logisticsData = result.data
                        this.logisticsData.data.forEach(item=>{
                            let year = item.ftime.split(' ')[0]
                            let hour = item.ftime.split(' ')[1]
                            item.ftime = {year,hour}

                        })

                    }
                }
                catch(err){

                }


            })()
        },
        mounted(){

        }
    }
</script>
<style lang="scss" type="text/scss">
    .logistics-inner{
        .logistics-desc{
            display: flex;
            align-items: center;
            font-size:13px;
            color: #353535;
            background: #fff;
            padding: 12px 15px;
            margin-bottom: 10px;
            .pic{
                width: 80px;
                height: 80px;
                border-radius: 4px;
                overflow: hidden;
                margin-right: 15px;
                img {
                    height: 100%;
                }
            }
            .info{
                .tit{
                    color: #F22A15;
                    font-size: 15px;
                }
            }
        }
        .logistics-list{
            background: #fff;
            padding: 15px;
            font-size: 14px;
            color: #353535;
            margin-bottom: 10px;
            .item{
                display: flex;
                .time{
                    text-align: right;
                    flex-shrink: 0;
                    width: 70px;
                }
                .year{
                    font-size: 12px;
                }
                .hour{
                    font-size: 14px;
                    font-weight: 700;
                }
                .icon{
                    position: relative;
                    margin: 0px 10px 0 10px;
                }
                .van-icon{
                    display: flex;
                    font-size: 15px;
                    background: #fff;
                    position: relative;
                    z-index: 3;
                }
                .line{
                    position: absolute;
                    height: 100%;
                    width: 1px;
                    transform: scaleX(0.5);
                    left: 50%;
                    top: 0;
                    background: #999;
                    z-index: 2;
                }
                .text{
                    margin-bottom: 20px;
                }
                &:first-child{
                    .text{
                        color: #f22a15;
                    }
                    .van-icon{
                        color: #f22a15;
                    }
                }
                &:last-child{
                    .line{
                        height: 0;
                    }
                }
            }

        }
        .logistics-nodata{
            padding: 15px;
            color: #999;
            text-align:center;
            margin-bottom: 10px;
        }
        .mark{
            padding: 15px;
            background: #fff;
            font-size: 13px;
            color: #353535;
            font-weight: 700;
            word-break: break-all;
        }
    }
</style>
