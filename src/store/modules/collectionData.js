const collectionData = {
  state: {
    queryConditions: sessionStorage.getItem('queryConditions') || '',
    fieldCode: sessionStorage.getItem('fieldCode') || '',
    aggregateType: sessionStorage.getItem('aggregateType') || ''
  },
  mutations: {
    SET_DATA: (state, opt) => {
      state.queryConditions = opt.queryConditions
      state.fieldCode = opt.fieldCode
      state.aggregateType = opt.aggregateType
      sessionStorage.setItem('queryConditions', opt.queryConditions)
      sessionStorage.setItem('aggregateType', opt.aggregateType)
      sessionStorage.setItem('fieldCode', opt.fieldCode)
    },
    REM_DATA: (state) => {
      state.fieldCode = ''
      state.queryConditions = ''
      state.aggregateType = ''
      sessionStorage.removeItem('fieldCode')
      sessionStorage.removeItem('aggregateType')
      sessionStorage.removeItem('queryConditions')
    }
  },
  actions: {
    setData({commit}, data) {
      commit('SET_DATA', data)
    },
    remData({commit}){
      commit('REM_DATA')
    }
  }
}
export default collectionData