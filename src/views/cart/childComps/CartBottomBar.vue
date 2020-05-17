<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :isCheck="isSelectAll" @click.native="checkAll"></check-button>
      <span class="spanMargin">全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="account">
      去计算{{checkLength}}
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex';
  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
       return '￥' + +this.cartList.filter(item=>{
          return item.checked;
        }).reduce((preValue,item)=>{
          return preValue+item.price*item.count;
        },0).toFixed(2);
      },
      checkLength(){
        return this.cartList.filter(item=>{
          return item.checked;
        }).length;
      },
      isSelectAll(){
        if(this.cartList.length==0){
          return false;
        }
       return !this.cartList.find(item=>{
          return !item.checked;
        })
      }
    },
    methods:{
      checkAll(){
        if(this.isSelectAll){//全选
          this.cartList.forEach(item=>{
            item.checked = false;
          })
        }else{
          this.cartList.forEach(item=>{
            item.checked = true;
          })
        }
      },
      account(){
        if(!this.isSelectAll){
          this.$toast.show('请选择商品',2000);
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    background-color: #eee;
    height: 40px;
    position: relative;
    width: 100%;
    display: flex;
    font-size: 12px;
    align-items: center;
  }
  .check-content{
    display: flex;
    padding-left: 3px;
    width: 60px;
  }
  .price{
    flex:1;
  }
  .calculate{
    width: 90px;
    height: 40px;
    background-color: red;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
  }
</style>
