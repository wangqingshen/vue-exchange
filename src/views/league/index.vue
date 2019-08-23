<template>
    <div class="league-wrapper" v-title="pageTitle">
        <div class="bg">
            <img :src="bg_pic" />
        </div>
        <div class="bd">
            <div class="stete-item" @click="PageFillIn" v-if="this.league_state == -1">
                <div class="txt">申请加盟</div>
            </div>
            <div class="stete-item item0" v-else-if="this.league_state == 0">
                <div class="txt">合作加盟申请已提交，后台正在审核</div>
            </div>
            <div class="stete-item item2" v-else-if="this.league_state == 2">
                <div class="txt"><p>审核不通过</p><p>原因：{{this.league_err}}</p></div>
                <div class="btn" @click="reApply">重新申请</div>
            </div>
        </div>
    </div>
</template>
<script>

    export default{
        name:'league',
        data(){
            return{
                pageTitle:'合作加盟',
                bg_pic:'',
                league_state: '',
                league_err: '',
                store_id: '',
            }
        },
        methods:{
            PageFillIn(){
                this.$router.replace({name: 'fillIn', params: {store_id: this.store_id}})
            },
            reApply(){
                this.league_state = -1
            },
            getArticle(){
                this.$api.getArticle({//协议文章
                cmd:{
                    member:'getArticle'
                },
                data:{
                    article_id:1,
                }
                }).then(res=>{
                    if(res.code===1){
                        this.bg_pic = res.data.article_pic
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        created(){
            this.league_state = this.$route.params.league_state
            this.league_err = this.$route.params.league_err
            this.store_id = this.$route.params.store_id || 0
            this.getArticle()
        },
    }
</script>
<style lang="scss" type="text/scss">
   .league-wrapper{
       .bg{
           img{
                height: 100vh;
           }
       }
       .bd{
            position: absolute;
            bottom: 30px;
            width: 100%;
            display: flex;
            justify-content: center;          
           .stete-item{              
               width: 35%;
               min-height: 50px;
               background: #F22A15;
               color: #fff;
               display: flex;
               align-items: center;
               justify-content: center;
               border-radius: 5px;
           }
           .item0{
               min-height: 70px;
               width: 80%;
               color: #888;
               border-radius: 0;
               background: #fff;
               font-size: 15px;
           }
           .item2{
               padding: 5px 0;
               display: flex;
               flex-direction: column;
               width: 80%;
               color: #888;
               border-radius: 0;
               background: #fff;
               font-size: 15px;
               .txt{
                   padding: 0 10px;
                    p{
                        text-align: center;
                        word-break: break-word;
                    }
               }
               .btn{
                   width: 75px;
                   height: 20px;
                   background: #F22A15;
                   color: #fff;
                   font-size: 13px;
                   text-align: center;
                   border-radius: 5px;
               }
           }
       }
   }
</style>
