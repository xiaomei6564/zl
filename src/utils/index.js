
export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

export function toToday(str, dateStr) {
  let date = new Date()
  var year = date.getFullYear() + "";
  var month = (date.getMonth() + 1) + "";

  var beginDate = '';
  if (str == 'year') { //本年到今天
    beginDate = year + "/01/01 00:00:00"
    return [new Date(beginDate), new Date()]
  } else if (str == 'month') {
    beginDate = year + "/" + month + "/01 00:00:00"
    return [new Date(beginDate), new Date()]
  } else if (str == 'date') {
    return [new Date(dateStr), new Date()]
  }
}

export function toMonth(str, dateStr) {
  let date = new Date()
  var year = date.getFullYear() + "";
  var month = (date.getMonth() + 1) + "";
  if (str == 'lastMonth') {
    return new Date(year + '/' + (month - 1) + '/01').getTime()
  } else if (str == 'yearFristMonth') {
    return new Date(year + '/01/01').getTime()
  } else if (str == 'currentMonth') {
    return new Date(year + '/' + month + '/01').getTime()
  } else if (str == 'customMonth') {
    return new Date(dateStr).getTime()
  }
}
export function toMonthrange(str, dateStr) {
  let date = new Date()
  var year = date.getFullYear() + "";
  var month = (date.getMonth() + 1) + "";
  if (str == 'yearFristToCurrentMonth') {
    return [new Date(year + '/01/01').getTime(), new Date(year + '/' + month + '/01').getTime()]
  } else if (str == 'customMonthToCurrentMonth') {
    return [new Date(dateStr).getTime(), new Date(year + '/' + month + '/01').getTime()]
  }
}

export function dateRadio(str, dateStr) {
  let date = new Date()
  var year = date.getFullYear() + "";
  var month = (date.getMonth() + 1) + "";
  if (str == 'yearFrist') {
    return new Date(year + '/01/01')
  } else if (str == 'monthFrist') {
    return new Date(year + '/' + month + '/01')
  } else if (str == 'lastMonthFrist') {
    return new Date(year + '/' + (month - 1) + '/01')
  } else if (dateStr) {
    return new Date(dateStr)
  }
}

export function parseDate(time, str = '') {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

    // 拼接
    return year + str + month + str + day
  } else {
    return ''
  }
}
export function parseMonth(time, str = '') {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1

    // 拼接
    return year + str + month
  } else {
    return ''
  }
}
export function stringDate(time, str = '-') {
  if (time) {
    // 例如 20200512
    const year = time.substring(0, 4),
          month = time.substring(4, 6),
          day = time.substring(6, 8);
    return new Date(year + str + month  + str + day)
  } else {
    return ''
  }
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function pathStr() {
  if (window.location.origin.indexOf('http://me.cofcotrading.com') !== -1) return '/hana';
  return ''
}

export function MP(ak = 'SzYwsyN0EXNeBX63UFeM3wOLVWGYZPHC') {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
