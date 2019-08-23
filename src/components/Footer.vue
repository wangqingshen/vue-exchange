<template>
    <van-tabbar v-model="active" fixed id="footer">
        <van-tabbar-item v-for="(item, index) in list" :index="index" :to="item.url" :key="index">
            <span>{{item.name}}</span>
            <img
              slot="icon"
              slot-scope="props"
              :src="props.active ? item.activedIcon : item.icon"
            >
            <span class="notice-tip" v-if="index === 3 && notice_status"></span>
        </van-tabbar-item>
    </van-tabbar>
</template>
<script>
    export default{
        props: {
            pageIndex:{
                type:Number,
            }
        },
        data() {
            return {
                active: 0,
                member_id: '',
                notice_status: 0,
                list: [
                    {
                        name: '首页', 
                        icon: require('../assets/images/tab_btn_home_normal@2x.png'), 
                        activedIcon: require('../assets/images/tab_btn_home_selected@2x.png'), 
                        url: '/'
                    },
                    {
                        name: '分类', 
                        icon: require('../assets/images/tab_btn_fenlei_normal@2x.png'), 
                        activedIcon: require('../assets/images/tab_btn_fenlei_selected@2x.png'), 
                        url: '/category'
                    },
                    {
                        name: '发布', 
                        icon: require('../assets/images/btn_release@2x.png'), 
                        activedIcon:  require('../assets/images/btn_release@2x.png'), 
                        url: '/goods/publish/-1'
                    },
                    {
                        name: '消息', 
                        icon: require('../assets/images/tab_btn_massage_normal@2x.png'), 
                        activedIcon: require('../assets/images/tab_btn_massage_selected@2x.png'), 
                        url: '/message'
                    },
                    {
                        name: '我的', 
                        icon: require('../assets/images/tab_btn_me_normal@2x.png'), 
                        activedIcon: require('../assets/images/tab_btn_me_selected@2x.png'), 
                        url: '/own'
                    }
                ]
            }
        },
        methods: {
            getNoticeStatus() {
                this.$api.isreadnotice({
                cmd:{"im":"isreadnotice"},
                data:{
                   member_id: this.member_id
                }
                }).then(res=>{
                   if(res.code == 1) {
                        this.$store.commit('SET_NOTICE_STATUS',res.data.is_unread)
                        this.notice_status = res.data.is_unread
                   }
                    
                })
            }
        },
        created() {
            this.member_id = JSON.parse(localStorage.getItem('userInfo')).member_id
            this.active = this.$parent.pageIndex
            this.notice_status = this.$store.state.notice_status
            this.getNoticeStatus()
        }        
    }
</script>
<style lang="scss" type="text/scss">
    #footer {
        .van-tabbar-item {
            .van-tabbar-item__icon{
                img {
                    width: 21px;
                    height: 21px;
                }
            }
            .van-tabbar-item__text {
                span {
                    font-size: 12px;
                }
            }
            &.van-tabbar-item--active {
                .van-tabbar-item__text {
                    span {
                        color: #F32D16;
                    }
                }
            }
            &:nth-child(3) {
                position: relative;
                .van-tabbar-item__icon {
                    position: absolute;
                    bottom: 8px;
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    border: 2px soild #fff;
                    box-sizing: border-box;
                    img {
                        border-radius: 50%;
                        width: 100%;
                        height: 100%;
                        background: #fff;
                    }
                }
                .van-tabbar-item__text { 
                    position: absolute;
                    bottom: 5px;
                }
            }
            &:nth-child(4) {
                position: relative;
                .notice-tip {
                    position: absolute;
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    top: 3px;
                    right: 22px;
                    border-radius: 50%;
                    background: #F32D16;
                }
            }
        }
        &:after {
            border-width: 0;
        }
    }
</style>