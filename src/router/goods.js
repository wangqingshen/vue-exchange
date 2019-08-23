const goodsRouter = [
    {
        path: '/goods/goodsDetails/:spu_id',
        name: 'goodsDetails',
        component: ()=> import('@/views/goods/index'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/category',
        name: 'category',
        component: ()=> import('@/views/goods/category'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/goods/list',
        name: 'goodList',
        component: ()=> import('@/views/goods/list'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/goods/groupList',
        name: 'groupList',
        component: ()=> import('@/views/goods/groupList'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/goods/groupDetails/:spu_id/:team_id',
        name: 'groupDetails',
        component: ()=> import('@/views/goods/groupDetails'),
        meta:{
            isWx:true
        }

    },
    {
        path: '/goods/secKill',
        name: 'secKill',
        component: ()=> import('@/views/goods/secKill'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/goods/publish/:spu_id',
        name: 'publish',
        component: ()=> import('@/views/goods/publish'),
        meta:{
            isWx:true
        }
    },
]
export default goodsRouter
