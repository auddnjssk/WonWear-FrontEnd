const { defineConfig } = require('@vue/cli-service')
const path = require('path'); // path 모듈을 가져오기

let backUrl       = process.env.VUE_APP_BACK_URL;        // JAVA서버 포트
let httpServerUrl = process.env.VUE_APP_HTTP_SERVER_URL; // HTTP서버 포트

module.exports = {
  
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // '@'를 'src'로 매핑
        '@components': path.resolve(__dirname, 'src/components'),
        '@common': path.resolve(__dirname, 'src/components/Common'),
        '@sideMenu': path.resolve(__dirname, 'src/components/SideMenu'),
        '@customerComp': path.resolve(__dirname, 'src/components/CustomerComp'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@js': path.resolve(__dirname, 'src/components/js'),
        '@pop': path.resolve(__dirname, 'src/components/Pop'),
        '@store': path.resolve(__dirname, 'src/store'),
        "pdfjs-dist/build/pdf.worker.entry": "pdfjs-dist/legacy/build/pdf.worker.entry",
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: backUrl, // 프록시할 백엔드 서버의 주소 (Spring Boot 서버)
        pathRewrite: { '^/api': '' }, // /api 경로를 제거

        changeOrigin: true, // 대상 서버로의 호스트 헤더를 변경
        secure: false, // HTTPS가 아닌 경우 false로 설정
      },
      '/api/pdf': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        pathRewrite: { '^/api/pdf': '' },
      },
      '/images': {
        target: httpServerUrl, // HTTP 서버의 주소
        changeOrigin: true,
        pathRewrite: {
          '^/images': '', // `/images`를 제거하고 실제 경로로 요청
        },
      },
        
      // '/oauth/google': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   pathRewrite: { '^/oauth/google': '/oauth/google' },
      // },
    },
  },
};

