<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" ></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
      <detail-comment-info :comment="comment" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommends"></goods-list>
    </scroll>
      <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import Scroll from "components/common/scroll/Scroll";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import {itemListenerMixin,backTopMixin} from 'common/mixin';
  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
  import {mapActions} from 'vuex';
  import {debounce} from "common/util";
  export default {
    name: "Detail",
    data(){
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        comment:{},
        recommends:[],
        getThemeTopYs:null,
        themeTopYs:[],
        currentIndex:0,
      }
    },
    mixins:[itemListenerMixin,backTopMixin],
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
    },
    created() {
      this.iid = this.$route.params.iid;
      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res=>{
        const data = res.result;
        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages;
        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        //3.获取商铺信息
        this.shop = new Shop(data.shopInfo);
        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;
        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        //6获取评论信息
        if(data.rate.cRate!=0){
          this.comment = data.rate.list[0];
        };
        this.getThemeTopYs = debounce(()=>{
          console.log('---');
          this.themeTopYs=[];
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.param.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
          console.log(this.themeTopYs);
        },200)

      });
      getRecommend().then(res=>{
        this.recommends = res.data.list
      });
    },
    mounted() {
    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImageListener);
    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.refresh();
        this.getThemeTopYs();
      },
      titleClick(index){
       this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200);
      },
      contentScroll(position){
        let length = this.themeTopYs.length;
        for(let i = 0;i<length;i++){
         if((this.currentIndex!=i)&&(i<length-1&&-position.y>=this.themeTopYs[i]&&-position.y<this.themeTopYs[i+1]
           ||i==length-1&&-position.y>=this.themeTopYs[i])){
           this.currentIndex = i;
           this.$refs.nav.currentIndex=this.currentIndex;
         }
        }
        //判断backtop是否显示
        this.isShowBackTop = (-position.y) >= 1000;
      },
      addToCart(){
        //获取购物车需要展示的信息
          const product ={};
          product.image = this.topImages[0];
          product.title = this.goods.title;
          product.desc = this.goods.desc;
          product.price = this.goods.realPrice;
          product.iid = this.iid;
          //将商品添加到购物车中
         /* this.$store.dispatch('addCart',product).then(res=>{
            console.log(res);
          });*/
         this.addCart(product).then(res=>{
           console.log(" Detail点击了购物车")
            this.$toast.show(res,2000);
         })
      }
    }
  }
</script>

<style scoped>
  #detail{
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>
