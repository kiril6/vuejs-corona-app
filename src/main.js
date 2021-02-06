import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics'
import VueTablerIcons from 'vue-tabler-icons';

Vue.config.productionTip = false;

// the package for icons
Vue.use(VueTablerIcons);

// configuration for firebase
let config = {
  apiKey: "AIzaSyCaeY8e5RJYMKiKbgMNO29-jpzsHJtNEJ0",
  authDomain: "corona-app-8b48a.firebaseapp.com",
  projectId: "corona-app-8b48a",
  storageBucket: "corona-app-8b48a.appspot.com",
  messagingSenderId: "697854206665",
  appId: "1:697854206665:web:430dc65e05ee6e54122318",
  measurementId: "G-Y94F5W938T"
};

firebase.initializeApp(config);
firebase.analytics();

export const db = firebase.firestore();

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
