<template>
    <div class="wrap" v-title="pageTitle">
        <myLoading :isloading="isloading"></myLoading>
        <div class="goodsDetails-inner">
            <div class="goods-inner-top">
                <div class="banner">
                    <div class="banner-pic">
                        <van-swipe :autoplay="3000" :show-indicators="false" :duration="1000" @change="imgChange">
                            <van-swipe-item v-for="(item, index) in goodsDetailsData.banner" :key="index" class="lazy-img">
                                <img v-lazy="item.goods_img" />
                            </van-swipe-item>
                        </van-swipe>
                        <div class="num">{{imgIndex}} / {{goodsDetailsData.banner.length}}</div>
                        <div class="person-info" v-if="goodsType == 3">
                            <img :src="goodsDetailsData.member_avatar">
                            <span>{{goodsDetailsData.member_nick_name}}</span>
                        </div>
                    </div>
                    <div class="share-icon" @click="share"></div>
                </div>
                <div class="spell-bar" v-if="goodsType === 1 ">
                    <div class="l">
                        <div class="l-cell">
                            <div class="price">
                                <div class="char">￥</div>
                                <div class="num">{{groupData.sku_price}}</div>
                            </div>
                            <div class="desc">
                                <div class="txt">优惠拼团价</div>
                                <div class="num-tag">单独购买价￥{{groupData.goods_price}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="r">{{groupData.group_people_num}}人团</div>
                </div>
                <div class="secKill-bar" v-if="goodsType === 2" :class="{green:secKillData.is_start_seckill===0}">
                    <div class="l">
                        <div class="sec-price">￥{{secKillData.seckill_price}}</div>
                        <div class="old-price">￥{{secKillData.ordinary_price}}</div>
                    </div>
                    <div class="r" v-if="secKillData.is_start_seckill === 1">
                        <div class="txt">距离结束还剩</div>
                        <div class="secKill-countDown">
                            <div class="box">{{timeObj.hr}}</div>
                            <div class="char">:</div>
                            <div class="box">{{timeObj.min}}</div>
                            <div class="char">:</div>
                            <div class="box">{{timeObj.sec}}</div>
                        </div>
                    </div>
                    <div class="r" v-if="secKillData.is_start_seckill === 0">
                        <div class="secKill-countDown">
                            <div class="box">{{secKillData.seckill_time_start_time.substring(0,2)}}</div>
                            <div class="char">:</div>
                            <div class="box">{{secKillData.seckill_time_start_time.substring(3,5)}}</div>
                            <div class="char">:</div>
                            <div class="box">{{secKillData.seckill_time_start_time.substring(6,8)}}</div>
                        </div>
                        <div class="txt">准时开抢</div>
                    </div>
                </div>
                <div class="goods-cell-box">
                    <div class="cell">
                        <span class="tag" v-if="goodsDetailsData.is_own_shop === 1">自营</span>
                        <span class="goods-desc">{{goodsDetailsData.goods_name}}</span>
                    </div>
                    <div class="cell-price" v-if="goodsType === 0 ">
                        <div class="price">{{displayPrice}}</div>
                        <div class="tags">
                            <div class="tag" v-if="index<= 1" v-for="(item,index) in goodsDetailsData.label" :key="index">{{item}}</div>
                        </div>
                    </div>
                    <div class="cell-price" v-if="goodsType === 3">
                        <div class="price">￥{{personPrice}}</div>
                        <div class="tags">
                            <div class="person-tag" v-if="index<= 1" v-for="(item,index) in goodsDetailsData.label" :key="index">
                                <span>{{item}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="cell-le" v-if="goodsType != 3">
                        <div class="li">库存：{{goodsType === 0  ? goodsSku.sku.stock_num : groupSku.sku.stock_num || secKillSku.sku.stock_num }}</div>
                        <!--<div class="li">四川成都</div>-->
                        <div class="li">销量：{{goodsType === 0 ||goodsType === 1 ? goodsSku.sku.total_sold_out : secKillSku.sku.total_sold_out}}</div>
                    </div>
                    <div class="cell-le" v-if="goodsType == 3">
                        <div class="li">{{cityList.city}} {{cityList.area}}</div>
                        <div class="li">运费 ￥{{goodsDetailsData.shipping_fee}}</div>
                        <div class="li">浏览 {{goodsDetailsData.goods_views}}</div>
                    </div>
                </div>
            </div>
            <div class="goods-inner-middle">
                <van-cell-group class="reset">
                    <van-cell title="优惠券" @click="couponIsDialog = !couponIsDialog" v-if="goodsType === 0 && couponItemData.length !== 0  ">
                        <div slot="right-icon" class="right-icon">
                            <div class="value">{{couponItemData.length}}张可选</div>
                            <van-icon name="arrow" />
                        </div>
                    </van-cell>
                    <van-cell title="规格" @click="selGoods('sel')" v-if="goodsType === 0">
                        <div slot="right-icon" class="right-icon">
                            <div class="value">请选择规格</div>
                            <van-icon name="arrow" />
                        </div>
                    </van-cell>

                </van-cell-group>
            </div>
            <div class="spell-box" v-if="goodsType === 1 ">
                <div class="spell-flow">
                    <div class="hd">
                        <div class="txt">拼团流程</div>
                        <div class="txt-r" @click="ins_dialog = !ins_dialog">
                            <div class="">详细说明</div>
                            <van-icon name="arrow"/>
                        </div>
                    </div>
                    <div class="bd">
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
                <div class="spell-infoBox" v-if="!noGroup && time > 0 " >
                    <div class="desc vux-1px-b">以下小伙伴正在发起团购，您可以直接参与</div>
                    <div class="go-spell">
                        <div class="l">
                            <div class="spell-user">
                                <div class="user-pic">
                                    <img :src="groupData.team.user.member_avatar" alt="">
                                </div>
                                <div class="user-name">{{groupData.team.user.member_nick_name}}</div>
                            </div>
                            <div class="timer">
                                <div class="t">还差{{groupData.team.remain_num}}人成团</div>
                               <!--<countDown  ref='timeC' :timeProps="groupData.team.remain_time" temp="2"></countDown>-->
                                <div class="countDown-temp">
                                    <div class="" v-if="isCountDown">
                                        <div class="countDown-box">
                                            <div class="">剩余</div>
                                            <div class="countDown-inner" >
                                                <div class="box d" v-if="timeObj.day !== '00'">{{timeObj.day}}</div>
                                                <div class="box" v-if="timeObj.day !== '00'">天</div>
                                                <div class="box h">{{timeObj.hr}}</div>
                                                <div class="box">时</div>
                                                <div class="box m">{{timeObj.min}}</div>
                                                <div class="box">分</div>
                                                <div class="box s">{{timeObj.sec}}</div>
                                                <div class="box">秒</div>
                                                <!--<div class="box">{{timeObj.micro_sec}}</div>-->
                                            </div>
                                            <div class="">结束</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="r" @click="goGroup">去参团</div>
                    </div>

                </div>
            </div>
            <div class="goods-inner-bottom">
                <van-tabs v-model="tabcardIndex" sticky class="reset" v-if="goodsType !== 3">
                    <van-tab v-for="(item,index) in tabCard" :key="index" :title='item.tit'>
                        <div class="tabcard-item lazy-img" v-if="index===0" v-for="(img,ids) in goodsDetailsData.goods_body_img" :key="ids">
                            <img v-lazy="img" alt="" class="goods-img">
                        </div>
                        <div class="tabcard-item" v-if="index===1">
                            <div class="cell-list">
                                <div class="cell" v-for="(item,index) in goodsDetailsData.goods_attr" :key="index">
                                    <div class="">{{item.name}}</div>
                                    <div class="txt">{{item.value}}</div>
                                </div>
                            </div>
                            <div class="no-attr" v-if="no_attr">
                                <div class="pic"></div>
                                <div class="">商品暂无规格信息</div>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
                <div class="person-desc" v-else>
                    <h1>商品描述</h1>
                    <section>
                        {{goodsDetailsData.goods_describe_exchange || '暂无详细描述' }}
                    </section>
                </div>
            </div>
            <div class="goods-inner-message" v-if="goodsType === 3">
                <div class="head">
                    <h1>留言({{totalNum}})</h1>
                    <span>{{expect_num}}人想要</span>
                </div>
                <div class="message-ask" v-if="goodsDetailsData.goods_state != 3">
                    <img :src="userInfo.member_avatar">
                    <div class="message-input">
                        <input type="text" :placeholder="msgPlaceholder" v-model:trim="messageText" ref="msgInput" maxlength="100" />
                        <div class="message-send-btn" @click="sendMsg">发送</div>
                    </div>
                </div>
                <section>
                    <div class="message-items" v-if="totalNum">
                        <div class="message-item" v-for="(item, index) in msgList" @click="applyEvt(1,item)">
                            <div class="message-item-head">
                                <div class="message-user-info">
                                    <img :src="item.member_avatar" />
                                    <span>{{item.member_nick_name}}<span class="person-tag" v-if="item.member_type == 1">卖家</span></span>
                                </div>
                                <div class="message-date">
                                    {{cur_time|formatMsgDate(item.create_time)}}
                                </div>
                            </div>
                            <div class="message-content" v-if="!item.parent_comment.member_nick_name">
                               {{item.content}}
                            </div>
                            <div class="message-content" v-else>
                                回复<span class="message-blue">@{{item.parent_comment.member_nick_name}}</span> {{item.content}}<br/>
                                <span class="message-grey">| {{item.parent_comment.member_nick_name}}: <span :class="item.parent_comment.member_id?'':'message-disabled'">{{item.parent_comment.content}}</span></span>
                            </div>
                        </div>
                        <div class="message-more" @click="msgShowMore" v-if="msgList.length * cur_page < totalNum">
                            展开更多(共{{totalNum}}条)
                        </div>
                    </div>
                    <div class="no-data" v-else>
                        <div class="pic"></div>
                        <div class="">消息空空，列表空空</div>
                    </div>
                </section>
            </div>
        </div>
        <div class="fixed-tool" v-if="goodsType === 0 ">
            <div class="c-btn">
                <a :href="store_mobile" class="tag-a">
                    <div class="server-icon"></div>
                    <div class="txt">联系客服</div>
                </a>
            </div>
            <div class="c-btn" @click="goShopCar">
                <span class="shopping-dot" v-if="shopping_dot"></span>
                <div class="shop-icon"></div>
                <div class="txt">购物车</div>
            </div>
            <div class="addCar-btn" @click="selGoods('addCar')">加入购物车</div>
            <div class="nowPay-btn" @click="selGoods('nowPay')">立即购买</div>
        </div>
        <div class="fixed-tool spell" v-if="goodsType === 2 ">
            <div class="c-btn" @click="goShopCar">
                <span class="shopping-dot" v-if="shopping_dot"></span>
                <div class="shop-icon"></div>
                <div class="txt">购物车</div>
            </div>
            <div class="nowPay-btn" @click="secKillIsDialog = !secKillIsDialog"  v-if="secKillData.is_start_seckill === 1 && secKillSku.sku.stock_num !== 0 && is_tomorrow === 0">立即抢购</div>
            <div class="end-btn" v-if="secKillSku.sku.stock_num === 0">已被抢空</div>
            <div class="nowStart-btn"  v-if="secKillData.is_start_seckill === 0 || is_tomorrow === 1" @click="$toast('活动还没开始')">即将开始</div>
        </div>
        <div class="fixed-tool spell" v-if="goodsType === 1 ">
            <div class="c-btn" @click="goShopCar">
                <span class="shopping-dot" v-if="shopping_dot"></span>
                <div class="shop-icon"></div>
                <div class="txt">购物车</div>
            </div>
            <div class="alone-btn" @click="selGoods('sel')" v-if="goodsSku.sku.stock_num !== 0">
                <div class="txt">单独购买</div>
                <div class="num">￥{{groupData.goods_price|toFixedTwo}}</div>
            </div>
            <div class="spell-btn" @click="groupDialogEvt" v-if="isAddGroup && groupData.sku_num">
                <div class="txt">{{groupData.group_people_num}}人团</div>
                <div class="num">{{groupData.sku_price|toFixedTwo}}</div>
            </div>
            <div class="spell-btn" @click="groupDialogEvt" v-if="!isAddGroup && groupData.sku_num"><div class="txt">立刻开团</div></div>
            <div class="spell-btn dis" v-if="groupData.sku_num === 0">已抢完</div>
        </div>
        <div class="fixed-tool" v-if="goodsType === 3 && !isCheckOwn">
            <div v-if="goodsDetailsData.goods_state == 4" style="display: flex;width:100%;height:100%;">
                <div class="c-btn" style="background: #ededed" @click="wantEvt">
                    <div class="want-icon" :class="want_state == 1?'selected':''"></div>
                    <div class="txt p-txt" :class="want_state == 1?'selected':''">想要</div>
                </div>
                <div class="c-btn" @click="applyEvt(2)" style="background: #ededed">
                    <div class="message-icon"></div>
                    <div class="txt p-txt">留言</div>
                </div>
                <div class="addCar-btn" @click="personOpt('talk')">买前聊一聊</div>
                <div class="nowPay-btn" @click="personOpt('buy')">立即购买</div>
            </div>
            <div v-else class="disabled-btn">
               {{stock_num?'已下架':'已售出'}}
            </div>
        </div>
         <div class="fixed-tool" v-if="goodsType === 3 && isCheckOwn">
            <div class="nowPay-btn" @click="personBtnEvt('xj')" v-if="goodsDetailsData.goods_state == 4">下架</div>
            <div v-else style="display: flex;width:100%;height:100%;">
                <div class="delete-btn" @click="personBtnEvt('del')" v-if="stock_num">删除</div>
                <div class="addCar-btn" @click="publishEditEvt" v-if="stock_num">编辑</div>
                <div class="nowPay-btn" @click="personBtnEvt('sj')" v-if="(goodsDetailsData.goods_state == 1 || goodsDetailsData.goods_state == 3) && stock_num">上架</div>
                <div class="disabled-btn" v-if="!stock_num">已售出</div>
            </div>
         </div>
        <van-sku stepper-title="数量" v-model='isDialog' :sku="goodsSku.sku" :goods="goodsSku.goods" class="rest-sku"
                  @buy-clicked="onBuyClicked"
                  @add-cart="onAddCartClicked" @sku-selected="onSelectSkuId" :reset-stepper-on-hide="isSkuF" :reset-selected-sku-on-hide="isSkuF">
            <template slot="sku-header-price" slot-scope="props">
                <div class="van-sku__goods-price">
                    <span class="van-sku__price-num">{{displayPrice}}</span>
                </div>
            </template>
            <template slot="sku-actions" slot-scope="props">
                <div class="van-sku-actions">
                    <van-button v-show="dialogType === 'addCar'|| dialogType === 'sel'" bottom-action @click="props.skuEventBus.$emit('sku:addCart')">加入购物车</van-button>
                    <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
                    <van-button v-show="dialogType === 'nowPay'|| dialogType=== 'sel'" type="primary" bottom-action @click="props.skuEventBus.$emit('sku:buy')">立刻购买</van-button>
                </div>
            </template>
        </van-sku>

        <van-sku stepper-title="数量" v-model='groupIsDialog'  :sku="groupSku.sku" :goods="groupSku.goods" class="rest-sku"
                 @buy-clicked="onBuyGroupClicked" @sku-selected="onSelectSkuId" :reset-stepper-on-hide="isSkuF" :reset-selected-sku-on-hide="isSkuF">
            <template slot="sku-header-price" slot-scope="props">
                <div class="van-sku__goods-price">
                    <span class="van-sku__price-num">{{displayPrice}}</span>
                </div>
            </template>
            <template slot="sku-actions" slot-scope="props">
                <div class="van-sku-actions">

                    <van-button type="primary" bottom-action @click="props.skuEventBus.$emit('sku:buy')">立刻拼团</van-button>
                </div>
            </template>
        </van-sku>

        <van-sku stepper-title="数量" v-model='secKillIsDialog' :sku="secKillSku.sku" :goods="secKillSku.goods" class="rest-sku"
                 @buy-clicked="onBuySecKillClicked" @sku-selected="onSelectSkuId" :reset-stepper-on-hide="isSkuF" :reset-selected-sku-on-hide="isSkuF">
            <template slot="sku-header-price" slot-scope="props">
                <div class="van-sku__goods-price">
                    <span class="van-sku__price-num">{{displayPrice}}</span>
                </div>
            </template>
            <template slot="sku-actions" slot-scope="props">
                <div class="van-sku-actions">
                    <van-button type="primary" bottom-action @click="props.skuEventBus.$emit('sku:buy')">立刻秒杀</van-button>
                </div>
            </template>
        </van-sku>

        <van-popup v-model="couponIsDialog" position="bottom" :overlay="true" class="couponDialog">
            <div class="hd">
                <div class="">可领取优惠券</div>
                <div class="close-icon" @click="couponIsDialog = !couponIsDialog">
                    <img src="../../assets/images/icon-select@2x.png" />
                </div>
            </div>
            <div class="bd">
                <couponItem type="1" :couponItemData="couponItemData" @emitGetCoupon="getCoupon" v-if="!couponNoData"></couponItem>
                <div class="no-data" v-if="couponNoData">
                    <div class="pic"></div>
                    <div class="">暂无可领取优惠券~</div>
                </div>
            </div>
        </van-popup>

        <van-popup v-model="ins_dialog" class="ins-dialog">
            <div class="ins-box">
                <p>1.开团：在商城内选择喜欢的商品，点击“去开团”，付款成功后即为开团成功</p>
                <p>2.参团：进入朋友分享的页面，点击“立即参团”，付款后即为参团成功，若多人同时支付，按先支付成功的用户获得参团资格，参团订单未支付不计入参团数量，团过期未支付订单失效，但参团人信息也会显示在团里面</p>
                <p>3.成团：在开团或参团之后,可以点击“分享出去”，在有效时间凑齐成团人数即拼团成功</p>
                <p>4.组团失败：在有效时间内未凑齐人数，即为组团失败，此时商城会将原款分别退回</p>
            </div>
        </van-popup>
        <shareIcon></shareIcon>
    </div>
</template>
<script>
    import myLoading from '@/components/my-loading'
    import couponItem from '@/components/couponItem'
    import countDown from '@/components/countDown'
    import shareIcon from '@/components/share-icon'
    export default{
        name:'goodsDetails',
        data(){
            return{
                pageTitle:'商品详情',
                imgIndex:1,
                isDialog:false,
                goodsDetailsData:{
                    banner:[
                    ]
                },
                wxParams: {
                    goods_img: '' || 'http://wuxing.wsyjcs.cn/pic/wuxingadmin/20180824/a251c264adf53cd0d295add7205569bd.jpg',
                    min_price: '' || 0.01,
                    goods_name: '' || 'xxx',
                },
                commission_money: '',
                wxPic: '',
                tabCard:[
                    {tit:'商品详情'},
                    {tit:'商品规格'}
                ],
                tabcardIndex:0,
                isloading:true,
                spu_id:'',
                dialogType:'sel',
                goodsSku:{
                    sku:{
                        list:[],
                        tree:[]
                    },
                    goods: {
                        title: '',
                        picture: ''
                    },
                },
                userInfo: {
                    member_id: '',
                },
                sellerInfo: {
                    distribution_code: '',
                },
                isCommon: false,
                couponIsDialog:false,
                couponItemData:[],
                isCheck:true,
                show: false,
                goodsType:0,
                groupData:{
                    team:{
                        user:{},

                    },
                },
                groupIsDialog:false,
                groupSku:{
                    sku:{
                        list:[],
                        tree:[],
                    },
                    goods: {
                        title: '',
                        picture: '',
                    }
                },
                secKillData:{},
                secKillSku:{
                    sku:{
                        list:[],
                        tree:[],
                    },
                    goods: {
                        title: '',
                        picture: '',
                    }
                },
                noGroup:'',
                timeObj:{},
                isCountDown:true,
                interval:null,
                time:'',
                team_id:0,
                tempTeam_id:'',
                isAddGroup:false,
                no_attr:false,
                stock_num:'',
                type: '2',
                couponNoData:false,
                is_secKill:'',
                secKillIsDialog:false,
                ins_dialog:false,
                store_mobile:'',
                is_tomorrow:0,
                messageText: '',
                personPrice: '0.00',
                cityList: {city: '', area: ''},
                isCheckOwn: '',
                msgList: [],
                parent_comment_id: -1,
                msgPlaceholder: '问问更多细节吧~',
                page: 1,
                pageSize: 10,
                cur_page: 1,
                totalNum: 0,
                cur_time: '',
                want_state: 0,
                expect_num: 0,
                shopping_dot: 0,
                displayPrice: '',
                displayOriginPrice: '',
                isSkuF: false
            }
        },
        components:{
            myLoading,
            couponItem,
            countDown,
            shareIcon
        },
        computed:{

        },
        watch:{

        },
        methods:{

            imgChange(index){
                this.imgIndex =index+1
            },
            goShopCar(){
                this.$router.push({name:'shopCar'})
            },

            onPointClicked(){

            },

            orderConfirmFun(data,{goodsType = 0 }={}){
                let order_goods = ''
                if(data.selectedSkuComb === undefined){
                    if(goodsType===0){
                        this.stock_num = this.goodsSku.sku.stock_num
                    }else if(goodsType === 1){
                        this.stock_num = this.groupSku.sku.stock_num
                    }else if(goodsType === 2){
                        this.stock_num = this.secKillSku.sku.stock_num
                    }else if(goodsType === 3){
                        this.stock_num = 1
                    }

                }else {
                    this.stock_num = data.selectedSkuComb.stock_num
                }
                if(goodsType === 1){
                    if(data.selectedNum > this.groupData.group_buy_limit){
                        this.$toast.fail(`该商品限购${this.groupData.group_buy_limit}件`)
                        return
                    }
                }

                if(this.stock_num !== 0 && data.selectedNum>=1){
                    if(goodsType === 0){
                        if(this.goodsSku.sku.none_sku === 'true'){
                            order_goods =[{sku_id:this.goodsSku.sku.collection_id,goods_num:data.selectedNum,activity_type:''}]
                            order_goods = JSON.stringify(order_goods)

                        }else {
                            order_goods =[{sku_id:data.selectedSkuComb.id,goods_num:data.selectedNum,activity_type:''}]
                            order_goods = JSON.stringify(order_goods)
                        }
                    }else if(goodsType === 1){
                        if(this.groupSku.sku.none_sku === 'true'){
                            order_goods =[{sku_id:this.groupSku.sku.collection_id,goods_num:data.selectedNum,activity_type:this.goodsType,group_team_id:this.team_id}]
                            order_goods = JSON.stringify(order_goods)

                        }else {
                            order_goods =[{sku_id:data.selectedSkuComb.id,goods_num:data.selectedNum,activity_type:this.goodsType,group_team_id:this.team_id}]
                            order_goods = JSON.stringify(order_goods)
                        }
                    }else if(goodsType === 2){
                        if(this.secKillSku.sku.none_sku === 'true'){
                            order_goods =[{sku_id:this.secKillSku.sku.collection_id,goods_num:data.selectedNum,activity_type:this.goodsType}]
                            order_goods = JSON.stringify(order_goods)
                            console.log(order_goods)

                        }else {
                            order_goods =[{sku_id:data.selectedSkuComb.id,goods_num:data.selectedNum,activity_type:this.goodsType}]
                            order_goods = JSON.stringify(order_goods)
                        }
                    }else if(goodsType === 3){
                        order_goods = [{sku_id: this.goodsDetailsData.sku.collection_id, goods_num: data.selectedNum,activity_type:this.goodsType}]
                        order_goods = JSON.stringify(order_goods)
                    }
                    this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        loadingType: 'spinner',
                        message: '提交订单中'
                    })
                    let second = 2;
                    const timer = setInterval(() => {
                        second--;
                        if (second) {

                        } else {
                            clearInterval(timer)
                            this.$toast.clear()
                            this.$store.dispatch('setOrderGoods',order_goods)
                            this.$store.dispatch('setSelAddress',false)
                            let payWay = {
                                type:'order_sn',
                                goodsType:goodsType
                            }
                            this.$store.commit('SET_SEL_ADDRESS_INDEX','-1')
                            localStorage.removeItem('isSelIndex')
                            this.$store.dispatch('setPayWay',payWay)
                            this.$router.push({name:'submitOrder',params:{order_goods:order_goods}})
                        }
                    }, 1000)
                }else {
                    this.$toast.fail('库存不足或者请输入正确数量')
                }

            },
            onBuyClicked(data) {
                this.orderConfirmFun(data)
            },
            onBuyGroupClicked(data){

                let sku_id = ''
                if(this.groupSku.sku.none_sku === 'true'){
                    sku_id = this.groupSku.sku.collection_id
                }else {
                    sku_id = data.selectedSkuComb.id
                }
                let obj = {
                    member_id:this.userInfo.member_id,
                    sku_id:sku_id,
                    buy_num:data.selectedNum
                }
                this.$api.getGroupGoodsNum({
                    cmd:{
                        group:'CheckGroup'
                    },
                    data:obj
                }).then(res=>{
                    console.log(res,'拼团数量')
                    if(res.code ===1){
                        this.orderConfirmFun(data,{goodsType:1})
                    }else{
                        this.$toast.fail(res.msg)
                    }

                })
            },
            onBuySecKillClicked(data){
                let sku_id = ''
                if(this.secKillSku.sku.none_sku === 'true'){
                    sku_id = this.secKillSku.sku.collection_id
                }else {
                    sku_id = data.selectedSkuComb.id
                }
                this.$api.getSecKillGoodsNum({
                    cmd:{
                        seckill:'getseckillpurchasenumber'
                    },
                    data:{
                        member_id:this.userInfo.member_id,
                        sku_id:sku_id,
                        goods_num:data.selectedNum
                    }
                }).then(res=>{
                    console.log(res,'秒杀数量')
                    if(res.code ===1){
                        this.orderConfirmFun(data,{goodsType:2})
                    }else{
                        this.$toast.fail(res.msg)
                    }

                })


            },

            onAddCartClicked(data) {
                let goods_num = data.selectedNum
                let sku_id =''
                if(this.goodsSku.sku.none_sku ==='true'){
                    sku_id = this.goodsSku.sku.collection_id
                }else {
                    sku_id = data.selectedSkuComb.id
                }
                this.$api.addCart({
                    cmd:{
                        "cart":"addcart"
                    },
                    data:{
                        member_id:this.userInfo.member_id,
                        goods_num:goods_num,
                        sku_id:sku_id
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.checkShopDot()
                        this.$toast(`${goods_num}件商品加入购物车哦,快去结算吧!`)
                        this.isDialog = false
                    }else {
                        this.$toast(res.msg)
                    }
                }).catch(err=>{

                })


            },

            onSelectSkuId(data){
                console.log(data)
                if(data.selectedSkuComb && Object.keys(data.selectedSkuComb).length) {
                    this.displayPrice = '￥' + data.selectedSkuComb.price.toFixed(2)
                }else{
                    this.displayPrice = this.displayOriginPrice
                }
            },
            groupDialogEvt(){
                this.isSkuF = true
                let {min_price, max_price} = this.groupData
                this.displayOriginPrice = this.displayPrice = min_price != max_price ? `￥${Number(min_price).toFixed(2)}-￥${Number(max_price).toFixed(2)}` : `￥${Number(min_price).toFixed(2)}`
                this.groupIsDialog=!this.groupIsDialog
            },
            selGoods(type){
                if(type == 'sel' && Object.keys(this.groupData).length > 1) {
                    this.isSkuF = true
                    let {min_price, max_price} = this.goodsDetailsData
                    this.displayOriginPrice = this.displayPrice = min_price != max_price ? `￥${Number(min_price).toFixed(2)}-￥${Number(max_price).toFixed(2)}` : `￥${Number(min_price).toFixed(2)}`
                }
                this.dialogType = type
                this.isDialog = true
            },
            wantEvt(){
                this.$api.toWantGoods({
                    cmd: {member: 'ToExpectGoods'},
                    data:{
                        spu_id: this.spu_id,
                        member_id: this.userInfo.member_id
                    }
                }).then(res => {
                    if(res.code === 1){
                        this.want_state?this.expect_num--:this.expect_num++
                        this.want_state=!this.want_state
                    }else{
                        this.$toast({message: '商品状态有更新，已帮您获取最新数据'},1000)
                        this.getGoodsPersonDetail()
                    }
                })
            },
            sendMsg(){
                if(!this.messageText){
                    this.$toast({message:'留言不能为空', duration: 1000})
                    return
                }
                let data = {
                    member_id: this.userInfo.member_id,
                    spu_id: this.spu_id,
                    content: this.messageText
                }
                if(this.parent_comment_id != '-1') {
                    data.parent_comment_id = this.parent_comment_id
                }
                console.log(data);
                this.$toast.loading({
                    duration: 0,
                    forbidClick: true,
                    loadingType: 'spinner'
                })
                this.$api.sendMsg({
                    cmd: {im: 'WriteComment'},
                    data:data
                }).then(res => {
                    this.$toast.clear()
                    this.messageText = ''
                    this.parent_comment_id = '-1'
                    this.msgPlaceholder = '问问更多细节吧~'
                    if(res.code === 1){
                        this.$toast.success({
                            message:'留言成功',
                            forbidClick:true
                        })
                        this.page=1
                        this.msgShowMore()
                    }else{
                        this.$toast({message: '商品状态有更新，已帮您获取最新数据'},1000)
                        this.getGoodsPersonDetail()
                    }
                })
            },
            msgShowMore(){
                this.$api.getMsgList({
                    cmd: {im: 'getGoodsComment'},
                    data: {
                        spu_id: this.spu_id,
                        page: this.page,
                        page_size: this.pageSize
                    }
                }).then(res=>{
                    if(res.code == 1) {
                        console.log(res)
                        this.totalNum = res.data.total
                        this.cur_page = res.data.current_page
                        this.cur_time = res.data.current_time
                        if(this.page == 1) {
                            this.msgList = res.data.data
                        }else{
                            this.msgList = [...this.msgList,...res.data.data]
                        }
                        if(this.pageSize * res.data.current_page < res.data.total) {
                            this.page++
                        }
                    }else{
                        this.$toast({message: '商品状态有更新，已帮您获取最新数据'},1000)
                        this.getGoodsPersonDetail()
                    }
                }).catch(res=>{})
            },
            personOpt(type){
                if(type == 'talk') {
                    this.$router.push({name: 'chat',params: {to_user_id: this.goodsDetailsData.goods_member_id}})
                }else if(type == 'buy') {
                    let data = {
                        selectedNum: 1
                    }
                    this.orderConfirmFun(data,{goodsType:3})
                }
            },
            applyEvt(type, item){
                if(type == 1) {
                    this.parent_comment_id = item.id
                    this.msgPlaceholder = '@'+item.member_nick_name
                }else if(type == 2) {
                    this.parent_comment_id = '-1'
                    this.msgPlaceholder = '问问更多细节吧~'
                }
                this.$refs.msgInput.focus()
            },
            publishEditEvt(){
                this.$router.push({name: 'publish', params: {spu_id: this.spu_id}})
            },
            personBtnEvt(type){
                let msg = '',
                    cftext='',
                    cctext='再想想',
                    tip = '',
                    goods_state = '';
                switch(type) {
                    case 'del': 
                        msg='请确认是否删除'
                        cftext='确认删除'
                        tip = '商品已删除成功'
                        goods_state = 5
                        break
                    case 'xj': 
                        msg='请确认是否下架'
                        cftext='确认下架'
                        tip = '商品已下架'
                        goods_state = 3
                        break
                    case 'sj':
                        msg='请确认是否上架'
                        cftext='确认上架'
                        tip = '商品已上架'
                        goods_state = 4
                        break
                }
                this.$dialog.confirm({
                    message: msg,
                    confirmButtonText: cftext,
                    cancelButtonText: cctext
                }).then(() => {
                    this.$api.dropExchangeGoods({
                        cmd: {
                            goods: 'DropExchangeGoods'
                        },
                        data:{
                            spu_id: this.spu_id,
                            member_id: this.userInfo.member_id,
                            goods_state: goods_state
                        }
                        }).then(res => {
                            if(res.code === 1){
                                this.$toast.success({
                                    message: tip,
                                    forbidClick:true
                                })
                                if(goods_state == 5) {
                                    this.$router.push({name:'index'})
                                }else {
                                    this.getGoodsPersonDetail()
                                }
                            }else{
                                this.$toast({message: '商品状态有更新，已帮您获取最新数据'},1000)
                                this.getGoodsPersonDetail()
                            }
                    });
                }).catch(() => {});
            },
            getCoupon(item){
                this.$api.getCoupon({
                    cmd:{
                        discount:'usergetdiscount'
                    },
                    data:{
                        member_id:this.userInfo.member_id,
                        discount_id:item.discount_id

                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.$toast.success({
                            message:'领取成功',
                            forbidClick:true
                        })
                        setTimeout(()=>{
                            this.getCouponList(this.goodsDetailsData.store_id)
                        },1000)

                    }else {
                        this.$toast.fail(res.msg)
                    }
                })
            },
            getCouponList(store_id){
                this.$api.storeCoupon({
                    cmd:{
                        discount:'storealldiscount'
                    },
                    data:{
                        store_id:store_id,
                        ids:this.spu_id,
                        member_id:this.userInfo.member_id
                    }
                }).then(res=>{
                    console.log(res,'店铺优惠券')
                    if(res.code === 1){
                        this.couponItemData = res.data
                        if(this.couponItemData.length === 0){
                            this.couponNoData = true
                        }
                    }
                }).catch(err=>{

                })
            },
            share(){
                let shareState = this.$store.state.share_icon;
                this.$store.commit('SET_SHARE_ICON',!shareState)
            },
            getGoodsDetails(){
                this.$api.goodsDetails({
                    cmd:{
                        "goods":"detail"
                    },
                    data:{
                        'spu_id':this.spu_id,
                        member_id: this.userInfo.member_id
                    }
                }).then(res=>{
                    console.log('商品详情',res)
                    if(res.code === 1){
                        setTimeout(()=>{
                            this.isloading = false
                        },500)
                        let {min_price, max_price} = res.data
                        let {list,tree,price,stock_num,none_sku,collection_id,total_sold_out} = res.data.sku
                        this.commission_money = res.data.commission_money
                        this.goodsDetailsData = res.data
                        this.store_mobile = `tel:${this.goodsDetailsData.store_mobile}`
                        this.wxParams.min_price = this.goodsDetailsData.min_price
                        this.wxParams.goods_name = this.goodsDetailsData.goods_name

                        if(this.goodsDetailsData.goods_attr.length === 0){
                            this.no_attr = true
                        }
                        this.goodsSku.sku.list = list
                        this.goodsSku.sku.tree = tree
                        this.goodsSku.sku.price =price
                        this.goodsSku.sku.stock_num = stock_num
                        this.goodsSku.sku.none_sku = none_sku
                        this.goodsSku.sku.collection_id = collection_id
                        this.goodsSku.sku.total_sold_out = total_sold_out
                        this.goodsSku.goods.title = res.data.goods_name
                        if(Object.keys(res.data.banner).length !== 0){
                            this.goodsSku.goods.picture = res.data.banner[0].goods_img
                            this.wxParams.goods_img = this.goodsDetailsData.banner[0].goods_img
                        }else{
                            let obj = {}
                            obj.goods_img = this.wxParams.goods_img
                            this.goodsDetailsData.banner.push(obj)
                            this.goodsSku.goods.picture = this.wxParams.goods_img
                        }
                        this.displayOriginPrice = this.displayPrice = min_price != max_price ? `￥${Number(min_price).toFixed(2)}-￥${Number(max_price).toFixed(2)}` : `￥${Number(min_price).toFixed(2)}`
                        let shareData = {}
                        if(this.sellerInfo.distribution_code){
                            shareData.link = `http://wuxing.wsyjcs.cn/commonclass/wechat/index/app/wuxing/page/goods.goodsDetails.${this.spu_id}&member_id=${this.userInfo.member_id}&distribution_code=${this.sellerInfo.distribution_code}`
                        }else{
                            shareData.link = `http://wuxing.wsyjcs.cn/commonclass/wechat/index/app/wuxing/page/goods.goodsDetails.${this.spu_id}&member_id=${this.userInfo.member_id}`
                        }
                        shareData.desc = `我在拥军换换上发现一个不错的商品,赶紧来看看吧。`
                        shareData.title = `${this.wxParams.goods_name}`
                        shareData.imgUrl = `${this.wxParams.goods_img}`
                        this.$share.api(shareData)

                    }
                    return this.goodsDetailsData
                }).then(res=>{
                    this.getCouponList(res.store_id)
                }).catch(err=>{

                })
            },
            getGroupGoodsDetails(){
                this.$api.getGroupGoodsDetails({
                    cmd:{
                        group:'GroupGoodsDetail'
                    },
                    data:{
                        spu_id:this.spu_id,
                        team_id:this.team_id,
                        member_id: this.userInfo.member_id
                    }
                }).then(res=>{
                    console.log(res, 'group')
                    if(res.code===1){

                        setTimeout(()=>{
                            this.isloading = false
                        },500)
                        this.groupData = res.data.group
                        this.goodsDetailsData = res.data.goods
                        this.store_mobile = `tel:${this.goodsDetailsData.store_mobile}`
                        this.wxParams.min_price = this.goodsDetailsData.min_price
                        this.wxParams.goods_name = this.goodsDetailsData.goods_name
                        if(this.groupData.team.hasOwnProperty('team_id')){
                            let {team:{team_id}} = this.groupData
                            this.tempTeam_id = team_id
                        }
                        if(this.groupData.team.remain_time) {
                            this.time = (this.groupData.team.remain_time)*1000
                            this.countDown()
                        }
                        if(this.groupData.team.user == undefined || Object.keys(this.groupData.team.user).length === 0){
                            this.noGroup = true
                        }else {
                            this.noGroup = false
                        }
                        console.log(555)
                        let {list,tree,price,stock_num,none_sku,collection_id,total_sold_out} = res.data.goods.sku
                        this.goodsSku.sku.price =price
                        this.goodsSku.sku.list = list
                        this.goodsSku.sku.tree = tree
                        this.goodsSku.sku.stock_num = stock_num
                        this.goodsSku.sku.none_sku = none_sku
                        this.goodsSku.sku.collection_id = collection_id
                        this.goodsSku.sku.total_sold_out = total_sold_out

                        this.goodsSku.goods.title = this.goodsDetailsData.goods_name
                        let {list:groupList,tree:groupTree,price:groupPrice,none_sku:groupNone_sku,collection_id:groupCollection_id,stock_num:group_stock_num} = res.data.group.sku
                        console.log(res.data.group.sku)
                        this.groupSku.sku.price= groupPrice
                        this.groupSku.sku.list= groupList
                        this.groupSku.sku.tree= groupTree
                        this.groupSku.sku.stock_num = group_stock_num
                        this.groupSku.sku.none_sku= groupNone_sku
                        this.groupSku.sku.collection_id= groupCollection_id
                        this.groupSku.goods.title = this.goodsDetailsData.goods_name
                        if(Object.keys(res.data.goods.banner).length !== 0){
                            this.groupSku.goods.picture = this.goodsDetailsData.banner[0].goods_img
                            this.goodsSku.goods.picture = this.goodsDetailsData.banner[0].goods_img
                            this.wxParams.goods_img = this.goodsDetailsData.banner[0].goods_img
                        }else{
                            let obj = {}
                            obj.goods_img = this.wxParams.goods_img
                            this.goodsDetailsData.banner.push(obj)
                            this.groupSku.goods.picture = this.wxParams.goods_img
                            this.goodsSku.goods.picture = this.wxParams.goods_img
                        }
                        let shareData = {}
                        shareData.linkName = `goods.goodsDetails.${this.spu_id}`
                        shareData.desc = `我在拥军换换上发现一个不错的商品,赶紧来看看吧。`
                        shareData.title = `${this.wxParams.goods_name}`
                        shareData.imgUrl = `${this.wxParams.goods_img}`
                        this.$share.api(shareData)

                    }
                }).catch(err=>{

                })
            },
            getSecKillDetails(){
                this.$api.getSecKillGoodsDetails({
                    cmd:{
                        seckill:'getseckillgoodsdetail'
                    },
                    data:{
                        spu_id:this.spu_id,
                        member_id: this.userInfo.member_id
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        if(res.code===1){
                            setTimeout(()=>{
                                this.isloading = false
                            },500)
                            this.secKillData = res.data.seckill
                            this.goodsDetailsData = res.data.goods
                            this.store_mobile = `tel:${this.goodsDetailsData.store_mobile}`
                            this.time = (this.secKillData.seckill_residue_time)*1000
                            this.countDown()
                            let {min_price, max_price} = this.secKillData
                            let {list:secKillList,tree:secKillTree,price:secKillPrice,none_sku:secKillNone_sku,collection_id:secKillCollection_id,stock_num:secKill_stock_num,total_sold_out:secKill_total_sold_out} = res.data.seckill.sku

                            this.secKillSku.sku.price= secKillPrice
                            this.secKillSku.sku.list= secKillList
                            this.secKillSku.sku.tree= secKillTree
                            this.secKillSku.sku.stock_num = secKill_stock_num
                            this.secKillSku.sku.none_sku= secKillNone_sku
                            this.secKillSku.sku.collection_id= secKillCollection_id
                            this.secKillSku.sku.total_sold_out = secKill_total_sold_out
                            this.secKillSku.goods.title = this.goodsDetailsData.goods_name
                            if(Object.keys(res.data.goods.banner).length !== 0){
                                this.secKillSku.goods.picture = res.data.goods.banner[0].goods_img
                            }
                            this.displayOriginPrice = this.displayPrice = min_price != max_price ? `￥${Number(min_price).toFixed(2)}-￥${Number(max_price).toFixed(2)}` : `￥${Number(min_price).toFixed(2)}`
                        }
                    }
                }).catch(err=>{

                })
            },
            getGoodsPersonDetail() {
                let data = {
                    spu_id:this.spu_id,
                    member_id: this.userInfo.member_id
                }
                this.$api.goodsPersonDetails({//获取个人商品详情
                    cmd:{
                        goods:'ExchangeGoodsDetail'
                    },
                    data:data
                }).then(res=>{
                    console.log(res, 444)
                    if(res.code == 1) {
                        setTimeout(()=>{
                            this.isloading = false
                        },500)
                        if(res.data.goods_member_id) {
                            this.goodsDetailsData = res.data
                            this.msgList = res.data.goods_comment.data
                            this.totalNum = res.data.goods_comment.total
                            this.cur_page = res.data.goods_comment.current_page
                            this.cur_time = res.data.goods_comment.current_time
                            this.personPrice = res.data.sku.price
                            this.cityList.city = res.data.goods_cityname.city
                            this.cityList.area = res.data.goods_cityname.district
                            this.stock_num = res.data.sku.stock_num
                            res.data.goods_member_id == this.userInfo.member_id ? this.isCheckOwn = true : this.isCheckOwn = false
                            this.want_state = res.data.expect_state
                            this.expect_num = res.data.expect_num
                            let shareData = {}
                            shareData.linkName = `goods.goodsDetails.${this.spu_id}`
                            shareData.desc = `我在拥军换换上发现一个不错的商品,赶紧来看看吧。`
                            shareData.title = `${res.data.goods_name}`
                            shareData.imgUrl = `${res.data.banner[0].goods_img}`
                            this.$share.api(shareData)
                        }else{
                            this.$dialog.alert({
                                message: '该商品已被删除，返回列表页'
                            }).then(() => {
                                this.$router.push({name: 'goodList', params:{}})
                            });
                        }    
                    }
                    
                }).catch(err=>{

                })
                
            },
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
            goGroup(){
                this.$router.push({name:'groupDetails',params:{team_id:this.tempTeam_id,spu_id:this.spu_id}})
            },
            getGoodsType(){
                this.$api.goodsDetailsType({
                    cmd:{
                        goods:'GoodsActivity'
                    },
                    data:{
                        spu_id:this.spu_id
                    }
                }).then(res=>{
                    if(res.code===1){
                        this.goodsType = res.data.goods_type
                    }
                    return this.goodsType
                }).then(res=>{
                    console.log(res)
                    if(res === 0){
                        console.log('普通商品')
                        this.getGoodsDetails()
                        this.isCommon = true
                    }else if(res ===1){
                        console.log('拼团商品')
                        this.getGroupGoodsDetails()
                    }else if(res === 2 && this.is_secKill){
                        console.log('秒杀商品')
                        if(this.$route.params.is_tomorrow != undefined) {
                            this.is_tomorrow = this.$route.params.is_tomorrow
                            localStorage.setItem('is_tomorrow_state', this.$route.params.is_tomorrow)
                        }else{
                            this.is_tomorrow = Number(localStorage.getItem('is_tomorrow_state'))
                        }
                        this.getSecKillDetails()
                    }else if(res === 3){
                        console.log('个人商品')
                        this.getGoodsPersonDetail()
                    }else{
                        console.log('秒杀有商品，普通列表进来')
                        this.goodsType = 0
                        this.isCommon = true
                        this.getGoodsDetails()
                    }
                    // this.goodsType = 3
                })
            },
            checkShopDot(){
                this.$api.cartList({
                    cmd:{cart:"cartlist"},
                    data:{member_id:this.userInfo.member_id}
                }).then(res=>{
                    if(res.code === 1){
                        this.shopCarData = res.data.good
                        if(this.shopCarData.length === 0){
                            this.shopping_dot = 0
                        }else{
                            this.shopping_dot = 1
                        }
                         this.$store.commit('SET_SHOPPING_STATUS',this.shopping_dot)
                    }
                }).catch(err=>{
                    this.shopping_dot = 0
                })
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.spu_id = this.$route.params.spu_id
            if(this.$route.params.team_id){
                this.team_id = this.$route.params.team_id
            }
            if(this.$route.params.isAddGroup){
                this.isAddGroup = this.$route.params.isAddGroup
            }
            if(this.$store.state.is_secKill){
                this.is_secKill = true
            }else {
                this.is_secKill = false
            }
            this.getGoodsType()
            this.shopping_dot = this.$store.state.shopping_status
            this.checkShopDot()
        },
        mounted(){

        },
        destroyed(){
            clearInterval(this.interval);
        }
    }
</script>
<style lang="scss" type="text/scss" >
    .server-icon{
        background: url('../../assets/images/Customerservice@2x.png') no-repeat;
        background-size: contain;
        width: 22px;
        height: 20px;
    }
    .shop-icon{
        background: url('../../assets/images/tabbar_icon3.png') no-repeat;
        background-size: contain;
        width: 22px;
        height: 20px;
    }

    .want-icon {
        background: url('../../assets/images/icon_want_normal@2x.png') no-repeat;
        background-size: contain;
        width: 21px;
        height: 21px;
        &.selected {
            background-image: url('../../assets/images/icon_want_selected@2x.png');
        }
    }

    .message-icon {
        background: url('../../assets/images/icon_liuyan_normal@2x.png') no-repeat;
        background-size: contain;
        width: 21px;
        height: 21px;
    }

    .goodsDetails-inner{
        padding-bottom: 60px;
        .goods-inner-top{
            margin-bottom: 12px;
        }
        .banner{
            position: relative;
            height:375px;
            .banner-pic{
                height: 375px;
                position: relative;
                .num{
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    right: 15px;
                    bottom: 5px;
                    width: 45px;
                    height: 25px;
                    border-radius: 15px;
                    background: rgba(0,0,0,0.4);
                    color: #fff;
                }
                .person-info {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    bottom: 5px;
                    left: 15px;
                    max-width: 120px;
                    height: 25px;
                    border-radius: 25px;
                    background: rgba(0,0,0,0.4);
                    color: #fff;
                    padding-right: 10px;
                    img {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                    }
                    span {
                        font-size: 12px;
                        display: inline-block;
                        width: calc(100% - 20px);
                        padding-left: 5px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

            }
            .van-swipe{
                height: 375px;
                .van-swipe-item {
                    
                }
                
            }
            .share-icon{
                width:25px;
                height: 25px;
                border-radius: 100%;
                position: absolute;
                top: 15px;
                right: 15px;
                &:after{
                    content: '';
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    background: url('../../assets/images/icon_share@2x.png') no-repeat;
                    background-size: contain;
                }
            }

        }
        .spell-bar{
            height: 45px;
            background: #F32D16;
            color: #fff;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            align-items: center;
            .l-cell{
                display: flex;
                align-items: center;
            }
            .price{
                display: flex;
                .num{
                    font-size: 20px;
                    line-height: 1;
                    align-self: flex-end;
                }
                .char{
                    font-size: 10px;
                    margin-right: 2px;
                    align-self: flex-end;
                    line-height: 1;
                }
            }
            .desc{
                margin-left:10px;
            }
            .num-tag{
                background: #BE2616;
                padding: 2px 4px;
                line-height: 1;
            }
        }
        .secKill-bar{
            height: 40px;
            background: #F32D16;
            color: #fff;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            /*&.green{*/
                /*background: #00B700;*/
                /*.r{*/
                    /*color: #00B700;*/
                    /*.secKill-countDown{*/
                        /*.box{*/
                            /*background: #00B700;*/
                        /*}*/
                    /*}*/
                /*}*/

            /*}*/
            .l{
                flex-grow: 1;
                padding-left: 15px;
                font-size: 20px;
                color: #fff;
                display: flex;
                line-height: 1;
                .old-price{
                    font-size: 12px;
                    align-self: flex-end;
                    margin-left: 5px;
                    text-decoration:line-through;
                }
            }
            .r{
                flex-shrink:0;
                width: 115px;
                background: #fff;
                display: flex;
                color: #F32D16;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 40px;
                .secKill-countDown{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .box{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #F32D16;
                        border-radius: 5px;
                        width: 20px;
                        height: 15px;
                        color: #fff;
                        margin: 0 2px;
                        font-size: 12px;
                    }
                }
                .txt{
                    font-size: 13px;
                }
            }
        }
        .goods-cell-box{
            background: #fff;
            padding: 10px 15px 10px;
            .cell-price{
                margin-bottom: 8px;
                font-size: 20px;
                display: flex;
                align-items: center;
                .price{
                    color: #F32D16;
                    margin-right: 5px;
                    letter-spacing: -1px;
                }
                .tags{
                    display: flex;
                    align-items: center;
                }
            }
            .cell{
                margin-bottom: 8px;
                text-align:left;
                .goods-desc{
                    font-size: 15px;
                    line-height: 22px;
                    color: #000;
                }
            }
            .cell-le{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size:13px;
                color: #999;
            }

        }
        .goods-inner-middle{
            margin-bottom: 12px;
        }
        .reset{
            .right-icon{
                display: flex;
                align-items: center;
                .value{
                    margin-right: 5px;
                }
            }
            .van-tabs__line{
                background: #F32D16;
            }
            .van-tab--active{
                color: #F32D16;
            }
            .van-tab__pane{
                min-height: 300px;
            }
        }
        .goods-inner-bottom{
            background: #fff;
            .tabcard-item{
                min-height: 200px;
                .cell{
                    display: flex;
                    align-items: center;
                    height: 44px;
                    border-bottom: 1px solid #eee;
                    padding: 0 15px;
                    font-size: 14px;
                    color: #666;
                    .txt{
                        margin-left: 30px;
                        color: #353535;
                    }
                }
                .no-attr {
                    font-size:15px;
                    color: #888;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 300px;
                    justify-content: center;
                    .pic{
                        background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                        width: 160px;
                        height: 120px;
                        background-size: 100%;
                        margin-bottom: 15px;
                    }
                }
            }
            .person-desc{
                width: 100%;
                padding: 0 15px;
                box-sizing: border-box;
                h1 {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    border-bottom: 1px solid #EDEDED;
                    font-size: 15px;
                    color: #333;
                }
                section {
                    font-size: 14px;
                    color: #666;
                    padding: 10px 0 15px;
                    line-height: 20px;
                }
            }
        }
        .goods-inner-message {
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
            background: #fff;
            margin-top: 12px;
            .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 40px;
                border-bottom: 1px solid #EDEDED;
                font-size: 15px;
                color: #333;
                h1 {
                    font-size: 100%;
                }
                span{
                    font-size: 12px;
                    color: #FF664D;
                }
            }
            .message-ask {
                display: flex;
                align-items: center;
                padding-top: 25px;
                img {
                    border-radius:50%;
                    width: 30px;
                    height: 30px;
                }
                .message-input {
                    position: relative;
                    margin-left: 10px;
                    display: flex;
                    height: 35px;
                    width: calc(100% - 40px);
                    .message-send-btn {
                        width: 80px;
                        height: 100%;
                        line-height: 35px;
                        color: #fff;
                        background-color: #F32D16;
                        border-bottom-right-radius: 4px;
                        border-top-right-radius: 4px;
                        text-align: center;
                        font-size: 15px;
                    }
                    input {
                        font-size: 12px;
                        width: calc(100% - 80px);
                        height: 100%;
                        background: #eee;
                        border: 0;
                        border-bottom-left-radius:4px;
                        border-top-left-radius:4px;
                        padding: 0 10px;
                        box-sizing: border-box;
                        -webkit-appearance:none;
                    }
                    &:before {
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-right: 6px solid #eee;
                        content: "";
                        position: absolute;    
                        width: 0;
                        left: -5px;
                        top: 50%;
                        margin-top: -5px;
                    }
    
                }
            }
            >section {
                padding-top: 20px;
                padding-bottom: 20px;
                .message-item {
                    padding: 15px 0;
                    .message-item-head {
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                        height: 30px;
                        .message-user-info {
                            display: flex;
                            justify-content: center;
                            align-items: start;
                            img {
                                width: 30px;
                                height: 30px;
                                margin-right: 10px;
                                border-radius: 50%;
                            }
                            >span {
                                font-size: 13px;
                                color: #333;
                                margin-top: 3px;
                                .person-tag {
                                    display: inline-block;
                                    padding: 2px;
                                    background: rgb(243,45,22);
                                    color: #fff;
                                    transform: scale(0.8);
                                }
                            }
                        }
                        .message-date {
                            font-size: 12px;
                            color: #ccc;
                            margin-top: 3px;
                        }
                    }
                    .message-content {
                        width: 100%;
                        padding-left: 40px;
                        padding-right: 50px;
                        box-sizing: border-box;
                        font-size: 13px;
                        color: #666;
                        line-height: 20px;
                        .message-blue {
                            color: #59A6FE;
                        }
                        .message-grey{
                            color: #999;
                        }
                        .message-disabled {
                           text-decoration:line-through;
                        }
                    }
                    &:not(:first-child) {
                        border-top: 1px solid #EDEDED;
                    }
                }
                .message-more {
                    color: #999;
                    text-align: center;
                    font-size: 13px;
                    border-top: 1px solid #EDEDED;
                    padding-top: 20px;
                }
                .no-data{
                    font-size:15px;
                    color: #888;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 10px;
                    .pic{
                        background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                        width: 160px;
                        height: 120px;
                        background-size: 100%;
                        margin-bottom: 15px;
                    }
                }
            }
        }
        .spell-box{
            margin-bottom: 10px;
            .spell-flow{
                color: #353535;
                font-size: 13px;
                background: #fff;
                margin-bottom: 10px;
                padding: 0 15px;
                .hd{
                    height: 44px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    justify-content: space-between;
                    .txt-r{
                        display: flex;
                        align-items: center;
                        .van-icon{
                            margin-left: 5px;
                        }
                    }
                }
                .bd{

                    .spell-stepList{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 65px;
                        .spell-stepItem{
                            position: relative;
                            .cir{
                                width: 20px;
                                height: 20px;
                                margin: 0 auto 5px;
                                border: 1px dashed #B2B2B2;
                                border-radius: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                                &:after{
                                    position: absolute;
                                    top: 50%;
                                    left: 22px;
                                    content: '';
                                    width:70px;
                                    height: 1px;
                                    background: #B2B2B2;
                                    transform: translateY(-50%) scaleY(0.5);
                                }

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
            .spell-infoBox{
                background: #fff;

                font-size: 12px;
                color: #353535;
                .desc{
                    padding: 0 15px;
                    height: 35px;
                    line-height: 35px;

                }
                .go-spell{
                    display: flex;
                    padding: 15px 0 15px 15px;
                    margin: 0 15px;
                    .l{
                        border: 1px solid #B2B2B2;
                        border-radius: 5px;
                        flex-grow: 1;
                        display: flex;
                        justify-content: space-between;
                        height: 35px;
                    }
                    .spell-user{
                        position: relative;
                        display: flex;
                        align-items: center;
                        .user-pic{
                            height:40px;
                            width: 40px;
                            border-radius: 100%;
                            overflow: hidden;
                            position: absolute;
                            left: -20px;
                            top: -3px;
                            img{
                                height: 100%;
                            }
                        }
                        .user-name{

                            margin-left: 30px;
                        }
                    }
                    .timer{

                        padding-right: 15px;
                        .t{
                            font-size: 11px;
                            color: #888;
                            text-align: right;
                        }
                        .countDown-temp{
                            font-size: 10px;
                            color: #353535;
                            .countDown-box{
                                display: flex;
                                align-items: center;
                                .countDown-inner{
                                    display: flex;
                                    align-items: center;
                                    margin: 0 2px;
                                    .box{
                                        width: 14px;
                                        text-align: center;
                                    }
                                }
                            }
                        }
                    }
                    .r{
                        width: 70px;
                        height: 35px;
                        line-height: 35px;
                        background: #F32D16;
                        color: #fff;
                        font-size:15px;
                        text-align: center;
                        border-radius: 5px;
                        margin-left: -10px;
                    }
                }
            }
        }

    }
    .fixed-tool{
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
        .c-btn{
            position: relative;
            width: 135px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 50px;
            padding: 8px 0 4px;
            font-size:10px ;
            color: #888;
            .tag-a{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #888;
                height: 50px;
            }
            .p-txt {
                color: #333;
                margin-top: 3px;
                &.selected {
                    color: #F32D16;
                }
            }
            .shopping-dot {
                position: absolute;
                display: inline-block;
                width: 6px;
                height: 6px;
                top: 9px;
                right: 25px;
                border-radius: 50%;
                background: #F32D16;
            }
        }
        .disabled-btn{
            width: 100%;
            height: 100%;
            line-height: 50px;
            background: #ededed;
            text-align: center;
            font-size: 15px;
            color: #333;
        }
        .addCar-btn{
            width: 240px;
            flex-grow: 1;
            background: #FFB30D;
            font-size: 16px;
            color: #fff;
            line-height: 50px;
            text-align: center;
        }
        .nowPay-btn{
            width: 240px;
            flex-grow: 1;
            background: #F32D16;
            font-size: 16px;
            color: #fff;
            line-height: 50px;
            text-align: center;
        }
        .delete-btn {
            width: 240px;
            flex-grow: 1;
            background: #ededed;
            font-size: 16px;
            color: #333;
            line-height: 50px;
            text-align: center;
        }
        .end-btn{
            width: 240px;
            flex-grow: 1;
            background: #B2B2B2;
            font-size: 16px;
            color: #fff;
            line-height: 50px;
            text-align: center;
        }

        .nowStart-btn{
            width: 240px;
            flex-grow: 1;
            background: #00B700;
            font-size: 16px;
            color: #fff;
            line-height: 50px;
            text-align: center;
        }
        &.spell{
            .c-btn{
                width: 70px;
            }
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
                background: #F32D16;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                height: 50px;
                flex-grow: 1;
                width: 152px;
                &.dis{
                    font-size:18px;
                    background:#B2B2B2 ;
                }
                .txt{
                    font-size: 18px;
                }
                .num{
                    font-size: 15px;
                }

            }
        }
    }
    .rest-sku {
        color: #888;
        font-size: 14px;
        .van-sku-stepper-container{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .van-sku-actions{
            height: 50px;
        }
        .van-sku-messages{
            padding-bottom: 0;
        }
        .van-button--default{
            background: #FFB30D;
        }
        .van-button--primary{
            background: #F32D16;
        }

    }
    .tag{
        background: #F32D16;
        padding: 2px 4px;
        font-size: 12px;
        border-radius: 6px;
        color: #fff;
        margin-right:5px;
    }
    .person-tag {
        background: rgb(255,206,201);
        padding: 2px 0;
        font-size: 12px;
        color: rgb(253,114,107);
        margin-left:5px;
        span {
            display: inline-block;
            transform: scale(0.8);
        }
    }
    .couponDialog{
        .no-data{
            font-size:15px;
            color: #888;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 60px;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 160px;
                height: 120px;
                background-size: 100%;
                margin-bottom: 15px;
            }
        }
        .hd{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
            padding: 0 15px;
            font-size: 14px;
            color: #353535;
            .close-icon{
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 45px;
                font-size: 20px;
                color: #888;
                img {
                    width: 13px;
                    height: 13px;
                }
            }
        }
        .bd{
            background: #f4f4f4;
            height:375px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
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
