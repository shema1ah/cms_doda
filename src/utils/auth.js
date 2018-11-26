import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const user = 'userInfo'

/* token */
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/* userInfo */
export function getUserInfo() {
  return Cookies.get(user)
}

export function setUserInfo(userInfo) {
  return Cookies.set(user, userInfo)
}

export function removeUserInfo() {
  return Cookies.remove(user)
}
