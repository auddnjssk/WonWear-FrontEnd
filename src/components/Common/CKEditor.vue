<template>
  <div style="height: 100%; width: 100%;">
    <div class="subjectCon">
      <textarea
        class="titleArea"
        v-model="titleText"
        placeholder="제목을 입력하세요"
        rows="10"
        cols="50"
      ></textarea>
      <button
        v-if="editFlag === 'Y'"
        class="delBtn"
        @click="submit"
      >
        삭제
      </button>
      <button
        class="saveBtn"
        @click="submit"
      >
        저장
      </button>
    </div>
    <div style="height: 100%;">
      <Ckeditor
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
      />
    </div>
  </div>
</template>

<script>
import { ref , toRefs ,defineComponent   } from "vue";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import supabase from "../js/supabase.js";
import * as utils from "@js/utils.js";

export default defineComponent({
  name: "App",
  components: {
    Ckeditor,
  },
  props: {
    toggleForm: {
      type: Function,
      required: true
    },
    tableName: {
      type: String,
      required: true
    },

  },
  setup(props) {

    // Props
    const { tableName, toggleForm } = toRefs(props);
    
    // State
    const editor = ref(ClassicEditor);
    const editorData = ref("");
    const editorConfig = ref({});
    const titleText = ref("");
    const maxFormId = ref("");
    const editFlag = ref("N");


    // Methods
    const formIdInput = async (formId, tableName) => {
      console.log(formId,"formIdInput",tableName);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("form_id", formId);

        if (error) {
          console.error("Select Error:", error);
        } else {
          maxFormId.value = formId;
          editorData.value = data[0].form_detail;
          titleText.value = data[0].form_title;
          editFlag.value = "Y";
          console.log("Select Success:", data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    const submit = async () => {
      
      if (!titleText.value || !editorData.value) {
        utils.showAlert("error", "제목이나 내용이 빠졌습니다.");
        return;
      }

      if (editFlag.value === "N") {
        try {
          const insertData = {
            form_title: titleText.value,
            form_detail: editorData.value,
          }
          console.log("insertData",insertData);

          utils.aSyncPostApi("/formManagement" , insertData)
          .then((response) => {
            console.log("fetch ! response",response);
          });

          utils.showAlert("alert", "저장되었습니다",parentCallBack);
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      } else if (editFlag.value === "Y") {
        try {
          const { data, error } = await supabase
            .from(tableName.value)
            .update([
              {
                form_title: titleText.value,
                form_detail: editorData.value,
              },
            ])
            .eq("form_id", maxFormId.value);

          if (error) {
            console.error("Update Error:", error);
          } else {
            utils.showAlert("alert", "22저장되었습니다",parentCallBack);
            console.log("Update Success:", data);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }
    };

    const parentCallBack = () => {

      toggleForm.value()

    }

    return {
      editor,
      editorData,
      editorConfig,
      titleText,
      maxFormId,
      editFlag,
      formIdInput,
      submit,
    };
  },
});
</script>

<style>
.subjectCon {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
}
.titleArea {
  padding: 10px;
  left: 0;
  height: 45px;
  width: 100%;
  margin-right: 10px;
  border-radius: 12px;
}
.delBtn {
  color: red;
  padding: 10px;
  right: 0;
  height: 45px;
  width: 60px;
  margin-right: 10px;
}
.saveBtn {
  padding: 10px;
  right: 0;
  height: 45px;
  width: 60px;
}
.editDiv {
  height: 100%;
}
.ck-editor__editable_inline {
  height: 100%;
}
.ck-editor__main {
  height: 100%;
}
</style>
