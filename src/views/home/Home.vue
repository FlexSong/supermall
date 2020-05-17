<template>
  <div id="home">
   <nav-bar class="home-nav">
     <div slot="center">购物街</div>
   </nav-bar>
 <tab-control class="tab-control" :titles="['流行','新款','精选']"
                 @tabClick="tabClick" ref="tabControl1"
                  v-show="isTabFixed"
                 ></tab-control>
    <scroll class="content"
            ref="scroll" :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick" ref="tabControl2" ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar"
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import {itemListenerMixin,backTopMixin} from "common/mixin";

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  export default {
    name: "Home",
    data(){
      return {
        banners:[],
        recommends: [],
        goods:{
          pop:{page:0, list:[]},
          new:{page:0,list:[]},
          sell:{page:0,list:[]}
        },
        currentType: 'pop',
        isTabFixed: false,
        tabOffsetTop:0,
        saveY:0,
      }
    },
    mixins:[itemListenerMixin,backTopMixin],
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
    },
    computed:{
      showGoods(){
      //  console.log(this.currentType)
       // console.log(this.goods[this.currentType].list);
        return this.goods[this.currentType].list;
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
      this.$bus.$off('itemImageLoad',this.itemImageListener);
    },
    created() {
      //请求多个数据
      this.getHomeMultidata()
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
    },

    methods:{
        btnClick(){
        },
      //监听轮播图加载完成
      swiperImageLoad(){
       this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;

      },
      //事件监听方法
      loadMore(){
        this.getHomeGoods(this.currentType);
      },
      tabClick(index){
        console.log(index);
        switch (index) {
          case 0 :
            this.currentType = 'pop';
            break;
          case 1 :
            this.currentType = 'new';
            break;
          case 2 :
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },

      contentScroll(position){
        //判断backtop是否显示
        this.isShowBackTop = (-position.y) >= 1000;
        // 决定tabcontrol是否吸顶
        this.isTabFixed = (-position.y) >= this.tabOffsetTop;
      },

      //发送网络请求
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        }).catch(err=>{
          console.log(err);
        });
      },
      getHomeGoods(type){
        const page =this.goods[type].page+1;
        getHomeGoods(type,page).then(res=>{
          this.goods[type].page = page ;
          this.goods[type].list.push(...res.data.list);
          this.$refs.scroll.finishPullUp();
        });
      },

    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
  }
.home-nav{
  background-color: var(--color-tint);
  color: #ffffff;
  width: 100%;
}
  .content{
    overflow: hidden;
    position: absolute;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
.tab-control{
  position: relative;
  z-index: 9;
}
</style>
