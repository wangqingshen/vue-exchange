import store from '../store/index'
const map = {}
map.geolocation = (data={}) =>{
	AMap.plugin('AMap.Geolocation', function() {
		var geolocation = new AMap.Geolocation({
       		enableHighAccuracy: true,//是否使用高精度定位，默认:true
       		timeout: 10000,          //超过10秒后停止定位，默认：5s
	       	buttonPosition:'RB',    //定位按钮的停靠位置
	       	buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	       	zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
	    })
	    geolocation.getCurrentPosition(function(status,result){
	     	if(status=='complete'){
	        	map.onComplete(result)
	     	}else{
	        	map.onError(result)
	     	}
	 	})
	})
}

map.onComplete = (res={})=>{
	console.log(res, '定位成功')
	let geoLocation = JSON.parse(window.localStorage.getItem('geoLocation')) || {}
	if(geoLocation.adcode == 'undefined' || geoLocation.adcode == null) {
		map.setData(res)
	}else if(res.addressComponent.adcode != geoLocation.adcode){
		map.setData(res)
	}
	
}

map.onError = (res={}) => {
	console.log(res, '定位失败')
	localStorage.removeItem('geoLocation')
}

map.setData = (res={})=>{
	let arr = {}
	arr.adcode = res.addressComponent.adcode
	arr.city = res.addressComponent.city
	arr.district = res.addressComponent.district
	arr.goods_longitude = res.position.lng
	arr.goods_latitude = res.position.lat
	localStorage.setItem('geoLocation', JSON.stringify(arr))
	// window.localStorage.setItem('isShow', true)
	window.location.reload()
}

map.init = () => {
	map.geolocation()
	
}

export default map