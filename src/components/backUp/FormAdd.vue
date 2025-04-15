<template>
  <div class="main-page">
    <!-- 고정된 헤더 -->
    <header class="glb-fixed-pdf-header">
      <a>양식 추가</a>
      
      <div class ="glb-paging-div">
          <svg  @click = "prevPage" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
           <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
          </svg>
          <input style="width: 25px; height : 35px; text-align: center; margin : 5px ; font-size: 15px;" type="text" v-model="currentPage" @change="goPage"/>
          <a style="font-size: 15px; font-weight: 100;">/</a>
          <input style="width: 25px; height : 35px; text-align: center; margin : 5px ; font-size: 15px;" readonly type="text" v-model="totalPages"   />

          <svg @click = "nextPage" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
          </svg>
      </div>
      <a> 제목</a> 
        <input style="width: 250px;text-align: center;" type="text" v-model = "formTitle" />
      <button 
          class="glb-button" 
          style="width : 120px"
          @click="savePDF"
        > PDF 저장
        </button>


    </header>
    <!-- PDF 미리보기 -->
    <div  
          class="drop-area"
          @dragover.prevent
          @drop="onDrop"
      >
      <div v-if="totalPages <= 0" class="file-upload" >
        <input type="file" @change="handleFileUpload" accept="application/pdf" />
      </div>
      <canvas :ref="el => setViewCanvasRef(el)"></canvas>
          <canvas
            hidden
            v-for="(totalPage,index) in totalPages" 
            :key="index"
            :ref="el => setCanvasRef(el,index)">
          </canvas>
          
          <div
          v-for="(field, index) in fields"
          :key="index"
          class="pdf-input-div"
          :style="{ top: field.top + 'px', left: field.left + 'px' }"
          >
              <input
                  class="pdf-input"
                  type="text"
                  v-model="field.value"
                  placeholder="값을 입력하세요"/>
          </div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist";
import * as utils from "@js/utils.js";
import { ref , nextTick, onMounted} from "vue";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
export default {
name: "FormAdd",
  setup() {
    const pdfFile = ref(null); // 업로드된 PDF 파일
    const pdfDoc = ref(null); // PDF 문서 객체
    const currentPage = ref(1); // 현재 페이지 번호
    const totalPages = ref(0); // 총 페이지 수
    const viewCanvasRef = ref(null); // canvas 참조
    const canvasRefs = ref([]); // canvas 참조
    const refFileUrl = ref(null);
    // 드래그 부분
    const fields = ref([]); // 입력 필드 배열
    const draggedItem = ref(null); // 드래그된 아이템 정보

    const dropAreaHeight = ref();
    const formTitle = ref();
    const BackformId = ref();

    const setHeight = () => {
        const parentElement = document.querySelector('.drop-area'); 
        const headerElement = document.querySelector('.glb-fixed-pdf-header'); 

        dropAreaHeight.value = (parentElement.offsetHeight - headerElement.offsetHeight)-5;
        parentElement.style.height =  `${dropAreaHeight.value}px`;

    }
    const onDragStart = (event) => {
        const targetElement = event.target; // 드래그 대상 엘리먼트
        const parentElement = document.querySelector('.drop-area'); // 기준이 되는 div

        // 기준 div의 좌표 가져오기
        const parentRect = parentElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        draggedItem.value = {
            offsetX: event.clientX - targetRect.left,
            offsetY: event.clientY - targetRect.top,
            parentOffsetX: parentRect.left,
            parentOffsetY: parentRect.top,
        };
    };
    const onDrop = (event) => {
        const parentElement = document.querySelector('.drop-area'); // 기준이 되는 div
        const parentRect = parentElement.getBoundingClientRect();

        const dropX = event.clientX - parentRect.left - draggedItem.value.offsetX;
        const dropY = event.clientY - parentRect.top - draggedItem.value.offsetY;

        fields.value.push({
            top: dropY,
            left: dropX,
            value: "",
        });

        console.log(fields.value); // 새 입력 필드 확인
    };

    const renderPage = async (pageNum) => {

      console.log("pageNum",pageNum);
        const pdf = await pdfjsLib.getDocument(refFileUrl.value).promise;
        const page = await pdf.getPage(parseInt(pageNum)); // 첫 번째 페이지 가져오기

        const viewport = page.getViewport({ scale: 1 });

        const canvas = viewCanvasRef.value;
        
        const ctx = canvas.getContext("2d");

        const mathScale = dropAreaHeight.value / viewport.height;

        viewCanvasRef.value.width = viewport.width*mathScale;
        viewCanvasRef.value.height = (viewport.height*mathScale)-5;

        await page.render({
            canvasContext: ctx,
            viewport: viewport,
        }).promise;

        
    };

    const setCanvasRef = (el) => {
        if (el) {
          canvasRefs.value.push(el);
        }
    };

    const setViewCanvasRef = (el) => {
        if (el) {
          viewCanvasRef.value = el;
        }
    };

    async function renderDownPDF() {

      for(let i = 1 ; totalPages.value >= i ; i ++){

        await nextTick(); // DOM이 렌더링될 때까지 대기
        console.log("pageNum",i);
        const pdf = await pdfjsLib.getDocument(refFileUrl.value).promise;
        const page = await pdf.getPage(i); // 첫 번째 페이지 가져오기
        const viewport = page.getViewport({ scale: 1 });

        if (!canvasRefs.value[i-1]) {
            console.error("캔버스 요소를 찾을 수 없습니다.",viewCanvasRef);
            return;
        }

        const context = canvasRefs.value[i-1].getContext("2d");

          
        // 스케일 맞추기
        const mathScale = dropAreaHeight.value / viewport.height;

        canvasRefs.value[i-1].width = viewport.width*mathScale;
        canvasRefs.value[i-1].height = (viewport.height*mathScale)-5;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;
      }
    }

    async function renderPDF() {

      await nextTick(); // DOM이 렌더링될 때까지 대기
      const pdf = await pdfjsLib.getDocument(refFileUrl.value).promise;
      const page = await pdf.getPage(1); // 첫 번째 페이지 가져오기
      const viewport = page.getViewport({ scale: 1 });

      if (!viewCanvasRef.value) {
          console.error("캔버스 요소를 찾을 수 없습니다.",viewCanvasRef);
          return;
      }

      const context = viewCanvasRef.value.getContext("2d");

      // 스케일 맞추기
      const mathScale = dropAreaHeight.value / viewport.height;

      viewCanvasRef.value.width = viewport.width*mathScale;
      viewCanvasRef.value.height = (viewport.height*mathScale)-5;

      await page.render({
          canvasContext: context,
          viewport: viewport,
      }).promise;

    }

    const goPage = async () => {
      if (currentPage.value < 1 || currentPage.value > totalPages.value) {
        alert("유효하지 않은 페이지 번호입니다.");
        return;
      }
      await renderPage(currentPage.value);
    };

    const prevPage = async () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        await renderPage(currentPage.value);
      }
    };

    const nextPage = async () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        await renderPage(currentPage.value);
      }
    };

    const handleFileUpload = async (event) => {
      
      const file = event.target.files[0];
      formTitle.value = file.name;
      //console.log("file.type ==",file.name);
      if (file) {
        if(file.type == "application/pdf"){

        refFileUrl.value = URL.createObjectURL(file);
        pdfDoc.value = await pdfjsLib.getDocument(refFileUrl.value).promise; // PDF 로드
        totalPages.value=pdfDoc.value.numPages;

        console.log("pdfDoc.value",pdfDoc.value);
        if (pdfDoc.value.numPages === 0) {
            console.error("PDF가 비어 있거나 올바르게 로드되지 않았습니다.");
            return;
        }

        renderPDF();

        renderDownPDF();

        }else if(file.type == "image/png"){
          console.log("이미지 !");
        }
      }
    };
    const savePDF = async() => {

      if(!formTitle.value) {
        utils.showAlert('error',"제목이 비어있습니다.");
        return;
      }else if(!pdfDoc.value){
        utils.showAlert('error',"PDF 로드가 정상적으로 처리되지 않았습니다.");
        return;
      }
      const jsonBody = {
        form_title : formTitle.value
      }

      await utils.aSyncPostApi('/formManagement',jsonBody,"post")
        .then(response => {
          console.log("response",response);

          BackformId.value = (response.result+1);
          if(response){
            for(let i = 1 ; totalPages.value >= i ; i ++){
              console.log("server에 Image 저장 Page : ",i-1);
              const image =canvasRefs.value[i-1].toDataURL("image/png"); // PNG 데이터 URL 생성
              utils.uploadImageToServer(utils.dataURLToBlob(image),BackformId.value+"_userId_"+i);
            }
            utils.showAlert('alert',response.message,reloadLocation);
            

          }else{
            utils.showAlert('error',"저장 중 에러가 발생했습니다.");
          }
      })

    };

    const reloadLocation = () => {
      location.reload();
    }

    onMounted(() => {
      setHeight();
    });
    return {
      pdfFile,
      pdfDoc,
      currentPage,
      totalPages,
      viewCanvasRef,
      handleFileUpload,
      goPage,
      prevPage,
      nextPage,
      renderPDF,
      setCanvasRef,
      refFileUrl,
      onDragStart,
      onDrop,
      fields,
      setHeight,
      dropAreaHeight,
      savePDF,
      formTitle,
      BackformId,
      canvasRefs,
      setViewCanvasRef,
      reloadLocation
    };
  },
};
</script>