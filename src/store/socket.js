import {
    SOCKET_ONOPEN,
    SOCKET_ONCLOSE,
    SOCKET_ONERROR,
    SOCKET_ONMESSAGE,
    SOCKET_RECONNECT,
    SOCKET_RECONNECT_ERROR
} from './mutation-types'
export default{
    state: {
        socket: {
            isConnected: false,
            message: '',
            reconnectError: false,
        }
    },
    mutations: {
        [SOCKET_ONOPEN](state, event)  {
            console.log('连接成功')
            state.socket.isConnected = true
        },
        [SOCKET_ONCLOSE](state, event)  {
            console.log('连接关闭')
            state.socket.isConnected = false
        },
        [SOCKET_ONERROR](state, event)  {
            console.error(state, event)
            console.log('连接错误')
        },
        // default handler called for all methods
        [SOCKET_ONMESSAGE](state, message)  {
            state.socket.message = message
        },
        // mutations for reconnect methods
        [SOCKET_RECONNECT](state, count) {
            console.info(state, count)
        },
        [SOCKET_RECONNECT_ERROR](state) {
            state.socket.reconnectError = true;
        }
    }
}