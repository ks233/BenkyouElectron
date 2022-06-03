<template>
    <div class="icon-button">
        <img src="{{icon}}">
    </div>
</template>

<script>


export default {
    name: 'MainFrame',
    props: {
        icon: String
    },
    data: function () {
        return {
            count: 0,
            ksks: "ksks"
        }
    },
    methods: {
        say() {
            this.ksks = "wbbb"
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon-button{
  display:flex;  
  height:50px;
  width:90%;
  text-align:center;
  flex-direction: row;
  background-color: #FF654E;
  border-radius: 50px;
  margin:0 auto;
  margin-top:10px;
}
.icon-button:hover {
  background-color: red;
}
</style>
