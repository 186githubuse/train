/**
 * js/store.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 全局状态管理
 *
 * 职责：
 *   1. 管理用户信息（年级、能力指数）
 *   2. 管理学习进度（哪些课已通关、星级、XP）
 *   3. 管理错题本
 *   4. 管理答题会话状态
 *   5. 持久化到 localStorage，刷新不丢失
 *
 * 使用方式：
 *   import { store } from '../js/store.js';
 *   store.getProgress(lessonId)   // 获取某节课进度
 *   store.recordAnswer(...)        // 记录一次答题
 * ─────────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════
   1. 默认状态结构
═══════════════════════════════════════════════════ */
const DEFAULT_STATE = {
  // 用户基本信息
  user: {
    grade: null,          // 年级（1~9），新用户为 null
    abilityIndex: 3.0,    // 能力指数（1.0~5.0），动态更新
    name: '',             // 新用户为空字符串
    totalStars: 0,        // 累计星星数（积分）
  },

  // 各节课进度
  // key: lessonId (1~10)
  // value: { passed, stars, xp, totalXp, attemptCount, videoWatched }
  lessonProgress: {},

  // 错题本
  // 格式：[{ id, lessonId, questionId, questionText, userAnswer, correctAnswer, difficulty, timestamp, reviewed }]
  mistakes: [],

  // 挑战记录
  // 格式：[{ score, accuracy, duration, timestamp }]
  challengeRecords: [],

  // 当前答题会话（临时状态，不持久化）
  _session: null,
};

/* ═══════════════════════════════════════════════════
   2. 持久化工具（localStorage）
═══════════════════════════════════════════════════ */
const STORAGE_KEY = 'ganjue_training_state';

function _load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const saved = JSON.parse(raw);
    // 合并默认值（防止新字段缺失）
    return {
      ...DEFAULT_STATE,
      ...saved,
      user: { ...DEFAULT_STATE.user, ...saved.user },
      _session: null, // session 永远不从存储恢复
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function _save(state) {
  try {
    const { _session, ...toSave } = state; // 排除 session
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('[Store] 本地存储保存失败', e);
  }
}

/* ═══════════════════════════════════════════════════
   3. 状态对象
═══════════════════════════════════════════════════ */
const _state = _load();

/* ═══════════════════════════════════════════════════
   4. 对外 API
═══════════════════════════════════════════════════ */
const store = {

  /* ─── 用户信息 ─── */

  /**
   * 判断是否新用户（未完成注册）
   * @returns {boolean}
   */
  isNewUser() {
    return !_state.user.name || _state.user.grade === null;
  },

  /**
   * 新手引导完成后保存姓名和年级
   * @param {string} name
   * @param {number} grade 1~9
   */
  setUserProfile(name, grade) {
    _state.user.name = name;
    _state.user.grade = grade;
    _state.user.abilityIndex = grade; // 年级即初始能力指数
    _save(_state);
  },

  /**
   * 设置用户年级，同时重置能力指数
   * @param {number} grade 1~9
   */
  setGrade(grade) {
    _state.user.grade = grade;
    _state.user.abilityIndex = grade; // 年级即初始能力指数
    _save(_state);
  },

  getUser() {
    return { ..._state.user };
  },

  /* ─── 星星积分 ─── */

  /**
   * 增加星星（积分）
   * @param {number} amount
   */
  addStars(amount) {
    _state.user.totalStars = (_state.user.totalStars || 0) + amount;
    _save(_state);
  },

  getStars() {
    return _state.user.totalStars || 0;
  },

  /**
   * 根据星星数返回称号
   * @returns {string}
   */
  getTitle() {
    const s = this.getStars();
    if (s >= 200) return '感觉大师';
    if (s >= 100) return '感觉高手';
    if (s >=  50) return '感觉达人';
    if (s >=  20) return '感觉学徒';
    return '感觉新手';
  },

  /* ─── 课程进度 ─── */

  /**
   * 获取某节课的进度
   * @param {number} lessonId
   * @returns {{ passed, stars, xp, totalXp, attemptCount, videoWatched }}
   */
  getProgress(lessonId) {
    return _state.lessonProgress[lessonId] ?? {
      passed: false,
      stars: 0,
      xp: 0,
      totalXp: 100,
      attemptCount: 0,
      videoWatched: false,
    };
  },

  /**
   * 标记视频已看完
   * @param {number} lessonId
   */
  markVideoWatched(lessonId) {
    if (!_state.lessonProgress[lessonId]) {
      _state.lessonProgress[lessonId] = this.getProgress(lessonId);
    }
    _state.lessonProgress[lessonId].videoWatched = true;
    _save(_state);
  },

  /**
   * 通关一节课
   * @param {number} lessonId
   * @param {number} stars     1~3
   * @param {number} xp        获得的 XP
   */
  passLesson(lessonId, stars, xp) {
    const prev = this.getProgress(lessonId);
    _state.lessonProgress[lessonId] = {
      ...prev,
      passed: true,
      stars: Math.max(prev.stars, stars),
      xp: Math.max(prev.xp, xp),
      totalXp: 100,
    };
    _save(_state);
  },

  /**
   * 判断某节课是否已解锁
   * 规则：第1课默认解锁，之后每节课须前一节通关
   * @param {number} lessonId
   * @returns {boolean}
   */
  isUnlocked(lessonId) {
    return true; // 【临时】全部解锁，客户测试视频用
    // if (lessonId === 1) return true;
    // return this.getProgress(lessonId - 1).passed;
  },

  /* ─── 能力指数 ─── */

  getAbilityIndex() {
    return _state.user.abilityIndex;
  },

  /**
   * 根据答题结果更新能力指数
   * @param {number} difficulty    1~3（题目难度层级）
   * @param {boolean} isCorrect
   * @param {number} responseTime  毫秒
   */
  updateAbility(difficulty, isCorrect, responseTime) {
    let delta = isCorrect ? 0.2 : -0.3;

    // 答对了但太快（< 3s），可能是猜，奖励减半
    if (isCorrect && responseTime < 3000) delta *= 0.5;
    // 答错了且拖了很久（> 30s），说明完全不会，惩罚加重
    if (!isCorrect && responseTime > 30000) delta *= 1.5;

    // 难度修正：高难题答对奖励更多，低难题答错惩罚更多
    delta *= isCorrect
      ? (difficulty / 3.0)
      : (3.0 / difficulty);

    _state.user.abilityIndex = Math.max(1.0, Math.min(5.0,
      _state.user.abilityIndex + delta
    ));
    _save(_state);
  },

  /**
   * 根据能力指数返回对应难度层级（1~3）
   * @returns {number}
   */
  getCurrentDifficulty() {
    const idx = _state.user.abilityIndex;
    if (idx < 2.0) return 1;
    if (idx < 4.0) return 2;
    return 3;
  },

  /* ─── 答题会话 ─── */

  /**
   * 开始新的答题会话
   * @param {number} lessonId
   * @param {Object[]} questions  本次题目列表
   */
  startSession(lessonId, questions) {
    _state._session = {
      lessonId,
      questions,
      currentIndex: 0,
      consecutiveCorrect: 0,  // 连续答对数
      totalAnswered: 0,
      totalCorrect: 0,
      startTime: Date.now(),
      questionStartTime: Date.now(),
    };
  },

  getSession() {
    return _state._session;
  },

  /**
   * 推进会话（记录本题结果）
   * @param {boolean} isCorrect
   * @param {string} userAnswer   'A'|'B'|'C'|'D'
   * @returns {{ consecutiveCorrect, passed, isCorrect }}
   */
  advanceSession(isCorrect, userAnswer) {
    const s = _state._session;
    if (!s) return null;

    const responseTime = Date.now() - s.questionStartTime;
    const q = s.questions[s.currentIndex];

    // 更新能力指数
    this.updateAbility(q.difficulty, isCorrect, responseTime);

    // 记录错题
    if (!isCorrect) {
      this._addMistake({
        lessonId: s.lessonId,
        questionId: q.id,
        questionText: q.text,
        userAnswer,
        correctAnswer: q.correct,
        difficulty: q.difficulty,
      });
      s.consecutiveCorrect = 0;
    } else {
      s.consecutiveCorrect += 1;
    }

    s.totalAnswered += 1;
    s.totalCorrect += isCorrect ? 1 : 0;
    s.currentIndex += 1;
    s.questionStartTime = Date.now();

    const passed = s.consecutiveCorrect >= 3;
    return { consecutiveCorrect: s.consecutiveCorrect, passed, isCorrect };
  },

  endSession() {
    const s = _state._session;
    _state._session = null;
    return s;
  },

  /* ─── 错题本 ─── */

  _addMistake({ lessonId, questionId, questionText, userAnswer, correctAnswer, difficulty }) {
    // 同一题不重复记录（只保留最新一次）
    _state.mistakes = _state.mistakes.filter(m => m.questionId !== questionId);
    _state.mistakes.unshift({
      id: `${Date.now()}_${questionId}`,
      lessonId,
      questionId,
      questionText,
      userAnswer,
      correctAnswer,
      difficulty,
      timestamp: Date.now(),
      reviewed: false,
      rewardClaimed: false,
    });
    _save(_state);
  },

  getMistakes(lessonId = null) {
    if (lessonId !== null) {
      return _state.mistakes.filter(m => m.lessonId === lessonId);
    }
    return [..._state.mistakes];
  },

  markMistakeReviewed(id) {
    const m = _state.mistakes.find(m => m.id === id);
    if (m && !m.rewardClaimed) {
      m.reviewed = true;
      m.rewardClaimed = true;
      this.addStars(3); // 每道错题只能领一次奖励
      _save(_state);
    } else if (m) {
      m.reviewed = true;
      _save(_state);
    }
  },

  removeMistake(id) {
    _state.mistakes = _state.mistakes.filter(m => m.id !== id);
    _save(_state);
  },

  /* ─── 挑战记录 ─── */

  addChallengeRecord({ score, accuracy, duration }) {
    _state.challengeRecords.unshift({
      id: Date.now(),
      score,
      accuracy,
      duration,
      timestamp: Date.now(),
    });
    // 最多保留 50 条
    if (_state.challengeRecords.length > 50) {
      _state.challengeRecords = _state.challengeRecords.slice(0, 50);
    }
    _save(_state);
  },

  getChallengeRecords() {
    return [..._state.challengeRecords];
  },

  getBestChallengeScore() {
    if (_state.challengeRecords.length === 0) return 0;
    return Math.max(..._state.challengeRecords.map(r => r.score));
  },

  /* ─── 学习统计（供报告页使用）─── */

  getStats() {
    const lessonIds = Object.keys(_state.lessonProgress).map(Number);
    const passed = lessonIds.filter(id => _state.lessonProgress[id].passed);
    const totalXp = passed.reduce((sum, id) => sum + (_state.lessonProgress[id].xp || 0), 0);
    const mistakeCount = _state.mistakes.length;
    const unreviewedMistakes = _state.mistakes.filter(m => !m.reviewed).length;

    return {
      completedLessons: passed.length,
      totalLessons: 10,
      totalXp,
      mistakeCount,
      unreviewedMistakes,
      abilityIndex: _state.user.abilityIndex,
      currentDifficulty: this.getCurrentDifficulty(),
    };
  },

  /* ─── 开发调试 ─── */

  /** 清除所有数据（开发用） */
  _reset() {
    Object.assign(_state, DEFAULT_STATE);
    _state._session = null;
    _state.lessonProgress = {};
    _state.mistakes = [];
    _state.challengeRecords = [];
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ob_accounts');
    console.warn('[Store] 已重置所有状态');
  },
};

/* 挂到 window，供控制台调试 */
window.__store = store;

export { store };
