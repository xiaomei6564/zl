const visualDesign = {
  state: {
    sourceData: [], // 数据源
    output: [], // 输出
    propertyIndex: null, // 属性下标
    lFilterData: [], // 左过滤器
    RFilterData: [], // 右过滤器
    dsLinks: [], // 连线数据
    reportCode: '', // 报表编码
    reqSourceData: {
      left: [],
      right: []
    }, //请求数据源
  },
  mutations: {
    SetReqSourceData: (state, {left, right}) => { //设置请求数据源
      if (left) {
        state.reqSourceData.left = left
      }
      if (right) {
        state.reqSourceData.right = right
      }
    },
    SET_REPORT_CODE: (state, code) => { // 设置报表编码
      state.reportCode = code
    },
    SET_SOURCE_DATA: (state, arr) => { // 设置数据源
      state.sourceData = arr
    },
    ADD_OUTPUT: (state, arr) => { // 添加输出整个对象
      let voidState = false
      if (!state.output.length) {
        voidState = true
      }
      state.output.push(arr)
      state.output = Array.from(new Set(state.output))
      if (voidState) {
        state.propertyIndex = 0
      }
    },
    DEL_OUTPUT: (state, index) => { //删除输出
      state.output.splice(index, 1)
      if (state.output.length) {
        state.propertyIndex = 0
      } else {
        state.propertyIndex = null
      }
    },
    INDEX_OUTPUT: (state, index) => {
      const newIndex = state.propertyIndex + index, delObj = state.output[state.propertyIndex];
      if (newIndex < 0 || newIndex > state.output.length) return false;
      state.output.splice(state.propertyIndex, 1)
      state.output.splice(newIndex, 0, delObj)
      state.propertyIndex = newIndex 
    },
    SELECT_PROPERTY_INDEX: (state, num) => { // 设置属性下标
      state.propertyIndex = num
    },
    CHANGE_OUTPUT: (state, obj) => { // 改变输出单个值
      state.output[state.propertyIndex] = {...state.output[state.propertyIndex], ...obj}
    },
    ADD_FILTER_DATA_L: (state, obj) => {
      const index = state.lFilterData.findIndex(item => item.dsFieldCode === obj.dsFieldCode)
      if (index !== -1) {
        state.lFilterData[index] = obj
      } else {
        state.lFilterData.push(obj)
      }
    },
    ADD_FILTER_DATA_R: (state, obj) => {
      const index = state.RFilterData.findIndex(item => item.dsFieldCode === obj.dsFieldCode)
      if (index !== -1) {
        state.RFilterData[index] = obj
      } else {
        state.RFilterData.push(obj)
      }
    },
    CLEAR_FILTER_DATA: (state, key, code) => {
      const index = state[key].findIndex(item => item.dsFieldCode === code)
      state[key].splice(index, 1)
    },
    SET_DS_LINKS: (state, opt) => {
      console.log(opt)
      const isArr = Object.prototype.toString.call(opt) == '[object Array]'
      if (isArr) {
        state.dsLinks = opt
      } else {
        state.dsLinks.push(opt)
      }
    },
    DEL_DS_LINKS: (state, index) => {
      state.dsLinks.splice(index, 1)
    },
    CLEAR_ALL: (state) => {
      state.sourceData = [] // 数据源
      state.output = [] // 输出
      state.propertyIndex = null // 属性下标
      state.lFilterData = [] // 左过滤器
      state.RFilterData = [] // 右过滤器
      state.dsLinks = [] // 连线数据
      state.reportCode = ''
    }
  },
  actions: {
    changeSourceData({commit, state}, row) { // 改变数据源对象复杂处理
      let arr = state.sourceData
      if (state.sourceData.length == 2) {
        arr.splice(0, 1)
      } 
      arr.push(row)
      arr = Array.from(new Set(arr))
      commit('SET_SOURCE_DATA', arr)
    },
    
  }
}
export default visualDesign