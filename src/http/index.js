import axios from 'axios'
import {Base64} from 'js-base64'
import sha1 from 'js-sha1'
function MathRand() {
    let num= ''
    for(var i=0;i<5;i++) {
        num+=Math.floor(Math.random()*10);
    }
    return num
}

const mathNum = MathRand()
// const appid = "wuxing"
const appid = "exchange"
const nonce = mathNum
const timestamp = Math.floor(new Date().getTime()/1000)
let signature = sha1(timestamp + nonce),
    userAgent = 'wap'
signature = sha1(signature + appid)


const http ={}
http.post =(url,params = {})=>{
    let post_obj={
        "header":{
            "signature":signature,
            "timestamp":timestamp,
            "nonce":nonce,
            "user_agent": userAgent,
            "token": ''
        },
        "cmd":params.cmd,
        "data":params.data||{}
    }
    console.log(post_obj)
    let data = JSON.stringify(post_obj)
    data = Base64.encode(data)
    let arr = [data,'exchange']
    let srt = JSON.stringify(arr)


    let baseData = Base64.encode(srt)
    return new Promise((reslove,reject)=>{
        axios.post(url,baseData).then(res=>{
            let firstBase64 = Base64.decode(res.data)
            let base64Parse =JSON.parse(firstBase64)
            let resultData =JSON.parse(Base64.decode(base64Parse[0]))
            reslove(resultData)


        }).catch(err=>{
            reject(err)
        })
    })
}

axios.interceptors.response.use(
    res => {
        if (res.status === 500) {

            return;
        }
        if (res.status === 302) {
            console.log('重定向');
        }
        if (res.data && res.data.type === 'err') {
            return Promise.reject(res);
        }
        return res;
    },
    err => {

        return Promise.reject(err);
    }
);


export default http
