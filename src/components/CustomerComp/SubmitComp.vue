<template> 
    <div class="glb-main-page">
      <!-- 고정된 헤더 -->
      <header class="glb-fixed-header">
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
  
        <div class ="glb-header-right-div">
            <button 
              class="glb-button" 
              @click="save()"
            > 제출
            </button>
        </div>
        <button @click = "TestClick()">dd</button>
      </header>
  
      <!-- -------------------------- Render start-------------------------- -->
  
      <div class="glb-content">
        <div class="image-outerDiv"  >
            <div class="ImageDiv" 
              :ref="el => setImgDivRef(el)"
              @click = "resetZoom()"
              >
              <!-- 텍스트 인풋 -->
              <div
                v-for="(field, index) in textFields[currentPage-1]"
                :key="index"
                @click.stop = "inputClick(field,$event)"
                class="pdf-input-div"
                :style="{ top: field.top + 'px', left: field.left + 'px', width : field.width + 'px' , height : field.height + 'px' }"
              >
                <input
                  class="pdf-textInput"
                  type="text"
                  v-model="field.value"
                  placeholder="값을 입력하세요"
                />
              </div>
  
              <!-- 서명패드 인풋 -->
              <div
                v-for="(field, index) in signFields[currentPage-1]"
                :key="index"
                @click.stop = "inputClick(field,$event,index)"
                class="pdf-input-div"
                :class="{ zoomed: zoomedField === index  }" 
                :style="{ top: field.top + 'px', left: field.left + 'px', width : field.width + 'px' , height : field.height + 'px' }"
              >
                <VueSignaturePad 
                  class="pdf-signInput"
                  v-model="field.value"
                  :key="currentPage + '-' + index" 
                  @canvas-setup="onCanvasSetup(index)"
                  ref="signaturePads" 
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  
    <div>
      
    </div>
  </template>
  
  
  <script>
  import * as pdfjsLib from "pdfjs-dist";
  import * as utils from "@js/utils.js";
  import { ref , onMounted, nextTick , watch} from "vue";
  import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
  import html2canvas from "html2canvas";

  // 서명 패드
  import { VueSignaturePad } from "vue-signature-pad";
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  export default {
  name: "PdfForm",
  components : {
    VueSignaturePad
  },
  setup() {
    
  
    const currentPage = ref(1); // 현재 페이지 번호
    const totalPages = ref(0); // 총 페이지 수
    const imgDivRef = ref(); // image 참조
    // 드래그 부분
    const textFields = ref([]); // 텍스트 입력 필드 배열
    const signFields = ref([]); // 서명 입력 필드 배열
    const imgUrls = ref([]); 
    const dropAreaHeight = ref();
    const formTitle = ref();
    const clickField = ref();
    const clickRef   = ref();
    const clickWidth = ref();
    const clickHeight = ref();
    const signaturePadRef = ref ();
    const zoomedField = ref();

    const signaturePads = ref([]);


    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 현재 화면비율에 맞춰서 Input Size 설정
  
    let dragType = null;
    let oldTop = null;
    let oldLeft = null;
    let urlParams = new URLSearchParams(window.location.search);
    let formUrl = urlParams.get('formUrl');
    let fileSeq = formUrl.split("_",3)[0];
    let formId = formUrl.split("_",3)[2];
    let saveYn = false;

    
    const inputClick = (field,event,index) => {
      signaturePadRef.value = event.srcElement;
      const clickedElement = event.target;
  
      clickRef.value = clickedElement
      clickField.value = field;
      clickWidth.value = clickedElement.getBoundingClientRect().width;
      clickHeight.value = clickedElement.getBoundingClientRect().height;
  
      if(event.srcElement.tagName == "CANVAS"){
        if(zoomedField.value!=null) return;
        zoomedField.value = zoomedField.value === index ? null : index;
        // 이전 좌표값 저장
        oldTop = clickField.value.top;
        oldLeft = clickField.value.left;
        // 2배로 확대
        clickField.value.width = clickField.value.width * 3;
        clickField.value.height = clickField.value.height * 3;
        // 화면 중간으로 정렬
        clickField.value.top = screenHeight / 2;
        clickField.value.left = screenWidth / 2;
        // Canvas도 같이 확대
        signaturePadRef.value.width = clickField.value.width * 3;
        signaturePadRef.value.height = clickField.value.height * 3;
        signaturePadRef.value.getContext("2d").scale(3, 3);
      }
    }
  
    const resetZoom = () => {
      if(zoomedField.value != null) {

        // 서명된 저장 줌아웃 할때 Value에 업데이트
        const signZoomOutField =  signFields.value[currentPage.value-1][zoomedField.value];
        const zoomOutCanvas = document.querySelectorAll(".pdf-signInput canvas")[zoomedField.value]; // 해당 인덱스의 canvas 가져오기
        const imageData = zoomOutCanvas.toDataURL("image/png"); // Base64 변환
        signZoomOutField.value = imageData ;

        zoomedField.value = null; // 배경 클릭 시 원래 크기로

        // 2배로 확대
        clickField.value.width = clickField.value.width / 3;
        clickField.value.height = clickField.value.height / 3;
        // 화면 중간으로 정렬
        clickField.value.top = oldTop
        clickField.value.left = oldLeft
      }
    }
    const setHeight = () => {
      
        utils.aSyncGetApi("/cust/submit","formUrl="+formUrl)
        .then((response) => {
            console.log("response.result,",response.result);
            imgUrls.value = response.result.imageList
            totalPages.value = response.result.imageList.length;
            
            if(totalPages.value > 0){
              nextTick(() => {
                
                const parentElement = document.querySelector('.image-outerDiv'); 
                const divHeight =parentElement.offsetHeight
                
                const screenScale = Math.min(divHeight / 792);
                
                const imageUrl = "/images/"+imgUrls.value[0];
  
                if(screenWidth > 768){
                  // A4용지 비율로 Width 계산
                  imgDivRef.value.style.height           =   screenScale*792+'px';
                  imgDivRef.value.style.width            = ((screenScale*792) * 0.705)+'px';
                  imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
                  imgDivRef.value.style.backgroundRepeat = "no-repeat"; // 한장의 사진만 (바둑배열 x)
                  imgDivRef.value.style.backgroundSize   = "cover"; // 컨테이너에 가득차게
                }else{ // 모바일에선 Width로 height를 계산
                  imgDivRef.value.style.height           =  screenWidth*1.414+'px';
                  imgDivRef.value.style.width            =  screenWidth+'px';
                  imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
                  imgDivRef.value.style.backgroundRepeat = "no-repeat"; // 한장의 사진만 (바둑배열 x)
                  imgDivRef.value.style.backgroundSize   = "cover"; // 컨테이너에 가득차게
                }
  
                inputGet(response.result.coordinateList);
              });
            }
          });
    }
  
    const inputGet = (coordinateList) => { 
      const renderedWidth = imgDivRef.value.offsetWidth;
      const renderedHeight = imgDivRef.value.offsetHeight;
  
      nextTick(() => {
        const results = coordinateList;
        
        // 기준이 되는 div
        const parentElement = document.querySelector('.ImageDiv'); 
        const headerElement = document.querySelector('.glb-fixed-header'); 
        
        // 드롭된 div의 위치 (뷰포트 기준)
        const rect = parentElement.getBoundingClientRect();
        if(coordinateList.length > 0){
          for(const result of results){
            if(result.input_type == "text"){
              // 페이지 배열 초기화   
              if (!Array.isArray(textFields.value[result.page_number-1])) {
                textFields.value[result.page_number-1] = [];
              } 
              textFields.value[result.page_number-1].push({

                top            : (result.y_relative * imgDivRef.value.offsetHeight) + headerElement.offsetHeight ,
                left           : (result.x_relative * imgDivRef.value.offsetWidth) + rect.left,
                width          : Math.round(result.width_relative * renderedWidth),
                height         : Math.round(result.height_relative * renderedHeight),
                relativeX      : result.x_relative,
                relativeY      : result.y_relative,
                relativeWidth  : result.width_relative,
                relativeHeight : result.height_relative,
                inputType      : result.input_type,
                value          :  "",

              }) 
            }else if(result.input_type == "sign"){
              // 페이지 배열 초기화   
              if (!Array.isArray(signFields.value[result.page_number-1])) {
                signFields.value[result.page_number-1] = [];
              } 
              signFields.value[result.page_number-1].push({

                top            : (result.y_relative * imgDivRef.value.offsetHeight) + headerElement.offsetHeight ,
                left           : (result.x_relative * imgDivRef.value.offsetWidth) + rect.left,
                width          : Math.round(result.width_relative * renderedWidth),
                height         : Math.round(result.height_relative * renderedHeight),
                relativeX      : result.x_relative,
                relativeY      : result.y_relative,
                relativeWidth  : result.width_relative,
                relativeHeight : result.height_relative,
                inputType      : result.input_type,
                value          :  "",

              }) 
            }
          }
        }
      }); // nextTick
    }
    const setImgDivRef = (el) => {
      if (el) {
        imgDivRef.value = el;
      }
    };
    
    const deleteClick = () => {
      textFields.value[currentPage.value-1] = "";
      signFields.value[currentPage.value-1] = "";
    }
  
    const renderPage = (currentPage) => {
      
      console.log("렌더링!" + currentPage.value);
      if (currentPage < 1 || currentPage > totalPages.value) {
        return;
      }else{
        const imageUrl = "/images/"+imgUrls.value[currentPage-1];
        imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
      }
    }
    const goPage = async () => {
      if (currentPage.value < 1 || currentPage.value > totalPages.value) {
        alert("유효하지 않은 페이지 번호입니다.");
        return;
      }
    };
  
    const prevPage = async () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        const imageUrl = "/images/"+imgUrls.value[currentPage.value-1];
        imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
      }
    };
  
    const nextPage = async () => {
      
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        const imageUrl = "/images/"+imgUrls.value[currentPage.value-1];
        imgDivRef.value.style.backgroundImage  = `url(${imageUrl})`;
      }
    };

    const save = async () => {
      saveYn = true;
      // 1페이지부터 저장 시작
      currentPage.value = 1;
      console.log("save 클릭!");

      saveImage();

    }

    const saveImage = async () => {

      await nextTick();
      
      const inputSignList = document.querySelectorAll(".pdf-signInput");
      const inputtextList = document.querySelectorAll(".pdf-textInput");
        
      for(const inputSign of inputSignList){
          inputSign.style.border = "0px";
          inputSign.style.backgroundColor = "rgba(255,255,255,0)";
          const canvasElements = inputSign.querySelectorAll("canvas");
          canvasElements[0].style.border ="0px";
      }

      for(const inputtext of inputtextList){
          inputtext.style.border = "0px";
          inputtext.style.backgroundColor =  "rgba(255,255,255,0)";  // 투명하게
      }

      

      const imageDiv = imgDivRef.value;

      const canvasCapture = await html2canvas(imageDiv);

      const formData = new FormData();
      const blob = await new Promise((resolve) => canvasCapture.toBlob(resolve));

      formData.append("image", blob, `${fileSeq}_${formId}_${currentPage.value}.png`);

      await utils.aSyncPostFileApi('/cust/submit', formData);

      if(currentPage.value != totalPages.value) {
        
        currentPage.value++;
      }else{
        saveYn = false;
      }
        
      console.log("save Image ");
      

    }

    const waitForRendering = (element, newImageUrl) => {
      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          if (element.style.backgroundImage.includes(newImageUrl)) {
            observer.disconnect();
            resolve();
          }
        });

        observer.observe(element, { attributes: true, attributeFilter: ["style"] });
      });
    }
    
    const TestClick = () => {
      console.log("textFields",textFields.value);
      console.log("signFields",signFields.value);
    }  

    onMounted(() => {
      setHeight();
    });
    watch(currentPage, async (newPage) => {

      await renderPage(currentPage.value);

      await nextTick(); // DOM 업데이트 후 실행

      
      // 입력된 Value Fields
      const SignField = signFields.value[newPage-1];
      
      console.log("시계는와차ㅣ"+SignField);

      for (const [index, pad] of signaturePads.value.entries()) {
        if (SignField[index] && SignField[index].value) {
          await pad.fromDataURL(SignField[index].value); // `await` 사용하여 순차 실행
        }
      }

      await nextTick();

      setTimeout(() => {
        console.log(" Vue 업데이트가 확실히 완료됨, 이제 캡처 실행!");
        if(saveYn){
          console.log("✅  이제 캡처 실행!");
          saveImage();
        } 
      }, 50);
    });
  
    return {
      currentPage,
      totalPages,
      imgDivRef,
      goPage,
      prevPage,
      nextPage,
      textFields,
      setHeight,
      dropAreaHeight,
      save,
      formTitle,
      renderPage,
      deleteClick,
      signFields,
      inputClick,
      clickField,
      clickWidth,
      clickHeight,
      inputGet,
      clickRef,
      screenWidth,
      screenHeight,
      setImgDivRef,
      dragType,
      zoomedField,
      resetZoom,
      signaturePadRef,
      oldTop ,
      oldLeft,
      fileSeq,
      formId,
      waitForRendering,
      TestClick,
      signaturePads,
      saveYn,
      saveImage
    };
  },
  };
  </script>
  
  <style scoped>
  .image{
    border: 1px solid black; 
  }
  .file-upload {
    padding: 10px;
  }
  .pdf-container {
    overflow: auto;
  }
  .pdf-page {
    position: relative;
    margin-bottom: 20px;
  }
  .input-field {
    position: absolute;
  }
  .pdf-input-div {
    position: absolute;
    border: 0px;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    /*transition: width 0.3s ease, height 0.3s ease;*/
  }
  .pdf-input {
    z-index: 10001;
    width: 100%;
    height: 100%;
    border: 0px;
  }
  .pdf-textInput {
    border: 0.5px solid  red;
    background-color :wheat;
  }
  .pdf-signInput {
    border: 0.5px solid  red;
    background-color :wheat;
  }

  .pdf-signInput canvas{
    border: 0;
    height: 150px;
  }
  
  /* 확대 시 중앙 배치 */
  .pdf-signInput.zoomed {
    position: fixed;
    /* transform: translate(-50%, -50%) scale(0.5); */
    z-index: 1001; /* 높은 z-index로 설정 */
    pointer-events: auto; /* 터치 및 클릭 이벤트를 수용 */
  }
  /* 확대 시 중앙 배치 */
  .pdf-input-div.zoomed {
    position: fixed;
    top: 50%;
    left: 50%;
    /* transform: translate(-50%, -50%);
    transition: transform 0.3s ease;  */
    z-index: 1001; /* 높은 z-index로 설정 */
    pointer-events: auto; /* 터치 및 클릭 이벤트를 수용 */
  }
  
  
  .dragDiv {
    display: flex;
  
  }
  .draggable{
    width: 100%;
    height: 100%;
  }
  .draggable:active {
    cursor: grabbing;
  }
  .drop-area {
    text-align : center;
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: #f8f9fa;
  }
  </style>
  
  <!-- setheight로 이미지를 들고옴 (그 뒤 빈 이미지칸에 Image를 넣음)
       그다음 절대좌표값을 들고옴
       생성
   
  -->