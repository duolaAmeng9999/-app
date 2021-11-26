const categories = {
    namespaced: true,
    actions: {
        async getCategories(context) {
            const result = await this._vm.$u.api.getCategories();
            context.commit("GETCATEGORIRS", result)
        }
    },
    mutations: {
        GETCATEGORIRS(state, result) {
            state.categories = result
        }
    },
    state: {
        categories: []
    },
    getters: {},
}
export default categories