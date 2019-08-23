<template>
    <div class="orderItem-component">
        <div class="orderItem-item vux-1px-b" v-for="(item,index) in orderItemData" :key="index">
            <div class="orderItem-inner">
                <div class="pic">
                    <img v-lazy="item.goods_img" alt="">
                </div>
                <div class="info">
                    <div class="name">{{item.goods_name||item.spu_name}}</div>
                    <div class="b">
                        <div class="price">￥{{item.goods_price|toFixedTwo}}</div>
                        <div class="num">x{{item.goods_num}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    export default{
        name:"orderItem-component",
        props:{
            orderItemData:{
                type:Array,
                default:function () {
                    return []
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
    .orderItem-item{
        padding: 10px 15px;
        background: #fff;
        &:last-child:after{
            content: none;
        }
        .orderItem-inner{
            display: flex;
            .pic{
                width: 100px;
                height: 100px;
                border-radius: 4px;
                flex-shrink: 0;
                margin-right: 7px;
                border-radius: 4px;
                overflow: hidden;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: auto;
                    height: 100%;
                }
            }
            .info{
                display: flex;
                flex-grow: 1;
                justify-content: space-between;
                .name{
                    font-size: 14px;
                    color: #333;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp:2;
                    height: 38px;
                }
                .b{
                    display: flex;
                    flex-direction: column;
                    .price{
                        font-size: 16px;
                    }
                    .num{
                        font-size: 12px;
                        color: #999;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>
