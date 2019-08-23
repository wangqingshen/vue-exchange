import Vue from 'vue'
import api from '../api/index'
let vue =new Vue({

})
const parseQueryString  = (str)=>{
    let srtChar = str
    return new Promise((reslove,reject)=>{
        if(srtChar.includes('?')){
            var str = srtChar.split('?')[1]
            var result = {}
            var temp = str.split('&')
            for(var i=0; i<temp.length; i++) {
                var temp2 = temp[i].split('=')
                result[temp2[0]] = temp2[1]
            }
            reslove(result)
        }else {
            reject(false)
        }
    })

}
const checkBrowser = {
    isWx: false,
    isAndroid: false,
    isIos: false,
    isPc: false,
    init:function () {
        var u = navigator.userAgent.toLowerCase();
        if (u.match(/MicroMessenger/i)) {
            this.isWx = true
        }
        if (u.match(/Mac OS X/i)) {
            this.isIos = true
        } else if (u.match(/Android/i)) {
            this.isAndroid = true
        } else {
            this.isPc = true
        }
    }
}

const userinfo = {}
userinfo.get = (data = {})=>{
    api.userInfo({
        cmd:{member:'getUserInfo'},
        data:data
    }).then(res=>{
        if(res.code===1){
            let timeStamp = Math.round(new Date().getTime()/1000)
            res.data.timeStamp = timeStamp
            window.localStorage.setItem('userInfo',JSON.stringify(res.data))
            window.localStorage.setItem('isShow', true)
            window.location.reload()
        }
    }).catch(err=>{})
}

userinfo.init = ()=>{
    // window.localStorage.clear()
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {}
    if(Object.keys(userInfo).length !== 0 && (userInfo.member_id !== 'undefined' || userInfo.member_id !== null)){
        parseQueryString(window.location.href).then(res=>{
            let openid = res.openid.split('#')[0]
            let memberid = res.memberid.split('#')[0]
            if(openid !== userInfo.mini_openid || memberid != userInfo.member_id){
                userinfo.get({openid: openid})
            }else{
                let timeStamp = Math.round(new Date().getTime()/1000)
                let oldTimeStamp = userInfo.timeStamp
                let diffTime = timeStamp-oldTimeStamp
                if(!userInfo.hasOwnProperty('timeStamp') || diffTime > 604800){
                    userinfo.get({openid: openid})
                }else{
                    window.localStorage.setItem('isShow', true)
                }
            }
        }).catch(err=>{})
    }else{
        if(checkBrowser.isWx){
            parseQueryString(window.location.href).then(res=>{
                let openid = res.openid.split('#')[0]
                userinfo.get({openid: openid})
            }).catch(err=>{})
        }else {
            //测试 死的openid
            //  openid:'ogxTM1Bp1sMYR90DHMiprqvz0iaA' 
            //  openid:'ogxTM1CZvyNIgHsZW-uh0Y1M5CN4'
            //  openid:'ogxTM1MmWpIAlvVqD_s5BGr83F7Q'
            // ogxTM1CAB3jbZar_dKkq_ClK9sDU ogxTM1K7AWnQ3kXetzwkli0DNUOY
            userinfo.get({openid: 'o8pZa0wyMgyAfgy_Heb-SzaFewjg'})
        }
    }
}
userinfo.init()
checkBrowser.init()
export {parseQueryString,checkBrowser,userinfo}
