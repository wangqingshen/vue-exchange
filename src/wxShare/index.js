import Vue from 'vue'
import store from '../store/index'
let vue =new Vue({})

const share = {}

// const shareBasic = 'http://exchange.wsyjcs.cn/commonclass/wechat/index/app/exchange/page/'
const shareBasic = 'http://www.yjbbkj.com/commonclass/wechat/index/app/exchange/page/'
// const shareBasic = 'https://shop.wsyjcs.cn/commonclass/wechat/index/app/exchange/page/'

share.api = (data = {})=>{
 console.log(data)
 vue.$api.getWeChatSignature({
    cmd:{
        order:"getwechatsignature"
    },
    data:{
        url:window.location.href
    }
}).then(res=>{
    vue.$wxSdk.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.appid, // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
        signature: res.data.signature, // 必填，签名，见附录1
        jsApiList: ['chooseWXPay','onMenuShareAppMessage','onMenuShareTimeline','chooseImage']//微信支付 分享给朋友 分享到朋友圈
    })
    vue.$wxSdk.ready(function () {   //需在用户可能点击分享按钮前就先调用
        if(Object.keys(data).length) {
            vue.$wxSdk.onMenuShareAppMessage({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: shareBasic + data.linkName, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                success: function(res){
                    store.commit('SET_SHARE_ICON',false)
                }
            });
            vue.$wxSdk.onMenuShareTimeline({ //分享到朋友圈
                title: data.title, // 分享标题
                link: shareBasic + data.linkName, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.imgUrl, // 分享图标
                success: function(res){
                    store.commit('SET_SHARE_ICON',false)
                }           
            })  
        } 
    })
})

}
export default share