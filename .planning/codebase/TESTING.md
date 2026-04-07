# Testing Patterns

_Generated: 2026-04-08_

## Summary

There is no automated test suite. No test runner, no test files, no CI pipeline. All verification is manual, done in a browser over a local HTTP server. The store exposes `window.__store` and `window.__router` for console-driven testing. Any new code must be verified manually using the patterns below.

---

## Test Framework

**Runner:** None  
**Assertion Library:** None  
**Test Files:** None found in project  
**Config Files:** None (`jest.config.*`, `vitest.config.*`, etc. do not exist)

---

## How to Run the App for Manual Testing

The app **cannot be opened via `file://`** — ES Modules require an HTTP server.

```bash
# From project root
python3 -m http.server 8080
# Then open: http://localhost:8080
```

See `memory/` session notes — this is a documented known requirement.

---

## Console-Based Testing Utilities

Two globals are available in browser DevTools for manual state inspection and manipulation:

**`window.__store`** — full store object, all methods callable:
```js
// Inspect state
window.__store.getUser()
window.__store.getProgress(1)
window.__store.getMistakes()
window.__store.getStats()
window.__store.getStars()

// Simulate progress
window.__store.passLesson(1, 3, 100)
window.__store.addStars(50)
window.__store.setUserProfile('测试', 3)

// Reset everything
window.__store._reset()
```

**`window.__router`** — navigate between views without clicking:
```js
window.__router.navigate('trainingCamp')
window.__router.navigate('lessonDetail', { lessonId: 3 })
window.__router.navigate('quiz', { lessonId: 5 })
window.__router.navigate('report')
window.__router.navigate('mistakeBook')
window.__router.navigate('challenge')
window.__router.navigate('medalHall')
window.__router.goBack()
```

**`window.__showToast`** — test toast display:
```js
window.__showToast('测试消息')
window.__showToast('长消息测试', 5000)
```

---

## Manual Test Checklist by Feature

### New User Onboarding
1. Run `window.__store._reset()` in console, then reload
2. Verify `onboarding` view renders (not `trainingCamp`)
3. Complete name + grade input, confirm redirect to `trainingCamp`
4. Verify `window.__store.getUser()` returns correct name and grade

### Training Camp Map
1. Navigate to `trainingCamp`
2. Verify all 10 lesson cards render with correct colors (`macaron-*` classes)
3. Verify zigzag offset alternates (even cards `mr-6`, odd cards `ml-6`)
4. Verify path connectors appear between cards
5. Tab switch: click "专题训练" → verify topic grid renders; click "基础训练" → map returns
6. Click avatar button → verify profile panel overlay appears
7. Click a lesson card's "开始训练" button → verify navigation to `lessonDetail`

### Lesson Detail
```js
window.__router.navigate('lessonDetail', { lessonId: 1 })
```
1. Verify header shows lesson title and back button
2. Verify video placeholder renders (all `videoUrl` are `null`)
3. Click video placeholder → verify toast "已标记视频为已观看" and `videoWatched` badge appears
4. Verify key points list renders with staggered animation
5. Click "开始答题" → verify navigation to `quiz`

### Quiz Flow
```js
window.__router.navigate('quiz', { lessonId: 1 })
```
1. Verify 5 questions load (or fewer if question pool is small)
2. Select an option → verify it highlights, answer auto-submits
3. Verify correct answer shows green, wrong answer shows red
4. Verify streak counter increments on correct answers
5. Answer 3 consecutive correctly → verify result page renders
6. Answer 3 consecutive wrong → verify video hint panel appears
7. On result page: verify stars (1/2/3), XP, accuracy display correctly
8. Verify `window.__store.getProgress(1).passed === true` after completion
9. Verify `window.__store.getStars()` increased by 10 (first pass)

### Mistake Book
```js
// First create some mistakes by answering wrong in quiz
window.__router.navigate('mistakeBook')
```
1. Verify mistake cards render with question text, your answer, correct answer
2. Test lesson filter dropdown — verify list filters correctly
3. Test status tabs (全部 / 未复习 / 已复习)
4. Click "重做此题" → verify inline redo area expands
5. Answer correctly in redo → verify "已掌握" badge appears, stars awarded
6. Click "移出错题本" → verify card removed, toast shown
7. Click "清除已掌握" → verify reviewed mistakes removed

### Challenge Mode
```js
window.__router.navigate('challenge')
```
1. Verify home page shows rules and difficulty label
2. Click "开始挑战" → verify 10 questions load with timer running
3. Select an option → verify 800ms auto-submit behavior
4. Complete all 10 → verify result page with score, accuracy, time
5. Verify `window.__store.getChallengeRecords()` has new entry
6. Verify `window.__store.getStars()` increased by 15
7. Click "再战一次" → verify new challenge starts fresh

### Growth Report
```js
window.__router.navigate('growth')
```
1. Verify user ability card renders with name, grade, ability index
2. Verify ring chart canvas draws (check `document.getElementById('progress-ring')`)
3. Verify radar chart canvas draws
4. Click each sense button (看/听/闻/尝/摸) → verify score panel appears, radar highlights
5. Click same sense button again → verify panel hides
6. Click "我的错题本" button → verify navigation to `mistakeBook`
7. Click "勋章馆" button → verify navigation to `medalHall`

### Medal Hall
```js
window.__router.navigate('medalHall')
```
1. Verify medals render based on current star count
2. Run `window.__store.addStars(200)` then re-navigate → verify more medals unlock

---

## State Reset Between Test Runs

```js
// Full reset — clears all localStorage, returns to new-user state
window.__store._reset()
location.reload()

// Partial — set specific progress without full reset
window.__store.passLesson(1, 3, 100)
window.__store.passLesson(2, 2, 80)
window.__router.navigate('trainingCamp')
```

---

## Ability Index Testing

The adaptive difficulty system can be tested via console:

```js
// Check current difficulty level (1/2/3)
window.__store.getCurrentDifficulty()

// Manually drive ability index up/down
// Simulate 10 correct answers at difficulty 3
for (let i = 0; i < 10; i++) {
  window.__store.updateAbility(3, true, 5000)
}
window.__store.getAbilityIndex() // should be near 5.0

// Simulate wrong answers to drop difficulty
for (let i = 0; i < 5; i++) {
  window.__store.updateAbility(1, false, 10000)
}
```

---

## localStorage Inspection

The entire persisted state is stored under one key:

```js
// View raw persisted state
JSON.parse(localStorage.getItem('ganjue_training_state'))

// Check if state is being saved correctly after actions
window.__store.passLesson(3, 2, 60)
JSON.parse(localStorage.getItem('ganjue_training_state')).lessonProgress
```

---

## Known Gaps (No Automated Coverage)

- **Ability index algorithm** (`js/store.js` `updateAbility`) — delta calculations with difficulty multipliers and response-time corrections are untested
- **Question generation** (`js/data/questions.js` `generateQuizSet`, `pickRandomQuestions`) — randomness and fallback logic untested
- **Star/XP deduplication** — `rewardClaimed` flag on mistakes, `isFirstPass` check in `views/quiz.js` `renderResult()` — no regression protection
- **Router history stack** — `goBack()` behavior with empty history, nested navigation paths
- **Canvas rendering** — `drawRingChart` and `drawRadarChart` in `views/report.js` — no visual regression tests
- **`store.isUnlocked`** — currently hardcoded `return true` (`js/store.js` line 209); the real unlock logic is commented out and untested

---

## If Adding Automated Tests

The architecture is well-suited for unit testing the pure logic modules:

**High-value targets:**
- `js/store.js` — all methods are pure functions on a plain object; easy to unit test with any framework
- `js/data/questions.js` — `generateQuizSet`, `pickRandomQuestions` — deterministic with seeded random
- `js/data/courseLogic.js` — `calcSenseRadarScores`, `getAbilityTitle`

**Suggested setup (no build tool needed):**
```bash
# Vitest works with ES Modules natively
npm init -y
npm install -D vitest
```

```js
// Example: js/store.test.js
import { store } from './store.js'

test('passLesson saves stars correctly', () => {
  store.passLesson(1, 3, 100)
  expect(store.getProgress(1).stars).toBe(3)
  expect(store.getProgress(1).passed).toBe(true)
})
```

Views are harder to test (they write directly to `document.getElementById`) — integration testing with jsdom or Playwright would be needed for those.

---

*Testing analysis: 2026-04-08*
