import request from '@/utils/request'
/**
 * @description 磁贴静态数据
 * @param name: 磁贴名称 icon：磁贴图标  color：磁贴图标色值 back： 磁贴图标背景颜色 unit：磁贴对应的数值单位
 */
let panels = {
  'xswcl':{
    name:'销售完成率',
    icon: 'icon-shanxingtu',
    color: '#5DA2F6',
    back:'#f0edff',
    unit: '%'
  },
  'ymsskc':{
    name:'玉米实时库存',
    icon: 'icon-bar',
    color: '#F19431',
    back:'#f0edff',
    unit: '万元'
  },
  'bzssdfze':{
    name:'本周实时待付总额',
    icon: 'icon-zhuxingtu',
    color: '#945DF6',
    back:'#f0edff',
    unit: '万元'
  },
  'bzssyfze':{
    name:'本周实时已付总额',
    icon: 'icon-61',
    color: '#945DF6',
    back:'#f0edff',
    unit: '万元'
  },
  'yysr':{
    name:'营业收入',
    icon: 'icon-shujutu-copy-copy',
    color: '#3ABFF2',
    back:'#f0edff',
    unit: '万元'
  },
  'yylr':{
    name:'营业利润',
    icon: 'icon-iocnsandiantu',
    color: '#3CB7A2',
    back:'#f0edff',
    unit: '万元'
  },
  'cghtqysl':{
    name:'采购合同签约数量',
    icon: 'icon-heilongjiangtubiao09',
    color: '#945DF6',
    back:'#f0edff',
    unit: '万元'
  },
  'xshtqysl':{
    name:'销售合同签约数量',
    icon: 'icon-shujutu2',
    color: '#69DCAF',
    back:'#f0edff',
    unit: '万元'
  }
}
/**
 * @description 获取磁贴对应key值的信息
 * @param {id} 磁贴id
 * @param {color} 图标颜色
 * @param {unit} 单位
 * @param {back} 图标背景颜色
 */
export function  getPanelInfo(id, key){
  id = id.toLowerCase();
  // console.log(id, key)
  let info_ = ''
  if ( panels[id]) {
    info_ = panels[id][key]?panels[id][key]: ''
  }
  
  // console.log(info_)
  return info_
}

/**
 * @description 获取iconfont 图标
 * @param {key} 磁贴id
 * return 图标i标签
 */

export function  getIcon(key){
  key = key.toLowerCase();
  let icon_ = ''
  if ( panels[key]) {
    icon_ = panels[key]["icon"]?"iconfont   "+panels[key]["icon"]: ''

  }
 let dom_ = '<i class="'+icon_+'"></i>'
 return dom_
}
// 获取磁贴展示数据（磁贴与数据接口一对一）
export function getPanelData(postUrl) {
  return request({
    url: postUrl,
    method: 'get'
  })
}
//获取磁贴所有列表
export function getPanelAllList() {
  return request({
    url: '/api/allApp/magnet',
    method: 'get'
  })
}
//获取个人首页磁贴
export function getPanelListByUser(params) {
  return request({
    url: '/api/myHomeApp/magnet',
    method: 'get',
    params
  })
}
//收藏磁贴
export function collectPanel(params) {
  return request({
    url: '/api/myApp',
    method: 'post',
    params
  })
}
//获取磁贴收藏状态
export function collectStatus(params) {
  return request({
    url: '/api/myApp/magnet',
    method: 'get',
    params
  })
}
//移除磁贴
export function deletePanelByUser(data) {
  return request({
    url: '/api/myApp/remove',
    method: 'post',
    data
  })
}
/**
 * 数字格式转换成千分位
 * @param num
 * @returns {string}
 */
export function  commafy(n){
  var str_n=n.toString();
  var result="";
  var cs=0;
  for(var i=str_n.length-1;i>=0;i--){
    cs++;
    result=str_n.charAt(i)+result;
    if(!(cs%3)&&i!=0){
      result=","+result;
    }
  }
return result;
}
