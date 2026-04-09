/**
 * js/data/lessons.js
 * ─────────────────────────────────────────────────────────────
 * 课程数据层 —— 只管数据定义，不涉及任何 DOM 操作
 * 改课程标题/描述/视频地址：只需修改这里
 *
 * 版本：依据《感觉训练基础模块开发标准文档 v3.0（2026-04-07）》更新
 * ─────────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} Lesson
 * @property {number}  id          - 课程编号（1-10）
 * @property {string}  title       - 课程标题
 * @property {string}  subtitle    - 副标题
 * @property {string}  description - 课程简介
 * @property {string}  icon        - Phosphor 图标名（如 'eye'，对应 <ph-eye>）
 * @property {string}  colorClass  - 马卡龙颜色类名（对应 style.css）
 * @property {string}  textColor   - 徽章文字颜色（hex）
 * @property {string|null} videoUrl - 视频地址（null = 占位，待填充）
 * @property {number}  duration    - 视频时长（秒，0 = 待定）
 * @property {string[]} keyPoints  - 本节核心知识点列表
 */

/** @type {Lesson[]} */
export const LESSONS = [
  {
    id: 1,
    title: '什么是感觉',
    subtitle: '感觉的定义、重要性与作文的关系',
    description: '通过骆宾王《咏鹅》和王安石《梅花》，认识"感觉"的定义——眼看、耳听、鼻闻、口尝、手摸，以及为什么写好作文离不开感觉。',
    icon: 'eye',
    colorClass: 'macaron-rose',
    textColor: '#C4566E',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson1.mov',
    duration: 0,
    keyPoints: ['感觉 = 眼看 + 耳听 + 鼻闻 + 口尝 + 手摸', '写好作文离不开感觉', '感觉是作文素材的基础'],
  },
  {
    id: 2,
    title: '怎么感觉及感觉结果',
    subtitle: '15个基本感觉点全览',
    description: '掌握感觉的完整结果：眼看5点、耳听2点、鼻闻2点、口尝1点（味道）、手摸5类，共15个基本感觉点，这是所有写作素材的来源。',
    icon: 'list-numbers',
    colorClass: 'macaron-lavender',
    textColor: '#6B5FC7',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson2.mov',
    duration: 0,
    keyPoints: ['眼看：颜色、形状、组成、作用、动作', '耳听：声音、声息', '鼻闻：气味、气息', '口尝：味道（酸甜苦辣咸麻涩）', '手摸：光滑/粗糙、软/硬、干/湿、冷/热、尖/钝'],
  },
  {
    id: 3,
    title: '感觉三步法',
    subtitle: '看组成 · 排顺序 · 再感觉',
    description: '学习有序观察事物的核心方法：第一步看组成（拆分事物各部分），第二步排顺序（选合理顺序），第三步再感觉（逐部分用五感扫描）。',
    icon: 'steps',
    colorClass: 'macaron-mint',
    textColor: '#2D8A5E',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson3.mov',
    duration: 0,
    keyPoints: ['第一步：看组成——把事物拆成自然部分', '第二步：排顺序——由大到小/由下到上等', '第三步：再感觉——按顺序逐部分用五感找特点'],
  },
  {
    id: 4,
    title: '眼看感觉点专项',
    subtitle: '颜色 · 形状 · 组成 · 作用 · 动作',
    description: '深入掌握眼看的5个感觉点：颜色（准确写色调）、形状（具体描轮廓）、组成（分解各部分）、作用（说明功能用途）、动作（描述运动状态）。',
    icon: 'eye',
    colorClass: 'macaron-peach',
    textColor: '#C47840',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson4.mov',
    duration: 0,
    keyPoints: ['颜色：准确传达视觉色彩', '形状：具体描述轮廓大小', '组成：拆分事物各组成部分', '作用：事物的功能与用途', '动作：运动状态让描写活起来'],
  },
  {
    id: 5,
    title: '耳听感觉点专项',
    subtitle: '声音 · 声息',
    description: '耳朵能听出两种声音：明显响亮的"声音"和细微轻柔的"声息"。掌握两者区别，让文章"响"起来，还能营造安静的意境。',
    icon: 'ear',
    colorClass: 'macaron-sky',
    textColor: '#3A7FAA',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson5.mov',
    duration: 0,
    keyPoints: ['声音：明显、外放的响动（雷声、鸟鸣）', '声息：微弱、细腻的气息声（叹气、书写声）', '声息反衬安静，声音表现热闹'],
  },
  {
    id: 6,
    title: '鼻闻感觉点专项',
    subtitle: '气味 · 气息',
    description: '鼻子能感受两种嗅觉：具体浓郁的"气味"和整体淡雅的"气息"。气味可以命名，气息是大环境的综合感受——王安石的"暗香"就是气息的经典例子。',
    icon: 'flower-lotus',
    colorClass: 'macaron-lemon',
    textColor: '#9A7E10',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson6.mov',
    duration: 0,
    keyPoints: ['气味：具体、较浓（花香、咖啡香）', '气息：整体、较淡（春天的气息）', '两者结合描写更生动'],
  },
  {
    id: 7,
    title: '口尝感觉点专项',
    subtitle: '酸 · 甜 · 苦 · 辣 · 咸 · 麻 · 涩',
    description: '舌头能尝出7种基本味道，它们都属于同一个感觉点：味道。把这些写出来，读者仿佛也能亲口品尝到！',
    icon: 'orange',
    colorClass: 'macaron-coral',
    textColor: '#B85040',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson7.mov',
    duration: 0,
    keyPoints: ['口尝只有1个感觉点：味道', '7种子类：酸、甜、苦、辣、咸、麻、涩', '味觉常与口感（软硬等）结合描写'],
  },
  {
    id: 8,
    title: '手摸感觉点专项',
    subtitle: '光滑/粗糙 · 软/硬 · 干/湿 · 冷/热 · 尖/钝',
    description: '手能摸出5类对比触感，让读者身临其境。每类都是对立感觉，描写时用对比能增强效果。',
    icon: 'hand-palm',
    colorClass: 'macaron-lilac',
    textColor: '#8040B8',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson8.mov',
    duration: 0,
    keyPoints: ['光滑/粗糙：表面质地', '软/硬：物体形变抵抗力', '干/湿：水分含量', '冷/热：温度高低', '尖/钝：顶端锋利度'],
  },
  {
    id: 9,
    title: '五感综合识别',
    subtitle: '多感官综合练习',
    description: '优秀的描写往往是多感官综合运用的。这节课练习从一段文字中识别出使用了哪些感官和感觉点，为综合写作打好基础。',
    icon: 'circles-four',
    colorClass: 'macaron-teal',
    textColor: '#2A8A8E',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson9.mov',
    duration: 0,
    keyPoints: ['多感官综合：找出文字中的各类感官', '关键词定位：颜色→眼看，声音→耳听等', '优秀描写往往同时运用多种感官'],
  },
  {
    id: 10,
    title: '三步法加五感综合练习',
    subtitle: '融合三步法与所有感觉点的终极综合',
    description: '把三步法（看组成·排顺序·再感觉）和15个基本感觉点融合在一起，这是基础训练的最高综合。三步法是骨架，感觉点是血肉，两者结合才能写出完整生动的作文。',
    icon: 'trophy',
    colorClass: 'macaron-cherry',
    textColor: '#B8406E',
    videoUrl: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson10.mov',
    duration: 0,
    keyPoints: ['三步法：看组成→排顺序→再感觉', '15感觉点：五感全面扫描', '自评三维度：完整性、顺序、丰富度'],
  },
];

/**
 * 根据 id 获取课程
 * @param {number} id
 * @returns {Lesson|undefined}
 */
export function getLessonById(id) {
  return LESSONS.find(l => l.id === id);
}
