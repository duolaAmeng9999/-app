const install = (Vue, vm) => {
    // 此为自定义配置参数，具体参数见上方说明
    Vue.prototype.$u.http.setConfig({
        baseUrl: 'https://gmall-prod.atguigu.cn/api',
        loadingText: '努力加载中~',
        loadingTime: 800,
    });

    // 请求拦截部分，如配置，每次请求前都会执行
    Vue.prototype.$u.http.interceptor.request = (config) => {
        config.header.token = uni.getStorageSync('token')
        return config;
    }

    // 响应拦截，如配置，每次请求结束都会执行本方法
    Vue.prototype.$u.http.interceptor.response = (res) => {
        if (res.code == 200) {
            return res.data;
        } else if (res.code == 208) {
            uni.redirectTo({
                url: "/pages/login/login"
            })
            return false;
        } else {
            // 错误信息提示
            uni.showToast({
                title: res.message,
                icon: 'none',
            });
            return false;
        }
    }

}
export default {
    install
}