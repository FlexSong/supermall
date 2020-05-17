<template>
  <div class="toast" v-show="isShow">
    {{message}}
  </div>
</template>

<script>
  export default {
    name: "Toast",
    data(){
      return {
        message:'',
        isShow:false
      }
    },
    methods:{
      show(message,time){
          this.message = message;
          this.isShow = true;
          setTimeout(()=>{
            this.isShow = false;
           //this.message = '';
          },time);
      }
    }
  }
</script>

<style scoped>
  .toast{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
   /* padding: 5px 9px; */
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0,0,0,.7);
    color: #ffffff;
    font-size: 12px;
    z-index: 77;
    text-align: center;
  }
</style>
