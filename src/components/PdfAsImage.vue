
<script>

import * as utils from "@js/utils.js";


export default {
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentUrl : null,
      pdfCanvas: null,
      signatureCanvas: null,
      pdfCtx: null,
      sigCtx: null,
      drawing: false,
    };
  },
  mounted() {

  document.body.innerHTML = ""; // body 내부의 모든 내용을 삭제

  this.currentUrl = window.location.href; // mounted에서 window 접근

  var requestParam = this.currentUrl.split("pdfPath=");

  console.log("requestParam",requestParam[1]);

  console.log("urlText",this.currentUrl);
  utils.aSyncGetApi("/pdfAsImage", "pdfPath="+requestParam[1])
  .then((imageBase64) => {


    console.log("imageBase64 ==>", imageBase64); // 값이 들어온 후 실행
    if (Array.isArray(imageBase64)) {
      imageBase64.forEach((base64) => {

        //const screenWidth = window.innerWidth;
        const img = new Image();
        img.style.width = "100%"; // 기본 크기
        img.style.height = "100%"; // 비율 유지


        img.src = `data:image/png;base64,${base64}`;

        document.body.appendChild(img); // 이미지를 DOM에 추가

      });

      const btn = document.createElement("button");
      btn.textContent = "계약서 전송";
      btn.style.width ="100%"
      btn.style.height ="10%"

      document.body.appendChild(btn); // 이미지를 DOM에 추가

    } else {
      console.error("Invalid response format: Expected an array");
    }
  })
  .catch((error) => {
    console.error("Error fetching imageBase64:", error);
  });
  },
  methods: {
  },
};
</script>

<style>
.pdf-container {
  position: relative;
}
canvas {
  border: 1px solid #000;
}
#signature-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 500px;
  height: 500px;
}
</style>
