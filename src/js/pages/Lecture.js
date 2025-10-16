import { $ } from "../utils/dom.js";
import { store } from "../store/store.js";
import { makeId } from "../utils/idGenerator.js";
const LS_KEY = {
  categories: "categories",
  lectures: "lectures",
};
function Lecture() {
  this.lectures = [];
  this.currentSort = "newest";
  this.currentCategory = "";

  const defaultCategories = [
    { id: "cat_basic", name: "코딩 기초" },
    { id: "cat_data", name: "데이터 분석" },
    { id: "cat_ai", name: "생성형 AI" },
    { id: "cat_design", name: "디자인" },
    { id: "cat_prog", name: "프로그래밍 언어" },
  ];
  this.init = function () {
    const categories =
      store.getLocalStorage(LS_KEY.categories) || defaultCategories;
    let lectures = store.getLocalStorage(LS_KEY.lectures) || [];
    this.lectures = lectures;
    this.renderLectureList(lectures);

    // (권장) createdAt 없는 레거시 데이터 보정
    let needSave = false;
    lectures = lectures.map((l) => {
      if (!l.createdAt) {
        needSave = true;
        return { ...l, createdAt: Date.now() };
      }
      return l;
    });
    if (needSave) store.setLocalStorage(LS_KEY.lectures, lectures);

    this.lectures = lectures;

    // 2) 최초 렌더: 기본 '최신순'
    this.renderLectureList(this._getView());

    // 3) 정렬 버튼(최신/오래) 클릭
    const sortBar =
      document.getElementById("lecture-sort") ||
      document.querySelector(".filter-wrap");
    if (sortBar) {
      sortBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;

        // 상태 갱신
        this.currentSort = btn.dataset.sort; // 'newest' | 'oldest'

        // 버튼 active 토글
        sortBar
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // 정렬 적용 후 렌더
        this.renderLectureList(this._getView());
      });
    }
  };

  // 현재 활성 카테고리(있으면) 읽어서 필터 → sort()만 적용해서 반환
  this._getView = function () {
    // 활성 카테고리(카테고리 바를 쓰는 경우)
    const activeCat =
      document.querySelector(".category-btn.active")?.dataset.cat || "all";

    // 1) 카테고리 필터
    let list = [...this.lectures];
    if (activeCat !== "all")
      list = list.filter((l) => l.category === activeCat);

    // 2) 정렬 (createdAt 기준 숫자 정렬)
    if (this.currentSort === "newest") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // 최신 → 오래
    } else {
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); // 오래 → 최신
    }
    return list;
  };

  this.renderLectureList = function (lectures) {
    const $list = document.querySelector("#lecture-list");
    if (!$list) return;

    if (lectures.length === 0) {
      $list.innerHTML = `<li class="lecture-item"><p>등록된 강의가 없습니다.</p></li>`;
      return;
    }

    const items = lectures
      .map(
        (l) => `
      <li class="lecture-item">
        <span class="lecture-image"><img src="${l.thumbnail}" alt="${l.title}"></span>
        <div class="lecture-info">
          <span class="lecture-title">${l.title}</span>
          <span class="lecture-description">${l.content}</span>
          <span class="lecture-instructor">${l.instructor} 강사님</span>
        </div>
      </li>
    `
      )
      .join("");

    $list.innerHTML = items;
  };
}

const lecture = new Lecture();
lecture.init();
