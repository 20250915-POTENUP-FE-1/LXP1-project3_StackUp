import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";
import { makeId } from "../utils/idGenerator.js";
const LS_KEY = {
  categories: "categories",
  lectures: "lectures",
};
function Lecture() {
  this.categories = {};
  this.lectures = {};
  this.currentCategory = ""; // "" 이면 전체 보기
  let imageData = "";

  const defaultCategories = [
    { id: "cat_basic", name: "코딩 기초" },
    { id: "cat_data", name: "데이터 분석" },
    { id: "cat_ai", name: "생성형 AI" },
    { id: "cat_design", name: "디자인" },
    { id: "cat_prog", name: "프로그래밍 언어" },
  ];
  this.init = function () {
    localStorage.setItem("categories", JSON.stringify(defaultCategories));
    const savedCategories = store.getLocalStorage(LS_KEY.categories);
    //console.group("savedCategory:", savedCategories);
  };

  /*
  const lectures = [
    {
      id: "20251015173512034",
      title: "자바스크립트 입문",
      category: "cat_prog",
      instructor: "홍길동",
      thumbnail: "/assets/thumbs/js.png",
      content: "JS 기초 문법과 DOM 조작을 배웁니다.",
      createdAt: 1739582112034,
    },
    {
      id: "20251015173645012",
      title: "코딩 기초: 변수와 자료형",
      category: "cat_basic",
      instructor: "이수진",
      thumbnail: "/assets/thumbs/basic-vars.png",
      content: "변수, 상수, 기본 자료형을 예제로 익혀요.",
      createdAt: 1739582205012,
    },
    {
      id: "20251015173830285",
      title: "데이터 분석 입문: 스프레드시트로 시작하기",
      category: "cat_data",
      instructor: "김민재",
      thumbnail: "/assets/thumbs/data-spreadsheet.png",
      content: "엑셀/시트로 데이터 전처리 감각을 길러요.",
      createdAt: 1739582310285,
    },
    {
      id: "20251015173955177",
      title: "생성형 AI 개론: 프롬프트 기초",
      category: "cat_ai",
      instructor: "박소연",
      thumbnail: "/assets/thumbs/ai-prompt.png",
      content: "프롬프트 작성 원칙과 실습 예제를 다룹니다.",
      createdAt: 1739582395177,
    },
    {
      id: "20251015174110463",
      title: "디자인 시스템 101",
      category: "cat_design",
      instructor: "정우성",
      thumbnail: "/assets/thumbs/design-system.png",
      content: "컴포넌트, 토큰, 일관성 있는 UI의 기초.",
      createdAt: 1739582470463,
    },
    {
      id: "20251015174232998",
      title: "DOM 조작 심화: 이벤트 위임",
      category: "cat_prog",
      instructor: "홍길동",
      thumbnail: "/assets/thumbs/dom-delegate.png",
      content: "이벤트 버블링을 활용한 성능 좋은 UI 패턴.",
      createdAt: 1739582552998,
    },
    {
      id: "20251015174415821",
      title: "파이썬으로 하는 데이터 정리",
      category: "cat_data",
      instructor: "김민재",
      thumbnail: "/assets/thumbs/python-data.png",
      content: "판다스로 CSV를 읽고 정리·요약하기.",
      createdAt: 1739582655821,
    },
    {
      id: "20251015174542910",
      title: "프로토타이핑을 위한 와이어프레임",
      category: "cat_design",
      instructor: "이수진",
      thumbnail: "/assets/thumbs/wireframe.png",
      content: "빠르게 화면 흐름을 잡는 와이어프레임 실습.",
      createdAt: 1739582742910,
    },
  ];
  */
  /*
  localStorage.setItem("lectures", JSON.stringify(lectures));
  */
  //localStorage.setItem("categories", JSON.stringify(defaultCategories));
  // console.log("✅ 저장 완료");

  /*
  강의 등록(Create)	배열에 새 강의 추가 → localStorage에 다시 저장	lectures.push(newLecture)
  강의 수정(Update)	find로 id 찾아서 내용 수정	lectures.find(l=>l.id===id)
  강의 삭제(Delete)	filter로 제외 후 다시 저장	lectures.filter(l=>l.id!==id)
  카테고리별 보기	선택된 category로 필터링	lectures.filter(l=>l.category===catId)
  상세페이지	URL의 ?id= 읽어서 find	lectures.find(l=>l.id===id)
  */

  /*
  Mission1. 강의 추가기능
    - 데이터 구조(상태관리 변수에 담을 값들)
      필드명      의미
      id          강의 고유 번호
      title       강의 제목
      category    어떤 카테고리에 속하는지
      instructor  강사 이름
      thumbnail   썸네일 이미지 경로
      content     강의 소개 내용
      createdAt   생성 시간

    - 기능 함수 만들기
    - 입력값 유효성 검증 (누락만 검증)
    - 등록 완료시 입력 필드 초기화
    - 
  */

  //console.log(store.getLocalStorage("lectures"));

  this.lectures = store.getLocalStorage("lectures") || [];
  this.categories = store.getLocalStorage("categories") || [];

  // 기능 함수1. 강의 등록
  const registLecture = () => {
    // 입력하는 값 담을 변수
    const lectureCategory = $("#category").value;
    const lectureTitle = $("#title-input").value;
    const lectureInstructor = $("#instructor-input").value;
    const lectureThumb = imageData; // 파일 input이라면 별도 처리 필요
    const lectureDesc = $("#desc-input").value;

    // 입력값 유효성 검증 (누락만 검증)
    if (
      !lectureCategory ||
      !lectureTitle ||
      !lectureInstructor ||
      !lectureDesc
    ) {
      alert("모든 입력란을 작성하세요.");
      return;
    }

    // ✅ 새 강의 객체 생성
    const newLecture = {
      id: makeId(),
      category: lectureCategory,
      title: lectureTitle,
      instructor: lectureInstructor,
      thumbnail: lectureThumb,
      content: lectureDesc,
      createdAt: Date.now(),
    };

    this.lectures.push(newLecture); // 배열에 담고
    store.setLocalStorage("lectures", this.lectures); // 스토리지에 저장
    renderLecture(); // 등록한 강의 랜더링

    // 입력값 초기화
    $("#category").selectedIndex = 0; // 첫번째 옵션 선택
    $("#title-input").value = "";
    $("#instructor-input").value = "";
    $("#thumb-input").value = "";
    $("#desc-input").value = "";
  };

  // 랜더링 함수1. 등록한 강의 리스트
  const renderLecture = () => {
    defaultCategories.forEach((cat) => {
      const group = this.lectures.filter((l) => l.category === cat.id);
      //console.log(cat.id, group);
    });

    const lectureItem = this.lectures // 여기에 카테고리 필터링
      .map((lecture) => {
        return `
        <li class="lecture-item">
          <a href="detail.html?id=${lecture.id}">
            <span class="lecture-image">
              <img src="${lecture.thumbnail}" alt="강의 이미지" />
            </span>
            <div class="lecture-info">
              <span class="lecture-title">${lecture.title}</span>
              <span class="lecture-description">${lecture.content}</span>
              <span class="lecture-instructor">${lecture.instructor} 강사님</span>
            </div>
          </a>
          <div class="lecture-actions">
            <button class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
            <button class="delete-btn">삭제</button>
          </div>
        </li>
      `;
      })
      .join("");

    if ($("#lecture-list")) $("#lecture-list").innerHTML = lectureItem;
  };

  // 랜더링 함수2. 강의 상세 페이지
  const renderDetail = () => {
    //const id = location.href.split("?")[1];
    const params = new URLSearchParams(location.search);
    const id = params.get("id"); // 예: "20251015173512034"

    if (!id) return;

    const lecture = this.lectures.find((l) => l.id === id);

    if (!lecture) {
      alert("일치하는 강의를 찾을 수 없습니다.");
      return;
    }

    const lectureDetail = `
      <div class="lecture-detail">
        <img src="${lecture.thumbnail}" alt="썸네일 이미지" />
        <div>강의 제목 ${lecture.title}</div>
        <div>강사님 ${lecture.instructor}</div>
        <div>카테고리 ${lecture.category}</div>
        <div>강의 소개 내용 ${lecture.content}</div>
        <button class="btn-back">목록</button>
      </div>
  `;

    $("#lecture-detail").innerHTML = lectureDetail;
  };

  const handleMainContentEvent = (e) => {
    // 폼 제출
    if (e.type === "submit") {
      e.preventDefault();
      registLecture();
    }

    // 뒤로가기 버튼 클릭
    if (e.type === "click" && e.target.classList.contains("btn-back")) {
      e.preventDefault();
      history.back();
    }

    if (e.type === "change" && event.target.classList.contains("thumb-input")) {
      e.preventDefault();
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader(); // 브라우저에 파일을 읽을 수 있는 객체
      reader.onload = (e) => {
        imageData = e.target.result; // Base64 데이터
      };
      reader.readAsDataURL(file); // 'file'을 문자열 형태의 데이터 URL(Base64)로 읽기 시작
    }
  };

  $(".main-content").addEventListener("submit", handleMainContentEvent);
  $(".main-content").addEventListener("click", handleMainContentEvent);
  $(".main-content").addEventListener("change", handleMainContentEvent);

  renderLecture();
  renderDetail();
}

const lecture = new Lecture();
lecture.init();
