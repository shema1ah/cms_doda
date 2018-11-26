const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  isLogin: state => state.user.isLogin,
  name: state => state.user.name,
  roleId: state => state.user.roleId
}
export default getters
