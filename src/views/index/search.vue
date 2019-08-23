<template>
    <div class="search-wrapper" v-title="pageTitle">
        <!-- 搜索 -->
        <div class="search">
           <div class="search-inner">
               <div class="box">
                   <div class="icon search-icon"></div>
                   <input v-model="value" placeholder="搜索商城商品" maxlength="45"/>
                   <div class="icon del-icon" v-show="value" @click="value = ''"></div>
               </div>
               <div class="fun-btn" @click="search">
                   <div class="txt" :class="value ? 'active' : ''">搜索</div>
               </div>
           </div>
       </div>
       <!-- 历史记录 -->
       <div class="history">
           <div class="title-bar">
               <div class="title">
                   <div class="txt">历史搜索</div>
               </div>
               <div class="fun-btn" @click="clear">
                   <van-icon name="delete" class="icon"/>
               </div>
           </div>
           <div class="info">
               <div class="info-item" v-for="(item, index) in historyArr" @click="searchHistory(index)" :key="index">{{item.historyItem | filterItem}}</div>
           </div>
       </div>
    </div>
</template>

<script>
    export default{
        name: 'search',
        data(){
            return{
                pageTitle: '搜索',
                value: '',
                historyArr: [],
            }
        },
        methods:{
            search(){
                // 空返回
                if(!this.value){
                    return false
                }
                // 每次存入的新值
                let searchVal = { historyItem: this.value };
                // 判断本存储是否有数据 取出来渲染
                if (localStorage.getItem('history')) {
                    this.historyArr = JSON.parse(localStorage.getItem('history'));
                }
                // 新值放入数组
                this.historyArr.unshift(searchVal);
                // 数组对象去重
                function uniqueArr(arr, key) {
                    let obj = {};
                    let newArr = [];

                    for (let i = 0; i < arr.length; i++) {
                        if (!obj[arr[i][key]]) {
                            newArr.push(arr[i]);
                            obj[arr[i][key]] = true;
                        }
                    }
                    return newArr;
                }
                //  去重后对象重新赋值
                this.historyArr = uniqueArr(this.historyArr, 'historyItem');
                // 长度超过10个 自动弹出
                if (this.historyArr.length > 10) this.historyArr.pop();
                // 去重后数组存储到本地
                localStorage.setItem('history', JSON.stringify(this.historyArr));
                this.$store.dispatch('setSearchHistory',this.value)
                localStorage.setItem('search_gc_name', this.value)
                localStorage.removeItem('gc_id_1')
                localStorage.removeItem('gc_id_2')
                localStorage.removeItem('gc_id_3')
                this.$router.replace({name: 'goodList', params: {searchTxt: this.value}})
            },
            clear(){
                localStorage.removeItem('history')
                this.value = '',
                this.historyArr = []
            },
            searchHistory(index){
                this.value = this.historyArr[index].historyItem
                this.$store.dispatch('setSearchHistory',this.value)
                localStorage.setItem('search_gc_name', this.value)
                //清空首页搜索记录
                localStorage.removeItem('gc_id_1')
                //清空分类页
                localStorage.removeItem('gc_id_2')
                localStorage.removeItem('gc_id_3')
                this.$router.push({name: 'goodList',params:{searchTxt:this.value}})            
            }
        },
        created() {
            if(localStorage.getItem('history')){
                this.historyArr = JSON.parse(localStorage.getItem('history'))
            }
        },
        filters: {
            filterItem(value){
                return value.length>10 ? value.slice(0, 9)+'...' : value 
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    .search-wrapper{
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
                    justify-content: space-between;
                    align-items: center;
                    color: #999;
                    font-size: 12px;
                    .icon{
                        margin: 0 7px 0 10px;
                        width: 15px;
                        height: 15px;
                        &.search-icon{
                            background: url(../../assets/images/icon_search_hui@2x.png) no-repeat;
                            background-size: contain;
                        }
                        &.del-icon{
                            background: url(../../assets/images/icon_details_del.png) no-repeat; 
                            background-size: contain;
                            margin: 0;
                            margin-right: 5px;
                        }
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
       .history{
           padding: 20px 15px;
           color: #333;
           .title-bar{
               display: flex;
               justify-content: space-between;
               font-size: 15px;
           }
           .info{
               display: flex;
               flex-wrap: wrap;
               .info-item{
                    padding: 5px 10px;
                    margin-top: 10px;
                    background: #F2F2F2;
                    border-radius: 18px;
                    margin-right: 10px;
               }
           }
       }
    }
</style>
