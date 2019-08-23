<template>
    <div class="wrapper" v-title="pageTitle">
        <div class="publishList-inner">
            <div class="orderStatus-bar">
                <div class="bar-inner">
                    <div class="items">
                        <div class="item" v-for="(item, index) in orderType" :key="index" :class="{'active':stepIndex === index }" @click="changepublishList({stepIndex: index})">
                            <div class="txt">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="line" :class="stepClass"></div>
                </div>
            </div>
            <van-list v-model="loading" :finished="finished" @load="loadMore" class="publishList" :offset="offset" v-if="!noData">
                <div class="publishList-item" v-for="(item,index) in publishListData" :key='index' :class="item.goods_num?'':'disabled'">
                    <div class="publish-state" v-if="item.goods_state != 4">
                        {{item.goods_num?(item.goods_state == 0? '已下架-审核中':(item.goods_state == 2?'已下架-审核不通过':'已下架-审核通过')):'已售出'}}
                    </div>
                    <div class="publishList-hd" @click="goGoodsPage(item.spu_id)">
                        <div class="goods-img">
                            <img v-lazy="item.goods_img" />
                        </div>                        
                        <section class="goods-info">
                            <div class="goods-name">
                                {{item.goods_name}}
                            </div>
                            <div class="goods-basic">
                                <div class="basic-item"><span>{{item.goods_views}}浏览</span></div>
                                <div class="basic-item"><span>{{item.expect_num}}想要</span></div>
                                <div class="basic-item"><span>{{item.comment_num}}留言</span></div>
                            </div>
                            <div class="goods-price">{{item.goods_price}}</div>
                        </section>
                    </div>
                    <div class="publishList-bt" v-if="item.goods_num">
                        <div class="btn xjbtn" @click="personBtnEvt('xj', item.spu_id)" v-if="item.goods_state == 4">下架</div>
                        <div v-else style="display: flex;width:100%;height:100%;justify-content: flex-end;">
                            <div class="btn xjbtn" @click="personBtnEvt('sj', item.spu_id)" v-if="item.goods_state == 3 || item.goods_state == 1">上架</div>
                            <div class="btn" @click="publishEditEvt(item.spu_id)">编辑</div>
                            <div class="btn" @click="personBtnEvt('del', item.spu_id)">删除</div>
                            
                        </div>
                        
                    </div>
                </div>
                <noMore :finished="finished"></noMore>
            </van-list>
            <div class="no-data" v-if="noData">
                <div class="pic"></div>
                <div class="" style="text-align: center">您还没有发布任何宝贝哦<br/>马上发布赚赚零花钱</div>
                <div class="publishBtn" @click="publishEditEvt(-1)">添加发布</div>
            </div>
        </div>
    </div>
</template>
<script>
    import noMore from '@/components/no-more'
    export default{
        name:'publishList',
        data(){
            return{
                pageTitle:'我发布的',
                orderType: [
                    {name: '上架宝贝', state: 4},
                    {name: '下架宝贝', state: 3},
                ],
                loading: false,
                finished: false,
                stepIndex:0,
                offset:50,
                member_id:'',
                publishListData:[],
                page:1,
                isMore:false,
                goods_state:4,
                noData:false
            }
        },
        components:{
            noMore
        },
        computed:{
            stepClass(){
                if(this.stepIndex === 0){
                    return false
                }else {
                    return `line-step${this.stepIndex}`
                }
            }
        },
        watch:{

        },
        methods:{
            loadMore() {
                if(!this.finished && this.isMore){
                    if(this.publishListData.length < 10){
                        this.loading = false
                        return
                    }else {
                        this.page++
                        setTimeout(()=>{
                            this.getpublishList({page:this.page,page_size:10,stepIndex:this.stepIndex})
                        },500)
                    }

                }

            },
            changepublishList({stepIndex = 0} = {}){
                if(stepIndex == this.stepIndex) return
                this.stepIndex = stepIndex
                this.publishListData = []
                this.page = 1
                this.isMore = false
                this.finished = false
                this.getpublishList({page:this.page,stepIndex:stepIndex})
                let status = this.$store.state.tabCard_status
                status.publishList = stepIndex
                this.$store.dispatch('setTabCardStatus',status)
            },
            getpublishList({page = 1,page_size = 10,stepIndex = 0} = {}){
                this.goods_state = this.orderType[stepIndex].state
                this.$api.myReleaseGoodsList({
                    cmd:{
                        member:'MyReleaseGoodsList'
                    },
                    data:{
                        member_id:this.member_id,
                        page:page,
                        page_size:page_size,
                        goods_state:this.goods_state
                    },
                }).then(res=>{
                    if(res.code===1){
                        if(this.page == 1) {
                            this.publishListData = res.data.data
                        }else{
                            this.publishListData = [...this.publishListData,...res.data.data]
                        }
                       
                        this.loading = false
                        this.isMore = true
                        this.noData = false
                        if(res.data.data.length < 10){
                            this.finished = true
                        }
                        if(this.publishListData.length === 0){
                            this.noData = true
                        }
                        console.log(res.data.data)
                    }
                }).catch(err=>{

                })
            },
            publishEditEvt(spu_id){
                this.$router.push({name: 'publish', params: {spu_id: spu_id}})
            },
            personBtnEvt(type, spu_id){
                let msg = '',
                    cftext='',
                    cctext='再想想',
                    tip = '',
                    goods_state = '';
                switch(type) {
                    case 'del': 
                        msg='请确认是否删除'
                        cftext='确认删除'
                        tip = '商品已删除成功'
                        goods_state = 5
                        break
                    case 'xj': 
                        msg='请确认是否下架'
                        cftext='确认下架'
                        tip = '商品已下架'
                        goods_state = 3
                        break
                    case 'sj':
                        msg='请确认是否上架'
                        cftext='确认上架'
                        tip = '商品已上架'
                        goods_state = 4
                        break
                }
                this.$dialog.confirm({
                    message: msg,
                    confirmButtonText: cftext,
                    cancelButtonText: cctext
                }).then(() => {
                    this.$api.dropExchangeGoods({
                        cmd: {
                            goods: 'DropExchangeGoods'
                        },
                        data:{
                            spu_id: spu_id,
                            member_id: this.member_id,
                            goods_state: goods_state
                        }
                        }).then(res => {
                            console.log(res)
                            if(res.code === 1){
                                this.$toast.success({
                                    message: tip,
                                    forbidClick:true
                                })
                            }
                            this.getpublishList({stepIndex:this.stepIndex})
                    });
                }).catch(() => {});
            },
            goGoodsPage(spu_id){
                this.$router.push({name:'goodsDetails',params:{spu_id:spu_id}})
            }
        },
        created(){
            this.userInfo =JSON.parse(localStorage.getItem('userInfo'))
            this.member_id =  this.userInfo.member_id
            if(this.$store.state.tabCard_status.publishList){
                this.stepIndex = this.$store.state.tabCard_status.publishList
            }
            console.log(this.stepIndex)
            this.getpublishList({stepIndex:this.stepIndex})
        },
        mounted(){
        }

    }
</script>
<style lang="scss" type="text/scss">
    .publishList-inner{
        padding-top: 50px;
        .shop-icon{
            background: url(../../assets/images/shop_icon.png) no-repeat;
            background-size: contain;
            width: 18px;
            height: 16px;
            margin-right: 5px;
        }
        .no-data{
            font-size:14px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 120px;
            margin-top: 50%;
            .pic{
                background: url(../../assets/images/pic_wufabu@2x.png) no-repeat;
                width: 130px;
                height: 90px;
                background-size: 100%;
                margin-bottom: 10px;
            }
            .publishBtn {
                height: 40px;
                width: 120px;
                line-height: 40px;
                border-radius: 20px;
                color: #F32D16;
                border: 1px solid #F32D16;
                text-align: center;
                margin-top: 30px;
            }
        }
        .orderStatus-bar{
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            font-size: 14px;
            color: #353535;
            background: #fff;
            z-index: 99;
            .bar-inner{
                position: relative;
            }
            .items{
                display: flex;
                align-items: center;
                .item{
                    width: 20%;
                    flex-grow: 1;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .txt{
                        margin-top: -4px;
                    }
                    &.active{
                        color: #f22a15;
                    }
                }

            }
            .line{
                position: absolute;
                left: 0;
                height: 4px;
                width: 50%;
                background: #f22a15;
                bottom: 0;
                transition: transform 0.2s ease-in;
                transform: translateX(0);
                &.line-step1{
                    transform: translateX(100%);
                }
            }
        }
        .publishList{
            margin-top: 10px;
            padding: 0 15px;
            box-sizing: border-box;
            .publishList-item{
                background: #fff;
                margin-top: 15px;
                padding: 10px;
                border-radius: 4px;
                .publish-state {
                    font-size: 15px;
                    color: #333;
                    line-height: 20px;
                    margin-bottom: 8px;
                }
                .publishList-hd {
                    display: flex;
                    .goods-img {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100px;
                        height: 100px;
                        margin-right: 10px;
                        background: #f5f5f5;
                        img {
                            height: 100%;
                        }
                    }
                    .goods-info {
                        position: relative;
                        width: calc(100% - 110px);
                        .goods-name {
                            overflow:hidden; 
                            text-overflow:ellipsis;
                            display:-webkit-box; 
                            -webkit-box-orient:vertical;
                            -webkit-line-clamp:2; 
                            font-size: 14px;
                            line-height: 20px;
                            color: #333;
                            max-height: 40px;
                        }
                        .goods-basic {
                            display: flex;
                            line-height: 14px;
                            margin-top: 5px;
                            .basic-item{
                                width: 50px;
                                margin-right: 10px;
                                span{
                                    width: 100%;
                                    overflow:hidden; 
                                    text-overflow:ellipsis;
                                    display:-webkit-box; 
                                    -webkit-box-orient:vertical;
                                    -webkit-line-clamp:1; 
                                    font-size: 12px;
                                    line-height: 18px;
                                    color: #999;
                                    transform: scale(0.9);
                                }
                            }
                        }
                        .goods-price {
                            position: absolute;
                            font-size: 18px;
                            line-height: 20px;
                            color: #F32D16;
                            bottom: 0;
                        }
                    }
                }
                .publishList-bt {
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    .btn {
                        width: 80px;
                        height: 30px;
                        border-radius:15px;
                        border: 1px solid #ccc;
                        color:#666;
                        font-size: 14px;
                        text-align: center;
                        line-height: 30px;
                        margin-left: 10px;
                        &.xjbtn{
                            border-color: #F32D16;
                            color: #F32D16;
                        }
                    }
                }
                &.disabled{
                    position: relative;
                    &:before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: rgba(105,105,105,0.4);
                        border-radius: 4px;
                        z-index: 10;
                        left: 0;
                        top: 0;
                    }
                }
            }
        }
    }
</style>
