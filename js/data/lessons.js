/**
 * js/data/lessons.js
 * ─────────────────────────────────────────────────────────────
 * 课程数据层 —— 只管数据定义，不涉及任何 DOM 操作
 * 改课程标题/描述/视频地址：只需修改这里
 * ─────────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} Lesson
 * @property {number}  id          - 课程编号（1-10）
 * @property {string}  title       - 课程标题
 * @property {string}  subtitle    - 副标题
 * @property {string}  description - 课程简介
 * @property {string}  emoji       - 装饰 emoji
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
    subtitle: '感觉的定义：眼看、耳听、鼻闻、口尝、手摸',
    description: '通过骆宾王《咏鹅》和王安石《梅花》，认识"感觉"的定义——用身体五官感知世界，是写好作文的第一步。',
    emoji: '👀',
    colorClass: 'macaron-rose',
    textColor: '#C4566E',
    videoUrl: null, // TODO: 填入实际视频地址
    duration: 0,    // TODO: 填入实际时长（秒）
    keyPoints: ['感觉 = 眼看 + 耳听 + 鼻闻 + 口尝 + 手摸', '五位小侦探各司其职', '没有感觉就没有作文'],
  },
  {
    id: 2,
    title: '感觉与作文的关系',
    subtitle: '感觉是写作的源泉',
    description: '感觉是作文的原材料，就像做饭需要食材——没有感觉，再聪明的大脑也写不出有内容的作文。',
    emoji: '✏️',
    colorClass: 'macaron-lavender',
    textColor: '#6B5FC7',
    videoUrl: null,
    duration: 0,
    keyPoints: ['写好作文离不开感觉', '感觉 = 写作的原材料', '名诗背后都有真实感觉'],
  },
  {
    id: 3,
    title: '用什么感觉',
    subtitle: '感觉器官：眼、耳、鼻、口、手',
    description: '认识五大感觉器官：眼睛看、耳朵听、鼻子闻、嘴巴尝、手摸——每个器官都是写作的好帮手。',
    emoji: '👂',
    colorClass: 'macaron-mint',
    textColor: '#2D8A5E',
    videoUrl: null,
    duration: 0,
    keyPoints: ['眼→看', '耳→听', '鼻→闻', '口→尝', '手/皮肤→摸'],
  },
  {
    id: 4,
    title: '怎么感觉及结果',
    subtitle: '感觉过程：器官 + 动作 = 感觉点',
    description: '掌握感觉的完整过程：感觉器官 + 感觉动作 = 感觉结果（感觉点），感觉点就是写作的宝贵素材。',
    emoji: '⚙️',
    colorClass: 'macaron-peach',
    textColor: '#C47840',
    videoUrl: null,
    duration: 0,
    keyPoints: ['感觉过程三要素', '什么是感觉点', '感觉点 = 作文最基本单位'],
  },
  {
    id: 5,
    title: '感觉结果精讲之"看"',
    subtitle: '颜色、形状、组成、作用、动作',
    description: '眼睛侦探能发现5个秘密：颜色、形状、组成、作用、动作——掌握这5点，写什么都能写具体。',
    emoji: '🎨',
    colorClass: 'macaron-sky',
    textColor: '#3A7FAA',
    videoUrl: null,
    duration: 0,
    keyPoints: ['颜色', '形状', '组成', '作用', '动作'],
  },
  {
    id: 6,
    title: '感觉结果精讲之"听"',
    subtitle: '声音与声息的区别',
    description: '耳朵侦探能听出两种声音：响亮的"声音"和细微的"声息"——用对了，文章意境大不同。',
    emoji: '🎵',
    colorClass: 'macaron-lemon',
    textColor: '#9A7E10',
    videoUrl: null,
    duration: 0,
    keyPoints: ['声音（响亮、清晰）', '声息（微弱、细小）', '两者营造不同意境'],
  },
  {
    id: 7,
    title: '感觉结果精讲之"闻"',
    subtitle: '气味与气息的区别',
    description: '鼻子侦探有两个绝活：浓烈的"气味"和清淡的"气息"——王安石的"暗香"就是气息的最好例子。',
    emoji: '🌸',
    colorClass: 'macaron-coral',
    textColor: '#B85040',
    videoUrl: null,
    duration: 0,
    keyPoints: ['气味（浓烈、明显）', '气息（清淡、隐约）', '暗香浮动 = 气息'],
  },
  {
    id: 8,
    title: '感觉结果精讲之"尝"',
    subtitle: '酸、甜、苦、辣、咸、麻、涩',
    description: '嘴巴侦探能尝出7种味道，把这些写出来，读者仿佛也能亲口品尝到！',
    emoji: '🍋',
    colorClass: 'macaron-lilac',
    textColor: '#8040B8',
    videoUrl: null,
    duration: 0,
    keyPoints: ['酸', '甜', '苦', '辣', '咸', '麻', '涩'],
  },
  {
    id: 9,
    title: '感觉结果精讲之"摸"',
    subtitle: '光滑/粗糙、软/硬、干/湿、冷/热、尖/平/凸/钝',
    description: '皮肤侦探能摸出5组对比感觉，写出来让读者也能感同身受！',
    emoji: '🤲',
    colorClass: 'macaron-teal',
    textColor: '#2A8A8E',
    videoUrl: null,
    duration: 0,
    keyPoints: ['光滑/粗糙', '软/硬', '干/湿', '冷/热', '尖/平/凸/钝'],
  },
  {
    id: 10,
    title: '15个基本感觉点总结',
    subtitle: '形成完整知识框架，成为感觉大师',
    description: '把10节课的所有感觉点汇成一张"宝藏地图"——掌握15个基本感觉点，任何事物都能写得丰富生动！',
    emoji: '🏆',
    colorClass: 'macaron-cherry',
    textColor: '#B8406E',
    videoUrl: null,
    duration: 0,
    keyPoints: ['看(5个)', '听(2个)', '闻(2个)', '尝(7个)', '摸(5个)', '共15个基本感觉点'],
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
