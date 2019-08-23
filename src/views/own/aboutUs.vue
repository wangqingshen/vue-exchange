<template>
    <div class="aboutUs-wrapper" v-title="pageTitle">
        {{content}}
    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageTitle: '关于商城',
                content: '',
            }
        },
        created(){
            this.$api.getArticle({
                cmd:{
                    member:'getArticle'
                },
                data:{
                    article_id:5,
                }
                }).then(res=>{
                    if(res.code===1){
                        this.content = res.data.article_text
                }
            })
        },
    }
</script>

<style lang="scss" type="text/scss">
    .aboutUs-wrapper{
        color: #353535;
        font-size: 13px;
    }
</style>
