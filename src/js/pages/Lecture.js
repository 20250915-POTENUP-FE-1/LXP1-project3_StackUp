import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";
export const LS_KEY = {
  lectures: "lectures",
};
export function Lecture() {
  this.lectures = {};
  this.currentCategory = {
    code: "all",
  };

  this.init = function () {
    const savedLectures = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(savedLectures) ? savedLectures : [];
    if (!savedLectures) store.setLocalStorage(LS_KEY.lectures, this.lectures);

    this.currentCategory = {
      code: "all",
    };

    renderLecture();
    renderCategory();
  };
  const renderLecture = () => {
    if ($("#lecture-list")) $("#lecture-list").innerHTML = "";

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const code = this.currentCategory.code;
    const list =
      code === "all"
        ? this.lectures
        : this.lectures.filter((lec) => lec.category === code);

    if ($("#lecture-list"))
      $("#lecture-list").innerHTML = list
        .map((lecture) => {
          const { id, title, instructor, content, thumbnail } = lecture;
          return `
          <li class="lecture-item" data-id="${id}">
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
          </li>`;
        })
        .join("");
  };
  const renderCategory = () => {
    const code = this.currentCategory.code;
    document.querySelectorAll(".category-btn").forEach((btn) => {
      const btnCode = btn.dataset.categoryCode ?? "all";
      btn.classList.toggle("active", btnCode === code);
    });
  };
  const renderDetail = () => {
    this.lectures = store.getLocalStorage("lectures") || [];
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

  const editLectureForm = (btn) => {
    const li = btn.closest(".lecture-item");
    if (!li) return;
    const id = li.dataset.id;
    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const target = this.lectures.find((l) => l.id === id);
    if (!target) return alert("수정할 강의를 찾을 수 없습니다.");
    $("#edit-lecture-id").value = target.id;
    $("#edit-lecture-category").value = target.category;
    $("#edit-lecture-title").value = target.title;
    $("#edit-lecture-instructor").value = target.instructor;
    $("#edit-lecture-content").value = target.content;
  };

  const editLecture = () => {
    const id = $("#edit-lecture-id").value;
    const category = $("#edit-lecture-category").value;
    const title = $("#edit-lecture-title").value.trim();
    const instructor = $("#edit-lecture-instructor").value.trim();
    const content = $("#edit-lecture-content").value.trim();

    if (!category) return alert("카테고리를 입력하세요.");
    if (!title) return alert("강의명을 입력하세요.");
    if (!instructor) return alert("강사명을 입력하세요.");
    if (!content) return alert("강의 설명을 입력하세요.");

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const idx = this.lectures.findIndex((l) => l.id === id);
    if (idx === -1) return alert("일치하는 강의를 찾을 수 없습니다.");

    const edited = {
      ...this.lectures[idx],
      category,
      title,
      instructor,
      content,
    };

    this.lectures.splice(idx, 1, edited);
    store.setLocalStorage(LS_KEY.lectures, this.lectures);
    renderLecture();

    document.querySelector("#editModal .modal-close")?.click();
  };
  const deleteLecture = (btn) => {
    const li = btn.closest(".lecture-item");
    if (!li) return;
    const id = li.dataset.id;

    if (!confirm("정말로 삭제하시겠습니까?")) return;

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];
    this.lectures = this.lectures.filter((l) => l.id !== id);

    store.setLocalStorage(LS_KEY.lectures, this.lectures);
    renderLecture();
  };

  const handleMainContentEvent = (e) => {
    // 폼 제출
    if (e.type === "submit" && e.target.id === "lecture-regist-form") {
      e.preventDefault();
      editLecture();
    }

    if (e.type === "submit" && e.target.id === "lecture-edit-form") {
      e.preventDefault();
      registLecture();
    }

    // 강의 목록에서 수정 / 삭제 버튼 클릭
    if (e.type === "click" && e.target.closest("#lecture-list")) {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.classList.contains("edit-btn")) {
        e.preventDefault();
        editLectureForm(btn);
      } else if (btn.classList.contains("delete-btn")) {
        e.preventDefault();
        deleteLecture(btn);
      }
    }

    // 뒤로가기 버튼 클릭
    if (e.type === "click" && e.target.classList.contains("btn-back")) {
      e.preventDefault();
      history.back();
    }

    // 카테고리 탭 클릭
    if (e.type === "click" && e.target.closest(".category-btn")) {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;
      this.currentCategory = { code: btn.dataset.categoryCode ?? "all" };
      renderCategory();
      renderLecture();
    }

    // 인풋 파일
    if (e.type === "change" && e.target.classList.contains("thumb-input")) {
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

  renderDetail();
}

const lecture = new Lecture();
lecture.init();
