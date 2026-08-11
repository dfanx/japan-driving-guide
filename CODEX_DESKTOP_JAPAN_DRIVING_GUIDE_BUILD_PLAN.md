# Codex Desktop 建構規劃書
# Japan Driving Guide — Codex Desktop Implementation Plan

> **Project:** Japan Driving Guide / 日本自駕交通規則互動學習指南  
> **Plan version:** 1.0  
> **Planning date:** 2026-08-09  
> **Deployment target:** GitHub Pages  
> **Primary content input:** `JAPAN_DRIVING_TOURIST_CURRICULUM_2026.md`  
> **Core constraint:** **做給海外觀光客，不做日本法規大全。**  
> **Engineering model:** Static-first + Agent Harness + build-time deterministic diagram generation.

---

# 0. 給 Codex 的第一指令

**不要一收到規劃書就直接把整站一次寫完。**

開始工作時依序：

1. 讀本文件。
2. 讀 `JAPAN_DRIVING_TOURIST_CURRICULUM_2026.md`。
3. 建立最小 Agent Harness。
4. 建立 `docs/PROJECT_BRIEF.md`、`docs/FEATURE_LIST.md`、`docs/PROGRESS.md`、`docs/DECISIONS.md`、`docs/VERIFICATION.md`。
5. 把本規劃拆成可驗證 feature。
6. **WIP=1：同一時間只能有一個 `active` feature。**
7. 先完成 Phase 0（專案骨架、內容 schema、測試與 deploy skeleton），不要先大量做 UI。
8. 每完成一項 feature，先跑對應驗證並記錄證據，再改成 `passing`。
9. 不允許未經來源查核而自行新增日本交通法規。
10. 不允許為了「看起來完整」把冷僻法規塞進教材。
11. 交通教材圖一律使用本計畫的 deterministic diagram generator；**禁止以生成式 AI 圖片直接作為法規示意圖正式資產。**

---

# 1. 產品定義 / Product Definition

## 一句話

讓海外旅客在前往日本租車前，用 30–60 分鐘學會**真正會遇到、容易犯錯、出錯代價高**的日本自駕規則，並透過情境測驗立即知道自己的弱點。同時頁面上要寫這是截至"日期"為止的法規，上路前請確認最新規範。

## 核心使用者

- 第一次在日本開車的海外觀光客
- 有駕駛經驗，但來自右側通行國家的旅客
- 從台灣、香港、新加坡、北美、歐洲、澳洲等地赴日租車者
- 不需要日本駕照考試完整知識，只需要安全完成旅程的人

## 主要使用裝置

1. **手機優先**
2. Desktop / tablet 同樣支援
3. 旅途中可能網路不穩，因此 PWA/offline 為第二階段高價值功能

## 語言

- `zh-TW`
- `en`

架構必須共用同一個 Rule ID、Question ID、Diagram ID，不能做兩套互不相干的網站。

---

# 2. 明確不做 / Non-Goals

本專案第一版不做：

- 登入
- 帳號
- 雲端資料庫
- 跨裝置同步
- 長期學習紀錄
- 排行榜
- 社群
- AI 聊天機器人
- 後台 CMS
- 法規全文搜尋
- 日本駕照正式模擬考大全
- 罰則/扣點百科
- 職業駕駛、大型車、巴士、計程車專用法規
- 使用者上傳內容
- 即時網路抓法規後直接自動發布
- 即時 runtime 交通場景生成（MVP 不需要）
- 生成式 AI 直接產生具有法律語意的正式教材圖

**原則：少做功能，多做正確性。**

---

# 3. 成功指標 / Success Criteria

MVP 成功不是「頁數很多」，而是：

1. 使用者可在 10 分鐘看完 Must Know。
2. 可在 30–45 分鐘完成完整觀光客核心教材。
3. 中英文內容一一對齊。
4. 至少 60 題經來源查核的題庫。
5. 每題立即顯示答案與解釋。
6. 完成測驗後顯示：
   - 總分
   - 各 weakness tag 正確率
   - 需要重讀的章節
7. 不需要帳號。
8. reload/關頁後不要求保存長期學習記錄。
9. 交通圖在 360 px 手機寬度仍可清楚判讀。
10. 所有規則內容可追溯到 Source ID。
11. `npm run verify` 一次完成 lint/typecheck/test/build/critical e2e。
12. GitHub Pages 自動部署成功。

---

# 4. 建議技術架構 / Recommended Architecture

## Frontend

- **Astro**
- **TypeScript**
- **React islands**：只用於 Quiz、score、weakness analysis、少量互動
- **Tailwind CSS**：版面與 Design System
- Astro Content Collections / schema validation
- Zod（若 Astro 既有能力足夠，避免重複引入）
- Vitest
- Playwright

## Deployment

- GitHub Pages
- GitHub Actions build + deploy
- 完全 static output

## Backend

**None**

## Database

**None**

## Authentication

**None**

## Runtime persistence

MVP：
- memory/state in current page
- optional `sessionStorage` for accidental refresh recovery

不要使用 LocalStorage 建立假性「學習帳號」。

---

# 5. 高層架構 / High-Level Architecture

```text
Official Sources
    ↓
Human-reviewed Rule Metadata
    ↓
Bilingual Lesson Content
    ↓
Question Bank ──────────────┐
    ↓                       │
Diagram Scene Specs         │
    ↓                       │
Build-time Diagram Generator│
    ↓                       │
Static SVG Assets           │
    ↓                       │
Astro Static Site ←─────────┘
    ↓
React Quiz Island
    ↓
Session Score + Weakness Analysis
    ↓
GitHub Pages
```

核心決策：

> **交通圖可以由程式產生，但 production 不在瀏覽器即時畫。**

採用：

> `Scene JSON → build-time SVG → QA → immutable static asset`

以降低 runtime 排版漂移與 generator 改版造成全站畫面瞬間變動的風險。

---

# 6. Repo 結構 / Repository Structure

```text
japan-driving-guide/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ astro.config.mjs
├─ tsconfig.json
├─ .gitignore
├─ .github/
│  └─ workflows/
│     ├─ verify.yml
│     └─ deploy-pages.yml
│
├─ docs/
│  ├─ PROJECT_BRIEF.md
│  ├─ FEATURE_LIST.md
│  ├─ PROGRESS.md
│  ├─ DECISIONS.md
│  ├─ VERIFICATION.md
│  ├─ ACCEPTANCE.md
│  ├─ RUNBOOK.md
│  ├─ CONTENT_GOVERNANCE.md
│  ├─ DIAGRAM_SYSTEM.md
│  └─ SOURCE_REGISTER.md
│
├─ src/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ zh-TW/
│  │  │  ├─ index.astro
│  │  │  ├─ learn/
│  │  │  ├─ signs/
│  │  │  └─ quiz/
│  │  └─ en/
│  │     ├─ index.astro
│  │     ├─ learn/
│  │     ├─ signs/
│  │     └─ quiz/
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ lesson/
│  │  ├─ quiz/
│  │  ├─ diagrams/
│  │  └─ common/
│  │
│  ├─ content/
│  │  └─ lessons/
│  │     ├─ M00-eligibility/
│  │     │  ├─ zh-TW.md
│  │     │  └─ en.md
│  │     ├─ M01-left-side/
│  │     └─ ...
│  │
│  ├─ data/
│  │  ├─ rules/
│  │  │  └─ *.json
│  │  ├─ questions/
│  │  │  └─ *.json
│  │  ├─ sources/
│  │  │  └─ sources.json
│  │  └─ diagram-manifest.json
│  │
│  ├─ lib/
│  │  ├─ content/
│  │  ├─ quiz/
│  │  ├─ weakness/
│  │  ├─ effective-date/
│  │  └─ validation/
│  │
│  └─ styles/
│
├─ tools/
│  └─ diagram-generator/
│     ├─ src/
│     │  ├─ cli.ts
│     │  ├─ schema.ts
│     │  ├─ renderer.ts
│     │  ├─ geometry/
│     │  ├─ primitives/
│     │  ├─ templates/
│     │  ├─ validators/
│     │  └─ manifest.ts
│     ├─ scenes/
│     │  ├─ D001.json
│     │  ├─ D002.json
│     │  └─ ...
│     ├─ golden/
│     └─ tests/
│
├─ public/
│  └─ diagrams/
│     ├─ D001.svg
│     ├─ D002.svg
│     └─ ...
│
├─ scripts/
│  ├─ init.ps1
│  ├─ init.sh
│  ├─ verify.ps1
│  ├─ verify.sh
│  ├─ validate-content.ts
│  └─ build-diagrams.ts
│
└─ tests/
   ├─ unit/
   ├─ content/
   ├─ diagram/
   └─ e2e/
```

---

# 7. Agent Harness 規範

本專案要讓 Codex Desktop 能多 session 穩定接手，因此 Repo 自己必須保存執行規則、狀態與驗證證據。

## 7.1 `AGENTS.md` 保持短

目標 50–150 行，只放：

- 專案一句話
- 技術棧
- 常用指令
- 必讀 docs 路由
- 不可違反規則
- Session start
- Session end

詳細規格放 `docs/`。

## 7.2 WIP=1

任何時候只允許：

```text
1 feature = active
```

不允許：

- 做 Quiz 順便重做整站 CSS
- 修 diagram generator 順便改 lesson schema
- 做 GitHub Pages 順便導入新的 state framework
- 做一個 bug 順便重構所有元件

## 7.3 Feature 狀態

只能用：

```text
not_started
active
blocked
passing
```

只有驗證通過並記錄 evidence 後，才能 `passing`。

## 7.4 完成一定要有證據

每次完成至少留下：

- 改了什麼
- 跑了什麼
- PASS / FAIL / NOT RUN
- 未驗證事項
- 已知風險
- 回滾方式
- 下一步

## 7.5 Session handoff

新的 Agent 只讀 repo 應能在 3 分鐘知道：

- 專案在做什麼
- 怎麼啟動
- 怎麼測
- 現在做到哪裡
- 哪個 feature active
- 下一個 feature 是什麼
- 有什麼不要碰

---

# 8. 內容資料模型 / Content Data Model

## 8.1 Rule metadata

```json
{
  "id": "JP-RULE-SIGNAL-RED-001",
  "category": "signals",
  "touristPriority": "must_know",
  "legalOrGuidance": "legal_rule",
  "sourceIds": ["S03", "S10"],
  "verifiedAt": "2026-08-09",
  "effectiveFrom": null,
  "effectiveTo": null,
  "reviewStatus": "approved",
  "lessonIds": ["M02-signals"]
}
```

`legalOrGuidance` enum：

```text
legal_rule
official_guidance
practical_advice
```

網站顯示文字要根據類型使用不同語氣，避免把「建議」寫成「法律義務」。

---

## 8.2 Source metadata

```json
{
  "id": "S09",
  "title": "生活道路における自動車の法定速度が引き下げられます",
  "authority": "National Police Agency",
  "url": "https://www.npa.go.jp/bureau/traffic/seikatsudouro/seikatsudoro.html",
  "tier": "S",
  "checkedAt": "2026-08-09",
  "notes": "30 km/h statutory limit change effective 2026-09-01"
}
```

---

## 8.3 Lesson pair

一個 module 共享 ID：

```text
M04-pedestrians
```

內容：

```text
src/content/lessons/M04-pedestrians/zh-TW.md
src/content/lessons/M04-pedestrians/en.md
```

兩份 frontmatter 必須擁有相同：

- `id`
- `ruleIds`
- `diagramIds`
- `quizTags`
- `order`

Build 時檢查 bilingual parity。

---

## 8.4 Question schema

```json
{
  "id": "Q008",
  "type": "single_choice",
  "tags": ["pedestrians"],
  "ruleIds": ["JP-RULE-CROSSWALK-001"],
  "diagramId": "D009",
  "difficulty": 1,
  "prompt": {
    "zh-TW": "斑馬線旁有行人面向道路等待，你應該？",
    "en": "A pedestrian is waiting at a crossing facing the road. What should you do?"
  },
  "options": [
    {
      "id": "A",
      "text": {
        "zh-TW": "維持速度",
        "en": "Maintain speed"
      }
    },
    {
      "id": "B",
      "text": {
        "zh-TW": "以能停住的速度接近，必要時停讓",
        "en": "Approach ready to stop and yield"
      }
    }
  ],
  "answer": "B",
  "explanation": {
    "zh-TW": "...",
    "en": "..."
  },
  "reviewStatus": "approved"
}
```

## 題庫原則

- 70% 情境題
- 20% 標誌/圖像辨識
- 10% 必要事實題
- 不考法條號碼
- 不考冷僻罰款
- 每題一定指向 `ruleIds`
- 每題一定有 answer explanation
- 有法律語意的題目必須 `reviewStatus=approved` 才能進 production

---

# 9. 生效日期引擎 / Effective-Date Engine

這個功能不能省。

2026-09-01 的生活道路速限變更證明：

> 靜態教材也需要版本治理。

Rule schema：

```json
{
  "id": "JP-RULE-SPEED-LOCAL-2026",
  "effectiveFrom": "2026-09-01",
  "effectiveTo": null
}
```

同一主題允許有舊版本：

```json
{
  "id": "JP-RULE-SPEED-LOCAL-PRE-2026-09",
  "effectiveFrom": null,
  "effectiveTo": "2026-08-31"
}
```

## Build behavior

以 build date / 明確設定的 `CONTENT_AS_OF_DATE` 決定：

- active
- upcoming
- expired

不要依 client local clock silently 改法律內容。

GitHub Actions build 要輸出：

```text
Content effective date: YYYY-MM-DD
```

並在網站 Footer 顯示：

```text
Traffic-rule content verified: YYYY-MM-DD
```

---

# 10. 教材圖產生器 / Deterministic Diagram Generator

## 10.1 決策

不用：

```text
browser runtime CSS scene engine
```

也不用：

```text
AI image prompt → random PNG
```

使用：

```text
Scene JSON
  ↓
TypeScript deterministic renderer
  ↓
SVG
  ↓
validation
  ↓
visual QA
  ↓
public/diagrams/*.svg
```

### 為什麼

- 只有數十到數百張圖，儲存空間不是核心問題。
- Static SVG 跨裝置穩定、清晰。
- Build-time 產圖仍能重用元件。
- 人工 QA 後的圖不會因 runtime renderer 更新而偷偷改變。
- Git diff 能看到 scene definition 的修改。
- Generator 可批次重建，但 production asset 有 manifest/hash 控制。

---

# 11. 圖產生器技術規格

## 11.1 Logical Canvas

固定使用：

```text
viewBox = 0 0 1200 800
```

必要時提供：

```text
1200 × 1200
```

square variant。

所有 layout 使用 logical units，不使用 browser pixel coordinate。

---

## 11.2 基本圖元 / Primitives

至少：

```text
RoadSegment
Lane
CenterLine
LaneBoundary
StopLine
Crosswalk
RailCrossing
Curb
Sidewalk
TrafficLight
RoadSign
Vehicle
Bicycle
Pedestrian
DirectionalArrow
ErrorMark
CorrectMark
LabelBadge
ETCGate
GuardRail
```

---

## 11.3 Scene Templates

MVP 先完成：

```text
T01 StraightRoad
T02 FourWayIntersection
T03 TJunction
T04 Crosswalk
T05 RailwayCrossing
T06 ExpresswayMerge
T07 ExpresswayLanes
T08 TollGate
T09 ParkingRoadside
T10 OneWayStreet
T11 NarrowLocalRoad
T12 BicyclePassing
```

只有當現有 template 無法乾淨表達新教材時才新增。

---

## 11.4 Scene JSON 示例

```json
{
  "id": "D006",
  "template": "FourWayIntersection",
  "canvas": {
    "aspect": "3:2"
  },
  "roads": {
    "northSouth": { "lanesPerDirection": 1 },
    "eastWest": { "lanesPerDirection": 1 }
  },
  "signals": [
    {
      "approach": "south",
      "state": "green"
    }
  ],
  "vehicles": [
    {
      "id": "A",
      "color": "yellow",
      "from": "south",
      "maneuver": "right",
      "label": "A"
    },
    {
      "id": "B",
      "color": "blue",
      "from": "north",
      "maneuver": "straight",
      "label": "B"
    }
  ],
  "annotations": [
    {
      "type": "yield",
      "vehicle": "A",
      "to": "B"
    }
  ]
}
```

---

# 12. 圖形幾何不可違反的 Invariants

Generator 必須自動檢查：

1. 車輛中心點必須落在合法 lane polygon 內。
2. 車輛 bounding box 不可超出 viewBox。
3. StopLine 不可畫在 crosswalk 後方，除非 scene 明確宣告特殊配置。
4. Crosswalk 條紋不可超出 road polygon。
5. TrafficLight / sign 不可壓到主要 vehicle path。
6. 方向箭頭不得與車輛方向矛盾。
7. 兩車若不是故意示意碰撞，不得重疊。
8. label 不得遮住停止線、號誌、行人等關鍵語意。
9. 在 360 px 寬等效縮圖下，A/B label 與禁止/正確符號仍可辨識。
10. 顏色不是唯一資訊；`×` / `✓` / shape / label 必須保留語意。

任何 invariant fail：

```text
build-diagrams = FAIL
```

---

# 13. Diagram Style Tokens

```text
road.surface        #53575C
road.shoulder       #D8CCB8
road.marking        #F7F7F2
danger              #D93A32
success             #1E8E69
vehicle.yellow      #F1B928
vehicle.blue        #3C77C5
vehicle.red         #CF4A44
text.primary        #202327
```

**顏色可微調，但全站統一。**

## 視覺風格

參考「優質日本駕駛教材」的資訊密度：

- 俯視
- 簡化
- 幾何精準
- 無不必要背景
- 車輛圖形有方向性
- 號誌/標線比例合理
- 禁止/正確符號清楚

**不能直接複製使用者參考書的圖、車輛造型、版面或插畫。**  
只使用其「教材圖應該精準、清楚、簡化」這個設計原則。

---

# 14. Generator Output & Immutability

輸出：

```text
public/diagrams/D006.svg
```

Manifest：

```json
{
  "id": "D006",
  "sceneHash": "sha256:...",
  "outputHash": "sha256:...",
  "generatorVersion": "1.0.0",
  "reviewStatus": "approved",
  "reviewedAt": "2026-08-09"
}
```

## Generator 改版時

若重建造成 output hash 改變：

```text
old approved asset
    ↓
diff detected
    ↓
reviewStatus = needs_review
    ↓
visual diff
    ↓
human approval
    ↓
approved
```

不可自動把 100 張圖全部更新後直接發布。

---

# 15. 圖片格式策略

MVP：

- **SVG 為主**
- `SVGO` 或等價最佳化
- 不把教材圖轉成 raster 才顯示

需要 social preview / 特殊平台時：

- generator 可選擇輸出 WebP/PNG derivative
- raster 不是 source of truth

Source of truth：

```text
Scene JSON + Generator version
```

---

# 16. Diagram Accessibility

每個 diagram scene 必須有語意描述：

```json
{
  "alt": {
    "zh-TW": "黃色 A 車準備右轉，藍色 B 車由對向直行，A 車應讓 B 車先行。",
    "en": "Yellow vehicle A is turning right while blue vehicle B approaches straight ahead; A must yield to B."
  }
}
```

不要把說明文字大量烤進 SVG。

正式中文/英文解說放 HTML，SVG 盡量語言中立，只保留：

- A/B
- STOP/止まれ等真實道路標誌
- arrows
- symbols

---

# 17. 內容治理 / Content Governance

## Source tier

### Tier S
- NPA
- e-Gov

### Tier A
- JAF
- JNTO
- NEXCO

### Tier B
- 其他政府/都道府縣警察官方旅客安全資料

### 禁止作為最終法規依據
- SEO blog
- Reddit
- travel influencer
- rental-company marketing copy
- AI answer without source

---

# 18. Content Validator

`scripts/validate-content.ts` 必須檢查：

- 每個 rule 至少一個 source
- `legal_rule` 優先含 Tier S source
- `verifiedAt` 有值
- effective date 格式正確
- expired rule 不被當 current
- zh-TW / en lesson pair 存在
- question references valid Rule ID
- question references valid diagram if specified
- answer option exists
- explanation exists in both languages
- diagram manifest item exists
- production diagram is `approved`
- source URL 非空
- 不允許 duplicate ID

驗證失敗：

```text
npm run build = FAIL
```

---

# 19. 網站 IA / Information Architecture

## Home

首頁不要做「法規目錄」。

首屏：

```text
Japan Driving Guide
第一次在日本開車？
30 分鐘掌握真正會用到的規則
```

CTA：

```text
10 分鐘必學
完整學習
直接測驗
```

English 同構。

---

## Learn

### Fast Track — 10 分鐘
12 Rules to Remember First

### Full Guide — 30–45 分鐘

1. Legal documents
2. Left-side driving
3. Traffic lights
4. STOP
5. Intersections
6. Pedestrians
7. Cyclists
8. Speed
9. Railway crossings
10. Signs
11. Parking
12. Expressways / ETC
13. Fuel
14. Weather
15. Emergencies

---

## Signs

只做：

```text
Tourists' Essential Signs
```

不要做全日本標誌百科。

支援：

- category filter
- quick recognition cards
- click for one-sentence action

---

## Quiz

入口：

```text
Quick Check — 10 questions
Full Check — 30 questions
By Topic
```

MVP question pool：

```text
≥ 60 reviewed questions
```

---

# 20. Quiz Engine

全前端。

State：

```ts
type QuizSession = {
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, string>;
  results: Record<string, boolean>;
};
```

結束後：

```text
Score: 24 / 30

Strong:
- Signals 100%
- Expressway 90%

Review:
- Pedestrians 60%
- Intersections 50%

Recommended:
- M05 Intersections
- M06 Pedestrians
```

## 不儲存

- name
- email
- identity
- long-term profile

可以用 sessionStorage 防止 refresh 意外遺失，但 close session 後不要求留存。

---

# 21. Weakness Algorithm

不要 AI。

確定性計算：

```text
tag score =
correct answers for tag
/
total answered for tag
```

門檻：

```text
>= 0.80 strong
0.60–0.79 review
< 0.60 priority_review
```

若某 tag 只有 1 題：

- 不顯示過度精確百分比
- 顯示「樣本不足 / limited sample」

---

# 22. Question Selection

Quick 10：

- 至少涵蓋 8 個核心 tags
- 必含：
  - left_side
  - signals
  - stop
  - intersections
  - pedestrians
  - speed
  - expressway or rail_crossing
  - emergency

Full 30：

- 使用 seed-controlled randomization
- 每次能變化
- 但相同 seed 可重現，方便 debug

不得生成不存在於題庫的新法律題。

---

# 23. UI / UX

## Design goals

- 不是駕訓班考試網站
- 不是政府法規網站
- 像高品質旅遊安全指南
- 圖比字快
- 一個畫面只教一個主要決策

## Card rhythm

```text
Scenario
↓
Diagram
↓
What to do
↓
Why
↓
Common mistake
↓
1-question check
```

## Mobile

以：

```text
360 × 800
```

作最低主要 viewport 驗收。

也測：

```text
390 × 844
768 × 1024
1440 × 900
```

---

# 24. Accessibility

最低：

- WCAG AA 對比
- keyboard usable
- visible focus
- no hover-only instruction
- diagrams with localized alt
- answers not indicated by color alone
- reduced motion support
- semantic headings
- correct `lang`
- language switch preserves equivalent page where possible

---

# 25. PWA / Offline

不放在第一個 active feature。

Phase 2 完成 core site 後再做：

- app manifest
- service worker
- cache core lessons
- cache diagrams
- cache quiz bank
- offline fallback

目標：

> 旅客在出發前開過網站一次，到了山區/停車場網路差時仍能查核心規則。

---

# 26. GitHub Pages Deployment

要求：

- static output
- 支援 repository base path
- GitHub Actions deploy
- PR / push 先 verify
- main passing 才 deploy

CI minimum：

```text
npm ci
npm run lint
npm run typecheck
npm run test
npm run validate:content
npm run diagrams:check
npm run build
npm run test:e2e:smoke
```

---

# 27. Verification Layers

## Level 1 — Static

- lint
- typecheck
- Astro build
- content schema
- duplicate IDs
- dead internal links

## Level 2 — Unit

- weakness score
- quiz selection
- effective date
- locale parity
- diagram geometry helpers
- content validation

## Level 3 — Diagram

- scene schema validation
- invariants
- golden SVG output
- selected visual snapshots

## Level 4 — E2E

Playwright：

1. Home loads
2. zh-TW → en switch
3. Learn module
4. diagram displays
5. answer quiz
6. immediate explanation
7. finish quiz
8. weakness result
9. mobile viewport
10. no serious console error
11. GitHub Pages base-path routing

---

# 28. Visual Regression Strategy

不要對每張圖做 fragile pixel-perfect browser snapshot。

分兩層：

### Generator unit / golden
對 12 個 template 各保留 1–2 個 golden SVG。

### Content QA
所有 approved diagram 存 hash。

Generator change：

- 只列出 affected diagram
- 產生 before/after review page
- 人工確認後更新 manifest approval

---

# 29. Content Regression Strategy

至少建立：

```text
tests/content/
```

檢查：

### Speed transition test

```text
2026-08-31 → pre-change rule
2026-09-01 → new 30 km/h local-road rule
```

### Translation parity

每個 must_know rule：

```text
zh-TW exists
en exists
```

### Legal/source traceability

每個 question：

```text
question → rule → source
```

不得斷鏈。

---

# 30. Copyright / Content Safety

- 官方規則要**摘要重寫**，不要大量複製官方文字。
- 道路標誌可依官方規格重新向量化，但要保持語意正確。
- 使用者提供的書本只當視覺品質參考。
- **不得複製書中插畫、構圖、車輛素材、頁面排版。**
- Diagram generator 全部自己建立原創 vector primitives。
- 不抓 Google Maps / Street View 圖片放進 repo。
- 若未來加入實景照片，必須有清楚授權來源。

---

# 31. Risk Register

| Risk | Severity | Mitigation |
|---|---:|---|
| 法規錯誤/幻覺 | P0 | Rule → source traceability；官方 source 優先；人工 approve |
| 2026 新制日期錯置 | P0 | effective-date engine + tests |
| 中文英文意思不一致 | P1 | parity validator + bilingual review |
| Diagram 法律語意畫錯 | P0 | deterministic generator + approved manifest |
| Generator 一改全站圖變 | P1 | output hash + needs_review gate |
| Codex scope creep | P1 | WIP=1 + FEATURE_LIST |
| 把網站做成法規大全 | P1 | Tourist relevance gate |
| GitHub Pages base path 壞 | P1 | E2E base-path test |
| 題庫答案無來源 | P0 | question→rule→source validator |
| 手機圖太小 | P1 | 360px acceptance |
| 過度動畫影響理解 | P2 | motion only when it teaches sequence |
| 資產過大 | P2 | optimized SVG + lazy loading |

---

# 32. Tourist Relevance Gate

任何新內容加入前回答：

```text
Frequency: 0–3
Safety impact: 0–3
Tourist confusion: 0–3
Trip usefulness: 0–3
```

總分：

```text
0–4   reject from core
5–7   optional/reference
8–10  useful
11–12 must_know
```

若內容是：

> 「法律上存在，但一般租車旅客幾乎遇不到」

放棄加入 core。

這個 Gate 的優先級高於「法規完整性」。

---

# 33. 初始 Feature List

Codex 初始化後，把下面拆成 `docs/FEATURE_LIST.md`。

| ID | Feature | Initial status | Acceptance |
|---|---|---|---|
| F001 | Repo / Astro skeleton | not_started | install/build works |
| F002 | Harness docs + init/verify scripts | not_started | new session can start from repo |
| F003 | Source/Rule schema | not_started | valid example + validator |
| F004 | Effective-date logic | not_started | boundary tests pass |
| F005 | Bilingual lesson content schema | not_started | zh/en pair validation |
| F006 | Base layout + responsive design system | not_started | 360/1440 screenshots |
| F007 | Home + Fast Track | not_started | bilingual routes work |
| F008 | Full Learn navigation | not_started | all modules navigable |
| F009 | Essential Signs | not_started | curated signs only |
| F010 | Question schema + seed bank import | not_started | questions validate |
| F011 | Quiz session engine | not_started | unit tests |
| F012 | Immediate answer explanation | not_started | E2E |
| F013 | Weakness analyzer | not_started | deterministic tests |
| F014 | Quiz result/review links | not_started | E2E |
| F015 | Diagram generator primitives | not_started | unit tests |
| F016 | Diagram templates T01–T06 | not_started | golden tests |
| F017 | Diagram templates T07–T12 | not_started | golden tests |
| F018 | D001–D024 scenes | not_started | all approved assets generated |
| F019 | Diagram manifest/review gate | not_started | hash change → needs_review |
| F020 | Lesson integration with diagrams | not_started | mobile readable |
| F021 | Content traceability page/footer | not_started | verified date/source shown |
| F022 | GitHub Pages CI/CD | not_started | deploy smoke pass |
| F023 | Full mobile/accessibility pass | not_started | acceptance checklist |
| F024 | PWA/offline | not_started | offline core guide |
| F025 | Production content revalidation | not_started | latest sources checked before release |

---

# 34. 開發階段 / Phases

## Phase 0 — Harness + Skeleton

只能做：

- repo skeleton
- install/start/build
- AGENTS
- FEATURE_LIST
- PROGRESS
- verify script
- one smoke test

**不要先做大量教材 UI。**

---

## Phase 1 — Data Contract

先鎖定：

- Source schema
- Rule schema
- Lesson schema
- Question schema
- Diagram scene schema
- Effective date

這是專案真正的 foundation。

---

## Phase 2 — Vertical Slice

只完成一條完整鏈：

```text
Source S03
↓
Rule red-light
↓
Lesson M02
↓
Diagram D002
↓
Question Q002
↓
Quiz
↓
Weakness result
```

這條全部 passing，才擴大量。

---

## Phase 3 — Content Expansion

把教材匯入：

- zh-TW
- en
- source IDs
- rule IDs

不要一次讓 Agent 自動「自由擴寫所有交通規則」。

只把既定教材結構化。

---

## Phase 4 — Diagram System

- primitives
- templates
- D001–D024
- invariants
- golden
- manifest
- QA

---

## Phase 5 — Quiz

- 60+ reviewed questions
- quick/full/topic modes
- score
- weakness
- review links

---

## Phase 6 — Release

- mobile
- accessibility
- GitHub Pages
- content revalidation
- 2026-09-01 speed rule state
- source check
- P0/P1 = 0

---

# 35. Codex 不應自行做的事

沒有使用者確認不要：

- 換成 Next.js
- 新增 backend
- 新增 Supabase/Firebase
- 加登入
- 加 CMS
- 加 AI API
- 加 analytics/tracking SDK
- 大量引入 UI framework
- 做 3D traffic simulator
- 把 diagram generator 變成 runtime game engine
- 自動 scraping 後 auto-publish
- 新增大量不在教材中的法規
- 重新定義產品為「駕照考試網站」

---

# 36. 依賴原則

新增 dependency 前問：

1. 原生 Web / Astro 能不能做？
2. 這個 dependency 是否長期必要？
3. 能不能用 50 行內部 code 取代？
4. 對 static GitHub Pages 有沒有實際價值？

大型 dependency 必須記錄 `docs/DECISIONS.md`。

---

# 37. Definition of Done

一個 feature 只有在：

```text
status = passing
```

而且：

- acceptance satisfied
- tests passed
- evidence recorded
- docs updated
- no new P0/P1
- rollback described
- no secrets
- no unrelated changes

才算完成。

**「我已經實作」不是完成證據。**

---

# 38. Session Start Template

每次 Codex session：

```markdown
## Session Start
- Active feature:
- Files to read:
- Scope:
- Out of scope:
- Risk:
- Verification:
- Rollback:
```

先回報再改碼。

---

# 39. Session End Template

```markdown
## Completed
- ...

## Files changed
- ...

## Verification
- `npm run ...`: PASS/FAIL/NOT RUN

## Content/source evidence
- Rule IDs:
- Source IDs:

## Diagram evidence
- Diagram IDs:
- Manifest status:

## Risks / unverified
- ...

## Next
- ...
```

更新：

```text
docs/FEATURE_LIST.md
docs/PROGRESS.md
docs/DECISIONS.md (if needed)
```

---

# 40. 建議 package scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run validate:content && npm run diagrams:check && astro build",
    "preview": "astro preview",
    "lint": "...",
    "typecheck": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "validate:content": "tsx scripts/validate-content.ts",
    "diagrams:build": "tsx scripts/build-diagrams.ts",
    "diagrams:check": "tsx tools/diagram-generator/src/cli.ts check",
    "verify": "npm run lint && npm run typecheck && npm run test && npm run build && npm run test:e2e:smoke"
  }
}
```

實際 lint tool 可由 Codex在初始化時選擇，但不要重複堆疊 ESLint/Biome 等多套工具。

---

# 41. README 首屏應回答

```text
What is this?
Who is it for?
How do I run it?
How do I verify it?
How do I build diagrams?
Where is content?
Where is current progress?
How do I deploy?
```

不要把 README 變成完整設計規格。

---

# 42. Release Checklist

## Content
- [ ] NPA sources rechecked
- [ ] foreign-license guidance current
- [ ] 2026-09-01 speed rule status correct
- [ ] bicycle 2026 guidance correct
- [ ] zh/en parity passes
- [ ] no unapproved rule
- [ ] no unapproved quiz question

## Diagram
- [ ] D001–D024 generated
- [ ] all `approved`
- [ ] mobile readable
- [ ] no geometry failures
- [ ] no copyrighted copied illustration

## Product
- [ ] Fast Track works
- [ ] Full Guide works
- [ ] Quick Quiz works
- [ ] Full Quiz works
- [ ] weakness result works
- [ ] language switch works

## Engineering
- [ ] lint
- [ ] typecheck
- [ ] unit
- [ ] content validation
- [ ] diagram validation
- [ ] build
- [ ] smoke E2E
- [ ] GitHub Pages route/base test

## Severity
- [ ] P0 = 0
- [ ] P1 = 0

---

# 43. 建議第一次交給 Codex Desktop 的 Prompt

```markdown
請把目前資料夾視為 Japan Driving Guide 專案根目錄。

你會收到：
1. `CODEX_DESKTOP_JAPAN_DRIVING_GUIDE_BUILD_PLAN.md`
2. `JAPAN_DRIVING_TOURIST_CURRICULUM_2026.md`

請先完整閱讀兩份文件，但不要立刻建構整站。

依規劃書執行 Phase 0：

1. 建立最小 Astro + TypeScript static site skeleton。
2. 建立 AGENTS.md。
3. 建立 docs/PROJECT_BRIEF.md。
4. 建立 docs/FEATURE_LIST.md，將規劃書初始 features 轉成可驗證項目。
5. 建立 docs/PROGRESS.md、DECISIONS.md、VERIFICATION.md、ACCEPTANCE.md。
6. 建立 init/verify scripts。
7. 建立一個最小首頁與 smoke test，證明專案可以 install / dev / build / test。
8. 不要開始大量搬教材。
9. 不要開始大量產圖。
10. 不要新增 backend、database、login 或 AI API。

工作規則：
- WIP=1。
- 一次只啟動一個 feature。
- 不做無關重構。
- 不在未驗證時宣稱完成。
- 所有日本交通規則必須可回指教材中的 Source ID。
- 教材定位是海外觀光客實用指南，不是日本法規大全。

開始前先回覆：
1. 你讀到的產品核心目標
2. Phase 0 範圍
3. 明確不做的項目
4. 預計建立/修改的檔案
5. 驗證方式
6. 風險與回滾方式

確認計畫後才開始修改檔案。
```

---

# 44. 最終架構判斷

這個專案真正要最佳化的不是：

```text
最少圖片
最少 KB
最多法規
最多功能
```

而是：

```text
正確
↓
旅客看得懂
↓
旅客記得住
↓
場景能判斷
↓
出事知道怎麼處理
↓
Codex 長期維護不失控
```

所以最終選擇是：

> **Static-first education product + source-governed content + deterministic build-time SVG diagrams + lightweight quiz engine + repo-local Agent Harness.**

不要把它做成「法規資料庫」，也不要把它做成「交通模擬器」。

它應該是一個：

> **海外旅客在真正拿到日本租車鑰匙之前，願意花 30 分鐘完成的安全學習工具。**
