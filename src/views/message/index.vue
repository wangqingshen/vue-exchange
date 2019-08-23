<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="messageList-inner">
            <div class="message-bar">
                <div class="bar-inner">
                    <div class="items">
                        <div class="item" v-for="(item, index) in msgType" :key="index" :class="{'active':stepIndex === index }" @click="changemessageList({msg_state: item.state})">
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="line" :class="stepClass"></div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="messageList" :offset="offset" v-if="!noData">
                <div class="messageList-item" v-for="(item,index) in messageListData" :key='index' @click="goMessageDetail(item)">
                    <div class="message-item-inner">
                        <div class="pic">
                            <img :src="!stepIndex?item.member_avatar:item.goods_img" :class="stepIndex?'':'img'">
                        </div>
                        <div class="info">
                            <div class="title" :class="stepIndex?(item.comment_type==1&&item.comment_state==1?'icon-msg icon-dots':''):(item.unread==1?'icon-dots':'')">{{stepIndex?(item.comment_type=='1'?'您收到一条留言':'您发出一条留言'):item.another_member_nickname}}<span v-if="stepIndex == 1">{{cur_time|formatMsgDate(item.create_time)}}</span></div>
                            <div class="desc">{{stepIndex?(item.comment_type==1?item.send_nick_name+'：'+item.content:item.content):item.chat_msg_content}}</div>
                            <div class="date" v-if="stepIndex == 0">{{item.last_chat_time|YYMMDD}}</div>
                        </div>
                    </div>
                </div>
                <noMore :finished="finished"></noMore>
            </van-list>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="">消息空空，列表空空</div>
            </div>
        </div>
        <Footer :pageIndex="pageIndex"/>
    </div>
</template>
<script>
    import noMore from '@/components/no-more'
    import Footer from '@/components/Footer.vue'
    export default{
        name:'message',
        data(){
            return{
                pageTitle:'消息',
                pageIndex: 3,
                msgType: [
                    {name: '聊天消息', state: 0},
                    {name: '留言消息', state: 1},
                ],
                loading: false,
                finished: false,
                stepIndex:0,
                offset:50,
                member_id:'',
                messageListData:[],
                page:1,
                isMore:false,
                noData:false,
                cur_time:''
            }
        },
        components:{
            noMore,
            Footer
        },
        computed:{
            stepClass(){
                if(this.stepIndex === 0){
                    return false
                }else {
                    return `line-step${this.stepIndex}`
                }
            }
        },
        watch:{

        },
        methods:{
            goMessageDetail(item){
                if(this.stepIndex) {
                    this.$router.push({name: 'goodsDetails',params: {spu_id: item.goods_spu_id}})
                }else{
                    this.$router.push({name: 'chat',params: {to_user_id: item.another_member_id}})
                }
            },

            loadMore() {
                if(!this.finished && this.isMore){
                    if(this.messageListData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getList()
                        },500)
                    }

                }

            },
            changemessageList({msg_state = 0} = {}){
                if(msg_state == this.stepIndex) return
                this.stepIndex = msg_state
                this.messageListData = []
                this.page = 1
                this.isMore = false
                this.finished = false
                this.getList()
                let status = this.$store.state.tabCard_status
                status.messageList = msg_state
                this.$store.dispatch('setTabCardStatus',status)
            },
            // 获取留言列表
            getMsgList({page = 1,page_size = 10} = {}) {
                this.$api.getCommentLists({
                    cmd:{
                        im:'getCommentLists'
                    },
                    data:{
                        member_id:this.member_id,
                        page:page,
                        page_size:page_size
                    },
                }).then(res=>{
                    if(res.code===1){
                        console.log(res, 456);
                        if(this.page == 1) {
                            this.messageListData = res.data.data
                        }else{
                            this.messageListData = [...this.messageListData,...res.data.data]  
                        }
                        this.cur_time = res.data.current_time
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.data.length < 10){
                            this.finished = true
                        }
                        if(this.messageListData.length === 0){
                            this.noData = true
                        }
                    }
                }).catch(err=>{

                })
            },
            // 获取聊天列表
            getChatList({page = 1,page_size = 10} = {}){
                this.$api.getChatList({
                    cmd:{
                        im:'chatlists'
                    },
                    data:{
                        member_id:this.member_id,
                        page:page,
                        page_size:page_size
                    },
                }).then(res=>{
                    if(res.code===1){
                        console.log(res);
                        if(this.page == 1) {
                            this.messageListData = res.data.list
                        }else{
                            this.messageListData = [...this.messageListData,...res.data.list]  
                        }
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.list.length < 10){
                            this.finished = true
                        }
                        if(this.messageListData.length === 0){
                            this.noData = true
                        }
                    }
                }).catch(err=>{

                })
            },
            getList(){
                this.stepIndex?this.getMsgList({page:this.page}):this.getChatList({page:this.page})
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            if(this.$store.state.tabCard_status.messageList) {
                this.stepIndex = this.$store.state.tabCard_status.messageList
            }
            this.getList()
        },
        mounted(){
        }

    }
</script>
<style lang="scss" type="text/scss">
    .messageList-inner{
        padding-top: 50px;
        .shop-icon{
            background: url(../../assets/images/shop_icon.png) no-repeat;
            background-size: contain;
            width: 18px;
            height: 16px;
            margin-right: 5px;
        }
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_massage@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
        }
        .message-bar{
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            font-size: 14px;
            color: #353535;
            background: #fff;
            z-index: 99;
            .bar-inner{
                position: relative;
            }
            .items{
                display: flex;
                align-items: center;
                .item{
                    width: 20%;
                    flex-grow: 1;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .txt{
                        margin-top: -4px;
                    }
                    &.active{
                        color: #f22a15;
                    }
                }

            }
            .line{
                position: absolute;
                left: 0;
                height: 4px;
                width: 50%;
                background: #f22a15;
                bottom: 0;
                transition: transform 0.2s ease-in;
                transform: translateX(0);
                &.line-step1{
                    transform: translateX(100%);
                }
                
            }
        }
        .messageList{
            padding-bottom: 80px;
            .messageList-item{
                border-top:1px solid #ededed;
                background: #fff;
                .message-item-inner {
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    padding: 15px;
                    .pic {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: 50px;
                            height: 50px;
                            &.img{
                                border-radius:50%;
                            }
                        } 
                    }
                    .info {
                        width: calc(100% - 50px);
                        padding-left: 8px;
                        .title {
                            position: relative;
                            display: flex;
                            justify-content: space-between;
                            font-size: 14px;
                            color: #333;
                            line-height: 20px;
                            span {
                                display: inline-block;
                                font-size: 12px;
                                color: #999;
                                transform: scale(0.9);
                            }
                            &.icon-dots:after {
                                bottom: 0;
                                right: 0;
                                width: 12px;
                                height: 12px;
                                content: ' ';
                                position: absolute;
                                border-radius: 100%;
                                background-color: #F32D16;
                            }
                            &.icon-msg:after{
                                top: 4px;
                            }
                            &.icon-msg span {
                                margin-right: 15px;
                            }
                        }
                        .desc{
                            font-size: 13px;
                            color: #666;
                            width: 100%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            line-height: 17px;
                            margin: 5px 0;
                        }
                        .date{
                            font-size: 12px;
                            color: #999;
                            line-height: 14px;
                        }
                    }
                }
            }
        }
    }
</style>
