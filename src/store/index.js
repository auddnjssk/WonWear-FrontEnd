// store/index.js
import { createStore } from 'vuex';
import * as utils from "@js/utils.js";

export default createStore({
  state: {
    // 상태를 저장하는 곳
    userName: '',
    userPicture: '',
    isLoggedIn: false,
  },
  mutations: {
    // 상태를 변경하는 동기 함수
    setUserData(state, { userName, userPicture }) {
      console.log("index!!!",userName, userPicture);
      state.userName = userName;
      state.userPicture = userPicture;
      state.isLoggedIn = true;
    },
    clearUserData(state) {
      state.userName = '';
      state.userPicture = '';
      state.isLoggedIn = false;

      utils.deleteCookie('googleAccess');
      utils.deleteCookie('googleRefresh');
    }
  },
  actions: {
      // 비동기 작업을 처리하는 함수
    login({ commit }, { userName, userPicture }) {
      // 예를 들어, API 요청 후 로그인 처리
      commit('setUserData', { userName, userPicture });
    },
    logout({ commit }) {
      commit('clearUserData');
    }
  },
  getters: {
    // 상태 값을 계산해서 반환하는 함수
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    getUserData(state) {
      return {
        userName: state.userName,
        userPicture: state.userPicture
      };
    }
  },
});
