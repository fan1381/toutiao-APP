// 封装操作本地存储的模块
// 设置
export const setItem = (name, value) => {
  // 由于本地存储只能存字符串，所以判断value是对象的话，就需要转换成字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}
// 获取
export const getItem = (name) => {
  const data = window.localStorage.getItem(name)
  try {
    // 如果获取的是字符串，就需要转成对象，否则就原样返回
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}
// 删除
export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}
