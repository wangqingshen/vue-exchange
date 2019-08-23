<template>
    <div class="noMore" v-if="finished">
        <div class="line"></div>
        <div class="txt">我是有底线的</div>
        <div class="line"></div>   
    </div>
</template>

<script>
    export default {
        name: 'noMore',
        props: ['finished'],
        data(){return {}},
        methods: {},
        created(){}
    }
</script>

<style lang="scss" type="text/scss">
    .noMore{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-top: .1rem;
        padding-bottom:.1rem;
        text-align: center;
        color: #999;
        .line{
            width: 15%;
            height: 1px;
            background: #e2e2e2;
        }
        .txt{
            padding: 0 5px;
        }
    }
</style>
