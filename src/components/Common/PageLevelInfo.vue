<template>
  <div class="flex flex-col items-center justify-center py-10">
    <h2 class="text-lg font-medium mb-6">{{ subMenu }}</h2>

    <div class="flex flex-col items-center space-y-8 w-full">
      <div
        v-for="(parent) in parentCategories"
        :key="parent.cate_no"
        class="w-full text-center"
      >
        <!-- 부모 카테고리 -->
        <div
          class="text-base font-semibold cursor-pointer mb-2"
          @click="menuClick(parent.cate_no)"
        >
          {{ parent.cate_name }}
        </div>

        <!-- 자식 카테고리: 가로 정렬 -->
        <div class="flex justify-center space-x-6 text-sm text-gray-600">
          <div
            v-for="child in childCategories"
            :key="child.cate_no"
            class="cursor-pointer hover:underline"
            @click="menuClick(child.cate_no)"
          >
            {{ child.cate_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
const props = defineProps({
  cateNo: String,
})

import { ref,onMounted } from 'vue';
import utils from '@js/utils.js';
import { useRouter } from 'vue-router'

const router = useRouter();
const categoryList = ref([]);
const parentCategories = ref([]);
const childCategories = ref([]);

const fetchItems = async() => {
  const result = await utils.aSyncGetApi('/category', '');
  
  const resultData =  result.result;

  categoryList.value = resultData.filter(categoryList => categoryList.cate_no == props.cateNo);

  const parentCateNo = categoryList.value[0].parent_cate_no;

  if(!categoryList.value[0].parent_cate_no){
    categoryList.value = resultData.filter(categoryList => categoryList.cate_no == props.cateNo || categoryList.parent_cate_no == props.cateNo );

    const main = categoryList.value.find(c => c.cate_no == props.cateNo);
    localStorage.setItem('meinMenu',main.cate_name);
    localStorage.setItem('subMenu',null);
    
  }else{
    categoryList.value = resultData.filter(categoryList => categoryList.cate_no == parentCateNo || categoryList.parent_cate_no == parentCateNo );
    const main = categoryList.value.find(c => c.cate_no == parentCateNo);
    const sub = categoryList.value.find(c => c.cate_no == props.cateNo);
    localStorage.setItem('meinMenu',main.cate_name);
    localStorage.setItem('subMenu',sub.cate_name);
  }

  parentPush();
  childPush();
}

const parentPush = async() => {
  parentCategories.value = categoryList.value.filter(c => !c.parent_cate_no);
}

const childPush = () => {
  for (const category of categoryList.value) {
    if (category.parent_cate_no) {
        childCategories.value.push(category)
    }
  }
}

const menuClick = async(cateNo) => {
  const findVal = categoryList.value.find(c => c.cate_no == cateNo);
  
  if(findVal.parent_cate_no){
    const parentVal = categoryList.value.find(c => c.cate_no == findVal.parent_cate_no);
    localStorage.setItem('meinMenu',parentVal.cate_name);
    localStorage.setItem('subMenu',findVal.cate_name);

  }else{
    localStorage.setItem('meinMenu',findVal.cate_name);
    localStorage.setItem('subMenu',null);
  }

  router.push(`/productPage/${cateNo}`)
}


onMounted(() => {
  fetchItems();
});
</script>
