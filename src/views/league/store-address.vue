<template>
    <div class="map-wrapper" v-title="pageTitle">
        <!-- 搜索 -->
        <div class="search">
           <div class="search-inner">
               <div class="box">
                   <div class="icon"></div>
                   <input v-model="value" placeholder="搜索地点" maxlength="45" id="tipinput"/>
               </div>
           </div>
       </div>
       <!-- 高德地图 -->
       <div class="map" id="map-container">

       </div>
       <!-- 建议选择 -->
       <div class="nearby">
        <div class="nearby-inner" v-if="nearbyList.length">
           <div class="nearby-item" v-for="(item, index) in nearbyList" :key="index" @click="choice(item)">
               <div class="title">{{item.name}}</div>
               <div class="desc">{{item.address || '暂无详细地址'}}</div>
           </div>
           <div class="moreData" @click="getMore" v-if="nearbyList.length<total">点击加载更多</div>
        </div>
        <div class="no-data" v-else>
            暂无周边列表
        </div>
       </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageTitle: '店铺地址',
                value: '',
                nearbyList: [],
                autocomplete: {},
                placeSearch: {},
                searchName: '',
                page: 1,
                pagesize: 15,
                total: 0,
                map: {},
                leagueData: ''
            }
        },
        methods: {
            choice(item){
                let status = this.$store.state.leagueData
                status.name = item.address
                status.adcode = item.adcode
                status.lng = item.location.lng
                status.lat = item.location.lat
                this.$store.dispatch('setLeagueData',status)
                this.$router.replace({name: 'submit', params: {league_data: this.leagueData}})
            },
            initGeo(){
              let _this = this
              this.map = new AMap.Map('map-container', {
                resizeEnable: true
              })
              AMap.plugin(['AMap.Geolocation','AMap.Autocomplete','AMap.PlaceSearch'], function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：5s
                    buttonPosition:'RB',    //定位按钮的停靠位置
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
                })
                _this.map.addControl(geolocation)
                geolocation.getCurrentPosition(function(status,res){
                    let curCity = ''
                    if(status=='complete'){
                        _this.searchName = res.formattedAddress
                        curCity = res.addressComponent.city
                    }else{
                        _this.searchName = '北京天安门'
                        curCity = '北京'
                    }
                    var autoOptions = {
                      city: curCity,
                      input: "tipinput"
                    }
                    _this.autocomplete= new AMap.Autocomplete(autoOptions)
                    _this.page = 1
                    _this.geoSeach()
                    AMap.event.addListener(_this.autocomplete, 'select', function(e){
                      _this.searchName = e.poi.name
                      _this.page = 1
                      _this.geoSeach()
                    })
                })
              })
            },

            geoSeach(){
              let _this = this
              this.placeSearch = new AMap.PlaceSearch({map:this.map, pageIndex: this.page, pageSize: this.pagesize})
              this.placeSearch.search(this.searchName, function(status, res){
                if(status == 'complete') {
                  _this.total = res.poiList.count

                  if(_this.page == 1) {
                     _this.nearbyList = res.poiList.pois
                  }else{
                     _this.nearbyList = [..._this.nearbyList,...res.poiList.pois]
                  }  
                }
              })
            },

            getMore(){
                this.page++
                this.geoSeach()
            }
        },
        created(){
    
        },
        mounted() {
          this.leagueData = this.$route.params.league_data
          this.initGeo()
        },
    }
</script>

<style lang="scss" type="text/scss">
    .map-wrapper{
        height: 100vh;
        background: #FFF;
        .search{
            .search-inner{
                height: 46px;
                background: #F2F2F2;
                padding: 5px 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .box{
                    width: 100%;
                    height: 36px;
                    background: #FFF;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    color: #999;
                    font-size: 12px;
                    &.active{
                        width: 87%;
                    }
                    .icon{
                        margin: 0 7px 0 10px;
                        width: 15px;
                        height: 15px;
                        background-image: url('../../assets/images/icon_search_hui@2x.png');
                        background-size: contain;
                    }
                    input{
                        border: none;
                        width: 84%;
                        &::-webkit-input-placeholder{
                            color: #999;
                        }
                    }
                }
            }
       }
       .map{
           height: 240px;
       }
       .nearby{
           padding: 0 15px;
           background: #FFF;
           height: calc(100% - 286px);
            overflow: auto;
           .nearby-inner{
              .nearby-item{
                 border-bottom: 1px solid #EDEDED;
                 padding: 10px 0;
                 width: 100%;
                 height: 60px;
                 display: flex;
                 flex-direction: column;
                 justify-content: space-between;
                 font-size: 14px;
                 color: #333;
                 .desc{
                     font-size: 12px;
                     color: #999;
                 }
             }
             .moreData {
                font-size: 13px;
                color: #555;
                text-align: center;
                padding: .1rem;
             }
           }
           
          .no-data {
            padding: 20px;
            font-size: 14px;
            text-align: center;
            color: #333;
          }
       }
    }
</style>
