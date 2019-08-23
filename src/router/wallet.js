const walletRouter = [
    {
        path: '/wallet',
        name: 'wallet',
        component: ()=> import('@/views/wallet/index'),
        meta: {
            isWx:true
        }       
    },
    {
        path: '/wallet/balance',
        name: 'balance',
        component: ()=> import('@/views/wallet/balance'),
        meta: {
            isWx:true
        }       
    },
    {
        path: '/wallet/withdraw',
        name: 'withdraw',
        component: ()=> import('@/views/wallet/withdraw'),
        meta: {
            isWx:true
        }       
    },
]
export default walletRouter