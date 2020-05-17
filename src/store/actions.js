import {ADD_TO_CART,ADD_COUNTER} from "./mutations-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //查找数组是否有该商品
      let oldProduct = context.state.cartList.find(item => {
        return item.iid === payload.iid
      });
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct);
        resolve('商品加一');
      } else {
        context.commit(ADD_TO_CART, payload);
        resolve('添加购物车');
      }
    })

  }
}
