/**
 * js/data/questions/index.js
 * ─────────────────────────────────────────────────────────────
 * 题库汇总入口
 * - 合并全部10个知识点题目（每课15题，共150题）
 * - 挑战赛从全题库随机抽取，按难度自适应
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

/** 全部题目（150题） */
export const QUESTIONS = [
  ...Q01, ...Q02, ...Q03, ...Q04, ...Q05,
  ...Q06, ...Q07, ...Q08, ...Q09, ...Q10,
];

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────

/** Fisher-Yates 洗牌 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 获取某课某难度的所有题目
 * @param {number} lessonId
 * @param {number} difficulty
 */
export function getQuestions(lessonId, difficulty) {
  return QUESTIONS.filter(q => q.lessonId === lessonId && q.difficulty === difficulty);
}

/**
 * 为指定课程生成一组答题题目
 * - 优先从当前难度抽，不够时从相邻难度补
 * @param {number} lessonId
 * @param {number} currentDifficulty  1-3
 * @param {number} count              需要题数（默认5）
 * @returns {Question[]}
 */
export function generateQuizSet(lessonId, currentDifficulty, count = 5) {
  const primary = shuffle(getQuestions(lessonId, currentDifficulty));
  if (primary.length >= count) return primary.slice(0, count);

  // 不够时从相邻难度补充
  const adjacent = currentDifficulty < 3 ? currentDifficulty + 1 : currentDifficulty - 1;
  const extra = shuffle(getQuestions(lessonId, adjacent));
  return [...primary, ...extra].slice(0, count);
}

/**
 * 挑战赛：从全题库按难度随机抽题
 * - difficulty 1 → 抽 difficulty 1 为主，混入少量 2
 * - difficulty 2 → 抽 difficulty 2 为主，混入少量 1 和 3
 * - difficulty 3 → 抽 difficulty 3 为主，混入少量 2
 * @param {number} difficulty  当前难度（1-3）
 * @param {number} count       抽题数量（默认15）
 * @returns {Question[]}
 */
export function generateChallengeSet(difficulty, count = 15) {
  // 按难度配比
  const ratios = {
    1: { 1: 0.7, 2: 0.3, 3: 0 },
    2: { 1: 0.2, 2: 0.6, 3: 0.2 },
    3: { 1: 0,   2: 0.3, 3: 0.7 },
  };
  const ratio = ratios[difficulty] || ratios[2];

  const pool1 = shuffle(QUESTIONS.filter(q => q.difficulty === 1));
  const pool2 = shuffle(QUESTIONS.filter(q => q.difficulty === 2));
  const pool3 = shuffle(QUESTIONS.filter(q => q.difficulty === 3));

  const n1 = Math.round(count * ratio[1]);
  const n3 = Math.round(count * ratio[3]);
  const n2 = count - n1 - n3;

  const picked = [
    ...pool1.slice(0, n1),
    ...pool2.slice(0, n2),
    ...pool3.slice(0, n3),
  ];

  // 如果某难度题不够，用其他难度补足
  if (picked.length < count) {
    const all = shuffle(QUESTIONS);
    const ids = new Set(picked.map(q => q.id));
    for (const q of all) {
      if (picked.length >= count) break;
      if (!ids.has(q.id)) { picked.push(q); ids.add(q.id); }
    }
  }

  return shuffle(picked).slice(0, count);
}

/**
 * 从指定课程和难度中随机抽取 n 道题（向后兼容旧接口）
 */
export function pickRandomQuestions(lessonId, difficulty, count = 5) {
  return shuffle(getQuestions(lessonId, difficulty)).slice(0, count);
}
