<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="content-container">
        <router-view/>
      </div>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain'
  }
</script>

<style scoped lang="scss">
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;
  }
</style>
