<template>
  <footer :class="footer">

    <hr style="width:100%">

    <div>      
      <a>상호명 : WonWear </a> <br>
      <a>contact : 010-7338-4228 </a> <br>
      <a>카카오뱅크 : 3333-09-489-2987 </a>
    </div>
  </footer>
</template>

<style scoped>
  a{
    size: 16px;
    color: black;
  }
  h1{
    color: black;
  }

  footer {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180px;
    background-color: white;
    color: white;
    display: flex;
    align-items: center;
    z-index: 1000;
    flex-direction: column; /*세로로 정렬*/
    height: 180px;
  }

  .topFixed{
    height : 100%;
    width: 100%;
    display: flex;
    align-items: center;          /* 수직 중앙 정렬 */
    justify-content: space-between
  }
  .topFixed-items {
    display: inline-block;        /* span을 inline-block으로 설정 */
    vertical-align: middle;       /* 텍스트와 아이콘이 수직으로 맞춰지도록 설정 */
  }
  .topFixed-items a{
    margin : 5px;
  }
  .centerFixed{
    height : 100%;
    display: flex;
    align-items: center;          /* 수직 중앙 정렬 */
    justify-content: center;      /* 수평 중앙 정렬 */
  }
  .mainLogo{
    display: inline-block;        /* span을 inline-block으로 설정 */
    vertical-align: middle;       /* 텍스트와 아이콘이 수직으로 맞춰지도록 설정 */
    height: 100px;
    width: 100px;
    cursor: pointer;

  }
  .bottomFixed{
    height : 100%;
    display: flex;
    align-items: center;          /* 수직 중앙 정렬 */
    justify-content: center;      /* 수평 중앙 정렬 */

  }
  .bottomFixed a  {
    margin : 10px;
  }
  .bottomFixed .menu-item{
    position: relative;   /* dropdown의 기준점 */
    height: 30px;         /* 메뉴 아이템 높이 고정 */
    color: black;
    margin : 5px;
    cursor: pointer;
  }
  .dropdown {
    position: absolute;
    top: 100%;            /* menu-item 바로 아래에 붙음 */
    left: 0;
    background: #ebebeb;
    list-style: none;
    padding: 10px 0;
    margin: 0;
    width: 150px;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    z-index: 10;
  }
  /* 페이드＋슬라이드 애니메이션 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.2s ease;
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
