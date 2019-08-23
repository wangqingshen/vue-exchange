<template>
    <div class="wrapper" v-title="pageTitle" id="chat-wrap">
        <div class="chatList-inner" ref="scrollWrap">
            <van-pull-refresh v-model="loading" @refresh="loadMore" class="chatList" v-if="!noData" pulling-text="下拉加载更多消息" loosing-text="释放加载更多消息" loading-text="消息加载中">
                <div class="chatList">
                    <div class="chat-item" v-for="(item,index) in chatListData" :key='index'>
                        <div class="time-line">{{item.chat_msg_create_time|unixdate}}</div>
                        <div class="chat-send" v-if="!item.is_self">
                            <img :src="item.member_avatar">
                            <div class="content">
                                {{item.chat_msg_content}}
                            </div>
                        </div>
                        <div class="chat-get" v-else>
                            <div class="content">
                                {{item.chat_msg_content}}
                            </div>
                           <img :src="item.member_avatar">
                        </div>
                    </div>
                </div>
            </van-pull-refresh>
        </div>
        <div class="chat-bottom">
            <div class="inner">
                <input type="text" v-model:trim="sendMsg" placeholder="输入聊天内容" maxlength="300" @focus="showInput"/>
            </div>
            <div class="send-btn" @click="sendMsgEvt">
                <img src="../../assets/images/icon_send@2x.png"/>
                <span>发送</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'chat',
        data(){
            return{
                pageTitle:'微信昵称',
                loading: false,
                member_id:'',
                chatListData:[],
                page:1,
                noData:false,
                sendMsg: '',
                to_user_id: ''
            }
        },
        components:{},
        computed:{},
        watch:{
        },
        methods:{
            loadMore() {
                this.page++
                setTimeout(()=>{
                    this.getChatList({page: this.page})
                },500)
            },
            sendMsgEvt(){
                if(!this.sendMsg && this.sendMsg == ''){
                    this.$toast({message:'内容不能为空', duration: 1000})
                    return
                }
                this.$api.sendChat({
                    cmd:{
                        im:'chat'
                    },
                    data:{
                        from_user_id:this.member_id,
                        to_user_id: this.to_user_id,
                        msg_content: this.sendMsg
                    },
                }).then(res=>{
                    if(res.code == 1) {
                        this.sendMsg=''
                        this.page=1
                        this.getChatList()
                    }
                }).catch(err=>{

                })
            },
            // 获取聊天列表
            getChatList({page = 1,page_size = 10} = {}){
                this.$api.getChatMsg({
                    cmd:{
                        im:'chatmsglists'
                    },
                    data:{
                        member_id:this.member_id,
                        to_user_id: this.to_user_id,
                        page:page,
                        page_size:page_size
                    },
                }).then(res=>{
                    if(res.code===1){
                        if(this.page == 1) {
                            this.chatListData = res.data.list.reverse()
                            setTimeout(res=>{
                                this.$refs.scrollWrap.scrollTop =  this.$refs.scrollWrap.scrollHeight
                            },10)
                        }else{
                            this.chatListData = [...this.chatListData.reverse(),...res.data.list].reverse() 
                        }
                        this.loading = false
                        this.noData = false
                        this.pageTitle=res.data.to_user_nickname||''
                        if(this.chatListData.length === 0){
                            this.noData = true
                        }
                
                    }
                }).catch(err=>{

                })
            },
            showInput(){
                setTimeout(res=>{
                    document.body.scrollTop = document.body.scrollHeight
                    document.getElementById('chat-wrap').scrollTop = document.getElementById('chat-wrap').scrollHeight
                }, 30)  
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            this.to_user_id = this.$route.params.to_user_id
            this.getChatList()
           
             
        },
        mounted(){
        }

    }
</script>
<style lang="scss" type="text/scss">
    #chat-wrap {
        position: relative;
    }
    .chatList-inner{
        width: 100%;
        height: 100vh;
        overflow: auto;
        background: #FFFDF8;
        .chatList {
            padding-bottom: 50px;
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 15px;
            // overflow: hidden;
            .time-line{
                text-align: center;
                color: #999;
                padding-bottom: 15px;
            }
            .chat-send, .chat-get{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius:50%;
                }
                .content {
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    max-width: 260px;
                    min-height: 40px;
                    padding: 10px;
                    box-sizing: border-box;
                    text-align: left;
                    font-size:14px;
                    color: #333;
                    border-radius:4px;
                    box-shadow: 0 2px 4px rgba(111,93,54,0.15);
                }

            }
            .chat-send {
                justify-content: flex-start;
                img {
                    margin-right: 10px;
                }
                .content{
                    background: #fff;
                    &:before {
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-right: 6px solid #fff;
                        content: "";
                        position: absolute;    
                        width: 0;
                        left: -5px;
                        top: 50%;
                        margin-top: -5px;
                    }
                }
            }
            .chat-get{
                justify-content: flex-end;
                img{
                    margin-left: 10px;
                }
                .content{
                    background: #FFE8B5;
                    &:after{
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        border-left: 6px solid #FFE8B5;
                        content: "";
                        position: absolute;    
                        width: 0;
                        right: -5px;
                        top: 50%;
                        margin-top: -5px;
                    }
                }
            }
        }
    }
    .chat-bottom {
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50px;
        background: #fff;
        align-items: center;
        border-top:1px solid #ededed;
        z-index: 99;
        .inner{
            width: calc(100% - 100px);
            height: 100%;
            input {
                width: 100%;
                height: 100%;
                font-size: 14px;
                padding: 0 10px;
                border: 0;
            }
        }
        .send-btn{
            width: 100px;
            display: flex;
            align-items: center;
            background: #F32D16;
            font-size: 16px;
            color: #fff;
            height: 100%;
            justify-content: center;
            img {
                width: 18px;
                height: 18px;
                margin-right: 5px;
            }
        }
    }
</style>
