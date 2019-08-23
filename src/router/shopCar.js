const shopCarRouter = [
    {
        path: '/shopCar',
        name: 'shopCar',
        component: ()=> import('@/views/shopCar/index'),
        meta:{
            isWx:true
        }
    },
]
export default shopCarRouter
