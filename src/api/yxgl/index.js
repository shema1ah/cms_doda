/* 延禧攻略需要代理的地址 */

const host = process.env.NODE_ENV === 'development' ? 'http://180.76.105.42:8101/admin' : 'https://api.ajimiyou.com/yanxi/admin'
// const host = 'https://api.ajimiyou.com/yanxi/admin'

export default {
  host: host
}
