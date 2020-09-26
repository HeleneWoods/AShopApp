const state = {
    shopCartList: ''
}

// 对外映射数据
const getters = {
    shopCartList: state => state.shopCartList

}

const actions = {
    addToVuex({ commit }, _n) {
        commit('add', _n);
    }
}

const mutations = {
    add(state, _n) {
        state.shopCartList = _n;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}