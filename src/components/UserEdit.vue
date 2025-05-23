<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-center text-2xl font-semibold mb-10">회원 정보 수정</h1>

    <!-- 유저 인사 -->
    <div class="bg-gray-100 p-6 rounded-md flex items-center mb-10">
      <div class="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
      <p class="text-gray-700">
        기본 쇼핑몰을 이용해 주셔서 감사합니다. <strong class="text-black">서명원</strong>님은 <strong class="text-black">[일반회원]</strong> 회원입니다.
      </p>
    </div>

    <!-- 기본 정보 -->
    <form class="space-y-8">
      <div class="space-y-6">
        <!-- 아이디 -->
        <div>
          <label class="block text-sm font-medium mb-1">아이디</label>
          <input type="text" value="123456test7gm" class="w-full border rounded px-4 py-2" disabled>
        </div>

        <!-- 비밀번호 -->
        <div>
          <label class="block text-sm font-medium mb-1">비밀번호</label>
          <input type="password" class="w-full border rounded px-4 py-2" placeholder="영문+숫자 조합 4~16자">
        </div>

        <!-- 비밀번호 확인 -->
        <div>
          <label class="block text-sm font-medium mb-1">비밀번호 확인</label>
          <input type="password" class="w-full border rounded px-4 py-2">
        </div>

        <!-- 이름 -->
        <div>
          <label class="block text-sm font-medium mb-1">이름</label>
          <input type="text" value="서명원" class="w-full border rounded px-4 py-2">
        </div>

        <!-- 주소 -->
        <div>
          <label class="block text-sm font-medium mb-1">주소</label>
          <div class="flex gap-2 mb-2">
            <input type="text" placeholder="우편번호" class="w-1/3 border rounded px-4 py-2">
            <button class="bg-gray-200 px-4 py-2 rounded">주소찾기</button>
          </div>
          <input type="text" placeholder="기본주소" class="w-full border rounded px-4 py-2 mb-2">
          <input type="text" placeholder="상세주소 (선택입력가능)" class="w-full border rounded px-4 py-2">
        </div>

        <!-- 일반 전화 -->
        <div>
          <label class="block text-sm font-medium mb-1">일반전화</label>
          <div class="flex gap-2">
            <select class="border rounded px-4 py-2">
              <option>02</option>
              <option>031</option>
            </select>
            <input type="text" class="w-1/3 border rounded px-4 py-2">
            <input type="text" class="w-1/3 border rounded px-4 py-2">
          </div>
        </div>

        <!-- 휴대전화 -->
        <div>
          <label class="block text-sm font-medium mb-1">휴대전화</label>
          <div class="flex gap-2 mb-2">
            <select class="border rounded px-4 py-2">
              <option>010</option>
            </select>
            <input type="text" class="w-1/3 border rounded px-4 py-2">
            <input type="text" class="w-1/3 border rounded px-4 py-2">
          </div>
          <div class="flex items-center gap-4 text-sm">
            <label><input type="radio" name="sms" checked> 수신함</label>
            <label><input type="radio" name="sms"> 수신안함</label>
          </div>
          <p class="text-xs text-gray-500 mt-1">쇼핑몰에서 제공하는 유익한 정보 SMS로 받아보실 수 있습니다.</p>
        </div>

        <!-- 이메일 -->
        <div>
          <label class="block text-sm font-medium mb-1">이메일</label>
          <input type="email" value="name123@test.com" class="w-full border rounded px-4 py-2 mb-2">
          <div class="flex items-center gap-4 text-sm">
            <label><input type="radio" name="email" checked> 수신함</label>
            <label><input type="radio" name="email"> 수신안함</label>
          </div>
          <p class="text-xs text-gray-500 mt-1">쇼핑몰에서 제공하는 유익한 정보를 이메일로 받아보실 수 있습니다.</p>
        </div>
      </div>

      <!-- 추가 정보 -->
      <div class="border-t pt-8">
        <h2 class="text-lg font-semibold mb-4">추가정보</h2>

        <!-- 성별 -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">성별</label>
          <div class="flex gap-4 text-sm">
            <label><input type="radio" name="gender" checked> 남성</label>
            <label><input type="radio" name="gender"> 여성</label>
          </div>
        </div>

        <!-- 생년월일 -->
        <div>
          <label class="block text-sm font-medium mb-1">생년월일</label>
          <div class="flex gap-2">
            <select class="border rounded px-3 py-2">
              <option>1997</option>
            </select>
            <select class="border rounded px-3 py-2">
              <option>02</option>
            </select>
            <select class="border rounded px-3 py-2">
              <option>01</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="mt-10 flex justify-center gap-4">
        <button type="submit" class="bg-black text-white px-6 py-2 rounded">회원정보수정</button>
        <button type="button" class="border px-6 py-2 rounded">취소</button>
      </div>
    </form>
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

    const formAdd = () => {
      showEditor.value = !showEditor.value;
      showList.value = !showList.value;
    };

    onMounted(() => {
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
