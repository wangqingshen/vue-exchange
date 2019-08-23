<template>
    <div class="map-wrapper">
        <!-- 搜索 -->
        <div class="search">
           <div class="search-inner">
               <div class="box">
                   <div class="icon"></div>
                   <input v-model="value" placeholder="搜索商城商品" maxlength="45"/>
               </div>
               <div class="fun-btn" @click="search">
                   <div class="txt" :class="value ? 'active' : ''">搜索</div>
               </div>
           </div>
       </div>
       <!-- 高德地图 -->
       <div class="map">
           高德地图
       </div>
       <!-- 建议选择 -->
       <div class="choice">
           可供选择区域
       </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {

            }
        },
        methods: {

        },
        created(){
            
        }
    }
</script>

<style lang="scss" type="text/scss">
    .map-wrapper{
        .search{
            .search-inner{
                height: 46px;
                background: #F2F2F2;
                padding: 5px 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .box{
                    width: 87%;
                    height: 36px;
                    background: #FFF;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    color: #999;
                    font-size: 12px;
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
                .fun-btn{
                    font-size: 14px;
                    .txt{
                        &.active{
                            color: #F32D16;
                        }                 
                    }
                }
            }
       }
    }
</style>
