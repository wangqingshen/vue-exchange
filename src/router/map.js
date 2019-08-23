const mapRouter = [
    {
        path: '/map/:league_data',
        name: 'map',
        component: ()=>import('@/views/league/store-address'),
        meta:{
            isWx:true
        }
    },
]
export default mapRouter