const orderRouter = [
    {
        path: '/submitOrder',
        name: 'submitOrder',
        component: ()=> import('@/views/order/submitOrder'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/payCashier/:order_num',
        name: 'payCashier',
        component: ()=> import('@/views/order/payCashier'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/orderPayStatus',
        name: 'orderPayStatus',
        component: ()=> import('@/views/order/orderPayStatus'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/orderDetails/:order_id',
        name: 'orderDetails',
        component: ()=> import('@/views/order/orderDetails'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/buyList',
        name:'buyList',
        component: ()=>import('@/views/order/buyList'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/sellList',
        name:'sellList',
        component: ()=>import('@/views/order/sellList'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/publishList',
        name:'publishList',
        component: ()=>import('@/views/order/publishList'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/wantList',
        name:'wantList',
        component: ()=>import('@/views/order/wantList'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/logistics',
        name:'logistics',
        component: ()=>import('@/views/order/logistics'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/modifyPrice',
        name:'modifyPrice',
        component: ()=>import('@/views/order/modifyPrice'),
        meta:{
            isWx:true
        }
    },
    {
        path:'/deliveryWay/:delivery_info/:state',
        name:'deliveryWay',
        component: ()=>import('@/views/order/deliveryWay'),
        meta:{
            isWx:true
        }
    },
]
export default orderRouter
