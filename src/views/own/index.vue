<template>
    <div class="own-wrapper" v-title="pageTitle">
        <!-- 头部信息 -->
        <div class="own-hd">
            <div class="userInfo">
                <div class="userLogo" @click="clickAvatarEvt">
                    <img :src="member_avatar" />
                </div>
                <div class="userText">
                    <div v-if="userInfo.member_id">
                        <span class="userName">{{member_nick_name}}</span>
                        <span class="userTip">{{Number(total_cash) ?'通过拥军换换，一共赚取了'+ total_cash +'元' : '虽然没赚到钱，没事儿常来转转'}}</span>
                    </div>
                    <div v-else>
                        <span class="noLogin">点击头像获取信息</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 中间内容 -->
        <div class="own-bd">
            <!-- 我的订单 -->
            <div class="own-order">
                <div class="order-box">
                    <div class="order-box-bd">
                        <div class="order-item" v-for="(item, index) in typeList" :index="index" @click="goOrderList(item.type)" :key="index">
                            <div class="order-icon">
                                <img :src="item.icon" />
                            </div>
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 面板 -->
            <div class="own-cell">
                <div class="cell-box">
                    <div class="cell-item" v-for="(item, index) in oneCellList" :index="index" @click="goLink(item.link)" :key="index" >
                        <div class="item-l">
                            <div class="item-icon">
                                <img :src="item.icon"/>
                            </div>
                            <div class="txt">{{item.name}}</div>
                        </div>
                        <div class="item-r">
                            <div class="arrow-right">
                                <img src="../../assets/images/ic_order_rightarrow.png" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cell-box">
                    <div class="cell-item" v-for="(item, index) in secCellList" :index="index" @click="goLink(item.link)" :key="index" v-show="index==1 || index==0 && league_state!==1">
                        <div class="item-l">
                            <div class="item-icon">
                                <img :src="item.icon"/>
                            </div>
                            <div class="txt">{{item.name}}</div>
                        </div>
                        <div class="item-r">
                            <div class="txt" v-if="index==0">{{league_state == -1?'':(league_state == 0?'审核中':(league_state == 2? '审核不通过': ''))}}</div>
                            <div class="arrow-right">
                                <img src="../../assets/images/ic_order_rightarrow.png" />
                            </div>
                        </div>
                    </div>
                    <a class="cell-item tel" :href="'tel:'+service">
                        <div class="item-l">
                            <div class="item-icon">
                                <img src="../../assets/images/icon_service@2x.png"/>
                            </div>
                            <div class="txt">客服帮助</div>
                        </div>
                        <div class="item-r">
                            <div class="txt">{{service}}</div>
                            <div class="arrow-right">
                                <img src="../../assets/images/ic_order_rightarrow.png" />
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <Footer :pageIndex="pageIndex"/>
    </div>
</template>
<script>
    import Footer from '@/components/Footer.vue'
    export default{
        name:'ownIndex',
        data(){
            return{
                pageIndex: 4,
                pageTitle:'个人中心',
                z:'0',
                userInfo: {},
                member_avatar: '',
                member_id:'',
                member_nick_name: '',
                total_cash: '',
                league_state: -1,
                league_err: '',
                isLeague: true,
                store_id: '',
                sellerData:{
                    seller_id: '',
                    status: '',
                },
                service: '',
                shopCarNum:0,
                typeList: [
                    {icon: require('../../assets/images/btn_icon_fabu@2x.png'), name: '我发布的', type: 'publish'},
                    {icon: require('../../assets/images/btn_icon_sale@2x.png'), name: '我卖出的', type: 'sell'},
                    {icon: require('../../assets/images/btn_icon_buy@2x.png'), name: '我买到的', type: 'buy'},
                    {icon: require('../../assets/images/btn_icon_want@2x.png'), name: '我想要的', type: 'want'},
                ],
                oneCellList: [
                    {icon: require('../../assets/images/icon_wallet@2x.png'), name: '我的钱包', link: 'wallet'},
                    {icon: require('../../assets/images/icon_Spell@2x.png'), name: '我的拼团', link: 'ownGroup'},
                    {icon: require('../../assets/images/icon_coupons@2x.png'), name: '我的优惠券', link: 'coupon'},
                    {icon: require('../../assets/images/icon_shopping_cart@2x.png'), name: '我的购物车', link: 'shopCar'},
                ],
                secCellList: [
                    {icon: require('../../assets/images/icon_cooperation@2x.png'), name: '合作加盟', link: 'league'},
                    {icon: require('../../assets/images/icon_shop@2x.png'), name: '关于商城', link: 'AboutUs'},
                ]
            }
        },
        components:{
            Footer
        },
        methods:{
            clickAvatarEvt() {
                this.userInfo.member_id == undefined ? this.getUserInfo() : this.goPage4()
            },
            getUserInfo() {

            },
            goLink(link) {
                console.log(link)
                var link = link,
                    params = {};
                if(link == 'ownGroup') {
                    params = {state:0}
                }else if(link == 'league'){
                    params = {league_state: this.league_state, league_err: this.league_err, store_id:this.store_id}
                }else{
                    this.$router.push({name: link})
                }
                this.$router.push({name: link, params: params})
            },
            goPage4(){
                this.$router.push({name: 'userInfo',params:{member_id:this.member_id}})
            },
            goOrderList(type){
                let name = type+'List';
                let status = this.$store.state.tabCard_status
                status.buyList = 0
                this.$router.push({name:name})
            },
            memberInfo(){
                this.$api.memberInfo({//用户信息
                    cmd:{
                        wallet:'memberinfo'
                    },
                    data:{
                        member_id:this.member_id,
                    }
                    }).then(res=>{
                        console.log(res,'memberInfo')
                        if(res.code ===1){
                            this.total_cash = res.data.total_cash     
                        }
                })
            },
            removeUserInfo(){
//                window.localStorage.removeItem('userInfo')
//                window.localStorage.removeItem('isShow')
            }
        },
        created(){
            //实例创建完成，完成属性绑定后
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.userInfo.member_avatar === undefined ? this.member_avatar = require('../../assets/images/head@2x.png') : this.member_avatar = this.userInfo.member_avatar;
            this.member_id = this.userInfo.member_id;
            this.member_nick_name = this.userInfo.member_nick_name;
            if(this.member_id){
                this.memberInfo()
                this.$api.leagueState({//合作加盟
                cmd:{
                    member:'leagueState'
                },
                data:{
                    member_id:this.member_id,
                }
                }).then(res=>{
                    console.log(res,'leagueState')
                    if(res.code===1){
                        this.league_state = res.data.league_state
                        if(this.league_state == 1){
                            this.isLeague = false
                        }
                        this.league_err = res.data.league_err
                        this.store_id = res.data.store_id
                    }
                }).catch(err=>{
                    console.log(err)
                })
                this.$api.getArticle({//协议文章
                    cmd:{
                        member:'getArticle'
                    },
                    data:{
                        article_id:4,
                    }
                    }).then(res=>{
                        if(res.code===1){
                            this.service = res.data.article_text
                    }
                })
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
    .own-wrapper{
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        .own-hd{
            width: 100%;
            height: 150px;
            background-image: url('../../assets/images/own_center@2x.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            .userInfo {
                display: flex;
                width: 100%;
                padding: 30px;
                box-sizing: border-box;
                align-items: center;
                .userLogo {
                    margin-right: 15px;
                    img {
                        display: block;
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                    }  
                }
                .userText {
                    color: #fff;
                    text-align: left;
                    span {
                        display: block;
                    }
                    .userName {
                        font-size: 18px;
                        line-height: 25px;
                        margin-bottom: 7px;
                    }
                    .userTip {
                        font-size: 12px;
                        line-height: 14px;
                    }
                    .noLogin {
                        font-size: 14px;
                    }
                }
            }
        }
        .own-bd{
            padding-top: 28px;
            color: #353535;
            .own-order{
                height: 90px;
                display: flex;
                justify-content: center;
                margin-top: -55px;
                .order-box{
                    width: 93%;
                    background: #FFFFFF;
                    border-radius: 4px;
                    .order-box-hd{
                            height: 45px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-left: 15px;
                            border-bottom: 1px solid #DEDEDE;
                        .txt{
                            font-size: 16px;
                            font-weight: bold;
                        }
                        .see-all{
                            font-size: 14px;
                            color: #888;
                            display: flex;
                            align-items: center;
                            .arrow-right{
                                width: 12px;
                                height: 12px;
                                margin: 0 13px 0 11px;
                            }
                        }
                    }
                    .order-box-bd{
                        display: flex;
                        justify-content: space-around;
                        .order-item{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            padding: 23px 0;
                            .order-icon{
                                width: 26px;
                                height: 20px;
                            }
                            .txt{
                                font-size: 13px;
                                padding-top: 15px;
                            }
                        }
                    }
                }
            }
            .own-cell{
                width: 93%;
                margin: auto;
                .cell-box{
                    background: #FFF;
                    padding-left: 15px;
                    margin-top: 10px;
                    border-radius: 4px;
                    .cell-item{
                        height: 46px;
                        border-bottom: 1px solid #F2F2F2;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        padding-right: 15px;
                        .item-l{
                            display: flex;
                            align-items: center;
                            .item-icon{
                                width: 22px;
                                height: 22px;
                                img{
                                    height: 100%;
                                }
                            }
                            .txt{
                                padding-left: 12px;
                            }
                        }
                        .item-r{
                            display: flex;
                            align-items: center;
                            .arrow-right{
                                    width: 12px;
                                    height: 12px;
                                    margin-left: 10px;
                            }
                        }
                        &:last-child{
                            border: 0;
                        }
                    }
                    .tel{
                        color: #353535;
                    }
                }
                &:last-child{
                    padding-bottom: 50px;
                }
            }
        }

        &:after{
            content: '';
        }

    }
</style>
