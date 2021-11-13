
// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let postsUrl = "/todos";
const install = (Vue, vm) => {
    // 此处没有使用传入的params参数
    let getPost = (params = { id: 1 }) => vm.$u.get(postsUrl + `${params.id}`);

    // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
    vm.$u.api = { getPost };
}

export default {
    install
}