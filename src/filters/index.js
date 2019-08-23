import moment from 'moment'
const orderStatus =(value)=>{
    switch (value){
        case 1:
            return '待付款'
            break;
        case 2:
            return '待发货'
            break;
        case 3:
            return '已发货'
            break;
        case 4:
            return '交易完成'
            break;
        case 5:
            return '已取消'
            break;
        case 7:
            return '拼团中'
            break;
        case 9:
            return '待付款'
            break;
        case 6:
            return '已退款'
            break;
        case 8:
            return '退款中'
            break;
    }
}
const groupStatus =(value)=>{
    switch (value){
        case 0:
            return '拼团中'
            break;
        case 1:
            return '拼团成功'
            break;
        case 2:
            return '拼团失败'
            break;
    }
}
const couponStatus = (value)=>{
    switch (value){
        case 0:
            return '已被领取'
            break;
        case 1:
            return '立刻领取'
            break;
        case 2:
            return '已抢空'
            break;
    }
}
const toFixedTwo = (value)=>{
    return parseFloat(value).toFixed(2)
}

const unixdate = (value) => {
    return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
}
const YYMMDD = (value) => {
    return moment(value * 1000).format('YYYY-MM-DD')
}

const filterGoodsName = (value)=>{
    return value.length > 4 ? value.slice(0,4) : value;
}

const filterCellNum = (value)=>{
    return value.slice(0,3) + '*****' +value.slice(8,11);
}

const formatMsgDate = (value1,value2)=>{
    var now = new Date(value1*1000);
    var date = new Date(value2*1000);
    //计算时间间隔，单位为分钟
    var inter = parseInt((now.getTime() - date.getTime())/1000/60);
    if(inter == 0){
        return "刚刚";
    }
    //多少分钟前
    else if(inter < 60){
        return inter.toString() + "分钟前";
    }
    //多少小时前
    else if(inter < 60*24){
        return parseInt(inter/60).toString() + "小时前";
    }
    else if(now.getFullYear() == date.getFullYear()){
        return (date.getMonth()+1).toString() + "-" +
            date.getDate().toString() + " " + 
            date.getHours() + ":" +
            date.getMinutes();
    }
    else{
        return date.getFullYear().toString().substring(2, 3) + "-" +
        (date.getMonth()+1).toString() + "-" + 
        date.getDate().toString() + " " + 
        date.getHours() + ":" +
        date.getMinutes();
    }
}

const formatChatDate = (vale)=>{

}
export {orderStatus,unixdate,toFixedTwo,filterGoodsName,filterCellNum,YYMMDD,groupStatus,couponStatus,formatMsgDate,formatChatDate}
