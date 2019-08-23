<template>
    <div class="couponItem-component">
        <div class="coupon-list">
            <div class="coupon-item" @click="checkCoupon(item,index)" :class="[{'cash':item.discount_type === 1,'sale':item.discount_type === 2,'disable':item.is_get_discount === 0 || item.is_get_discount === 2 ||state === 2 || state=== 3 || item.dis || state === 4}]" v-for="(item,index) in couponItemData" :key="index">
                <div class="check-box" v-if="isCheck">
                    <!--'cash':item.discount_type === 1,'sale':item.discount_type === 2-->
                    <van-checkbox v-model="item.checked" :disabled="disabled"></van-checkbox>
                </div>
                <div class="coupon-inner">
                    <div class="type-line"></div>
                    <div class="coupon-info" @click="useIt(item, index)">
                        <div class="l">
                            <div class="num">
                                <div class="txt">
                                    <div class="sub_char" v-if="item.discount_type === 1">￥</div>
                                    <div class="num-txt" v-if="item.discount_type === 1">{{item.discount_price}}</div>
                                    <div class="num-txt" v-if="item.discount_type === 2">{{item.discount_rate}}</div>
                                    <div class="sale-txt" v-if="item.discount_type === 2">折</div>
                                </div>
                            </div>
                            <div class="s_txt" v-if="item.discount_use_type ===1 && type === 'submitOrder'">无门槛</div>
                            <div class="s_txt" v-if="item.discount_use_type ===2 && type === 'submitOrder'">满{{item.discount_full_use}}元可用</div>
                            <div class="now-btn" v-if="type === '1'" @click="getCoupon(item)">{{item.is_get_discount | couponStatus}}</div>
                            <div class="now-btn" v-if="state === 1">立刻使用</div>
                            <div class="now-btn" v-if="state === 2">已使用</div>
                            <div class="now-btn" v-if="state === 3">已过期</div>
                        </div>
                        <div class="r">
                            <div class="top">
                                <div class="type-icon">{{item.discount_type === 1 ? '现金券' : '折扣卷'}}</div>
                                <div class="desc">{{item.discount_name}}</div>
                            </div>
                            <div class="num-txt" v-if="item.is_limit === 2 || item.discount_use_type === 2">满{{item.full_use||item.discount_full_use}}元可用</div>
                            <div class="num-txt" v-if="item.is_limit === 1 || item.discount_use_type === 1">无门槛</div>
                            <div class="type-tag">{{item.discount_goods_type === 1 ? '全部商品' : '部分商品'}}</div>
                            <div class="date">{{item.discount_start_time | YYMMDD}}-{{item.discount_end_time | YYMMDD}}</div>
                            <div class="dis-icon" v-if="state===2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'couponItem',
        props:{
            couponItemData:{
                default:function () {
                    return []
                }
            },
            isCheck:{
                type:Boolean,
                default:false
            },
            type:{

            },
            state:{}
        },
        computed:{

        },
        data(){
            return{
                checked:false,
                disabled:true
            }
        },
        methods:{
            getCoupon(item){
                if(item.is_get_discount === 1){
                    this.$emit('emitGetCoupon',item)
                }

            },
            checkCoupon(item,index){
                this.$emit('emitCheckCoupon',item,index)
            },
            useIt(item, index){
                this.$emit('emitUseIt', item, index)
                // console.log(item,item.id,'使用')
            },
        },
        created(){
        },

    }
</script>
<style lang="scss" type="text/scss">
    .couponItem-component{
        .coupon-list{
            padding: 10px 15px ;
        }
        .coupon-item{
            display: flex;
            align-items: center;
            .check-box{
                margin-right: 10px;
                .van-checkbox__icon--disabled .van-icon{
                    border-color: #888;
                }
            }
            .coupon-inner{
                margin-bottom: 10px;
                background: #fff;
                border-radius: 5px;
                overflow: hidden;
                box-shadow:0 0 5px 0 rgba(0,0,0,0.1);
                flex-grow: 1;
            }

            &.disable{
                color: #888 !important;
                .type-line{
                    background: #888 !important;
                }
                .l{
                    .now-btn{
                        border: 1px solid #888 !important;
                    }
                }
                .r{
                    .type-icon{
                        background:#888 !important;
                    }
                }

            }
            &.cash{
                color: #F22A15;
                .type-line{
                    background: #F22A15;
                }
                .l{
                    .now-btn{
                        border: 1px solid #F22A15;
                    }
                }
                .r{
                    .type-icon{
                        background:#F22A15;
                    }
                }
            }
            &.sale{
                color: #FFB30D;
                .type-line{
                    background: #FFB30D;
                }
                .l{
                    .now-btn{
                        border: 1px solid #FFB30D;
                    }
                }
                .r{
                    .type-icon{
                        background:#FFB30D;
                    }
                }
            }
            .type-line{
                height: 8px;

            }
            .coupon-info{
                display: flex;
                align-items: center;
                padding: 10px;
                justify-content: space-between;
                .l{
                    width: 110px;
                    flex-shrink: 0;
                    margin-right: 10px;
                    .num{
                        position: relative;
                        display: flex;
                        justify-content: center;
                        margin-bottom: 10px;
                    }
                    .s_txt{
                        font-size: 14px;
                        text-align: center;
                    }
                    .txt{
                        font-size: 30px;
                        font-weight: 700;
                        display: flex;
                        .sale-txt{
                            font-size: 24px;
                            align-self: flex-end;
                        }
                        .sub_char{
                            font-size: 11px;
                        }
                    }
                    .now-btn{
                        height: 20px;
                        width: 75px;
                        line-height: 18px;
                        font-size: 14px;
                        text-align: center;
                        border-radius: 5px;
                        margin: 0 auto;
                    }

                }
                .r{
                    font-size: 11px;
                    position: relative;
                    flex-grow: 1;
                    .top{
                        display: flex;
                        align-items: center;
                        margin-bottom: 5px;
                        .type-icon{
                            padding: 1px 5px;
                            white-space: nowrap;
                            border-radius:5px;
                            color: #fff;
                            text-align: center;
                        }
                        .desc{
                            color: #888;
                            margin-left: 5px;
                        }
                    }
                    .num-txt{
                        color: #353535;
                        margin-bottom: 5px;
                    }
                    .type-tag{
                        padding: 1px 5px;
                        background:#EEEEEE;
                        color: #888;
                        border-radius:5px;
                        display: inline-flex;
                        margin-bottom: 10px;
                    }
                    .date{
                        color: #888;
                    }
                    .dis-icon{
                        background: url(../assets/images/img-used@2x.png) no-repeat;
                        width: 60px;
                        height: 60px;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        margin-top: -30px;
                        background-size: contain;
                    }
                }
            }
        }
    }
</style>
