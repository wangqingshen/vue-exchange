<template>
    <div class="category-wrapper" v-title="pageTitle">
        <!-- 搜索 -->
        <div class="search">
            <div class="search-inner" @click="PageSearch">
                <div class="box">
                    <div class="icon"></div>
                    <div class="content"></div>
                </div>
            </div>
        </div>
        <!-- 商品分类 -->
        <div class="category">
            <!-- 左侧一级分类 -->
            <div class="category-inner">
                <div class="categoryLevel1" v-for="(item, index) in categoryLevel1" :key="index">
                    <div class="category-item" :class="categoryIndex == index ? 'active' : ''"  @click="changeCategoryFun(index)">
                        <span>{{item.gc_name | filterGoodsName}}</span>
                    </div>
                </div>
            </div>
            <!-- 右侧分类 -->
            <div class="category-detail">
                <div class="category-detail-item"  v-for="item in categoryLevel2" :key="item.gc_id" v-if="item">
                    <!-- 右侧二级分类 -->
                    <div class="detail_title">
                        <div class="text">{{item.gc_name}}</div>
                        <div class="look_all" @click="goNavigateToPage(item, 'level2')">
                            <span>查看所有</span>
                            <van-icon name="arrow" />
                        </div>
                    </div>
                    <!-- 右侧三级分类 -->
                    <div class="detail_list">
                        <div class="children_item" v-for="children_item in item.next_level" :key="children_item.gc_id" >
                            <div class="children" @click="goNavigateToPage(children_item, 'level3')">
                                <div class="child_pic lazy-img">
                                    <img v-lazy="children_item.gc_img" />
                                </div>
                                <div class="child_txt">{{children_item.gc_name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部横栏-->
        <Footer :pageIndex="pageIndex"/>
    </div>
</template>

<script>
    import Footer from '@/components/Footer.vue'
    export default {
        name: 'category',
        data(){
            return {
                pageTitle: '商品分类',
                pageIndex: 1,
                categoryIndex:'0',
                categoryLevel1:[],
                categoryLevel2:[],
            }
        },
        components: {
            Footer,
        },
        methods: {
            PageSearch(){
                this.$router.push({name: 'search'})
            },
            // 底部跳转
            goPage(url){
                this.select = url
                this.$router.replace({name:url})
            },
            // 点击获取索引
            changeCategoryFun(index){
                this.categoryIndex = index;
                this.$store.commit('SET_CLASSIFY_TYPE',index);
                setTimeout(()=>{
                  this.categoryLevel2  =  this.categoryLevel1[index].next_level;
                },200)
            },
            // 跳转连接
            goNavigateToPage(item, level){
                let params = {}
                localStorage.removeItem('gc_id_1')
                localStorage.removeItem('gc_id_2')
                localStorage.removeItem('gc_id_3')
                if(level == 'level2'){
                    localStorage.setItem('gc_id_2', item.gc_id)
                    params = {gc_id_2:item.gc_id}
                }else if(level == 'level3'){
                    localStorage.setItem('gc_id_3', item.gc_id)
                    params = {gc_id_3:item.gc_id}
                }
                localStorage.setItem('search_gc_name', item.gc_name)
                this.$store.dispatch('setSearchHistory',item.gc_name)
                this.$router.push({name: 'goodList',params:params})
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
                    console.log(res)
                    if(res.code === 1){
                        this.categoryIndex = this.$store.state.classify_type || 0
                        this.categoryLevel1 = res.data;
                        this.categoryLevel2 = this.categoryLevel1[this.categoryIndex].next_level
                    }
                }).catch(err=>{

                })
            },
            
            shareEvt() {
                let shareData = {}
                shareData.linkName = `category`
                shareData.desc = `掐指一算，这里有很多商品值得购买，进来看一看`
                shareData.title = '我在拥军换换上发现许多好东西，赶紧来看看'
                shareData.imgUrl = 'http://wuxing.mszjsm.cn/pic/wuxingadmin/20180905/f5fd725805a79e3711e4e3644eed3f3b.jpg'
                this.$share.api(shareData)
            },
        },
        created() {
            this.shareEvt()
            this.getCatetoryInfo()
        },
    }
</script>

<style lang="scss" style="text/scss">
    .category-wrapper{
        .search{
            height: 46px;
            background: #F2F2F2;
            padding: 5px 15px;
            .search-inner{
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
                    .icon{
                        margin: 0 7px 0 10px;
                        width: 15px;
                        height: 15px;
                        background-image: url('../../assets/images/icon_search_hui@2x.png');
                        background-size: contain;
                    }
                }
            }
        }
        .category{
            color: #353535;
            display: flex;
            height: calc(100vh - 46px);
            padding-bottom: 50px;
            .category-inner{
                font-size: 14px;
                line-height: 45px;
                display: flex;
                flex: 0 0 90px;
                height: 100%;
                background: #F4F4F4;
                text-align: center;
                line-height: 45px;
                display: flex;
                flex-direction: column;
                overflow: auto;
                -webkit-overflow-scrolling:touch;
                .category-item{
                    background: #F4F4F4;
                    overflow: auto;
                    // text-overflow: ellipsis;
                    white-space: nowrap;
                    &.active{
                        background: #fff;
                        color:#F22A15;
                        border-left: 1px solid #F22A15;
                    }
                    span{
                        overflow: hidden;
                    }
                }
            }
            .category-detail{
                display: flex;
                flex:1;
                flex-direction: column;
                overflow: auto;
                padding-bottom: 35px;
                -webkit-overflow-scrolling:touch;
                .category-detail-item{
                    width: 100%;
                    border-bottom:1px solid #dedede;
                    padding-right: 15px;
                    padding-bottom: 20px;
                    .detail_title{
                        display: flex;
                        justify-content: space-between;
                        padding: 18px 13px 0 15px;
                        box-sizing: border-box;
                        .text{
                            font-size: 13px;
                            line-height: 18px;
                            font-weight: 600;
                            align-items: center;
                            width: 100px;
                            flex-grow: 1;
                        }
                        .look_all{
                            font-size: 12px;
                            color: #888;
                            display: flex;
                            align-items: center;
                            flex-shrink: 0;
                            span{
                                line-height: 16px;
                                margin-right: 4px;
                            }
                        }
                    }
                    .detail_list{
                        display: flex;
                        flex-wrap: wrap;
                        margin-left: 15px;
                        .children_item{
                            display:flex;
                            flex-wrap: wrap;
                            width: 33.3%;
                            margin-top: 15px;
                            .children{
                                display: flex;
                                flex-direction: column;
                                flex-wrap:wrap;
                                align-items: center;
                                width: 100%;
                                flex: 1;
                                &:nth-child(3n){
                                    margin-right: 0;
                                }
                                .child_pic{
                                    border-radius: 5px;
                                    width: 65px;
                                    height: 65px;
                                    overflow: hidden;
                                    margin-bottom: 14px;
                                }
                                .child_txt{
                                    font-size: 12px;
                                    line-height: 16px;
                                    text-align: center;
                                    width: 65px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                }
            }

        }
    }
</style>
