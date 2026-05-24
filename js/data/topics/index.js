/**
 * js/data/topics/index.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练数据层入口
 * 6 大模块：静物 → 植物 → 动物 → 景物 → 人物 → 事件
 * （文档：感觉训练专题模块开发大纲 5.23 版）
 *
 * 每个模块包含若干 sub（子内容），按难度递增排列：
 *   静物：台灯 → 柳树 → 书包 → 笔袋 → 橘子（待补）
 *
 * 子内容数据格式见 topics/jingwu/taideng.js
 * ─────────────────────────────────────────────────────────────
 */

import { TAIDENG } from './jingwu/taideng.js';
import { SHUBAO } from './jingwu/shubao.js';
import { BIDAI } from './jingwu/bidai.js';
import { LIUSHU } from './jingwu/liushu.js';

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
        '静物 = 静止不动的物品（台灯、书包、笔袋、水果……）',
        '核心方法：感觉三步法（看组成 → 排顺序 → 再感觉）',
        '感觉工具：五感 15 个基本感觉点全口径扫描',
        '写作目标：总-分-分-分四段式，平实准确、有序描写',
      ],
    },
    subs: [
      TAIDENG,
      LIUSHU,
      SHUBAO,
      BIDAI,
      { id: 'juzi', title: '橘子/西瓜/菠萝', subtitle: '有层次的水果，引入味觉嗅觉', comingSoon: true },
    ],
  },
  {
    id: 'plant',
    title: '植物训练',
    subtitle: '观察草木花朵的生长之美',
    icon: 'flower',
    colorClass: 'macaron-mint',
    textColor: '#2D8A5E',
    available: false,
    subs: [],
  },
  {
    id: 'animal',
    title: '动物训练',
    subtitle: '生动写出动物的特征与习性',
    icon: 'paw-print',
    colorClass: 'macaron-peach',
    textColor: '#C47840',
    available: false,
    subs: [],
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
