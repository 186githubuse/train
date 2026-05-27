/**
 * js/data/topics/index.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练数据层入口
 * 6 大模块：静物 → 植物 → 动物 → 景物 → 人物 → 事件
 * （文档：感觉训练专题模块开发大纲 5.27 版）
 *
 * 子内容数据格式见 topics/jingwu/taideng.js
 * ─────────────────────────────────────────────────────────────
 */

import { TAIDENG } from './jingwu/taideng.js';
import { BIDAI } from './jingwu/bidai.js';
import { SHUBAO } from './jingwu/shubao.js';

import { LIUSHU } from './zhiwu/liushu.js';
import { MUDAN } from './zhiwu/mudan.js';
import { JUZI } from './zhiwu/juzi.js';

import { JUMAO } from './dongwu/jumao.js';
import { BIXIONG } from './dongwu/bixiong.js';
import { YINGWU } from './dongwu/yingwu.js';
import { JINYU } from './dongwu/jinyu.js';

/** 专题模块定义（含子内容） */
export const TOPICS = [
  {
    id: 'still-life',
    title: '静物训练',
    subtitle: '学会描写身边的静止物品',
    icon: 'jar',
    colorClass: 'macaron-rose',
    textColor: '#C4566E',
    available: true,
    intro: {
      videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson9.mov',
      title: '什么是静物描写？',
      points: [
        '静物 = 静止不动的物品（台灯、笔袋、书包……）',
        '核心方法：感觉三步法（看组成 → 排顺序 → 再感觉）',
        '感觉工具：五感 15 个基本感觉点全口径扫描',
        '写作目标：总-分-分-分多段式，平实准确、有序描写',
      ],
    },
    subs: [
      TAIDENG,
      BIDAI,
      SHUBAO,
    ],
  },
  {
    id: 'plant',
    title: '植物训练',
    subtitle: '观察草木花朵的生长之美',
    icon: 'flower',
    colorClass: 'macaron-mint',
    textColor: '#2D8A5E',
    available: true,
    intro: {
      videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson9.mov',
      title: '什么是植物描写？',
      points: [
        '植物 = 有生命、会生长变化的对象（树木、花卉、水果……）',
        '核心方法：感觉三步法（看组成 → 排顺序 → 再感觉）',
        '常用顺序：由下到上 / 由外到内（如树干→枝→叶 或 皮→肉→籽）',
        '感觉重点：形态、颜色、姿态、动作、植物气息、味觉触感',
      ],
    },
    subs: [
      LIUSHU,
      MUDAN,
      JUZI,
    ],
  },
  {
    id: 'animal',
    title: '动物训练',
    subtitle: '生动写出动物的特征与习性',
    icon: 'paw-print',
    colorClass: 'macaron-peach',
    textColor: '#C47840',
    available: true,
    intro: {
      videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson9.mov',
      title: '什么是动物描写？',
      points: [
        '动物 = 会移动、有动作和声音的生命对象',
        '核心方法：感觉三步法（看组成 → 排顺序 → 再感觉）',
        '统一顺序：由头到尾（头 → 身体 → 四肢/翅/鳍 → 尾巴）',
        '感觉重点：外形、毛发/羽毛/鳞片、动作、叫声、品种背景',
      ],
    },
    subs: [
      JUMAO,
      BIXIONG,
      YINGWU,
      JINYU,
    ],
  },
  {
    id: 'scenery',
    title: '景物训练',
    subtitle: '用文字描绘自然风景之美',
    icon: 'mountains',
    colorClass: 'macaron-sky',
    textColor: '#3A7FAA',
    available: false,
    subs: [],
  },
  {
    id: 'person',
    title: '人物训练',
    subtitle: '刻画人物外貌、动作与性格',
    icon: 'person-simple',
    colorClass: 'macaron-lavender',
    textColor: '#6B5FC7',
    available: false,
    subs: [],
  },
  {
    id: 'event',
    title: '事件训练',
    subtitle: '把一件事写清楚、写生动',
    icon: 'book-open',
    colorClass: 'macaron-lemon',
    textColor: '#9C7B2F',
    available: false,
    subs: [],
  },
];

/** 通过 topicId 取专题 */
export function getTopic(topicId) {
  return TOPICS.find(t => t.id === topicId) || null;
}

/** 通过 topicId + subId 取子内容 */
export function getSub(topicId, subId) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  return topic.subs.find(s => s.id === subId) || null;
}
