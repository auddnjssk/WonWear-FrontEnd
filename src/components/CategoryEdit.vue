<template>
  <div class="container">
    <div class="section">
      <div>
        메인메뉴 설정
        <button @click="mainAdd" class="icon-button">+</button>
      </div>
      <div v-for="(parent) in categoryList.filter(c => c.parent_cate_no === null)" :key="parent.cate_no" class="menu-item">
        <ul class="menu-list">
          <li v-if="!parent.addYn">
            {{ parent.cate_name }}
            <button @click="subMenuAdd(parent.cate_no)" class="miniAddButton">+</button>
            <button @click="removeCategory(parent.cate_no)" class="miniXButton">X</button>

            <ul class="submenu-list">
              <li v-for="child in categoryList.filter(c => c.parent_cate_no === parent.cate_no)" :key="child.cate_no">
                <div v-if="!child.addYn">
                  <a>{{ child.cate_name }}</a>
                  <button @click="removeCategory(child.cate_no)" class="miniXButton">X</button>
                </div>
                <div v-else>
                  <input v-model="child.cate_name" placeholder="제목을 입력해주세요" />
                  <button @click="menuSaveClick(child)" class="icon-button">SAVE</button>
                  <button @click="removeCategory(child.cate_no)" class="miniXButton">X</button>
                </div>
              </li>
            </ul>
          </li>

          <li v-else>
            <input v-model="parent.cate_name" placeholder="제목을 입력해주세요" />
            <button @click="menuSaveClick(parent)" class="icon-button">SAVE</button>
            <button @click="removeCategory(parent.cate_no)" class="miniXButton">X</button>
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

const categoryList = ref([]);


// 메인 메뉴 목록 불러오기
const fetchItems = async () => {
  const result = await utils.aSyncGetApi('/category', '');
  categoryList.value = result.result;
  console.log("categoryList",categoryList.value);
};

// 메인 메뉴 추가
const mainAdd = () => {
  const maxId = Math.max(...categoryList.value.map(item => item.cate_no), 0);

  categoryList.value.push({
    cate_no: maxId + 1,
    cate_name: '',
    addYn: true,
    parent_cate_no : null,
  });


};

// 서브 메뉴 추가
const subMenuAdd = (cate_no) => {

  console.log("sub add",cate_no);

  const val = {
    parent_cate_no: cate_no,
    cate_name: "",
    addYn: true,
  };
  categoryList.value.push(val);
};

// 메인 메뉴 저장
const menuSaveClick = async (category) => {

  console.log("menuClick ",category);

  const result = await utils.aSyncPostApi('/category', category);

  category.addYn = false;

  
  console.log("menu Add",result);

};
// 메인메뉴 삭제
const removeCategory = async(cate_no) => {
  
  const result = await axios.delete(`/api/category/${cate_no}`);
  console.log("menu Add",result);
  // if (result.status === 200) {
  //   menuList.value.splice(index, 1);
  // }else{
  //   utils.showAlert('error',"삭제실패");
  // }
};

// // 서브메뉴 삭제
// const removeSub = async(mainmenu_id,submenu_id) => {

//   const mainIndex = menuList.value.findIndex(menuList => menuList.mainmenu_id == mainmenu_id);
//   const subIndex = menuList.value[mainIndex].subMenuList.findIndex(subMenuList => subMenuList.submenu_id == submenu_id);

//   const result = await axios.delete(`/api/subMenu/${mainmenu_id}/${submenu_id}`);
  
//   if (result.status === 200) {
//     menuList.value[mainIndex].subMenuList.splice(subIndex, 1);
//   }else{
//     utils.showAlert('error',"삭제실패");
//   }
// };

// 테스트 버튼 클릭 (디버그용)
const testBt = () => {
  console.log('menuList', categoryList.value);
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
