<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="groupDetails-inner">
            <div class="groupDetails-hd">
                <div class="pic">
                    <img v-lazy="groupData.goods_img" alt="">
                </div>
                <div class="info">
                    <div class="desc">{{groupData.goods_name}}</div>
                    <div class="bottom">
                        <div class="l">
                            <div class="price">￥{{groupData.sku_price}}</div>
                            <div class="num">{{groupData.group_people_num}}人团</div>
                        </div>

                        <div class="status">{{groupData.team_status|groupStatus}}</div>
                    </div>
                </div>

            </div>
            <div class="groupDetails-bd">
                <div class="group-team">
                    <div class="hd">
                        <div class="line"></div>
                        <div class="count-time" v-if="time > 0">
                            <div class="countDown-temp-box" >
                                <div class="">
                                    <div class="countDown-box">
                                        <div class="txt">剩余</div>
                                        <div class="countDown-inner" >
                                            <div class="box h">{{timeObj.hr}}</div>
                                            <div class="box box2">:</div>
                                            <div class="box m">{{timeObj.min}}</div>
                                            <div class="box box2">:</div>
                                            <div class="box s">{{timeObj.sec}}</div>
                                        </div>
                                        <div class="txt">结束</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="status-txt" v-if="groupData.team_status === 1">拼团成功</div>
                        <div class="status-txt" v-if="groupData.team_status === 2">拼团失败</div>
                        <div class="line"></div>
                    </div>
                    <div class="bd">
                        <div class="tips" v-if="groupData.team_status === 0">还差{{groupData.group_people_num - groupData.team_num}}人成团，赶紧邀请好友加入吧！</div>
                        <div class="user-teamList">
                            <div class="user-teamItem" v-for="(item,index) in groupData.team_user" :key="index">
                                <img :src="item.member_avatar" alt="">
                                <div class="tz" v-if="index === 0">团长</div>
                            </div>
                            <div class="add-people" @click="shareGroupToast" v-if="groupData.team_status === 0">
                                <van-icon name="add-o" />
                            </div>
                        </div>
                        <div class="group-progress">
                            <div class="progress-inner">
                                <div class="pro-bar" :style="{width:groupData.percentage+'%'}">
                                    <div class="num">{{groupData.percentage+'%'}}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="group-step">
                    <div class="hd">
                        <div class="line"></div>
                        <div class="txt">拼团流程</div>
                        <div class="line"></div>
                    </div>
                    <div class="bd">
                        <div class="title-r" @click="ins_dialog = !ins_dialog">
                            <div class="">详细说明</div>
                            <van-icon name="arrow"/>
                        </div>
                        <div class="spell-stepList">
                            <div class="spell-stepItem">
                                <div class="cir">1</div>
                                <div class="txt">选择商品</div>

                            </div>
                            <div class="spell-stepItem">
                                <div class="cir">2</div>
                                <div class="txt">开团参团</div>

                            </div>
                            <div class="spell-stepItem">
                                <div class="cir">3</div>
                                <div class="txt">邀请好友</div>

                            </div>
                            <div class="spell-stepItem">
                                <div class="cir">4</div>
                                <div class="txt">人满开团</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="group-btns">
            <div class="alone-btn" @click="goGroupListPage">
                <div class="txt">更多拼团</div>
            </div>
            <div class="spell-btn" @click="$toast('点击微信上方三个点发送给朋友即可')" v-if="groupData.user_status===1 && groupData.team_status === 0">
                <div class="txt">邀请好友参团</div>
            </div>
            <div class="spell-btn" @click="addGroupFun" v-if="groupData.user_status===0 && groupData.team_status === 0">
                <div class="txt">立即参团</div>
                <div class="num">￥{{groupData.sku_price}}</div>
            </div>
            <div class="spell-btn" @click="goGroupDetailsPage" v-if="(groupData.team_status === 1 && groupData.goods_state === 4) || (groupData.team_status === 2 && groupData.goods_state === 4)">
                <div class="txt">立即开团</div>
                <div class="num">￥{{groupData.sku_price}}</div>
            </div>
        </div>

        <van-popup v-model="ins_dialog" class="ins-dialog">
            <div class="ins-box">
                <p>1.开团：在商城内选择喜欢的商品，点击“去开团”，付款成功后即为开团成功</p>
                <p>2.参团：进入朋友分享的页面，点击“立即参团”，付款后即为参团成功，若多人同时支付，按先支付成功的用户获得参团资格，参团订单未支付不计入参团数量，团过期未支付订单失效，但参团人信息也会显示在团里面</p>
                <p>3.成团：在开团或参团之后,可以点击“分享出去”，在有效时间凑齐成团人数即拼团成功</p>
                <p>4.组团失败：在有效时间内未凑齐人数，即为组团失败，此时商城会将原款分别退回</p>
            </div>
        </van-popup>
    </div>
</template>
<script>
    import countTime from '@/components/countDown'
    export default{
        name:'',
        data(){
            return{
                pageTitle:'拼团详情',
                time:'',
                userInfo:'',
                member_id:'',
                groupData:{},
                progress:'',
                timeObj:{},
                isCountDown:true,
                interval:null,
                team_id:'',
                spu_id:'',
                tempTeam_id:'',
                ins_dialog:false
            }
        },
        components: {
            countTime
        },
        computed: {

        },
        watch: {},
        methods:{
            countDown() {
                if(this.isCountDown){
                    let timeObj=this.dateFormat(this.time)
                    this.timeObj = timeObj
                    if(this.time<= 0 ){
                        this.isCountDown = false
                    }
                    this.interval = setTimeout(()=>{
                        this.time-= 1000
                        this.countDown()
                    },1000)
                }
            },
            timeFormat(param) {
                return param < 10 ? '0' + param : param;
            },
            dateFormat (time) {

                if(time>0){
                    var second = Math.floor(time/1000)
                    var day = Math.floor(second / (3600*24))
                    var hr = Math.floor(second % (60 * 60 * 24) / 3600)
                    var min = Math.floor(second % (3600 * 24) % 3600 / 60)
                    var sec = second % (60 * 60 * 24) % 3600 % 60
                    var micro_sec = Math.floor((time % 1000) / 10)

                    return {
                        day:this.timeFormat(day),
                        hr:this.timeFormat(hr),
                        min:this.timeFormat(min),
                        sec:this.timeFormat(sec),
                        micro_sec:this.timeFormat(micro_sec)
                    }
                }else {
                    return {
                        day:'00',
                        hr:'00',
                        min:'00',
                        sec:'00',
                        micro_sec:'00'
                    }
                }

            },
            addGroupFun(){
                this.$router.replace({name:'goodsDetails',params:{spu_id:this.spu_id,team_id:this.groupData.team_id,isAddGroup:true}})
            },
            goGroupListPage(){
                this.$router.replace({name:'groupList'})
            },
            shareGroupToast(){
                this.$toast('点击微信上方三个点发送给朋友即可')
            },
            shareGroup(item){
                let shareData = {}
                shareData.linkName = `goods.groupDetails.${item.goods_spu_id}.${item.team_id}`
                shareData.desc = `我在拥军换换发现一个不错的商品，赶紧来一起拼单吧。`
                shareData.title = `【等你上车】${item.sku_price}元拼${item.goods_name}`
                shareData.imgUrl = item.goods_img
                this.$share.api(shareData)
            },
            goGroupDetailsPage(){
                this.$router.push({name:'goodsDetails',params:{spu_id:this.spu_id}})
            }

        },
        created() {
            this.team_id = this.$route.params.team_id
            this.spu_id = this.$route.params.spu_id
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.$api.getGroupTeamInfo({
                cmd:{
                    group: 'GroupTeamInfo'
                },
                data:{
                    team_id:this.team_id,
                    member_id:this.member_id
                }
            }).then(res=>{
                console.log(res)
                if(res.code===1){
                    this.groupData = res.data
                    this.groupData.remain_time = (this.groupData.remain_time )*1000
                    this.time = this.groupData.remain_time
                    this.countDown()
                    this.shareGroup(this.groupData)
                }
            })

        },
        mounted() {

        },
        destroyed(){
            clearInterval(this.interval)
        }
    }
</script>
<style lang="scss" type="text/scss">
    .groupDetails-inner{
        .groupDetails-hd{
            background: #fff;
            padding: 15px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .pic{
                background: #f5f5f5;
                width: 75px;
                height: 75px;
                border-radius: 5px;
                margin-right: 10px;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    height: 100%;
                }
            }
            .info{
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-grow: 1;
                .desc{
                    font-size: 15px;
                    color: #000;
                }
                .bottom{
                    display: flex;
                    justify-content: space-between;
                    .l{
                        display: flex;
                    }
                    .price{
                        font-size: 18px;
                        color: #F22A15;
                        line-height: 1;
                        align-self: flex-end;
                        margin-right: 10px;

                    }
                    .num{
                        padding: 1px 2px;
                        color: #F22A15;
                        font-size: 12px;
                        border-radius: 5px;
                        border: 1px solid #F22A15;
                        align-self: flex-end;
                    }
                    .status{
                        width: 55px;
                        height: 55px;
                        background: #F22A15;
                        border-radius: 100%;
                        font-size: 12px;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-top: -18px;
                        text-align:center;
                    }
                }
            }

        }
        .groupDetails-bd{
            background: #fff;
            padding: 15px;
            font-size: 14px;
            .group-team{
                .hd{
                    display: flex;
                    position: relative;
                    .line{
                        width: 90px;
                        height: 1px;
                        background: #b2b2b2;
                        transform: scaleY(0.5);
                        margin-top: 7px;
                        flex-grow: 1;
                    }
                    .status-txt{
                        margin: 0 5px;
                    }
                    .count-time{
                        margin: 0 5px;
                        .countDown-temp-box{
                            font-size: 10px;
                            color: #353535;
                            line-height: 1;
                            .countDown-box{
                                display: flex;
                            }
                            .txt{
                                font-size: 14px;
                                color: #000;
                            }
                            .countDown-inner{
                                margin: 0 5px;
                                display: flex;
                                align-items: center;
                            }
                            .box{
                                text-align: center;
                                &.d,&.h,&.m,&.s{
                                    background: #F22A15;
                                    border-radius: 5px;
                                    width: 20px;
                                    height: 15px;
                                    color: #fff;
                                    font-size: 12px;
                                    line-height: 15px;
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
                }
                .bd{
                    .tips{
                        text-align: center;
                        font-size: 13px;
                        color: #353535;
                        margin-top: 6px;
                    }
                    .user-teamList{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #353535;
                        margin: 20px auto 20px;
                        flex-wrap: wrap;
                        width: 300px;
                        .add-people{
                            height: 40px;
                            .van-icon{
                                font-size: 40px;
                                color: #F22A15;
                            }
                        }
                        .user-teamItem{
                            width: 40px;
                            height: 40px;
                            border-radius: 100%;
                            background: #f5f5f5;
                            position: relative;
                            margin: 0 10px 10px 10px;


                            img{
                                height: 40px;
                                border-radius: 100%;
                            }
                            .tz{
                                padding: 1px 3px;
                                border-radius:4px;
                                font-size: 10px;
                                text-align: center;
                                position: absolute;
                                color: #fff;
                                right: -5px;
                                top: -5px;
                                background: #353535;
                            }

                        }

                    }
                    .group-progress{
                        padding: 0 37px;
                        display: flex;
                        .progress-inner{
                            border: 1px solid #F22A15;
                            border-radius: 5px;
                            height: 21px;
                            flex-grow: 1;
                            overflow: hidden;
                            .pro-bar{
                                width: 0;
                                background: #F22A15;
                                border-radius: 0 5px 5px 0;
                                position: relative;
                                height: 100%;
                                .num{
                                    position: absolute;
                                    left: 50%;
                                    top: 50%;
                                    color: #fff;
                                    transform: translate(-50%,-50%)
                                }
                            }
                        }
                    }
                }
            }
            .group-step{
                margin-top: 20px;
                .hd{
                    display: flex;
                    position: relative;
                    .line{
                        width: 90px;
                        height: 1px;
                        background: #b2b2b2;
                        transform: scaleY(0.5);
                        margin-top: 10px;
                        flex-grow: 1;
                    }
                    .txt{
                        margin: 0 5px;
                    }
                }
                .bd{
                    .title-r{
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        font-size: 14px;
                        color: #888;
                        .van-icon{
                            font-size: 14px;
                        }
                    }
                    .spell-stepList{
                        margin-top: 25px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .spell-stepItem{
                            position: relative;
                            flex-grow: 1;
                            width: 25%;
                            flex-direction: column;
                            display: flex;
                            align-items: center;
                            &:after{
                                content: '';
                                position: absolute;
                                top: 10px;
                                left: 66%;
                                width: 66%;
                                height: 1px;
                                background: #b2b2b2;
                                transform: translateY(-50%) scaleY(0.5);

                            }
                            &:last-child{
                                &:after{
                                    content: normal;
                                }
                            }
                            .cir{
                                width: 20px;
                                height: 20px;
                                margin: 0 0 5px;
                                border: 1px dashed #B2B2B2;
                                border-radius: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                            }
                            &:last-child{
                                .cir:after{
                                    content: normal;
                                }
                            }

                        }
                    }
                }
            }

        }
    }
    .group-btns{
        display: flex;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        background: #fff;
        align-items: center;
        border-top:1px solid #eee;
        z-index: 99;
            .alone-btn{
                background: #FFB30D;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                height: 50px;
                flex-grow: 1;
                width: 152px;
                .txt{
                    font-size: 18px;
                }
                .num{
                    font-size: 15px;
                }
            }
            .spell-btn{
                background: #F22A15;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                height: 50px;
                flex-grow: 1;
                width: 152px;
                .txt{
                    font-size: 18px;
                }
                .num{
                    font-size: 15px;
                }

            }

    }
    .ins-dialog{
        .ins-box{
            padding: 15px;
            font-size: 14px;
            color: #353535;
            width: 300px;
        }
    }
</style>
