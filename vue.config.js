const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.VUE_APP_MODE === 'production' || process.env.VUE_APP_MODE === 'alpha'
module.exports = {
    baseUrl:process.env.VUE_APP_MODE === 'production' || process.env.VUE_APP_MODE === 'alpha' ? './' : '/',
    lintOnSave: false,//是否格式规范eslint
    configureWebpack: config => {
        if (isProduction) {
            config.externals = {
                // 'vue': 'Vue',
                'moment': 'moment',
                'vuex' : 'Vuex',
                'axios' : 'axios'
            },
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
    },
    devServer:{
        host: '0.0.0.0', // can be overwritten by process.env.HOST
        port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        proxy:{
            '/exchange': {
                target: 'http://www.yjbbkj.com/api',
                // target: 'http://secondhand.wsyjcs.cn/api',
                // target: 'https://shop.wsyjcs.cn/api',
                // target:'http://192.168.0.165/api',//冯
                // target:'http://192.168.0.160/api',//殷
                changeOrigin: true,
                pathRewrite: {
                    '^/exchange': '/exchange'
                }
            },
        }
    },
    productionSourceMap:false
}