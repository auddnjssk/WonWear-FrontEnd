// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null // 초기 값은 null
  }),
  actions: {
    syncWithLocalStorage() {
      const token = localStorage.getItem('accessToken');
      this.accessToken = token;
    },

    setAccessToken(token) {

      this.accessToken = token

      const now = new Date();

      const item = {
        value: token,
        expiry: now.getTime() + (60 * 1000)/12, // 현재 시간 + 1시간;
      };

      localStorage.setItem('accessToken', JSON.stringify(item));
    },
    /**
     * Refresh Token을 이용해 새로운 AccessToken 발급
     * @returns accessToken
     */
    async issueAccessToken() {
        try {
          const response = await fetch('/api/issueToken', { method: 'POST', credentials: 'include' });
          const data = await response.json();
          this.setAccessToken(data.accessToken); // 새로운 토큰 저장
          return data.accessToken;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          return null; // 갱신 실패 시 null 반환
        }
    },

    clearAccessToken() {
      this.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.setItem('adminYn',"");
    }
  }
});
