/**
 * js/data/questions/index.js
 * ─────────────────────────────────────────────────────────────
 * 题库汇总入口（300 题版，2026-05-15）
 *
 * 编码规范：K<知识点>-D<难度>-[<学段>]<序号>
 *   K3-D1-01    知识点3 难度1 第1题
 *   K3-D3-S01   知识点3 难度3 小学段 第1题
 *
 * 抽题规则（5.13 增补）：每轮 10 题 = 难度1×3 + 难度2×3 + 难度3×4
 *   难度3 按学生学段 S/C/H 过滤
 * ─────────────────────────────────────────────────────────────
 */

import { Q01 } from './q01.js';
import { Q02 } from './q02.js';
import { Q03 } from './q03.js';
import { Q04 } from './q04.js';
import { Q05 } from './q05.js';
import { Q06 } from './q06.js';
import { Q07 } from './q07.js';
import { Q08 } from './q08.js';
import { Q09 } from './q09.js';
import { Q10 } from './q10.js';

/** 全部活跃题（archived 已过滤掉，约 297 题） */
export const QUESTIONS = [
  ...Q01, ...Q02, ...Q03, ...Q04, ...Q05,
  ...Q06, ...Q07, ...Q08, ...Q09, ...Q10,
].filter(q => q.status !== 'archived');

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────

/** Fisher-Yates 洗牌（不改原数组） */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 取一节课某难度的题（D3 还要按学段过滤）
 * @param {number} lessonId
 * @param {1|2|3} difficulty
 * @param {'S'|'C'|'H'} stage   仅 D3 用；D1/D2 忽略
 * @returns {Question[]}
 */
export function getQuestions(lessonId, difficulty, stage = 'S') {
  return QUESTIONS.filter(q => {
    if (q.lessonId !== lessonId) return false;
    if (q.difficulty !== difficulty) return false;
    if (difficulty === 3 && q.stage && q.stage !== stage) return false;
    return true;
  });
}

/**
 * 抽一轮基础训练题：难度1×3 + 难度2×3 + 难度3×4 = 10 题
 * @param {number} lessonId
 * @param {'S'|'C'|'H'} stage
 * @param {Set<string>} excludeIds  已用过的题 id（补测时传入）
 * @returns {Question[]}
 */
export function generateLessonRound(lessonId, stage = 'S', excludeIds = new Set()) {
  const pickN = (diff, n) => {
    const pool = shuffle(getQuestions(lessonId, diff, stage)).filter(q => !excludeIds.has(q.id));
    return pool.slice(0, n);
  };

  const d1 = pickN(1, 3);
  const d2 = pickN(2, 3);
  const d3 = pickN(3, 4);
  let picked = [...d1, ...d2, ...d3];

  // 题量不足时（题库见底/学段过滤太严）从同课全部题里补
  if (picked.length < 10) {
    const ids = new Set([...picked.map(q => q.id), ...excludeIds]);
    const fallback = shuffle(QUESTIONS.filter(q => q.lessonId === lessonId && !ids.has(q.id)));
    picked = [...picked, ...fallback].slice(0, 10);
  }
  return picked;
}

/**
 * 补测一轮：3 题（难度配比 1:1:1）
 * @param {number} lessonId
 * @param {'S'|'C'|'H'} stage
 * @param {Set<string>} excludeIds
 * @returns {Question[]}
 */
export function generateRetryRound(lessonId, stage = 'S', excludeIds = new Set()) {
  const pickN = (diff, n) => {
    const pool = shuffle(getQuestions(lessonId, diff, stage)).filter(q => !excludeIds.has(q.id));
    return pool.slice(0, n);
  };
  let picked = [...pickN(1, 1), ...pickN(2, 1), ...pickN(3, 1)];
  if (picked.length < 3) {
    const ids = new Set([...picked.map(q => q.id), ...excludeIds]);
    const fallback = shuffle(QUESTIONS.filter(q => q.lessonId === lessonId && !ids.has(q.id)));
    picked = [...picked, ...fallback].slice(0, 3);
  }
  return picked;
}

/**
 * 挑战赛：从全题库按难度比例抽题
 * - difficulty 1 → 主 1，少量 2
 * - difficulty 2 → 1/2/3 混合
 * - difficulty 3 → 主 3，少量 2
 * 只用 single + multi 题型，避免混入连线/判断（挑战赛交互简化）
 * @param {1|2|3} difficulty
 * @param {number} count
 * @param {'S'|'C'|'H'} stage
 * @returns {Question[]}
 */
export function generateChallengeSet(difficulty, count = 15, stage = 'S') {
  const ratios = {
    1: { 1: 0.7, 2: 0.3, 3: 0 },
    2: { 1: 0.2, 2: 0.6, 3: 0.2 },
    3: { 1: 0,   2: 0.3, 3: 0.7 },
  };
  const ratio = ratios[difficulty] || ratios[2];

  const pickByDiff = (diff) => {
    let pool = QUESTIONS.filter(q => q.difficulty === diff && (q.qtype === 'single'));
    if (diff === 3) pool = pool.filter(q => !q.stage || q.stage === stage);
    return shuffle(pool);
  };
  const pool1 = pickByDiff(1);
  const pool2 = pickByDiff(2);
  const pool3 = pickByDiff(3);

  const n1 = Math.round(count * ratio[1]);
  const n3 = Math.round(count * ratio[3]);
  const n2 = count - n1 - n3;

  const picked = [
    ...pool1.slice(0, n1),
    ...pool2.slice(0, n2),
    ...pool3.slice(0, n3),
  ];

  if (picked.length < count) {
    const all = shuffle(QUESTIONS.filter(q => q.qtype === 'single'));
    const ids = new Set(picked.map(q => q.id));
    for (const q of all) {
      if (picked.length >= count) break;
      if (!ids.has(q.id)) { picked.push(q); ids.add(q.id); }
    }
  }
  return shuffle(picked).slice(0, count);
}

/* ─── 兼容旧接口（暂保留，逐步淘汰）─── */

/** @deprecated 用 generateLessonRound 代替 */
export function generateQuizSet(lessonId, currentDifficulty, count = 5) {
  const stage = (typeof window !== 'undefined' && window.__store?.getStage?.()) || 'S';
  return generateLessonRound(lessonId, stage).slice(0, count);
}

/** @deprecated */
export function pickRandomQuestions(lessonId, difficulty, count = 5) {
  return shuffle(getQuestions(lessonId, difficulty)).slice(0, count);
}

/**
 * 错题本复测：同知识点 + 同难度，排除原题，随机抽 3 道
 * @param {number} lessonId
 * @param {1|2|3} difficulty
 * @param {string} excludeQid  原错题的 questionId，不要抽到自己
 * @returns {Question[]}
 */
export function getQuestionsByLessonAndDifficulty(lessonId, difficulty, excludeQid = '') {
  let pool = QUESTIONS.filter(q =>
    q.lessonId === lessonId &&
    q.difficulty === difficulty &&
    q.id !== excludeQid &&
    q.qtype !== 'link'
  );
  // 如果同难度题不够，放宽到同知识点任意难度
  if (pool.length < 3) {
    const ids = new Set(pool.map(q => q.id));
    const extra = QUESTIONS.filter(q =>
      q.lessonId === lessonId &&
      q.id !== excludeQid &&
      !ids.has(q.id) &&
      q.qtype !== 'link'
    );
    pool = [...pool, ...shuffle(extra)];
  }
  return shuffle(pool).slice(0, 3);
}
