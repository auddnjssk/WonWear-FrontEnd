<template>
  <div style="  height: 100%;    padding: 10px;">
    <div class="section">
      <div>
         메인메뉴 설정  <button @click="mainMenuAdd(index)" style="background: #ccc; height: 16px; width: 16px; border: none; cursor: pointer;">+</button>
      </div>
      <div 
        v-for="menu in menuList" 
        :key="menu.mainmenu_id"
        class="menu-item" 
        @mouseenter="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, true)"
        @mouseleave="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, false)"
      >
        <ul class="menu-list">
          <li v-if="!menu.addYn">{{ menu.mainmenu_name }}
            <button @click="mainMenuAdd(index)" class ="miniAddButton">+</button>
            <button @click="removeMain(index)" class ="miniXButton">X</button>
            <ul class="submenu-list">
              <li v-for="sub in menu.subMenuList" :key="sub.mainmenu_id">
                서브메뉴 : {{ sub.submenu_name }}
                <button @click="removeSub(index)" class ="miniXButton">X</button>
              </li>
            </ul>
          </li>
          <li v-if="menu.addYn">
            <input v-model="menu.mainmenu_name" placeholder="제목을 입력해주세요">
            <button @click="menuSaveClick(index)" style="background: #ccc; height: 16px; width: 16px; border: none; cursor: pointer;">SAVE</button>
            <ul class="submenu-list">
              <li v-for="sub in menu.subMenuList" :key="sub.mainmenu_id">
                서브메뉴 : {{ sub.submenu_name }}
                <button @click="removeSub(index)" class ="miniXButton">X</button>
              </li>
            </ul>
          </li>
        </ul>

      </div>
    </div>
    <button @click="testBt()" style="background: #ccc; height: 16px; width: 16px; border: none; cursor: pointer;">X</button> 
  </div>
</template>

<script >
import { ref, onMounted, reactive} from 'vue';
import WONWEARLogo from '@assets/WONWEARLogo.png';
import { useAuthStore } from '@store/auth.js';
import { useRouter } from 'vue-router'; // useRouter 훅 임포트
import utils from '@js/utils.js'

export default {
  name: 'MenuEdit',
  setup() {

    const backgroundImage = WONWEARLogo;
    const activeDropdownId = ref(null);
    const dropdownMap = reactive({});

    const menuList = ref([]);    

    const router = useRouter();

    // 로그인체크 변수
    const loginStat = ref(null); 
    const adminYn = ref(null); 

    const custStat = ref();
    
    const authStore = useAuthStore();
    authStore.syncWithLocalStorage();
   

    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get('code');

    const fetchItems = async() => {
      const result = await utils.aSyncGetApi('/menu', '');
      menuList.value = result.result;
      console.log("menuList.value",menuList.value);
    }

    const showDropdown = (menuId, show) => {
      activeDropdownId.value = show ? menuId : null;
    }
    const mainMenuAdd = () => {
      const maxId = Math.max(...menuList.value.map(item => item.mainmenu_id));

      const val = {
        mainmenu_id :  maxId+1,
        mainmenu_name :  "",
        subYn : "N",
        addYn : true,
      }
      menuList.value.push(val);

      // activeDropdownId.value = show ? menuId : null;
    }
    const menuSaveClick = async() => {
      
      const addId = Math.max(...menuList.value.map(item => item.mainmenu_id));
      
      const val = {
        mainmenu_id :  menuList.value[addId-1].mainmenu_id ,
        mainmenu_name :  menuList.value[addId-1].mainmenu_name ,
        subYn : menuList.value[addId-1].subYn ,
        addYn : menuList.value[addId-1].addYn ,
      }
      console.log("menuList.value[addId]",val);
      await utils.aSyncPostApi('/menu', val);
    }
    
    const testBt = () => {
      console.log("menuList",menuList.value);
      // activeDropdownId.value = show ? menuId : null;
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

    onMounted(() => {
      fetchItems();
    })

    return {
      backgroundImage,
      menuClick,
      menuList,
      showDropdown,
      dropdownMap,
      activeDropdownId,
      code,
      loginStat,
      accessToken: authStore.accessToken,
      custStat,
      adminYn,
      mainMenuAdd,
      testBt,
      menuSaveClick,
    };
  },
};
</script>

<style scoped>

.topFixed-items a{
  cursor: pointer;
}
.section {
  display: flex;
  flex-direction: column;
  align-items: start;
  
}
.menu-item{
  
  height: 100%;
}
.menu-list {
  
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list > li {
  margin-bottom: 10px;
  font-weight: bold; /* 메인메뉴 강조 */
}

.submenu-list {
  list-style: none;
  padding-left: 20px; /* 들여쓰기 */
  margin-top: 5px;
}

.submenu-list > li {
  margin-bottom: 5px;
  font-weight: normal; /* 서브메뉴는 보통 */
}
.miniAddButton{
  background-color: #4CAF50; /* 초록색 */
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  line-height: 24px; /* 세로 가운데 정렬 */
  font-size: 14px;
}
.miniXButton{
  background-color: #f44336; /* 빨간색 */
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  line-height: 24px; /* 세로 가운데 정렬 */
  font-size: 14px;
}


</style>