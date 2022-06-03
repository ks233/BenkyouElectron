<template>

  <MainFrame msg="Welcome to Your Vue.js App" />
</template>

<script>
import MainFrame from './components/MainFrame.vue'

export default {
  name: 'App',
  components: {
    MainFrame
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
html {
    height: 100%;
}

body {
    margin: 0;
    padding: 0;
    --benkyou-theme-color:#FF654E;
    --benkyou-hover-color:rgb(245, 213, 210);
    --benkyou-active-color:rgb(255, 241, 240);
}
</style>
