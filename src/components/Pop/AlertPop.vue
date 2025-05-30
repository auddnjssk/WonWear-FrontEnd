<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closePopup">
    <div class="bg-white p-8 rounded-lg w-full max-w-lg text-center shadow-lg relative" @click.stop>
      <!-- 상태별 아이콘 -->
      <svg
        v-if="stat === 'alert'"
        xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
        class="mx-auto mb-4 text-green-500" viewBox="0 0 16 16"
      >
        <path
          d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
      </svg>

      <svg
        v-if="stat === 'error'"
        xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
        class="mx-auto mb-4 text-red-500" viewBox="0 0 16 16"
      >
        <path
          d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0" />
      </svg>

      <svg
        v-if="stat === 'confirm'"
        xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
        class="mx-auto mb-4 text-yellow-500" viewBox="0 0 16 16"
      >
        <path fill-rule="evenodd"
          d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14" />
      </svg>

      <!-- 메시지 -->
      <p class="text-base text-gray-800 mb-6">{{ message }}</p>

      <!-- 확인 버튼 -->
      <button
        class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        @click="closePopup"
      >
        확인
      </button>
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";
import * as utils from "@js/utils.js";

export default {
  name: "AlertPop",
  props: {
    stat: {
      type: String,
      default: "alert",
    },
    message: {
      type: String,
      default: "This is a message in the popup.",
    },
    removePopup: {
      type: Function,
      required: true,
    },
    callBack: {
      type: Function,
      required: false,
    },
    cbArgument: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { callBack, removePopup, cbArgument } = toRefs(props);

    const closePopup = () => {
      if (!utils.isEmpty(callBack.value)) callBack.value(cbArgument.value);
      removePopup.value();
    };

    return {
      closePopup,
    };
  },
};
</script>
