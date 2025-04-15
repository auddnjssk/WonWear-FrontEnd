<template>
  <section >
    <FormMngmComp 
    v-if = "listNedit === 'list'"
      :listNeditFn = "listNeditFn"
    />
    <PdfForm 
      v-if = "listNedit === 'edit'"
      :ref = "pdfFormRef"
      :editNlist = "editNlist"
      :formId = "formIdRef"
    />
  </section>
</template>

<script>
import '@assets/loginStyles.css'  // 스타일 파일 임포트

import FormMngmComp from '@components/SideMenu/formManagementComp/FormMngmComp.vue'; 
import PdfForm from '@components/SideMenu/formManagementComp/PdfForm.vue'; 

import { ref } from 'vue';

export default {
  name: 'FormManagement',
  components: {
    FormMngmComp,
    PdfForm
  },
  setup() {
    const listNedit = ref('list');
    const pdfFormRef = ref();
    const formIdRef = ref();

    const listNeditFn = (formId) => {
      listNedit.value = "edit";
      formIdRef.value=String(formId);
    }

    const editNlist = () => {
      listNedit.value = "list";
    }

    return {
      formIdRef,
      pdfFormRef,
      PdfForm,
      FormMngmComp,
      listNedit,
      listNeditFn,
      editNlist

    };
  },
};
</script>
