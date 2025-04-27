<template>
  <header :class="{ shrink: isShrunk }">

    <div class="topFixed">
      <div class="centerFixed">
        <img @click="logoClick" class="mainLogo" :src="backgroundImage" alt="background" />
      </div>
      <div class="topFixed-items">
        <a>로그인</a>  
        <!-- 로그아웃 정보수정 -->
        <a>회원가입</a>
        <a>마이페이지</a>
        <a>장바구니</a>
      </div>
    </div>

    <div class="bottomFixed">
      <div 
        v-for="menu in menuList" 
        :key="menu.mainmenu_id"
        class="menu-item" 
        @mouseenter="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, true)"
        @mouseleave="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, false)"
      >
        <span data-type="main" @click="menuClick">{{ menu.mainmenu_name }}</span>

        <transition  v-if="menu.subYn === 'Y' && menu.subMenuList && activeDropdownId === menu.mainmenu_id"
          name="fade-slide">
          <ul class="dropdown">
            <li v-for="sub in menu.subMenuList" :key="sub.mainmenu_id" data-type="sub" @click="menuClick"> {{ sub.submenu_name }}</li>
          </ul>
        </transition>
      </div>
    </div>
  </header>

  <hr>

</template>

<script >
import { ref, onMounted, onUnmounted,reactive} from 'vue';
import WONWEARLogo from '@assets/WONWEARLogo.png';
import { useRouter } from 'vue-router'; // useRouter 훅 임포트
import utils from '@js/utils.js'


export default {
  name: 'AppHeader',
  setup() {

    const backgroundImage = WONWEARLogo;
    const activeDropdownId = ref(null);
    const dropdownMap = reactive({});

    const menuList = ref([]);    

    const isShrunk = ref(false)
    const router = useRouter();

// 호출

    const fetchItems = async() => {
      const result = await utils.aSyncGetApi('/menu', '');
      menuList.value = result.result;
      console.log("menuList.value",menuList.value);
    }

    const showDropdown = (menuId, show) => {
      activeDropdownId.value = show ? menuId : null;
    }
    
    const menuClick = async(event) => {
      const type = event.target.dataset.type;
      const mainSpan = event.target.closest('.dropdown')?.previousElementSibling;

      let sub  = '';
      let main = '';

      if (type === "main") {
        main = event.target.textContent.trim();
      }else if (type === "sub"){
        main = mainSpan?.innerText.trim() || '';
        sub = event.target.textContent.trim();
      }

      router.push(`/productPage/${main}/${sub}`);
    };


    const logoClick = () => {
      router.push('/'); 

    };

    const handleScroll = () => {
      isShrunk.value = window.scrollY > 50 // 50px 이상 스크롤 시 줄어듦
    }

    onMounted(() => {
      fetchItems();

      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      backgroundImage,
      menuClick,
      logoClick,
      menuList,
      showDropdown,
      dropdownMap,
      activeDropdownId,
    };
  },
};
</script>

<style scoped>
  a{
    color: black;
  }
  h1{
    color: black;
  }

  header {
    top: 0;
    left: 0;
    width: 100%;
    height: 180px;
    background-color: white;
    color: white;
    display: flex;
    align-items: center;
    transition: height 0.3s ease;
    z-index: 1000;
    flex-direction: column; /*세로로 정렬*/
  }

  header.shrink {
    height: 120px;
    position: fixed;
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
