
백그라운드 컬러  :  --background: #e3ddff;
수정 #d2dfff
수정 화이트

Vue2
data	반응형 상태 정의	초기 상태 정의 및 템플릿에서 사용.
methods	이벤트 처리 및 로직 정의	상태 변경 및 사용자 동작 처리.
computed	계산된 값 정의	상태를 기반으로 동적 값 생성 및 캐싱.
watch	상태 변화 감지	상태 변화에 따른 부수 효과 수행(API 호출 등).

Vue3 부터는
모두 setup 내에서 정의

생명주기 훅 
onBeforeMount	컴포넌트가 DOM에 마운트되기 직전 실행.	초기 데이터 준비, 로깅.
onMounted	컴포넌트가 DOM에 마운트된 후 실행.	데이터 로딩, DOM 초기화, API 호출.
onBeforeUpdate	컴포넌트가 업데이트되기 직전 실행.	업데이트 직전 로직 실행.
onUpdated	컴포넌트가 업데이트된 후 실행.	DOM 업데이트 후 작업.
onBeforeUnmount	컴포넌트가 DOM에서 제거되기 직전 실행.	리소스 정리, 이벤트 해제.
onUnmounted	컴포넌트가 DOM에서 제거된 후 실행.	타이머 해제, API 연결 종료, 데이터 정리.

ref를 사용하는 목적
값 변화 즉시 UI 업데이트:

A4용지 사이즈 px
792px x 1123px


// 로컬 HTTP서버 실행
http-server -p 8082
