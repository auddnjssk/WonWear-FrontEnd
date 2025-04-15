<template>
  <div class="main-page">
    <!-- title -->
    <div class="glb-titleCon">
      <div class="title">고객 관리</div>
      <button class="glb-button-title" @click="fn_custAddPop">
        고객 추가
      </button>
    </div>
    <!-- titleEnd -->

    <CustAddPop
      style="width: 100%; height: 100%;"
      v-if="showPopup"
      @fn_custAddPop="fn_custAddPop"
    />

    <!-- 컨텐츠 -->
    <div class="contents">
      <div v-if="showList">
        <!-- 테이블 형식으로 데이터 출력 -->
        <table v-if="paginatedData.length" class="data-table">
          <thead>
            <tr class="glb-table-head">
              <th>고객명</th>
              <th>전화번호</th>
              <th>카카오 ID</th>
              <th>구글 ID</th>
              <th>플래너</th>
              <th>예약 날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.FORM_ID">
              <td contenteditable="true">{{ item.cust_nm }}</td>
              <td contenteditable="true">{{ item.cust_tel }}</td>
              <td contenteditable="true">{{ item.cust_kaid }}</td>
              <td contenteditable="true">{{ item.cust_gooid }}</td>
              <td contenteditable="true">{{ item.planner_nm }}</td>
              <td contenteditable="true">{{ item.resv_dt_format }}</td>
            </tr>
          </tbody>
        </table>
        <div class="div-paging">
          <button
            class="glb-button-small"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            이전
          </button>
          <span
            class="paging-span"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </span>
          <button
            class="glb-button-small"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustAddPop from "../Pop/CustAddPop.vue";
import supabase from "../js/supabase.js";
import * as utils from "@js/utils.js";

export default {
  name: "CustomerManagement",
  components: {
    CustAddPop,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      showPopup: false,
      items: [],
      showList: true,
      showEditor: false,
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchItems() {
      try {
        const { data, error } = await supabase
          .from("t_customer_info")
          .select(`
            cust_cd,
            cust_nm,
            cust_kaid,
            cust_gooid,
            planner_nm,
            resv_dt,
            cust_tel,
            user_id
          `);
        if (error) {
          console.error("데이터 조회 중 오류:", error);
        } else {
          data.forEach((item) => {
            item.resv_dt_format = utils.dateFormmat(item.resv_dt);
          });
          this.items = data;
        }
      } catch (error) {
        console.error("예기치 않은 오류:", error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    fn_custAddPop(stat, custInfo) {
      if (stat === "save") {
        this.items.unshift(custInfo);
      }
      this.showPopup = !this.showPopup;
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>


<style>
.main-page {
  flex: 0 0 85%;
  width: 100%;
  height: 100%;
}
.contents {
  padding: 10px;
  width: 100%;
  height: auto;
}
.titleCon {
  display: flex;
  align-items: center;
  font-size: 35px;
  width: 100%;
  height: 10%;
}
.title {
  width: 100%;
}
.addBtn {
  width: 120px;
  height: 50px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.data-table tbody tr:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
.div-paging {
  text-align: center;
  margin-top: 10px;
}
.div-paging button {
  margin: 0 5px;
}
</style>
