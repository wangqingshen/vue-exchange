<template>
    <div id="app" v-show="isShow">
        <router-view/>
    </div>
</template>
<script>
    export default{
        name:'app',
        data() {
            return {
                isShow: false
            }
        },
        created() {
            let state = window.localStorage.getItem('isShow');
            let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {}
            if((state !== 'undefined' && state !== null) || (Object.keys(userInfo).length !== 0 && (userInfo.member_id !== 'undefined' || userInfo.member_id !== null)) ) this.isShow = true
            // console.log = function() {}
        }
    }
</script>
<style lang="scss" type="text/scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        text-align:left;
    }

    #nav {
        padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

    &
    .router-link-exact-active {
        color: #42b983;
    }

    }
    }
</style>
