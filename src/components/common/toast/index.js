import Toast from "./Toast";
const obj = {}
obj.install= function (Vue) {
 const ToastConstuctor = Vue.extend(Toast);
 const toast = new ToastConstuctor();
 toast.$mount(document.createElement('div'));
 document.body.appendChild(toast.$el);
 Vue.prototype.$toast = toast;
};
export default obj
