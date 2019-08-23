<template>
    <div class="share-icon-component">
        <van-popup v-model="wxIsShow" class="wxShare-pop" @click-overlay="closeWxShare">
            <div class="pic">
                <img src="../assets/images/share_info.png" />
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: 'shareIcon',
        props: {

        },
        data(){
            return {

            }
        },
        methods: {
            closeWxShare() {
                this.$store.commit('SET_SHARE_ICON',false)
            }
        },
        computed: {
             wxIsShow: {
                get() {
                    return this.$store.state.share_icon
                },
                set (value) {
                    this.$store.commit('SET_SHARE_ICON', value)
                }
               
            }
        },
        created(){
            
        }
    }
</script>

<style lang="scss" type="text/scss">
    .wxShare-pop{
        top: 15%!important;
        transform: translate3d(-21%, -50%, 0)!important;
        background: transparent!important;
        color: #FF2A15;
        font-size: 14px;
    }
</style>
