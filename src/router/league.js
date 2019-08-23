const leagueRouter = [
    {
        path: '/league',
        name: 'league',
        component: ()=>import('@/views/league/index'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/league/fillIn/:store_id',
        name: 'fillIn',
        component: ()=>import('@/views/league/fillIn'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/league/submit/:league_data',
        name: 'submit',
        component: ()=>import('@/views/league/submit'),
        meta:{
            isWx:true
        }
    },
]
export default leagueRouter