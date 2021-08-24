export default {
  methods: {
    getCookieByName(name) {
      const strcookie = document.cookie // 获取cookie字符串
      const arrcookie = strcookie.split('; ') // 分割
      // 遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split('=')
        if (arr[0] === name) {
          return arr[1]
        }
      }
      return ''
    }
  }
}
