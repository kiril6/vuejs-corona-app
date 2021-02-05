// Use of VUEX a state management for data

import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reports: null,
  },
  getters: {
    getItems: (state) => {
      return state.reports;
    },
  },
  mutations: {
    setItems: (state) => {
      let reports = [];
      db.collection(localStorage.getItem('access') || 'empty')
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          reports = [];
          snapshot.forEach((doc) => {
            reports.push({
              id: doc.id,
              title: doc.data().title,
              date: doc.data().date,
              timeOfDay: doc.data().timeOfDay,
              location: doc.data().location,
              checked: doc.data().checked,
            });
          });
          state.reports = reports;
        });
    },
  },
  actions: {
    setItems: (context) => {
      context.commit("setItems");
    },
  },
});
