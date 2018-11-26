<template>
  <div class="inner">
    <div class="home-editor-container">
      <img src="../../assets/logo.png" class="logo">
      <div class="home-text">欢迎来到哆哒管理后台</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .inner{
    .home-editor-container {
      display: flex;
      min-height: calc(100vh - 110px);
      justify-content: center;
      align-items: center;
      padding: 32px;
      .logo{
        width: 65px;
        height: 65px;
        margin-right: 10px;
        border-radius: 15px;
      }
      .home-text{
        font-size: 36px;
        color: black;
        text-align: center;
      }
    }
  }

</style>
