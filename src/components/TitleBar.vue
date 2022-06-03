<template>

    <div id="titlebar"  unselectable="on">
        Benkyou - 学习计划
    </div>
</template>

<script>

export default {
    name: "TitleBar"
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#titlebar{  
  text-align: left;
  background-color: var(--benkyou-theme-color);
  height: 48px;
  padding-left: 10px;
  line-height: 48px;
  font-size: 18px;
  color:white;
}
</style>
