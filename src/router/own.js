const ownRouter = [
    {
        path: '/own',
        name: 'ownIndex',
        component: ()=> import('@/views/own/index'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/coupon',
        name: 'coupon',
        component: ()=>import('@/views/own/own-coupon'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/userInfo',
        name: 'userInfo',
        component: ()=>import('@/views/own/userInfo'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/addressList',
        name: 'addressList',
        component: ()=>import('@/views/own/addressList'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/editAddress',
        name: 'editAddress',
        component: ()=>import('@/views/own/editAddress'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/group',
        name: 'ownGroup',
        component: ()=>import('@/views/own/own-group'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/own/aboutUs',
        name: 'AboutUs',
        component: ()=>import('@/views/own/aboutUs'),
        meta:{
            isWx:true
        }
    },
]
export default ownRouter
