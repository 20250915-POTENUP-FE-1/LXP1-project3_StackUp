## 🚀 GitHub 협업 & 자동화 가이드 (LXP1-project3_StackUp)

### 🎯 목적

이 리포지토리는 3인 팀 협업을 위해 GitHub의 **Issues + Projects + Workflows 자동화**를 활용합니다.  
이슈 생성 → 작업 → PR 머지까지의 흐름이 자동으로 프로젝트 보드에 반영됩니다.

---

### 🧩 1. 브랜치 네이밍 규칙

| 구분      | 규칙                      | 예시                             |
| --------- | ------------------------- | -------------------------------- |
| 기능 개발 | `feature/<이름>/<기능명>` | `feature/yoonsun/button-hover`   |
| 버그 수정 | `fix/<이름>/<버그내용>`   | `fix/jongdeok/input-placeholder` |

> 이름은 성 제외한 본인 영문 이름 (예: 윤선 → yoonsun, 종덕 → jongdeok)

---

### 💬 2. 커밋 메시지 규칙 (Conventional Commits)

| 타입    | 의미             | 예시                                         |
| ------- | ---------------- | -------------------------------------------- |
| `feat:` | 새로운 기능 추가 | `feat(button): add hover animation`          |
| `fix:`  | 버그 수정        | `fix(input): placeholder disappearing issue` |
| `docs:` | 문서 수정        | `docs: update README`                        |

---

### 🐞 3. Issue 작성 규칙

- Issue 템플릿 2종을 사용합니다:
  - ✨ **Feature Request** → 새 기능 제안 / 추가
  - 🐞 **Bug Report** → 버그 신고
- 제목 형식
  - `[Feat]: 컴포넌트/기능명`
  - `[Fix]: 버그 내용`

---

### 🪄 4. Project 자동화 워크플로 (완성형)

모든 이슈는 생성 즉시 **자동으로 프로젝트 보드에 추가**되며,  
진행 단계에 따라 자동으로 컬럼이 이동합니다.

| 조건          | 자동 동작                 | 결과                           |
| ------------- | ------------------------- | ------------------------------ |
| 새 Issue 생성 | Auto-add to project       | → **To Do** 컬럼으로 자동 등록 |
| 작업 진행 중  | 수동으로 In Progress 이동 |                                |
| PR 머지 시    | Pull request merged       | → **Done** 컬럼으로 자동 이동  |

프로젝트 보드:  
🔗 [LXP1-project3_StackUp Board](https://github.com/orgs/20250915-POTENUP-FE-1/projects/2)

---

### 🧭 5. 실제 협업 흐름 예시

1️⃣ 새 기능 필요 → Issue 생성 (`Feature Request` 템플릿 사용)  
2️⃣ 자동으로 **To Do** 칸에 등록  
3️⃣ 담당자 브랜치 생성

```bash
git switch -c feature/yoonsun/button-hover-#12
```

4️⃣ 커밋 및 PR 생성

```bash
git commit -m "feat(button): add hover animation (#12)"
git push -u origin feature/yoonsun/button-hover-#12
```

✅ **Tip:** 모든 이슈는 한 기능 = 한 브랜치 = 한 PR = 한 Done 카드로 관리합니다.

5️⃣ PR 본문에 Fixes #12 입력 → 머지 시 자동으로 Issue Done

⚙️ 6. 자동화 워크플로 설정 요약
| 워크플로 | 설정 내용 | 상태 |
|-----------|------------|------|
| Auto-add to project | 모든 새 이슈 자동 추가 | ✅ ON |
| Item added to project | 새 이슈의 상태를 “To Do”로 설정 | ✅ ON |
| Pull request merged | 머지된 PR의 상태를 “Done”으로 변경 | ✅ ON |

⚙️ 설정 경로: Projects → ⚙️ Settings → Workflows

👩🏻‍💻 7. 주의사항

main 브랜치에는 직접 커밋 ❌
→ 반드시 PR로 병합

이슈와 브랜치는 1:1로 관리
→ 한 기능 = 한 이슈 = 한 PR

모든 이슈에는 라벨(feature / bug)을 붙이기
