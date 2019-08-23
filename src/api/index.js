import http from '../http/index'

const api={}
api.userInfo = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/getUserInfo',parmas)
// 首页接口
api.indexPic = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/shop/banner',parmas)
// 首页图标
api.indexIcon = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/index/icon',parmas)
//加入购物车
api.addCart = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/cart/addcart',parmas)
//购物车列表
api.cartList = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/cart/cartlist',parmas)
//购物车填减
api.changeCarGoodsNum = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/cart/changegoodsnum',parmas,false)
//删除购物车
api.removeShopItem = (params) => http.post(process.env.VUE_APP_APIHOST+'/cart/delcart',params)
//结算购物车
api.goPay = (params)=>http.post(process.env.VUE_APP_APIHOST+'/cart/orderconfirm',params)
//提交合作加盟
api.submitLeague = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/submitLeague',params)
//加盟状态
api.leagueState = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/leagueState',params)
//协议文章
api.getArticle = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/getArticle',params)
//重新获取加盟信息
api.getLeagueById = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/getLeagueById',params)

//领取优惠券
api.getCoupon = (params)=>http.post(process.env.VUE_APP_APIHOST+'/discount/usergetdiscount',params)
//订单确认优惠券
api.getOrderCoupon = (params)=>http.post(process.env.VUE_APP_APIHOST+'/discount/getorderdiscount',params,false)
//我的优惠券
api.getOwnCoupon = (params)=>http.post(process.env.VUE_APP_APIHOST+'/discount/mydiscountlist',params)

//商品详情
api.goodsDetails = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/detail',parmas,false)
// 商品分类
api.classInfo = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/classinfo',parmas)
// 商品列表
api.goodList = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/lists',parmas)
//商品标签
api.getGoodLabel = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/getgoodslabel',parmas)
//商品发布
api.goodPublish = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/ReleaseExchangeGoods',parmas)

//获取商品详情type
api.goodsDetailsType = (params)=>http.post(process.env.VUE_APP_APIHOST+'/goods/GoodsActivity',params)
// 获取个人商品详情
api.goodsPersonDetails = (params)=>http.post(process.env.VUE_APP_APIHOST+'/goods/ExchangeGoodsDetail',params)

//生成订单
api.createOrder =(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/createorder',params,true)
//支付收银台
api.cashier = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/cashier',params)
//支付
api.payMoney = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/wxpay',params)

//用户信息
api.memberInfo = (params)=>http.post(process.env.VUE_APP_APIHOST+'/wallet/memberinfo',params)
//用户钱包明细
api.walletlist = (params)=>http.post(process.env.VUE_APP_APIHOST+'/wallet/memberbalance',params)
//用户提现
api.withdraw = (params)=>http.post(process.env.VUE_APP_APIHOST+'/wallet/memberwithdraw',params)

//配置wx.config
api.getWeChatSignature = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/getwechatsignature',params,false)
//订单列表
api.getOrderList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/orderlist',params)
//取消订单
api.cancelOrder=(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/cancelOrder',params)
//订单详情
api.orderDetail=(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/orderdetail',params)
//确认收货
api.confirmOrder = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/confirmorder',params)
//我卖出的订单列表
api.sellOrerList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/getMemberSellOrder',params)
//我买到的订单列表
api.buyOrderList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/orderList',params)
//修改订单价格
api.modifyOrder = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/ExchangeModifyOrder',params)
//设置发货
api.deliverWay= (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/SetDeliveryWay',params)
//订单支付状态查询
api.orderQuery= (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/OrderQuery',params)
//物流公司列表
api.logisticsList= (params)=>http.post(process.env.VUE_APP_APIHOST+'/Logistics/LogisticsCompanyList',params)
//物流详情
api.logistics = (params)=>http.post(process.env.VUE_APP_APIHOST+'/logistics/searchlogistics',params)

//店铺优惠券
api.storeCoupon = (params)=>http.post(process.env.VUE_APP_APIHOST+'/discount/storealldiscount',params,false)

//改电话
api.editMobile = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/editMobile',parmas)

//地址列表
api.getAddressList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/addressList',params)
//新增编辑地址
api.editAddress = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/editAddress',params)
//删除地址
api.deleteAddress = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/deleteAddress',params)
//设置默认收货地址
api.setDefaultAddress = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/setDefaultAddress',params)

//拼团商品详情
api.getGroupGoodsDetails = (params)=>http.post(process.env.VUE_APP_APIHOST+'/group/GroupGoodsDetail',params,false)
//拼团频道
api.getChannelLists = (params)=>http.post(process.env.VUE_APP_APIHOST+'/group/ChannelLists',params)
//拼团列表
api.getGroupGoodsList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/group/GroupBuyLists',params,false)
//拼团团队详情
api.getGroupTeamInfo = (params)=>http.post(process.env.VUE_APP_APIHOST+'/group/GroupTeamInfo',params)
//我的拼团列表
api.getOwnGroupList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/MyGroupTeam',params)
//秒杀频道
api.getSecKillChannel = (params)=>http.post(process.env.VUE_APP_APIHOST+'/seckill/getseckillphaselist',params)
//秒杀列表
api.getSecKillList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/seckill/seckillgoodslists',params,false)
//秒杀详情
api.getSecKillGoodsDetails = (params)=>http.post(process.env.VUE_APP_APIHOST+'/seckill/getseckillgoodsdetail',params,false)
//秒杀数量判断
api.getSecKillGoodsNum = (params)=>http.post(process.env.VUE_APP_APIHOST+'/seckill/getseckillpurchasenumber',params,false)
//拼团数量判断
api.getGroupGoodsNum = (params)=>http.post(process.env.VUE_APP_APIHOST+'/group/CheckGroup',params,false)

//聊天列表
api.getChatList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/chatlists',params,false)
//聊天对话发送
api.sendChat = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/chat',params,false)
//聊天消息内容
api.getChatMsg = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/chatmsglists',params,false)
//回复留言内容
api.sendMsg = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/WriteComment',params,false)
//获取留言内容
api.getMsgList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/getGoodsComment',params,false)
// 获取留言列表
api.getCommentLists = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/getCommentLists',params,false)
// 底部消息红点
api.isreadnotice = (params)=>http.post(process.env.VUE_APP_APIHOST+'/im/isreadnotice',params,false)

//我想要列表
api.getWamtLists = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/ExpectGoodsLists',params,false)
//想要红心
api.toWantGoods = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/ToExpectGoods',params,false)

//个人商品上下架及删除
api.dropExchangeGoods = (params)=>http.post(process.env.VUE_APP_APIHOST+'/goods/DropExchangeGoods',params,false)

//我发布的商品列表
api.myReleaseGoodsList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/MyReleaseGoodsList',params,false)

//获取后台公共配置项
api.getCommonSet = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/getCommonSet',params,false)

//三级地址联动
api.getCityRegion = (params)=>http.post(process.env.VUE_APP_APIHOST+'/region/getCityRegion',params,false)

export default api
