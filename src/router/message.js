const messageRouter = [
    {
        path: '/message',
        name: 'message',
        component: ()=> import('@/views/message/index'),
        meta:{
            isWx:true
        }
    },
    {
        path: '/message/chat/:to_user_id',
        name: 'chat',
        component: ()=>import('@/views/message/chat'),
        meta:{
            isWx:true
        }
    }

]
export default messageRouter
