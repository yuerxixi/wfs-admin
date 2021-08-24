/**
 * judge type accurate
 * @param value
 * @returns {*}
 */
export const judgeType = value => {
  const t = Object.prototype.toString.call(value)
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (value instanceof Element) {
    return 'element'
  }
  return map[t]
}
/**
 * judge is a certain type
 * @param type
 * @param value
 * @returns {boolean}
 */
export const isXType = (type, value) => {
  if (type && judgeType(type) === 'string') {
    const t = Object.prototype.toString.call(value)
    switch (type) {
      case 'number':
        return t === '[object Number]'
      case 'string':
        return t === '[object String]'
      case 'undefined':
        return t === '[object Undefined]'
      case 'boolean':
        return t === '[object Boolean]'
      case 'object':
        return t === '[object Object]'
      case 'array':
        return t === '[object Array]'
      case 'function':
        return t === '[object Function]'
      default:
        break
    }
  } else {
    throw 'The value of the type of judgment must exist and must be a string.'
  }
}

/**
 * judge object is empty
 * @param value
 * @returns {boolean}
 */
export const isEmpty = value => {
  return (
    (Array.isArray(value) && value.length === 0) ||
    (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
  )
}

/**
 * isEqual
 * @param a
 * @param b
 * @param aStack
 * @param bStack
 * @returns {boolean}
 */
export const isEqual = (a, b, aStack, bStack) => {
  if (a === b) return a !== 0 || 1 / a === 1 / b
  if (a == null || b == null) return false
  if (a !== a) return b !== b
  const type = typeof a
  if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false

  /**
   * deep equire
   * @param a
   * @param b
   * @param aStack
   * @param bStack
   * @returns {boolean}
   * @private
   */
  function _deepEq(a, b, aStack, bStack) {
    const className = toString.call(a)
    if (className !== toString.call(b)) return false

    switch (className) {
      case '[object RegExp]':
      case '[object String]':
        return '' + a === '' + b
      case '[object Number]':
        if (+a !== +a) return +b !== +b
        return +a === 0 ? 1 / +a === 1 / b : +a === +b
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b
    }
    const areArrays = className === '[object Array]'
    if (!areArrays) {
      if (typeof a !== 'object' || typeof b !== 'object') return false
      const aCtor = a.constructor
      const bCtor = b.constructor
      if (
        aCtor === bCtor &&
        !(
          isXType('function', aCtor) &&
          aCtor instanceof aCtor &&
          isXType('function', bCtor) &&
          bCtor instanceof bCtor &&
          'constructor' in a &&
          'constructor' in b
        )
      ) {
        return false
      }
    }
    aStack = aStack || []
    bStack = bStack || []
    let length = aStack.length
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b
      }
    }
    aStack.push(a)
    bStack.push(b)
    if (areArrays) {
      length = a.length
      if (length !== b.length) return false
      while (length--) {
        if (!isEqual(a[length], b[length], aStack, bStack)) return false
      }
    } else {
      const keys = Object.keys(a)
      let key
      length = keys.length
      if (Object.keys(b).length !== length) return false
      while (length--) {
        key = keys[length]
        if (!(b.hasOwnProperty(key) && isEqual(a[key], b[key], aStack, bStack))) return false
      }
    }
    aStack.pop()
    bStack.pop()
    return true
  }

  return _deepEq(a, b, aStack, bStack)
}

/**
 * is variable Exitsed
 * @param variableName
 * @returns {boolean}
 */
export const isExitsVariable = variableName => {
  try {
    const type = judgeType(variableName)
    if (type === 'undefined' || type === 'null') {
      return false
    } else {
      return true
    }
  } catch (e) {}
  return false
}

/**
 * judge array contain another Obj
 * @param arr
 * @param obj
 * @returns {boolean}
 */
export const arrContainObj = (arr, obj) => {
  if (judgeType(arr) === 'array') {
    let i = arr.length
    while (i--) {
      if (arr[i] === obj) {
        return true
      }
    }
    return false
  } else {
    throw 'the object of the judgment must be a array format ，you better find it'
  }
}

/**
 * judge string contain another string in definite place
 * @param str
 * @param substr
 * @param place       place number
 * @returns {boolean}
 */
export const strContainPlace = (str, substr, place) => {
  if (isXType('string', str) && isXType('string', substr)) {
    if (judgeType(place) === 'number') {
      return str.indexOf(substr) === place
    }
  } else {
    throw 'the object of the judgment must be a string format ，you better find it'
  }
}

/**
 * invert
 * @param val
 * @returns {boolean}
 */
export const invert = val => {
  if (typeof val === 'undefined') {
    return
  }
  return !val
}

/**
 * debounce
 * @param func
 * @param wait
 * @param immediate
 * @returns {Function}
 */
export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function() {
    const last = +new Date() - timestamp
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
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
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}

/**
 * deep clone
 * @param data
 * @returns {{}}
 */
export const deepClone = data => {
  const obj = {}
  const originQueue = [data]
  const copyQueue = [obj]
  const visitQueue = []
  const copyVisitQueue = []
  while (originQueue.length > 0) {
    const _data = originQueue.shift()
    const _obj = copyQueue.shift()
    visitQueue.push(_data)
    copyVisitQueue.push(_obj)
    for (const key in _data) {
      const _value = _data[key]
      const type = judgeType(_data[key])
      if (type !== 'object') {
        if (type === 'undefined') {
          _obj[key] = ''
        } else {
          _obj[key] = _value
        }
      } else {
        const index = visitQueue.indexOf(_value)
        if (index >= 0) {
          _obj[key] = copyVisitQueue[index]
        } else {
          originQueue.push(_value)
          _obj[key] = {}
          copyQueue.push(_obj[key])
        }
      }
    }
  }
  return obj
}

/**
 * check range (校验特定范围内是否所有表单元素都通过验证)
 * @param range
 * @param target
 * @returns {boolean}
 */
export const checkRange = (range, target) => {
  const t = range + ' ' + target
  const allError = document.querySelectorAll(t)
  return !allError.length > 0
}

/**
 * replace the specified string by something in father string
 * @param str
 * @param substr
 * @param replace
 * @returns {*|string|void|XML}
 */
export const delsubstr = (str, substr, replace) => {
  if (isXType('string', str) && isXType('string', substr)) {
    const reg = new RegExp(substr, 'g')
    return typeof replace === 'undefined' ? str.replace(reg, '') : str.replace(reg, replace)
  } else {
    this.throw('the object of the judgment must be a string format ，you better find it')
  }
}

/**
 * 获取浏览器url中参数
 * @param name - 参数名
 * @returns {string}
 */
export const getUrlParam = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r =
    window.location.search.substr(1).match(reg) ||
    window.location.hash.substring(window.location.hash.search(/\?/) + 1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
}

/*
 * addEventListener（绑定Dom元素的监听事件）
 *
 * target：监听对象
 * type：监听函数类型，如click,mouseover
 * func：监听函数
 */
export const addEventHandler = function(target, type, func) {
  if (target.addEventListener) {
    // 监听IE9，谷歌和火狐
    target.addEventListener(type, func, false)
  } else if (target.attachEvent) {
    target.attachEvent('on' + type, func)
  } else {
    target['on' + type] = func
  }
}

/*
 * :
 *removeEventHandler （移除Dom元素的监听事件）
 * target：监听对象
 * type：监听函数类型，如click,mouseover
 * func：监听函数
 */
export const removeEventHandler = function(target, type, func) {
  if (target.removeEventListener) {
    // 监听IE9，谷歌和火狐
    target.removeEventListener(type, func, false)
  } else if (target.detachEvent) {
    target.detachEvent('on' + type, func)
  } else {
    delete target['on' + type]
  }
}
/**
 * log information style
 * @param type
 * @returns {string}
 */
export const logStyle = type => {
  const base = 'font-weight:bold;'
  switch (type) {
    case 'tit':
      return 'color:#F56C6C; ' + base
    case 'info':
      return 'color:#409EFF; ' + base
    case 'text':
      return 'color:#303133; ' + base
    case 'success':
      return 'color:#67C23A; ' + base
    case 'warning':
      return 'color:#E6A23C; ' + base
    case 'line':
      return 'color:#DCDFE6; ' + base
    case '3DTest':
      return ' text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:1.4em'
    default:
      break
  }
}

/**
 * 数组对象去重
 * @param {array} arr
 * @param {fn} fn
 * @returns {array}
 */
export const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v)
    return acc
  }, [])
/**
 * @description 奇偶数判断
 * @param {number} num
 */
export function isEven(num) {
  if (num & 1) {
    // return 0 为奇数
    return false
  } else {
    // return 1 为偶数
    return true
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {String}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
