<template>
<div class="max-w-6xl mx-auto px-4 py-12">
  <!-- 제목 -->
  <h1 class="text-center text-2xl font-semibold mb-8">마이 페이지</h1>

  <!-- 유저 프로필 및 인사 -->
  <div class="bg-gray-100 p-6 rounded-md flex items-center justify-between mb-8">
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gray-300 rounded-full" />
      <p class="text-gray-700">
        WonWear를 이용해 주셔서 감사합니다. <strong class="text-black">서명원</strong>님은 <strong class="text-black">[일반회원]</strong> 회원입니다.
      </p>
    </div>
    <a href="#" class="text-blue-500 underline text-sm">회원정보확인</a>
  </div>

  <!-- 간단 요약 -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm text-center">
    <div class="border p-4 rounded">
      <p class="text-gray-500 mb-1">가용적립금</p>
      <p class="font-semibold text-lg">3,000원</p>
    </div>
    <div class="border p-4 rounded">
      <p class="text-gray-500 mb-1">사용적립금</p>
      <p class="font-semibold text-lg">0원</p>
    </div>
    <div class="border p-4 rounded">
      <p class="text-gray-500 mb-1">총적립금</p>
      <p class="font-semibold text-lg">4,000원</p>
    </div>
    <div class="border p-4 rounded">
      <p class="text-gray-500 mb-1">총주문</p>
      <p class="font-semibold text-lg">104,000원(1회)</p>
    </div>
  </div>

  <!-- 최근 주문 상태 -->
  <div class="bg-white border rounded p-6 mb-8">
    <h2 class="text-lg font-semibold mb-4">나의 주문처리 현황 <span class="text-sm text-gray-400">(최근 3개월 기준)</span></h2>
    <div class="grid grid-cols-5 text-center text-sm text-gray-600">
      <div>
        <p class="font-bold text-lg text-black">0</p>
        <p>입금전</p>
      </div>
      <div>
        <p class="font-bold text-lg text-black">0</p>
        <p>배송준비중</p>
      </div>
      <div>
        <p class="font-bold text-lg text-black">3</p>
        <p>배송중</p>
      </div>
      <div>
        <p class="font-bold text-lg text-black">0</p>
        <p>배송완료</p>
      </div>
      <div>
        <p class="font-bold text-lg text-black">0</p>
        <p>취소</p>
      </div>
    </div>
  </div>

  <!-- 아이콘 메뉴 -->
  <div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-sm text-gray-700">
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">•••</p>
      <p class="font-semibold">ORDER</p>
      <p class="text-gray-500 text-xs mt-1">주문내역 조회</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">⚙️</p>
      <p class="font-semibold">PROFILE</p>
      <p class="text-gray-500 text-xs mt-1">회원 정보</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">❤️</p>
      <p class="font-semibold">WISH LIST</p>
      <p class="text-gray-500 text-xs mt-1">관심상품</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">%</p>
      <p class="font-semibold">MILEAGE</p>
      <p class="text-gray-500 text-xs mt-1">적립금</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">🎟️</p>
      <p class="font-semibold">COUPON</p>
      <p class="text-gray-500 text-xs mt-1">쿠폰</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">👍</p>
      <p class="font-semibold">LIKE</p>
      <p class="text-gray-500 text-xs mt-1">좋아요</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">📝</p>
      <p class="font-semibold">BOARD</p>
      <p class="text-gray-500 text-xs mt-1">게시판</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">📦</p>
      <p class="font-semibold">ADDRESS</p>
      <p class="text-gray-500 text-xs mt-1">배송 주소록</p>
    </div>
    <div class="border rounded p-6 hover:shadow-md">
      <p class="text-xl mb-2">💎</p>
      <p class="font-semibold">DEPOSITS</p>
      <p class="text-gray-500 text-xs mt-1">예치금</p>
    </div>
  </div>
</div>

</template>

<script>
import '@assets/globStyles.css'
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 18,
      tableName : "t_mail_form",
    };
  },
  setup() {
    
    const backgroundImage = 'https://placehold.co/1000x400?text=Background'
    const items = ref([]);
    const showList = ref(true);
    const showEditor = ref(false);

    // const fetchItems = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('t_mail_form')
    //       .select('*');
    //     if (error) {
    //       console.error('Error fetching data:', error);
    //     } else {
    //       items.value = data;
    //     }
    //   } catch (error) {
    //     console.error('Unexpected error:', error);
    //   }
    // };

    const formAdd = () => {
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
    };

    onMounted(() => {
      //fetchItems();
    });

    return {
      items,
      formAdd,
      showList,
      showEditor,
      backgroundImage
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
    goToPage(page) {
      this.currentPage = page; // 선택된 페이지로 이동
      console.log(`Moved to page: ${page}`);
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
    async listClick(FORM_ID) {
      this.formAdd();
      await nextTick();

      if (this.$refs.childRef && this.$refs.childRef.formIdInput) {
        this.$refs.childRef.formIdInput(FORM_ID,this.tableName);
      } else {
        console.warn("CKEditor reference is not available or formIdInput method is undefined.");
      }
    }
  }
};
</script>
