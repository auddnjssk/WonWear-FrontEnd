<template>
  <div class="ProductPage">
    <div class = "menuLine">
      <a>HOME > 주문 목록</a>
    </div>
    <div class = "subject">
      <a>장바구니</a>
    </div>
    <!-- ProductPage Content -->
    <div class="glb-contents">
        <div class="cart-table">
          <table class ="itemTable">
            <thead>
              <tr>
                <th><input type="checkbox" v-model="allChecked" @change="toggleAll" /></th>
                <th>주문자ID</th>
                <th>받는사람 이름</th>
                <th>받을 주소</th>
                <th>진행상태</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              <tr  v-for="orderItem in orderList" :key="orderItem.index">
                <td><input type="checkbox" v-model="orderItem.checked" @change="toggleAll" /></td>
                <td>{{ orderItem.user_id }}</td>
                <td>{{ orderItem.receiver_name }}</td>
                <td>{{ orderItem.address1 }}</td>
                <td>{{ orderItem.status }}</td>
                <td>010{{ orderItem.receiver_phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
    <!-- ProductPage ContentEnd -->
  </div>
</template>

<script setup>
  import '@assets/globStyles.css'
  import { ref, onMounted } from 'vue';
  import utils from '@js/utils.js';

  const orderList = ref([]);

  // function formatPrice(value) {
  //   return `${value.toLocaleString()}원`
  // }
  // API 호출
  const fetchItems = async () => {
    const result = await utils.aSyncGetApi('/order', ``);
    console.log("result",result);
    orderList.value = result.result;
  };

  onMounted(() => {
    fetchItems();
  });
</script>


<style scoped>

.itemPriceTable {
  margin-top: 50px;
  width: 100%;
  border : 1px solid black;
}
.subject{
    display: block;
    padding: 10px 0 10px;
    text-align: center;
}
.exposeCont {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.tripleImage {
  cursor: pointer;
  flex: 0 0 calc(33.333% - 20px);
  box-sizing: border-box;
  background: #eee;
  padding: 20px;
  text-align: center;
}

.exposeImagesCont {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.exposeImagesCont img {
  width: 100%;
  height: 400px;
  margin-bottom: 10px;
}

.exposeImagesCont a {
  color: black;
}

.exposeImagesCont hr {
  border: none;
  border-top: 2px solid #ccc;
  margin: 5px 0;
  width: 80%;
}

.itemTable{
  width: 100%;
  /* border : 1px solid black; */
  border: 1px solid #e6e6e6;
}
.total-box{
  width: 100%;
  /* border : 1px solid black; */
  border-top: 1px solid #e6e6e6;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}

.Buy-Button{
  margin-top: 10px;
}
</style>