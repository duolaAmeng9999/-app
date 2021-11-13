const install = (Vue, vm) => {
    // 此为自定义配置参数，具体参数见上方说明
    Vue.prototype.$u.http.setConfig({
        baseUrl: 'https://jsonplaceholder.typicode.com',
        loadingText: '努力加载中~',
        loadingTime: 800,
    });

    // 请求拦截部分，如配置，每次请求前都会执行
    Vue.prototype.$u.http.interceptor.request = (config) => {
        return config;
    }

    // 响应拦截，如配置，每次请求结束都会执行本方法
    Vue.prototype.$u.http.interceptor.response = (res) => {
        return res
    }

}
export default {
    install
}