export const storageSave = (key, value) => {
  localStorage.setItem(key,JSON.stringify(value))
}
export const storageRead = key => {
  const data = localStorage.getItem(key)
  if (data) {
      return JSON.parse(data)
  }
  return null
}
export const storageRemove = key => {
  const data = localStorage.getItem(key)
  if (data) {
      localStorage.removeItem(key)
  }
}
