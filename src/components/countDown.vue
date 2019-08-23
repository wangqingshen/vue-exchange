<template>
    <div class="countDown-component">
        <div class="countDown-temp" v-if="temp === '1'">
            <div class="" v-if="isCountDown">
                <div class="countDown-box">
                    <div class="">若未在</div>
                    <div class="countDown-inner" >
                        <!-- <div class="box d">{{timeObj.day}}</div>
                        <div class="box">天</div> -->
                        <!-- <div class="box h">{{timeObj.hr}}</div>
                        <div class="box">时</div> -->
                        <div class="box m">{{timeObj.min}}</div>
                        <div class="box">分</div>
                        <div class="box s">{{timeObj.sec}}</div>
                        <div class="box">秒</div>
                        <!--<div class="box">{{timeObj.micro_sec}}</div>-->
                    </div>
                    <div class="">内付款</div>
                </div>
                <div class="txt">超时订单将自动关闭</div>
            </div>

            <div class="" v-if="!isCountDown">已结束</div>
        </div>
        <div class="countDown-temp" v-if="temp === '4'">
            <div class="" v-if="isCountDown">
                <div class="countDown-box">
                    <div class="">还剩</div>
                    <div class="countDown-inner" >
                        <div class="box d">{{timeObj.day}}</div>
                        <div class="box">天</div>
                        <div class="box h">{{timeObj.hr}}</div>
                        <div class="box">时</div>
                        <div class="box m">{{timeObj.min}}</div>
                        <div class="box">分</div>
                        <div class="box s">{{timeObj.sec}}</div>
                        <div class="box">秒</div>
                        <!--<div class="box">{{timeObj.micro_sec}}</div>-->
                    </div>
                    <div class="">自动确认收货</div>
                </div>
            </div>
            <div class="" v-if="!isCountDown">已结束</div>
        </div>
        <div class="countDown-temp" :class="{'temp2':temp ==='2' }" v-if="temp ==='2'">
            <div class="" v-if="isCountDown">
                <div class="countDown-box">
                    <div class="txt">剩余</div>
                    <div class="countDown-inner" >
                        <div class="box d" v-if="timeObj.day !== '00'">{{timeObj.day}}</div>
                        <div class="box" v-if="timeObj.day !== '00'">天</div>
                        <div class="box h">{{timeObj.hr}}</div>
                        <div class="box box2">:</div>
                        <div class="box m">{{timeObj.min}}</div>
                        <div class="box box2">:</div>
                        <div class="box s">{{timeObj.sec}}</div>
                        <!--<div class="box">秒</div>-->
                        <!--<div class="box">{{timeObj.micro_sec}}</div>-->
                    </div>
                    <div class="txt">结束</div>
                </div>
            </div>
        </div>
        <div class="countDown-temp" :class="{'temp3':temp ==='3'}" v-if="temp ==='3'">
            <div class="" v-if="isCountDown">
                <div class="countDown-box">
                    <div class="txt3">{{isStart === 1 ? '距结束' : '距开始'  }}</div>
                    <div class="countDown-inner" >
                        <div class="box d" v-if="timeObj.day !== '00'">{{timeObj.day}}</div>
                        <div class="box" v-if="timeObj.day !== '00'">天</div>
                        <div class="box h">{{timeObj.hr}}</div>
                        <div class="box box2">:</div>
                        <div class="box m">{{timeObj.min}}</div>
                        <div class="box box2">:</div>
                        <div class="box s">{{timeObj.sec}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'countDown',
        props:{
            timeProps:{
            },
            temp:{
                default:'1',
                type:String
            },
            isStart:{}
        },
        computed:{

        },
        data(){
            return{
                timeObj:{},
                isCountDown:true,
                interval:null,
                time:this.timeProps
            }
        },
        watch:{
            timeProps(val) {
                this.isCountDown = true
                this.time = val
            }
        },
        methods:{
            countDown() {
                if(this.isCountDown){
                    let timeObj=this.dateFormat(this.time)
                    this.timeObj = timeObj
                    if(this.time<= 0 ){
                        this.isCountDown = false
                        this.$emit('emitCountDownFun')
                    }
                    this.interval = setTimeout(()=>{
                        this.time-= 1000
                        this.countDown()
                    },1000)
                }
            },
            timeFormat(param) {
                return param < 10 ? '0' + param : param;
            },
            dateFormat (time) {

                if(time>0){
                    var second = Math.floor(time/1000)
                    var day = Math.floor(second / (3600*24))
                    var hr = Math.floor(second % (60 * 60 * 24) / 3600)
                    var min = Math.floor(second % (3600 * 24) % 3600 / 60)
                    var sec = second % (60 * 60 * 24) % 3600 % 60
                    var micro_sec = Math.floor((time % 1000) / 10)

                    return {
                        day:this.timeFormat(day),
                        hr:this.timeFormat(hr),
                        min:this.timeFormat(min),
                        sec:this.timeFormat(sec),
                        micro_sec:this.timeFormat(micro_sec)
                    }
                }else {
                    return {
                        day:'00',
                        hr:'00',
                        min:'00',
                        sec:'00',
                        micro_sec:'00'
                    }
                }

            },
        },
        created(){
            this.countDown()
        },
        mounted(){

        },
        destroyed(){
            clearInterval(this.interval);
        }
    }
</script>
<style lang="scss" type="text/scss">
    .countDown-temp{
        font-size: 10px;
        color: #fffefe;
        .countDown-box{
            display: flex;
            align-items: center;
            .countDown-inner{
                display: flex;
                align-items: center;
                margin: 0 2px;
                .box{
                    width: 14px;
                    text-align: center;

                }
            }
        }
        &.temp2,&.temp3{
            color: #353535;
            line-height: 1;
            .txt{
                font-size: 14px;
                color: #000;
            }
            .txt3{
                font-size: 13px;
                color: #353535;
            }
            .countDown-inner{
                margin: 0 5px;

            }
            .box{
                &.d,&.h,&.m,&.s{
                    background: #F22A15;
                    border-radius: 5px;
                    width: 20px;
                    height: 15px;
                    color: #fff;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                &.box2{
                    width: auto;
                    height: 15px;
                    line-height: 15px;
                    margin: 0 2px;
                }
            }

        }

    }


</style>
