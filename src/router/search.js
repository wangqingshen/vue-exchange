const searchRouter = [
    {
        path: '/search',
        name: 'search',
        component: ()=> import('@/views/index/search'),
        meta:{
            isWx:true
        }
    },
]
export default searchRouter
