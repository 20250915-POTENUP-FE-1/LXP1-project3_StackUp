import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";

export const LS_KEY = {
  lectures: "lectures",
};

export function Lecture() {
  this.lectures = [];
  this.currentCategory = { code: "all" };
  this.currentSort = "newest"; // 정렬 상태 추가

  this.init = function () {
    const savedLectures = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(savedLectures) ? savedLectures : [];
    if (!savedLectures) store.setLocalStorage(LS_KEY.lectures, this.lectures);

    this.currentCategory = { code: "all" };
    this.currentSort = "newest";

    renderLecture();
    renderCategory();
    renderDetail();
    initSortBar(); // 정렬바 초기화
  };

  /** 정렬 및 필터링된 강의 목록 반환 */
  const getFilteredAndSorted = () => {
    let list = [...this.lectures];

    // 1️⃣ 카테고리 필터
    const code = this.currentCategory.code;
    if (code !== "all") {
      list = list.filter((lec) => lec.category === code);
    }

    // 2️⃣ 정렬 (createdAt 기준)
    if (this.currentSort === "newest") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // 최신순
    } else {
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); // 오래된순
    }

    return list;
  };

  /** 정렬 버튼 초기화 */
  const initSortBar = () => {
    const sortBar =
      document.getElementById("lecture-sort") ||
      document.querySelector(".filter-wrap");
    if (!sortBar) return;

    sortBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      this.currentSort = btn.dataset.sort; // newest | oldest

      // active 토글
      sortBar
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      renderLecture();
    });
  };

  /** 강의 목록 렌더링 */
  const renderLecture = () => {
    const $list = $("#lecture-list");
    if (!$list) return;

    const saved = store.getLocalStorage(LS_KEY.lectures);
    this.lectures = Array.isArray(saved) ? saved : [];

    const view = getFilteredAndSorted();

    if (view.length === 0) {
      $list.innerHTML = `<li class="lecture-item"><p>등록된 강의가 없습니다.</p></li>`;
      return;
    }

    $list.innerHTML = view
      .map((lecture) => {
        const { id, title, instructor, content, thumbnail } = lecture;
        return `
          <li class="lecture-item" data-id="${id}">
            <a href="detail.html?id=${id}">
              <span class="lecture-image">
                <img src="${thumbnail}" alt="강의 이미지" />
              </span>
              <div class="lecture-info">
                <span class="lecture-title">${title}</span>
                <span class="lecture-description">${content}</span>
                <span class="lecture-instructor">${instructor} 강사님</span>
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

  /** 카테고리 버튼 active 관리 */
  const renderCategory = () => {
    const code = this.currentCategory.code;
    document.querySelectorAll(".category-btn").forEach((btn) => {
      const btnCode = btn.dataset.categoryCode ?? "all";
      btn.classList.toggle("active", btnCode === code);
    });
  };

  /** 상세 페이지 렌더링 */
  const renderDetail = () => {
    this.lectures = store.getLocalStorage(LS_KEY.lectures) || [];
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (!id) return;

    const lecture = this.lectures.find((l) => l.id === id);
    if (!lecture) {
      alert("일치하는 강의를 찾을 수 없습니다.");
      return;
    }

    const detailHTML = `
      <div class="lecture-detail">
        <img src="${lecture.thumbnail}" alt="썸네일 이미지" />
        <div>강의 제목 ${lecture.title}</div>
        <div>강사님 ${lecture.instructor}</div>
        <div>카테고리 ${lecture.category}</div>
        <div>강의 소개 내용 ${lecture.content}</div>
        <button class="btn-back">목록</button>
      </div>
    `;
    $("#lecture-detail").innerHTML = detailHTML;
  };

  /** 수정 폼 채우기 */
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

  /** 수정 기능 */
  const editLecture = () => {
    const id = $("#edit-lecture-id").value;
    const category = $("#edit-lecture-category").value;
    const title = $("#edit-lecture-title").value.trim();
    const instructor = $("#edit-lecture-instructor").value.trim();
    const content = $("#edit-lecture-content").value.trim();

    if (!category || !title || !instructor || !content)
      return alert("모든 입력란을 작성하세요.");

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

  /** 삭제 기능 */
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

  /** 공통 이벤트 핸들러 */
  const handleMainContentEvent = (e) => {
    // 등록 폼 제출
    if (e.type === "submit" && e.target.id === "lecture-regist-form") {
      e.preventDefault();
      registLecture(); // ← 등록 함수 (별도 정의)
    }

  $("#lecture-edit-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    editLecture();
  });
  $("#lecture-list").addEventListener("click", (e) => {
    if (e.target.closest("button")) return;

    const li = e.target.closest("li");
    if (!li) return;
    const liId = li.dataset.id;
    location.href = `/src/js/pages/detail.html?id=${liId}`;
  });
}

const lecture = new Lecture();
lecture.init();
