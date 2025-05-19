<template>
  <div class="container">
    <div class="section">
      <div>
        메인메뉴 설정
        <button @click="mainMenuAdd" class="icon-button">+</button>
      </div>

      <div
        v-for="(menu) in menuList"
        :key="menu.mainmenu_id"
        class="menu-item"
        @mouseenter="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, true)"
        @mouseleave="menu.subYn === 'Y' && showDropdown(menu.mainmenu_id, false)"
      >
        <ul class="menu-list">
          <li v-if="!menu.addYn">
            {{ menu.mainmenu_name }}
            <button @click="subMenuAdd(menu.mainmenu_id)" class="miniAddButton">+</button>
            <button @click="removeMain(menu.mainmenu_id)" class="miniXButton">X</button>
            <ul class="submenu-list">
              <li v-for="sub in menu.subMenuList" :key="sub.mainmenu_id">
                <template v-if="!sub.addYn">
                  서브메뉴 : {{ sub.submenu_name }}
                  <button @click="removeSub(sub.mainmenu_id,sub.submenu_id)" class="miniXButton">X</button>
                </template>
                <template v-else>
                  서브메뉴 : <input v-model="sub.submenu_name" placeholder="제목을 입력해주세요" />
                  <button @click="subMenuSaveClick(sub)" class="icon-button">SAVE</button>
                </template>
              </li>
            </ul>
          </li>

          <li v-else>
            <input v-model="menu.mainmenu_name" placeholder="제목을 입력해주세요" />
            <button @click="menuSaveClick(menu)" class="icon-button">SAVE</button>
          </li>
        </ul>
      </div>
    </div>

    <button @click="testBt" class="icon-button">X</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@store/auth.js';
import utils from '@js/utils.js';
import axios from 'axios';

const authStore = useAuthStore();
authStore.syncWithLocalStorage();

const activeDropdownId = ref(null);
const menuList = ref([]);


// 메인 메뉴 목록 불러오기
const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/menu', '');
  menuList.value = result.result;
};

// 드롭다운 토글
const showDropdown = (menuId, show) => {
  activeDropdownId.value = show ? menuId : null;
};

// 메인 메뉴 추가
const mainMenuAdd = () => {
  const maxId = Math.max(...menuList.value.map(item => item.mainmenu_id), 0);
  menuList.value.push({
    mainmenu_id: maxId + 1,
    mainmenu_name: '',
    subYn: 'N',
    addYn: true,
    subMenuList: [],
  });
};

// 서브 메뉴 추가
const subMenuAdd = (mainmenu_id) => {
  const index          = menuList.value.findIndex(menuList => menuList.mainmenu_id == mainmenu_id);
  const orgSubMenuList = menuList.value[index].subMenuList

  if(!orgSubMenuList){
    menuList.value[index].subMenuList = [{
        submenu_id: 1,
        submenu_name: "",
        mainmenu_id: mainmenu_id,
        addYn: true,
      }];
  }else{
    const maxId = Math.max(...menuList.value[index].subMenuList.map(subMenuList => subMenuList.submenu_id), 0) + 1;
    console.log("maxId",maxId);
    const val = {
      submenu_id: maxId,
      submenu_name: "",
      mainmenu_id: mainmenu_id,
      addYn: true,
    };
    menuList.value[index].subMenuList.push(val);
  }
};

// 메인 메뉴 저장
const menuSaveClick = async (menu) => {
  const val = {
    mainmenu_id: menu.mainmenu_id,
    mainmenu_name: menu.mainmenu_name,
    subYn: menu.subYn,
    addYn: menu.addYn,
  };
  const result = await utils.aSyncPostApi('/menu', val);
  if (result.statusCode === 200) {
    menu.addYn = false;
  }else{
    utils.showAlert('error',"추가실패");
  }
};
// 서브 메뉴 저장
const subMenuSaveClick = async (sub) => {
  
  console.log("sub",sub);

  const result = await utils.aSyncPostApi('/subMenu', sub);

  if (result.statusCode === 200) {
    sub.addYn = false;
  }else{
    utils.showAlert('error',"추가실패");
  }
  // const val = {
  //   mainmenu_id: menu.mainmenu_id,
  //   mainmenu_name: menu.mainmenu_name,
  //   subYn: menu.subYn,
  //   addYn: menu.addYn,
  // };
  // const result = await utils.aSyncPostApi('/menu', val);
  // if (result.statusCode === 200) {
  //   menu.addYn = false;
  // }else{
  //   utils.showAlert('error',"추가실패");
  // }
};

// 메인메뉴 삭제
const removeMain = async(mainmenu_id) => {
  
  const index = menuList.value.findIndex(menuList => menuList.mainmenu_id == mainmenu_id);

  const result = await axios.delete(`/api/menu/${mainmenu_id}`);

  if (result.status === 200) {
    menuList.value.splice(index, 1);
  }else{
    utils.showAlert('error',"삭제실패");
  }
};

// 서브메뉴 삭제
const removeSub = async(mainmenu_id,submenu_id) => {

  const mainIndex = menuList.value.findIndex(menuList => menuList.mainmenu_id == mainmenu_id);
  const subIndex = menuList.value[mainIndex].subMenuList.findIndex(subMenuList => subMenuList.submenu_id == submenu_id);

  const result = await axios.delete(`/api/subMenu/${mainmenu_id}/${submenu_id}`);
  
  if (result.status === 200) {
    menuList.value[mainIndex].subMenuList.splice(subIndex, 1);
  }else{
    utils.showAlert('error',"삭제실패");
  }
};

// 테스트 버튼 클릭 (디버그용)
const testBt = () => {
  console.log('menuList', menuList.value);
};


onMounted(fetchItems);
</script>

<style scoped>
.container {
  height: 100%;
  padding: 10px;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.menu-item {
  height: 100%;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list > li {
  margin-bottom: 10px;
  font-weight: bold;
}

.submenu-list {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}

.submenu-list > li {
  margin-bottom: 5px;
  font-weight: normal;
}

.miniAddButton {
  background-color: #4caf50;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
}

.miniXButton {
  background-color: #f44336;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
}

.icon-button {
  background: #ccc;
  height: 16px;
  width: 32px;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
}
</style>
