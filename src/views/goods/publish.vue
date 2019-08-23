<template>
    <div class="publish-wrapper" v-title="pageTitle">
        <div class="content" v-if="!publish_success">
            <!-- 上传图片 -->
            <div class="upload-pic">
                <div class="upload-inner">
                    <div class="upload-item" @click="upload" v-if="content.goods_album.length<9" :class="content.goods_album.length?'img':''">
                        <div class="pic"></div>
                        <div class="txt">添加照片</div>
                    </div>
                    <div class="img-item" v-for="(item, index) in content.goods_album" :key="index">
                        <img :src="item" />
                        <span class="del-img" @click="removeImg(index)"></span> 
                        <span class="first-tip" v-if="!index">封面</span>  
                    </div>
                </div>
            </div>
            <!-- 商品名 描述 定位 上架-->
            <div class="ptitle">
                <input type="text" v-model="content.goods_name" placeholder="在此填写宝贝名称，如“iphone8 p" maxlength="30">
            </div>
            <div class="product">
                <textarea name="" v-model="content.goods_describe" placeholder="在此描述您的宝贝：如品牌、规格、橙色、购买渠道、转手原因等" maxlength="300"></textarea>
                <div class="choice">
                    <div class="area">
                        <div class="icon icon1"></div>
                        <div class="txt" @click="geoAreaDialog">{{geoArea}}</div>
                        <div class="icon icon2" v-show="!content.adcode" @click="getGeoInfo"></div>
                    </div>
                    <div class="putaway" @click="putaway">
                        <div class="icon" :class="content.goods_auto_release ? 'active' : ''"></div>
                        <div class="txt">自动上架</div>
                    </div>
                </div>
            </div>
            <!-- 分类 价格 -->
            <div class="option">
                <div class="option-item" @click="category_show = !category_show">
                    <div class="item-l">分类</div>
                    <div class="item-r">
                        <div class="txt" :class="gc_name ? 'active' : ''">{{gc_name ? gc_name : '选择分类'}}</div>
                        <div class="icon"></div>
                    </div>
                </div>
                <div class="option-item" @click="price_show = !price_show">
                    <div class="item-l">价格</div>
                    <div class="item-r">
                        <div class="txt" :class="content.goods_price ? 'active' : ''">{{content.goods_price ? content.goods_price : '开价'}}</div>
                        <div class="icon"></div>
                    </div>
                </div>            
            </div>
            <div class="publish" @click="publish" v-if="content.goods_name&&content.goods_describe&&content.adcode&&gc_name&&content.goods_price&&content.goods_album.length">
                <div class="fun-btn">{{btnTxt}}</div>
            </div>
            <div class="publish disabled" v-else>
                <div class="fun-btn">{{btnTxt}}</div>
            </div>
            <!-- 弹出分类联动 -->
            <van-popup v-model="category_show" class="category-popup" overlay-class="category-modal">
                <div class="category-close" @click="category_show=false"><img src="../../assets/images/icon_close@2x.png" /></div>
                <div class="category-inner">
                    <div class="level_1">
                        <div class="category-item" :class="firSelected == index ? 'active' : ''"  @click="changeCategoryEvt(index)" v-for="(item, index) in categoryFirList" :key="index">
                            <span>{{item.gc_name | filterGoodsName}}</span>
                        </div>
                    </div>
                    <div class="category-list">
                        <div class="category-item" :class="secSelected == index ? 'active' : ''"  @click="changeSecEvt(index)" v-for="(item, index) in categorySecList" :key="index" >
                            <span>{{item.gc_name}}</span>
                            <section v-show="secSelected == index">
                                <div class="thrCategory-item" v-for="(_item, _index) in item.next_level" :class="thrSelected == _index ? 'active' : ''" :key="_index" @click="selectCategoryEvt(_index)">
                                    <span>{{_item.gc_name}}</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </van-popup>
            <!-- 城市地址首字母排序 -->
            <van-popup v-model="region_show" class="region-popup" overlay-class="region-modal" :overlay="false">
                <div class="region-close" @click="region_show=false"><img src="../../assets/images/icon_close@2x.png" /></div>
                <div class="region-inner" v-if="!selectAdCode">
                    <div class="region-title">
                        <div class="address-icon"></div>
                        <div class="txt">{{geoArea}}</div>
                    </div>
                    <div class="city-wrapper city-wrapper-hook" ref="scrollWrap">
                         <div class="scroller-hook">
                            <div class="cities">
                                <div v-for="(item, index) in areaList" :key="index" :id="item.name">
                                    <div class="title">{{item.name}}</div>
                                    <ul>
                                        <li v-for="(city, index) in item.cities" :key="index" class="item city-click" :data-name="city.cityName" :data-id="city.adcode" @click="touchUp(city)"><span class="border-1px name">{{city.cityName}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="shortcut shortcut-hook">
                        <ul>
                            <li v-for="(item, index) in areaList" :key="index" :data-anchor="item.name" class="item" @click="touchPy">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <div class="region-inner" v-else style="padding-top: 0">
                    <div class="city-wrapper city-wrapper-hook">
                        <div class="scroller-hook">
                            <div class="cities">
                                <ul>
                                    <li v-for="(city, index) in areaList" :key="index" class="item city-click" :data-name="city.cityName" :data-id="city.adcode" @click="touchUp(city)"><span class="border-1px name">{{city.cityName}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                </div>
            </van-popup>
            <!-- 弹出价格框 -->
            <van-popup v-model="price_show" class="price-popup" overlay-class="price-modal">
                <!-- 关闭 -->
                <div class="close" @click="price_show = false"></div>
                <div class="cell">
                    <div class="hd">
                        <p>想卖多少钱？</p>
                        <div class="tips" v-show="commission_ratio">平台将从交易金额中抽成{{commission_ratio}}%，请合理设置价</div>
                    </div>
                    <div class="bd">
                        <!-- 售价 -->
                        <div class="item">
                            <span>¥</span>
                            <input type="number" v-model="content.goods_price" maxlength="10" oninput="if(value.length>9)value=value.slice(0,9)">
                        </div>
                        <!-- 原价 -->
                        <div class="item">
                            <div class="item-l">
                                <p>原价</p>
                                <div class="value">
                                    <span v-show="content.goods_original_price">¥</span>
                                    <input type="number" v-model="content.goods_original_price" maxlength="10" oninput="if(value.length>9)value=value.slice(0,9)">
                                </div>
                            </div>
                        </div>
                        <!-- 运费 -->
                        <div class="item">
                            <div class="item-l">
                                <p>运费</p>
                                <div class="value" v-if="isPostage">
                                    <span v-show="content.shipping_fee">¥</span>
                                    <input type="number" v-model="content.shipping_fee" placeholder="¥0.00" readonly>
                                </div> 
                                <div class="value" v-else>
                                    <span v-show="content.shipping_fee">¥</span>
                                    <input type="number" v-model="content.shipping_fee" placeholder="待议" maxlength="7">                    
                                </div>      
                            </div>
                            <div class="item-r">
                                <div class="choice" @click="postage">
                                    <div class="icon" :class="isPostage ? 'active' : ''"></div>
                                    <p>包邮</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ft" @click="save">保存</div>
                </div>
            </van-popup>
        </div>
        <!-- 发布成功 -->
        <div class="success" v-else>
            <div class="success-inner">
                <div class="info">
                    <div class="pic"></div>
                    <div class="txt">{{btnTxt}}成功</div>
                </div>
                <div class="look" @click="PageGood">
                    <div class="txt">查看宝贝</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'publish',
        data(){
            return {
                pageTitle: '',
                btnTxt: '',
                content: {
                    goods_name: '',
                    goods_describe: '',
                    gc_1: '',
                    gc_2: '',
                    gc_3: '',
                    goods_auto_release: 1,
                    goods_longitude: '',
                    goods_latitude: '',
                    adcode: '',
                    shipping_fee: '',
                    goods_price: '',//售价
                    goods_original_price: '',//原价
                    goods_album: []
                },
                geoArea: '定位中',
                geoStatus: false,
                city: '',
                district: '',
                categoryFirList: [],
                categorySecList: [],
                firSelected: -1,
                secSelected: -1,
                thrSelected: -1,
                commission_ratio: '',//佣金抽成
                gc_name: '',
                category_show: false,
                price_show: false,
                isPostage: false,
                publish_success: false,
                region_show: false,
                member_id: '',
                areaList: [],
                cityList: [],
                districtList: [],
                selectAdCode: 0,
                selectLevel: 'city',
                py: ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'],
                spu_id: ''
            }
        },
        computed: {
            
        },
        components: {

        },
        methods: {
            upload(){
                let _this = this
                this.$wxSdk.chooseImage({
                    count: 9,
                    sizeType: ['compressed'],
                    success: function (res) {
                        var localIds = res.localIds
                        if(_this.content.goods_album.length+localIds.length>9) {
                            _this.$toast({message: '最多上传9张图片'})
                        }else{
                            _this.getLocalImage(localIds)
                        }
                    }
                })
            },
            getLocalImage(localIds){
                let _this = this
                var localId = localIds.shift()
                this.$wxSdk.getLocalImgData({
                    localId: localId, // 图片的localID
                    success: function (res) {
                        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                        var u = navigator.userAgent;
                        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端     
                        if(isAndroid) {
                            var base_data = localData;
                            localData = 'data:image/jgp;base64,' + base_data;
                        }
                        _this.content.goods_album.push(localData)
                        if(localIds.length) {
                            _this.getLocalImage(localIds)
                        }
                    }
                })
            },
            removeImg(index){
                this.content.goods_album.splice(index,1)
            },
            putaway(){
                this.content.goods_auto_release = !this.content.goods_auto_release
            },
            postage(){
                this.isPostage = !this.isPostage
                this.content.shipping_fee = '0.00'
            },
            save(){
                // let reg1 = /^0\.\d{1,2}$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/
                // console.log(this.content)
                let reg1 = /^[1-9][0-9]{0,6}(\.{0,1}[0-9]{0,2})$/
                if(!this.content.goods_price){
                    this.$toast({message: '请填写销售价'})
                    return false
                }
                if(!reg1.test(this.content.goods_price)){
                    this.$toast({message: '价格范围1-9999999'})
                    return false
                }
                if(Number(this.content.goods_original_price) && !reg1.test(this.content.goods_original_price )){
                    this.$toast({message: '价格范围1-9999999'})
                    return false
                }
                let reg2 = /^[1-9]\d{0,3}|0$/
                if(!this.isPostage && !this.content.shipping_fee){
                    this.$toast({message: '请填写运费'})
                    return false
                }
                if(!this.isPostage && !reg2.test(this.content.shipping_fee)){
                    this.$toast({message: '请填写正确格式的运费'})
                    return false
                }
                this.price_show = false
            },
            publish(){
                this.$toast.loading({
                   duration: 0,
                   forbidClick: true,
                   loadingType: 'spinner',
                   message: '商品发布中'
                })
                this.$api.goodPublish({//商品分类
                    cmd:{
                        "goods":"ReleaseExchangeGoods"
                    },
                    data:this.content
                }).then(res=>{
                    console.log(res,'release')
                    this.$toast.clear()
                    if(res.code === 1){
                        this.spu_id = res.data.spu_id
                        this.publish_success = true
                    }
                }).catch(err=>{

                })
            },
            getCatetoryInfo(){
                this.$api.classInfo({//商品分类
                    cmd:{
                        "goods":"classinfo"
                    },
                    data:{
                        'type':1
                    }
                }).then(res=>{
                    if(res.code === 1){
                        this.categoryFirList = res.data
                    }
                }).catch(err=>{

                })
            },
            Commission(){
                this.$api.getCommonSet({//佣金比列
                    cmd:{
                        "member":"getCommonSet"
                    },
                    data:{
                        'param_type': '1'
                    }
                }).then(res=>{
                    console.log(res,'commission')
                    if(res.code === 1){
                        this.commission_ratio = res.data.commission_ratio
                        console.log(this.commission_ratio,'commission_ratio')
                    }
                }).catch(err=>{

                })
            },
            changeCategoryEvt(index){
                if(this.firSelected == index) return
                this.firSelected = index
                this.secSelected = -1
                this.content.gc_1 = this.categoryFirList[index].gc_id
                this.content.gc_2 = 0
                this.content.gc_3 = 0
                this.gc_name=''
                setTimeout(()=>{
                  this.categorySecList  =  this.categoryFirList[index].next_level;
                },200)
            },
            changeSecEvt(index){
                if(this.secSelected == index) return
                this.secSelected = index
                this.thrSelected = -1
                this.content.gc_3 = 0
                this.gc_name=''
                this.content.gc_2 = this.categorySecList[index].gc_id
            },
            selectCategoryEvt(index) {
                this.thrSelected = index
                this.content.gc_3 = this.categorySecList[this.secSelected].next_level[index].gc_id
                this.gc_name = this.categorySecList[this.secSelected].next_level[index].gc_name
                this.category_show = false
                // console.log(this.gc_1, this.gc_2, this.gc_3, this.gc_name)
                console.log(this.content)
            },
            PageGood(){
                this.$router.push({name: 'goodsDetails', params: {spu_id: this.spu_id}})
            },
            geoAreaDialog(){
                if(!this.geoStatus) return
                this.areaList = this.cityList
                this.selectAdCode = 0
                this.selectLevel = 'city'
                this.region_show = true
            },
            getRegionList(){
                this.$api.getCityRegion({//城市三联
                    cmd:{
                        "region":"getCityRegion"
                    },
                    data:{
                        adcode: this.selectAdCode,
                        level: this.selectLevel
                    }
                }).then(res=>{
                    if(res.code === 1){
                        if(this.selectAdCode) {
                            this.areaList = res.data
                            this.districtList = res.data
                        }else{
                            this.mergeCityPy(res.data)
                        }
                        
                    }
                }).catch(err=>{
    
                })
            },
            mergeCityPy(data){
                this.py.map(res=>{
                    let o = {}
                    o.name = res
                    o.cities = []
                    for(var i in data) {
                        if(res == data[i].cityFirstLetter) o.cities.push(data[i])
                    }
                    this.areaList.push(o)
                    this.cityList.push(o)
                })
            },
            touchUp(item){
                if(this.selectAdCode) {
                    this.district = item.cityName
                    this.geoArea = this.city + ' ' + this.district
                    this.content.adcode = item.adcode
                    this.content.goods_longitude = item.lng
                    this.content.goods_latitude = item.lat
                    this.region_show = false
                }else{
                    this.selectAdCode=item.adcode
                    this.selectLevel = 'district'
                    this.city = item.cityName
                    this.areaList = []
                    this.getRegionList()
                }
            },
            touchPy(e){
                let anchor = e.target.getAttribute('data-anchor')
                this.$nextTick(() => {
                    this.animateScroll(document.getElementById(anchor).offsetTop - 51)
                })
            },

            animateScroll(target){
                var scrollT = this.$refs.scrollWrap.scrollTop
                if (scrollT > target) {
                    var timer = setInterval(res=>{
                        var scrollT = this.$refs.scrollWrap.scrollTop
                        var step = Math.floor(-scrollT/30);
                        this.$refs.scrollWrap.scrollTop = step + scrollT;
                        if(scrollT <= target){
                           this.$refs.scrollWrap.scrollTop = target;
                            clearTimeout(timer);
                        }
                    },20)
                }else if(scrollT == 0){
                    var timer = setInterval(res=>{
                        var scrollT = this.$refs.scrollWrap.scrollTop
                        var step = Math.floor(300/3*0.7);
                        this.$refs.scrollWrap.scrollTop= step + scrollT;
                        if(scrollT >= target){
                            this.$refs.scrollWrap.scrollTop = target;
                            clearTimeout(timer);
                        }
                    },20)
                }else if(scrollT < target){
                    var timer = setInterval(res=>{
                        var scrollT =this.$refs.scrollWrap.scrollTop
                        var step = Math.floor(scrollT/30);
                        this.$refs.scrollWrap.scrollTop = step + scrollT;
                        if(scrollT >= target){
                            this.$refs.scrollWrap.scrollTop = target;
                            clearTimeout(timer);
                        }
                    },20)
                }else if(target == scrollT){
                    return false;
                }
            },
          
            getGeoInfo(){
                let _this = this
                this.geoStatus = false
                AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：5s
                        buttonPosition:'RB',    //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
                    })
                    geolocation.getCurrentPosition(function(status,res){
                        _this.geoStatus = true
                        if(status=='complete'){
                            _this.content.adcode = res.addressComponent.adcode
                            _this.city = res.addressComponent.city
                            _this.district = res.addressComponent.district
                            _this.content.goods_longitude = res.position.lng
                            _this.content.goods_latitude = res.position.lat
                            _this.geoArea = res.addressComponent.city + ' ' +  res.addressComponent.district
                        }else{
                            _this.content.adcode = ''
                            _this.content.goods_longitude = ''
                            _this.content.goods_latitude = ''
                            _this.geoArea = '定位失败 请重试'
                        }
                    })
                })
            },
            getPublishInfo(){
                let data = {
                    spu_id:this.spu_id,
                    member_id: this.member_id
                }
                this.$api.goodsPersonDetails({
                    cmd:{
                        goods:'ExchangeGoodsDetail'
                    },
                    data:data
                }).then(res=>{
                    if(res.code == 1) {
                        let info = res.data
                        this.content.goods_name = info.goods_name
                        this.content.goods_describe = info.goods_describe_exchange
                        this.content.adcode = info.goods_adcode
                        this.content.goods_auto_release = info.goods_auto_release
                        this.content.goods_longitude = info.goods_longitude
                        this.content.goods_latitude = info.goods_latitude
                        this.content.shipping_fee = info.shipping_fee
                        this.content.goods_price = info.sku.price
                        this.content.goods_original_price = info.spu.market_price
                        this.geoArea = info.goods_cityname.city + ' ' + info.goods_cityname.district
                        this.geoStatus = true
                        this.content.gc_1 = info.spu.gc_id_1
                        this.content.gc_2 = info.spu.gc_id_2
                        this.content.gc_3 = info.spu.gc_id_3
                        this.gc_name = info.spu.gc_name
                        for(var i in info.banner) {
                            var image = new Image()
                            image.src = info.banner[i].goods_img
                            image.setAttribute("crossOrigin",'Anonymous')
                            image.onload = res=>{
                                this.content.goods_album.push(this.getBase64Image(res.target))
                            }
                        }
                    }
                    
                }).catch(err=>{

                })
            },

            getBase64Image(img) {
                var canvas = document.createElement("canvas");
                var w = img.width,
                    h = img.height;
                var toSize = 400;
                canvas.width = toSize;
                canvas.height = toSize;
                var w2 = toSize, h2 = toSize;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h, 0, 0, w2, h2);
                var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
                var dataURL = canvas.toDataURL("image/"+ext);
                return dataURL;
            }
        },
        created(){
            let txt = ''
            let spuId = this.$route.params.spu_id
            this.$share.api()
            this.getCatetoryInfo()
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            this.member_id = this.userInfo.member_id
            this.content.member_id = this.member_id
            this.getRegionList()
            this.Commission()  
            if(spuId == -1) {
                txt = '发布'
                this.getGeoInfo()
            } else{
                txt = '编辑'
                this.spu_id = spuId
                this.content.spu_id = spuId
                this.getPublishInfo()
            }
            this.pageTitle = txt+'二手商品'
            this.btnTxt = txt
        }
    }
</script>

<style lang="scss" type="text/scss">
    .publish-wrapper{
        .content{
            .upload-pic{
                display: flex;
                padding: 0 15px;
                height: 110px;
                background: #FFF;
                width: 100%;
                box-sizing: border-box;
                overflow: auto;
                .upload-inner{
                    display: -webkit-box;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    .upload-item{
                        width: 87px;
                        height: 87px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        color: #333;
                        font-size: 14px;
                        .pic{
                            width: 38px;
                            height: 38px;
                            background-image: url(../../assets/images/icon_camera@2x.png);
                            background-size: contain;
                        }
                        &.img {
                            background: #f3f3f3;
                        }
                    }
                    .img-item {
                        width: 87px;
                        height: 87px;
                        background-color: #d8d8d8;
                        margin-left: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        position: relative;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .del-img {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 15px;
                            height: 15px;
                            background-image: url('../../assets/images/icon_close@2x.png');
                            background-repeat: no-repeat;
                            background-size: contain;
                        }
                        .first-tip {
                            position: absolute;
                            width: 100%;
                            height: 20px;
                            left: 0;
                            bottom: 0;
                            background: rgba(243,45,22,0.6);
                            color: #fff;
                            font-size: 12px;
                            line-height: 20px;
                            text-align: center;
                        }
                    }
                }
            }
            .ptitle{
                width: 100%;
                height: 50px;
                margin: 10px 0;
                padding: 0 15px;
                background: #fff;
                input{
                    width: 100%;
                    padding-top: 14px;
                    border: 0;
                    font-size: 16px;
                    &::-webkit-input-placeholder{
                        color:#ccc;
                    }
                }
            }
            .product{
                padding: 0 15px;
                height: 225px;
                background: #FFF;
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: #333;
                textarea{
                    padding-top: 15px;
                    border: 0;
                    height: 150px;
                    &::-webkit-input-placeholder{
                        color:#ccc;
                    }
                }
                .choice{
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 9px;
                    .area{
                        display: flex;
                        align-items: center;
                        .icon{
                            width: 10px;
                            height: 15px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;
                        }
                        .icon1{
                            background-image: url(../../assets/images/icon_location@2x.png);
                        }
                        .icon2{
                            background-image: url(../../assets/images/refresh@2x.png);
                        }
                        .txt{
                            padding: 0 8px;
                        }
                    }
                    .putaway{
                        display: flex;
                        align-items: center;
                        .icon{
                            width: 18px;
                            height: 18px;
                            background-image: url(../../assets/images/icon_chose_normal@2x.png);
                            background-size: contain;
                            margin-right: 5px;
                            &.active{
                                background-image: url(../../assets/images/icon-xuanzhong@2x.png);                            
                            }
                        }
                    }
                }
            }
            .option{
                padding: 0 15px;
                background: #FFF;
                .option-item{
                    width: 100%;
                    height: 44px;
                    border-bottom: 1px solid #EDEDED;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 16px;
                    &:last-child{
                        border: 0;
                    }
                    .item-l{
                        color: #000;
                    }
                    .item-r{
                        display: flex;
                        align-items: center;
                        color: #999;
                        .txt{
                            &.active{
                                color: #333;
                            }
                        }
                        .icon{
                            width: 12px;
                            height: 12px;
                            background-image: url(../../assets/images/ic_order_rightarrow.png);
                            background-size: contain;
                            margin-left: 5px;
                        }
                    }
                }
            }
            .publish{
                height: 44px;
                position: fixed;
                bottom: 0;
                width: 100%;
                background: #F32D16;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #FFF;
                font-size: 14px;
                &.disabled {
                    background: #ccc;
                }
            }
            .category-popup{
                width: 100%;
                height: 100%;
                background: #efefef;
                .category-close {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    z-index: 10;
                    img {
                        width: 25px;
                        height: 25px;
                    }
                }
                .category-inner{
                    color: #353535;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: flex;
                    height: 100vh;
                    .level_1 {
                        font-size: 14px;
                        line-height: 45px;
                        flex: 0 0 120px;
                        background: #F4F4F4;
                        text-align: left;
                        flex-direction: column;
                        overflow: auto;
                        -webkit-overflow-scrolling:touch;
                        .category-item {
                            overflow: auto;
                            white-space: nowrap;
                            padding: 0 15px;
                            &.active{
                                color: #F22A15;
                                background: #efefef;
                            }
                        }
                    }
                    .category-list {
                        width: calc(100% - 120px);
                        padding: 0 15px;
                        box-sizing: border-box;
                        overflow: auto;
                        >.category-item {
                            &.active{
                                >span {
                                    color: #F22A15;
                                    background: #efefef;
                                }
                               
                            }
                            >span{
                                line-height: 45px;
                                font-size: 14px;
                            }
                            section{
                                overflow: hidden;
                                clear: both;
                                .thrCategory-item {
                                    display: block;
                                    float: left;
                                    margin-bottom: 15px;
                                    width: 50%;
                                    >span{
                                        display: block;
                                        width: 85%;
                                        background: #fff;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        padding: 5px 10px;
                                        text-align: center;
                                        border-radius: 4px; 
                                        border: 1px solid transparent;
                                    }
                                    &.active>span{
                                        color: #F22A15;
                                        border-color: #F22A15;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .region-popup {
                width: 100%;
                height: 100%; 
                background: #f7f7f7;
                .region-close {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    z-index: 10;
                    img {
                        width: 25px;
                        height: 25px;
                    }
                }
                .region-inner {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    padding-top: 60px;
                    box-sizing: border-box;
                    .region-title {
                        display: flex;
                        align-items: center;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 50px;
                        line-height: 50px;
                        padding: 0 15px;
                        box-sizing: border-box;
                        background-color: #fff;
                        border-bottom: 1px solid #EDEDED;
                        .address-icon {
                            width: 10px;
                            height: 15px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-image: url(../../assets/images/icon_location@2x.png);
                        }
                        .txt {
                            font-size: 14px;
                            color: #333;
                            margin-left: 5px;
                        }
                    }
                    .city-wrapper {
                        width: 100%;
                        height: 100%;
                        background-color: #fff;
                        overflow: auto;
                        .cities {
                            .title, ul>li{
                                font-size: 14px;
                                color: #333;
                                height: 50px;
                                line-height: 50px;
                                border-top: 1px solid #EDEDED;
                                padding: 0 15px;
                                box-sizing: border-box;
                            }
                        }
                    }
                    .shortcut {
                        position: absolute;
                        z-index: 30;
                        right: 15px;
                        top: 70px;
                        text-align: center;
                        ul {
                            li {
                                font-size: 13px;
                                line-height: 18px;
                                color:#F32D16;
                            }
                        }
                    }
                }
            }
            .price-popup{
                width: 80%;
                height: 330px;
                background: transparent;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .close{
                    width: 21px;
                    height: 21px;
                    background-image: url(../../assets/images/btn_close_white@2x.png);
                    background-size: contain;
                    position: relative;
                    left: 100%;
                    margin-left: -21px;
                }
                .cell{
                    height: 280px;
                    background: #FFF;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .hd{
                        padding: 0 15px;
                        padding-top: 18px;
                        color: #333;
                        font-size: 14px;
                        .tips{
                            color: #FD726B;
                            font-size: 10px;
                        }                    
                    }
                    .bd{
                        padding: 0 15px;
                        .item{
                            height: 44px;
                            border-bottom: 1px solid #EDEDED;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            color: #333;
                            &:first-child{
                                font-size: 20px;
                                color: #000;
                                span{
                                    color: #666;
                                    padding-right: 10px;
                                }
                                input{
                                    border: 0;
                                }
                            }
                            .item-l{
                                display: flex;
                                align-items: center;
                                flex-shrink: 0;
                                .value{
                                    padding-left: 15px;
                                    display: flex;
                                    align-items: center;
                                    input{
                                        border: 0;
                                        &::-webkit-input-placeholder{
                                            color: #999;
                                        }
                                    }
                                }
                            }
                            }
                            .item-r{
                                flex-shrink: 0;
                                .choice{
                                display: flex;
                                align-items: center;
                                .icon{
                                    width: 18px;
                                    height: 18px;
                                    background: url(../../assets/images/icon_chose_normal@2x.png) no-repeat;
                                    background-size: contain;
                                    margin-right: 5px;
                                    &.active{
                                        background: url(../../assets/images/icon-xuanzhong@2x.png) no-repeat;
                                        background-size: contain;
                                    }
                                }
                            }                       
                        }                    
                    }
                    .ft{
                        height: 44px;
                        background: #F32D16;
                        color: #FFF;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
            .price-modal{
                background: rgba($color: #000000, $alpha: 0.5)
            }
        }
        .success{
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            .success-inner{
                display: flex;
                flex-direction: column;
                align-items: center;
                .info{
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    .pic{
                        width: 130px;
                        height: 91px;
                        background-image: url(../../assets/images/pic_succeed@2x.png);
                        background-size: contain;
                        margin-bottom: 10px;
                        background-repeat: no-repeat;
                    }
                }
                .look{
                    margin-top: 32px;
                    width: 120px;
                    height: 40px;
                    border: 1px solid #F32D16;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #F32D16;
                    font-size: 16px;
                }
            }
        }
    }
</style>
