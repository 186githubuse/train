/**
 * js/data/questions.js
 * ─────────────────────────────────────────────────────────────
 * 题库入口（re-export）
 * 题目数据已拆分到 js/data/questions/ 目录下按课维护：
 *   q01.js ~ q10.js  各15题（5核心+10备选）
 *   index.js         汇总 + generateQuizSet / generateChallengeSet
 *
 * 这里只做 re-export，保持外部 import 路径不变。
 * ─────────────────────────────────────────────────────────────
 */

export {
  QUESTIONS,
  getQuestions,
  generateQuizSet,
  generateChallengeSet,
  pickRandomQuestions,
} from './questions/index.js';
