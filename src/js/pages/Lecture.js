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

  const defaultCategories = [
    { id: "cat_basic", name: "코딩 기초" },
    { id: "cat_data", name: "데이터 분석" },
    { id: "cat_ai", name: "생성형 AI" },
    { id: "cat_design", name: "디자인" },
    { id: "cat_prog", name: "프로그래밍 언어" },
  ];
  this.init = function () {
    const savedCategories = store.getLocalStorage(LS_KEY.categories);
    console.group("savedCategory:", savedCategories);
  };
}

const lecture = new Lecture();
lecture.init();
