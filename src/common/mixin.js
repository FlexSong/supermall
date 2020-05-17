import {debounce} from "./util";
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMixin ={
  data(){
    return {
      itemImageListener:null,
      refresh:null,
    }
  },
  mounted(){
    this.refresh = debounce(this.$refs.scroll.refresh,50);
    this.itemImageListener = ()=>{
      this.refresh();
    }
    this.$bus.$on('itemImageLoad',this.itemImageListener);
  }
};
export const backTopMixin={
  data(){
    return {
      isShowBackTop: false,
    }
  },
  components:{
    BackTop
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,300);
    },
  }
};
