import { $ } from "/src/js/utils/dom.js";
import { store } from "/src/js/store/store.js";
const params = new URLSearchParams(location.search);
const id = params.get("id");
if (!id) {
  console.log("id 값 없습니다");
} else {
  console.log("id:", id);
  const lectures = store.getLocalStorage("lectures") || [];
  const lecture = lectures.find((l) => l.id === id);
  if (!lecture) {
    alert("일치하는 강의를 찾을 수 없습니다.");
  } else {
    $("#lecture-detail").innerHTML = `
    <main id="detailPage" class="page">
      <!-- ✅ Hero Banner -->
      <section class="hero">
        <div class="container swiper">
          <div class="hero-grid swiper-wrapper">
            <!-- 카드 1 -->
            <a class="hero-card swiper-slide" href="#">
              <img
                src="${lecture.thumbnail}"
                alt="미리캔버스 소개 배너 1"
              />
            </a>

            <!-- 카드 2 -->
            <a class="hero-card swiper-slide" href="#">
              <img
                src="https://image.wanted.co.kr/optimize?src=https%3A%2F%2Fstatic.wanted.co.kr%2Fimages%2Fcompany%2F40832%2Femy4zlhrqhryau4w__1080_790.png&w=700&q=100"
                alt="미리캔버스 소개 배너 2"
              />
            </a>

            <!-- 카드 3 (오른쪽 동그란 화살표 포함) -->
            <a class="hero-card swiper-slide with-arrow" href="#">
              <img
                src="https://image.wanted.co.kr/optimize?src=https%3A%2F%2Fstatic.wanted.co.kr%2Fimages%2Fcompany%2F40832%2Fq2ui2asdut7xzpfo__1080_790.png&w=700&q=100"
                alt="비즈하우스 소개 배너"
              />
              <span class="hero-arrow" aria-hidden="true">➜</span>
            </a>
          </div>
        </div>
      </section>
      <!-- ✅ 여기 바로 아래에 job-top 섹션 추가! -->
      <section class="job-top">
        <div class="container">
          <div class="job-grid">
            <div class="job-main">
              <div class="job-meta">
                <a href="#" class="brand">온라인</a>
                <span class="dot">·</span>
                <span>${lecture.instructor}</span>
                <span class="dot">·</span>
                <span>경력 3년 이상</span>
              </div>

              <h1 class="job-title">
                ${lecture.title}
              </h1>

              <div class="job-badges">
                <span class="badge badge-blue">Stack Up Pick!</span>
                <a class="link" href="#">${lecture.content}</a>
              </div>

              <div class="job-stats">
                <span class="bullet"></span>
                <span class="label">완강률</span>
                <span class="muted">매우 높음</span>
              </div>
            </div>

            <aside class="job-side">
              <button class="btn-primary btn-lg">수강하기</button>

              <div class="notice-card">
                <div class="notice-head">
                  <span class="title">후기보상</span>
                  <span class="muted">강의추천자, 추천인 각 현금 10만원</span>
                  <button class="icon-info" aria-label="정보">i</button>
                </div>
                <p class="notice-desc">
                  위 후기보상은 완강수강생 기준이며, 수강률과 추천인 각각 현금
                  5만원으로 달라질 수 있어요.
                </p>
              </div>
            </aside>

            <!-- (선택) 본문도 왼쪽 컨텐츠 폭에 맞추려면 container 추가 -->
            <section class="job-body container" style="padding: 24px">
              <h1>강좌 상세</h1>
              <p>여기에 강좌 상세 내용을 채우면 돼요.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
    `;
  }
}
