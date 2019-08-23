<template>
    <transition name="fade" v-if="isloading">
        <div class="loading">
            <van-loading color="black"/>
        </div>
    </transition>
</template>
<script>
    export default{
        name:'myLoading',
        props:['isloading'],
        data(){
            return{

            }
        }
    }
</script>
<style lang="scss" type="text/scss">
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .loading{
        position: fixed;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 101;
    .van-loading{
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%,-50%) ;
    }
    }
</style>
