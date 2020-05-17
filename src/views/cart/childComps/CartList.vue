<template>
  <div class="cart-list">
    <scroll class="content1" ref="scroll">
      <cart-list-item v-for="(item,index) in cartList" :item="item" :key="index"></cart-list-item>
    </scroll>

  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";
  import CartListItem from "./CartListItem";
  import {mapGetters} from 'vuex';
  export default {
    name: "CartList",
    components:{
      Scroll,
      CartListItem
    },
    computed:{
      ...mapGetters(['cartList']),
    },
    activated() {
        this.$refs.scroll.refresh();
    }
  }
</script>

<style scoped>
  .cart-list{
    height: calc(100% - 44px - 49px - 40px);
  }
.content1{
  height: 100%;
  overflow: hidden;
}
</style>
