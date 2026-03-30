/**
 * js/data/courseLogic.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 课程核心逻辑
 *
 * 这是整个系统的"大脑"文件。
 * 所有功能（AI出题、魔法机器写作引导、学习报告、挑战赛）
 * 都从这里提取课程逻辑，确保全系统的教学口径一致。
 *
 * 核心理论：写好作文离不开感觉
 * 感觉 = 眼看 + 耳听 + 鼻闻 + 口尝 + 手摸
 * 15个基本感觉点是所有事物描写的原子单元
 * ─────────────────────────────────────────────────────────────
 */


// ═══════════════════════════════════════════════════════════════
// 一、15个基本感觉点（全系统核心数据结构）
// ═══════════════════════════════════════════════════════════════

/**
 * 15个基本感觉点完整定义
 * 每个感觉点是写作素材的最小原子单元
 *
 * 分布：看(5) + 听(2) + 闻(2) + 尝(7) + 摸(5) = 21个维度 → 15个感觉点分组
 */
export const SENSE_POINTS = {

  // ── 眼看（5个感觉点）──
  look: {
    organ: '眼睛',
    action: '看',
    label: '看',
    color: '#FF8FAB',
    lessonId: 5,
    points: [
      {
        id: 'look_color',
        name: '颜色',
        desc: '事物的色彩，如红、黄、绿、白、黑等',
        examples: ['白毛浮绿水，红掌拨清波（骆宾王《咏鹅》）', '霜叶红于二月花（杜牧《山行》）', '春来江水绿如蓝（白居易《忆江南》）'],
        writingTip: '颜色让画面鲜活，优先选择对比色',
        keywords: ['颜色', '色彩', '红', '绿', '黄', '白', '蓝', '紫', '金', '银'],
      },
      {
        id: 'look_shape',
        name: '形状',
        desc: '事物的外形轮廓，如圆、长、弯、方、尖等',
        examples: ['曲项向天歌（骆宾王《咏鹅》）', '横看成岭侧成峰（苏轼《题西林壁》）', '月亮像大圆盘'],
        writingTip: '形状让读者脑补画面，善用比喻更生动',
        keywords: ['形状', '圆', '方', '长', '短', '弯', '直', '尖', '扁', '胖'],
      },
      {
        id: 'look_composition',
        name: '组成',
        desc: '事物由哪些部分构成，如树由树根、树干、树枝、树叶组成',
        examples: ['鹅由脖子、羽毛、红掌组成', '书包正面有图案，两侧有网兜，背面有背带'],
        writingTip: '描写组成，能让读者对事物有整体认知',
        keywords: ['组成', '由…构成', '包括', '分为', '部分', '内部', '外部'],
      },
      {
        id: 'look_function',
        name: '作用',
        desc: '事物有什么用途或带来什么效果，如让人感到愉快、实用等',
        examples: ['看到大白鹅，骆宾王心情舒畅（《咏鹅》）', '粉笔是用来写字的', '伞是用来挡雨的'],
        writingTip: '写出作用，让读者理解事物的意义',
        keywords: ['作用', '用来', '可以', '让人', '带来', '功能', '用途'],
      },
      {
        id: 'look_movement',
        name: '动作',
        desc: '事物正在做的动作，如飞翔、摇摆、飞驰等',
        examples: ['红掌拨清波（骆宾王《咏鹅》）', '飞流直下三千尺（李白《望庐山瀑布》）', '两个黄鹂鸣翠柳，一行白鹭上青天（杜甫）'],
        writingTip: '动作让画面动起来，是写活事物的关键',
        keywords: ['动作', '飞', '跑', '跳', '摇', '落', '升', '游', '飘'],
      },
    ],
  },

  // ── 耳听（2个感觉点）──
  listen: {
    organ: '耳朵',
    action: '听',
    label: '听',
    color: '#82C4E8',
    lessonId: 6,
    points: [
      {
        id: 'listen_sound',
        name: '声音',
        desc: '响亮、清晰、明显的声音，能被轻松听到',
        examples: ['夜来风雨声（孟浩然《春晓》）', '两岸猿声啼不住（李白《早发白帝城》）', '锣鼓喧天'],
        writingTip: '声音衬托热闹、紧张、激动等氛围',
        keywords: ['声音', '响', '震', '轰', '鸣', '叫', '喊', '唱'],
      },
      {
        id: 'listen_murmur',
        name: '声息',
        desc: '微弱、细小、若有若无的声音，需要安静才能听到',
        examples: ['春雨沙沙（声息）', '人闲桂花落（王维《鸟鸣涧》）', '钟表滴答声', '翻书声'],
        writingTip: '声息营造安静、细腻、温柔的氛围，以动衬静',
        keywords: ['声息', '悄悄', '轻轻', '细细', '沙沙', '滴答', '嘀咕'],
      },
    ],
  },

  // ── 鼻闻（2个感觉点）──
  smell: {
    organ: '鼻子',
    action: '闻',
    label: '闻',
    color: '#A8D8A8',
    lessonId: 7,
    points: [
      {
        id: 'smell_strong',
        name: '气味',
        desc: '浓烈、明显、扑鼻而来的气味，好闻或难闻都算',
        examples: ['刚出炉的面包香', '走进火锅店的麻辣味', '垃圾堆的臭味'],
        writingTip: '气味强烈，适合描写近距离接触或浓郁的场景',
        keywords: ['气味', '香气', '臭味', '浓香', '刺鼻', '扑鼻', '弥漫'],
      },
      {
        id: 'smell_faint',
        name: '气息',
        desc: '清淡、隐约、若有若无的气味，需要细心感受',
        examples: ['遥知不是雪，为有暗香来（王安石《梅花》）', '清晨森林里淡淡的草木气息', '春风带来的泥土气息'],
        writingTip: '气息清雅，适合描写自然、远处、朦胧的场景',
        keywords: ['气息', '暗香', '淡淡', '清香', '幽香', '隐约', '若有若无'],
      },
    ],
  },

  // ── 口尝（7个感觉点 → 归为1个分类下的7种味道）──
  taste: {
    organ: '嘴巴/舌头',
    action: '尝',
    label: '尝',
    color: '#FFD580',
    lessonId: 8,
    points: [
      {
        id: 'taste_flavor',
        name: '味道',
        desc: '口腔感受到的七种基本味道：酸、甜、苦、辣、咸、麻、涩',
        flavors: [
          { name: '酸', examples: ['柠檬', '话梅', '酸奶', '醋'], keywords: ['酸', '酸溜溜', '酸涩'] },
          { name: '甜', examples: ['西瓜', '蜂蜜', '冰淇淋', '荔枝（苏轼）'], keywords: ['甜', '甜蜜', '甜蜜蜜'] },
          { name: '苦', examples: ['中药', '苦瓜', '咖啡'], keywords: ['苦', '苦涩', '苦口'] },
          { name: '辣', examples: ['辣椒', '火锅', '芥末'], keywords: ['辣', '辛辣', '火辣'] },
          { name: '咸', examples: ['盐', '酱油', '海水', '话梅'], keywords: ['咸', '咸味', '咸淡'] },
          { name: '麻', examples: ['花椒', '四川火锅', '麻辣烫'], keywords: ['麻', '麻木', '酥麻'] },
          { name: '涩', examples: ['未熟的柿子', '青果', '某些茶叶'], keywords: ['涩', '苦涩', '干涩'] },
        ],
        writingTip: '味觉是最难用文字表达的感觉，用好了能让读者"口水直流"',
        examples: ['日啖荔枝三百颗（苏轼）', '入口甘香冰玉寒'],
        keywords: ['味道', '酸', '甜', '苦', '辣', '咸', '麻', '涩', '口感'],
      },
    ],
  },

  // ── 手摸（5个感觉点）──
  touch: {
    organ: '手/皮肤',
    action: '摸',
    label: '摸',
    color: '#C8A8E8',
    lessonId: 9,
    points: [
      {
        id: 'touch_texture',
        name: '光滑/粗糙',
        desc: '表面质感，如丝绸光滑，树皮粗糙',
        examples: ['玻璃杯光滑', '砂纸粗糙', '鹅卵石光滑', '纱布粗糙'],
        writingTip: '质感描写能让读者"隔空触摸"',
        keywords: ['光滑', '粗糙', '细腻', '毛糙', '滑', '糙'],
      },
      {
        id: 'touch_hardness',
        name: '软/硬',
        desc: '软硬程度，如棉花软，铁块硬',
        examples: ['棉花很软', '铁块很硬', '海绵软', '石头硬'],
        writingTip: '软硬对比能增强触感描写的立体感',
        keywords: ['软', '硬', '坚硬', '柔软', '松软', '坚实'],
      },
      {
        id: 'touch_moisture',
        name: '干/湿',
        desc: '干燥或潮湿，如晒干的衣服，雨后的草地',
        examples: ['刚洗完的毛巾湿', '晒了一天的被子干爽', '锄禾日当午，汗滴禾下土（热+湿）'],
        writingTip: '干湿感结合温度效果更强',
        keywords: ['干', '湿', '潮', '燥', '潮湿', '干燥', '湿漉漉'],
      },
      {
        id: 'touch_temperature',
        name: '冷/热',
        desc: '温度感受，如冬天铁栏杆冷，夏天石板热',
        examples: ['冬天铁栏杆冰冰凉', '太阳晒了一天的石头烫', '春江水暖鸭先知（苏轼《惠崇春江晚景》）'],
        writingTip: '温度感是最容易引发共鸣的触觉',
        keywords: ['冷', '热', '温', '凉', '烫', '冰', '暖', '寒'],
      },
      {
        id: 'touch_shape',
        name: '尖/平/凸/钝',
        desc: '触摸到的形态感，如铅笔头尖，橡皮面平',
        examples: ['铅笔笔尖很尖', '橡皮背面是平的', '仙人掌刺很尖'],
        writingTip: '尖锐感带来紧张，平滑感带来舒适',
        keywords: ['尖', '平', '凸', '钝', '棱角', '光滑', '刺'],
      },
    ],
  },
};


// ═══════════════════════════════════════════════════════════════
// 二、感觉点快查表（扁平化，供AI出题和魔法机器快速检索）
// ═══════════════════════════════════════════════════════════════

/**
 * 所有感觉点的扁平列表，每项包含所属感官信息
 * 供AI出题时快速检索对应知识点
 */
export const ALL_SENSE_POINTS_FLAT = Object.entries(SENSE_POINTS).flatMap(([senseKey, sense]) =>
  sense.points.map(point => ({
    senseKey,
    organ: sense.organ,
    action: sense.action,
    senseLabel: sense.label,
    lessonId: sense.lessonId,
    ...point,
  }))
);

/**
 * 根据感觉点ID查找完整信息
 * @param {string} pointId - 如 'look_color', 'touch_temperature'
 */
export function getSensePointById(pointId) {
  return ALL_SENSE_POINTS_FLAT.find(p => p.id === pointId);
}

/**
 * 根据课程ID获取对应的感觉点列表
 * @param {number} lessonId
 */
export function getSensePointsByLesson(lessonId) {
  return ALL_SENSE_POINTS_FLAT.filter(p => p.lessonId === lessonId);
}


// ═══════════════════════════════════════════════════════════════
// 三、课程知识点摘要（供AI出题使用的精炼描述）
// ═══════════════════════════════════════════════════════════════

/**
 * 每个知识点的核心教学内容摘要
 * AI出题时将对应的 summary 注入提示词，确保出题紧扣本节要点
 */
export const LESSON_SUMMARIES = {
  1: {
    title: '什么是感觉',
    coreConclusion: '感觉 = 眼看 + 耳听 + 鼻闻 + 口尝 + 手摸；写好作文离不开感觉',
    keyDistinctions: ['感觉 vs 想象：感觉依赖身体器官，想象依赖大脑', '感觉是直接的感知，猜测/回忆不算感觉'],
    representativePoems: [
      { poem: '鹅鹅鹅，曲项向天歌，白毛浮绿水，红掌拨清波', author: '骆宾王《咏鹅》', senses: ['看（白毛、绿水、红掌）', '听（歌声）'] },
      { poem: '墙角数枝梅，凌寒独自开，遥知不是雪，为有暗香来', author: '王安石《梅花》', senses: ['看（数枝梅）', '闻（暗香）'] },
    ],
    testFocus: ['判断哪些是感觉行为，哪些不是', '在诗句中识别用了什么感觉', '区分感觉与想象/猜测/回忆'],
  },

  2: {
    title: '感觉与作文的关系',
    coreConclusion: '感觉是写作的源泉和原材料；没有感觉就写不出好作文',
    keyDistinctions: ['感觉 = 写作的原材料（食材）；写作技巧 = 烹饪方法', '亲身感觉 > 听别人说 > 查资料 > 想象（对写作的价值依次降低）'],
    representativePoems: [
      { poem: '纸上得来终觉浅，绝知此事要躬行', author: '陆游《冬夜读书示子聿》', senses: ['感觉的重要性'] },
      { poem: '两个黄鹂鸣翠柳，一行白鹭上青天', author: '杜甫《绝句》', senses: ['看（黄鹂、翠柳、白鹭、青天）', '听（鸣）'] },
    ],
    testFocus: ['为什么写不出作文（缺少感觉）', '感觉是写作的什么（原材料/源泉）', '在诗句中发现感觉与写作的联系'],
  },

  3: {
    title: '用什么感觉',
    coreConclusion: '五大感觉器官：眼→看，耳→听，鼻→闻，口→尝，手/皮肤→摸',
    keyDistinctions: ['每个器官有专属的感觉动作', '多个器官可以同时使用，写出更丰富的内容'],
    representativePoems: [
      { poem: '停车坐爱枫林晚，霜叶红于二月花', author: '杜牧《山行》', senses: ['眼睛（看霜叶红）'] },
      { poem: '空山不见人，但闻人语响', author: '王维《鹿柴》', senses: ['耳朵（听人语）'] },
    ],
    testFocus: ['判断诗句用了哪个感觉器官', '哪个器官感知什么（如冷热→皮肤，甜苦→舌头）', '多器官综合运用'],
  },

  4: {
    title: '怎么感觉及结果',
    coreConclusion: '感觉过程三要素：感觉器官 + 感觉动作 → 感觉结果（感觉点）；感觉点是写作最基本单位',
    keyDistinctions: ['感觉器官（谁来感觉）', '感觉动作（怎么感觉）', '感觉结果=感觉点（感觉到了什么）'],
    representativePoems: [
      { poem: '春来江水绿如蓝', author: '白居易《忆江南》', senses: ['眼睛→看→绿色（颜色）'] },
      { poem: '踏花归去马蹄香', author: '古诗', senses: ['眼睛→看→花（视觉）', '鼻子→闻→香（气息）'] },
    ],
    testFocus: ['区分三要素各是什么', '完整表述感觉过程', '感觉点的概念'],
  },

  5: {
    title: '感觉结果精讲之"看"',
    coreConclusion: '眼睛看能发现5个感觉点：颜色、形状、组成、作用、动作',
    keyDistinctions: [
      '颜色：事物是什么颜色',
      '形状：事物是什么形状（圆、方、长、弯等）',
      '组成：事物由哪些部分构成',
      '作用：事物有什么用/带来什么感受',
      '动作：事物在做什么动作',
    ],
    representativePoems: [
      { poem: '两个黄鹂鸣翠柳（颜色：黄、翠），一行白鹭上青天（颜色：白、青；动作：上）', author: '杜甫《绝句》', senses: ['颜色', '动作'] },
      { poem: '横看成岭侧成峰，远近高低各不同', author: '苏轼《题西林壁》', senses: ['形状'] },
    ],
    testFocus: ['判断句子描写的是哪个"看"的感觉点', '5个感觉点的识别和区分'],
  },

  6: {
    title: '感觉结果精讲之"听"',
    coreConclusion: '耳朵听能感知2个感觉点：声音（响亮）、声息（微弱）',
    keyDistinctions: ['声音：响亮、清晰、明显的声音（雷声、鸟鸣、喊叫）', '声息：微弱、细小、若有若无的声音（桂花落、翻书声、滴答声）'],
    representativePoems: [
      { poem: '大弦嘈嘈如急雨（声音），小弦切切如私语（声息）', author: '白居易《琵琶行》', senses: ['声音', '声息'] },
      { poem: '夜来风雨声（声音），花落知多少（声息）', author: '孟浩然《春晓》', senses: ['声音', '声息'] },
    ],
    testFocus: ['区分声音和声息', '通过诗句判断是声音还是声息', '不同场景下的听觉描写选择'],
  },

  7: {
    title: '感觉结果精讲之"闻"',
    coreConclusion: '鼻子闻能感知2个感觉点：气味（浓烈）、气息（清淡）',
    keyDistinctions: ['气味：浓烈、扑鼻、明显（炒菜味、火锅味、恶臭）', '气息：清淡、隐约、若有若无（梅花暗香、草木清香、雨后泥土味）'],
    representativePoems: [
      { poem: '为有暗香来（气息）', author: '王安石《梅花》', senses: ['气息'] },
      { poem: '暗香浮动月黄昏（气息）', author: '林逋《山园小梅》', senses: ['气息'] },
    ],
    testFocus: ['区分气味和气息', '通过诗句判断是气味还是气息', '用合适的词描写不同场景的嗅觉'],
  },

  8: {
    title: '感觉结果精讲之"尝"',
    coreConclusion: '口尝能感知7种味道：酸、甜、苦、辣、咸、麻、涩',
    keyDistinctions: ['酸：柠檬、话梅', '甜：西瓜、蜂蜜、荔枝', '苦：中药、苦瓜', '辣：辣椒、火锅', '咸：盐、酱油', '麻：花椒', '涩：未熟的柿子'],
    representativePoems: [
      { poem: '日啖荔枝三百颗，不辞长作岭南人', author: '苏轼《食荔枝》', senses: ['甜（荔枝的味道）'] },
    ],
    testFocus: ['7种味道的识别', '生活中常见食物对应哪种味道', '在作文中如何运用味觉描写'],
  },

  9: {
    title: '感觉结果精讲之"摸"',
    coreConclusion: '手/皮肤摸能感知5组感觉点：光滑/粗糙、软/硬、干/湿、冷/热、尖/平/凸/钝',
    keyDistinctions: [
      '光滑/粗糙：表面质感（丝绸光滑，砂纸粗糙）',
      '软/硬：硬度（棉花软，铁块硬）',
      '干/湿：含水量（晒干的衣服干，刚洗的毛巾湿）',
      '冷/热：温度（冬天栏杆冷，晒过的石头热）',
      '尖/平/凸/钝：形态感（铅笔尖尖，橡皮面平）',
    ],
    representativePoems: [
      { poem: '锄禾日当午，汗滴禾下土', author: '李绅《悯农》', senses: ['热（触觉：在烈日下劳作的炙热感）', '湿（触觉：汗水）'] },
      { poem: '春江水暖鸭先知', author: '苏轼《惠崇春江晚景》', senses: ['温度（触觉：水温变暖）'] },
    ],
    testFocus: ['5组触觉感觉点的识别', '生活中物体的触感描写', '通过诗句判断触觉感觉点'],
  },

  10: {
    title: '15个基本感觉点总结',
    coreConclusion: '掌握15个基本感觉点，任何事物都能写得生动丰富',
    keyDistinctions: [
      '看(5)：颜色、形状、组成、作用、动作',
      '听(2)：声音、声息',
      '闻(2)：气味、气息',
      '尝(7)：酸、甜、苦、辣、咸、麻、涩（算作1个大类）',
      '摸(5)：光滑/粗糙、软/硬、干/湿、冷/热、尖/平/凸/钝',
      '合计：5+2+2+1+5 = 15个感觉点',
    ],
    representativePoems: [
      { poem: '两个黄鹂鸣翠柳（看：颜色+动作；听：声音），一行白鹭上青天（看：颜色+动作）', author: '杜甫《绝句》', senses: ['综合多感觉点'] },
      { poem: '春江水暖鸭先知（摸：温度；看：动作）', author: '苏轼《惠崇春江晚景》', senses: ['综合多感觉点'] },
    ],
    testFocus: ['15个感觉点的完整记忆', '各感觉归属哪个器官', '用多感觉点描写同一事物'],
  },
};


// ═══════════════════════════════════════════════════════════════
// 四、AI出题系统提示词模板
// ═══════════════════════════════════════════════════════════════

/**
 * 构建 AI 出题的系统提示词（System Prompt）
 * 这个提示词确保 Claude API 出的题严格遵循杨老师的教学体系
 */
export const AI_QUIZ_SYSTEM_PROMPT = `
你是一位专业的语文教学助手，专门为杨老师的"感觉训练"写作课程出题。

【课程核心理论】
写好作文离不开感觉。感觉 = 眼看 + 耳听 + 鼻闻 + 口尝 + 手摸。
15个基本感觉点是写作素材的原子单元：
- 眼看(5个)：颜色、形状、组成、作用、动作
- 耳听(2个)：声音（响亮）、声息（微弱）
- 鼻闻(2个)：气味（浓烈）、气息（清淡）
- 口尝(7个味道)：酸、甜、苦、辣、咸、麻、涩
- 手摸(5组)：光滑/粗糙、软/硬、干/湿、冷/热、尖/平/凸/钝

【重要区分】
1. 感觉 vs 想象/猜测/回忆：感觉依赖身体器官，是直接感知；想象、猜测、回忆不属于感觉
2. 声音 vs 声息：声音响亮清晰，声息微弱细小
3. 气味 vs 气息：气味浓烈扑鼻，气息清淡隐约

【出题规范】
1. 题型：单选题，4个选项（A/B/C/D）
2. 优先引用课本名诗名句作为题目情境（骆宾王、王安石、杜甫、白居易、李白等）
3. 难度分3级：基础（概念识别）、中等（诗句分析）、挑战（综合运用）
4. 干扰项要合理，不能太明显
5. 每道题必须有正确答案和简短解析

【输出格式】
严格按照以下JSON格式输出：
{
  "questions": [
    {
      "text": "题目内容",
      "options": { "A": "选项A", "B": "选项B", "C": "选项C", "D": "选项D" },
      "correct": "A",
      "hint": "解析说明",
      "difficulty": 1
    }
  ]
}
`;

/**
 * 构建针对特定知识点的 AI 出题用户提示词
 * @param {number} lessonId - 知识点ID（1-10）
 * @param {number} difficulty - 难度层级（1-3）
 * @param {number} count - 出题数量
 * @param {number} abilityIndex - 用户能力指数（1.0-5.0）
 * @param {string[]} [excludeIds] - 排除的题目（避免重复）
 * @returns {string}
 */
export function buildQuizPrompt(lessonId, difficulty, count = 3, abilityIndex = 3.0, excludeIds = []) {
  const summary = LESSON_SUMMARIES[lessonId];
  if (!summary) return '';

  const difficultyDesc = ['', '基础（概念识别，直接判断）', '中等（结合诗句分析，有合理干扰项）', '挑战（综合运用，需要深度理解）'][difficulty];
  const gradeHint = abilityIndex < 2.5 ? '（用户为低年级，语言要简单易懂）' : abilityIndex > 4.0 ? '（用户能力较强，可以加大难度）' : '';

  return `
请为"${summary.title}"这个知识点出${count}道${difficultyDesc}${gradeHint}的选择题。

【本节核心结论】
${summary.coreConclusion}

【重点区分】
${summary.keyDistinctions.join('\n')}

【代表性诗句（优先用于出题）】
${summary.representativePoems.map(p => `- ${p.poem}（${p.author}）`).join('\n')}

【考察重点】
${summary.testFocus.join('\n')}

【用户当前能力指数】${abilityIndex}（1.0最低，5.0最高）

请出${count}道难度${difficulty}的题目，严格按JSON格式输出。
`;
}


// ═══════════════════════════════════════════════════════════════
// 五、魔法机器（作文引导）核心逻辑
// ═══════════════════════════════════════════════════════════════

/**
 * 魔法机器：引导学生用感觉点构建作文的系统提示词
 * 学生输入一个作文题目，系统通过多轮对话引导他用15个感觉点收集素材，最终生成作文
 */
export const MAGIC_MACHINE_SYSTEM_PROMPT = `
你是"感觉魔法机器"，一个帮助小学生写作文的AI助手。你基于杨老师的"感觉训练"教学体系工作。

【你的工作方式】
1. 学生给你一个作文题目
2. 你引导学生用"15个基本感觉点"来观察和感受这个题目的主角
3. 通过一问一答，帮学生收集丰富的感觉素材
4. 最后把这些素材整理成一篇生动的作文

【感觉引导框架（15个感觉点）】
眼睛看：
  - 颜色：它是什么颜色？
  - 形状：它是什么形状？
  - 组成：它由哪些部分组成？
  - 作用：它有什么用/让你感觉怎么样？
  - 动作：它在做什么动作？

耳朵听：
  - 声音：有什么响亮的声音？
  - 声息：有什么细小的声音？

鼻子闻：
  - 气味：有什么浓烈的气味？
  - 气息：有什么淡淡的气息？

嘴巴尝（如适用）：
  - 味道：酸/甜/苦/辣/咸/麻/涩

手/皮肤摸（如适用）：
  - 光滑/粗糙、软/硬、干/湿、冷/热、尖/平

【对话原则】
1. 语言亲切、简单，像朋友聊天（适合小学生）
2. 每次只问1-2个感觉点，不要一次问太多
3. 用具体的引导问题，如"你看到它是什么颜色的？""摸上去感觉怎么样？"
4. 对学生的回答给予鼓励，并帮助扩展描写
5. 当收集到足够素材后，帮学生整理成作文

【输出作文时的要求】
- 按照"感觉顺序"组织段落（先写看到的，再写听到的，闻到的，尝到的，摸到的）
- 语言生动，多用比喻和感叹句
- 适合小学生水平，不要用生僻词
`;

/**
 * 构建魔法机器的初始引导提示词
 * @param {string} topic - 作文题目
 * @param {number} abilityIndex - 用户能力指数
 * @param {number} grade - 年级（1-9）
 * @returns {string}
 */
export function buildMagicMachinePrompt(topic, abilityIndex = 3.0, grade = 4) {
  return `
学生想写一篇关于"${topic}"的作文，他是${grade}年级的学生，能力指数为${abilityIndex}。

请开始引导他用感觉点收集写作素材。
先用热情的语气欢迎他，然后问他关于"${topic}"的第一个感觉问题——从"眼睛看到的颜色"开始引导。
语言要活泼有趣，像朋友聊天一样。
`;
}

/**
 * 根据已收集的感觉素材，构建生成作文的提示词
 * @param {string} topic - 作文题目
 * @param {Object} collectedSenses - 已收集的感觉素材
 * @param {number} grade - 年级
 * @returns {string}
 */
export function buildEssayGenerationPrompt(topic, collectedSenses, grade) {
  const senseSummary = Object.entries(collectedSenses)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  return `
请根据以下感觉素材，帮${grade}年级的学生写一篇关于"${topic}"的作文。

【收集到的感觉素材】
${senseSummary}

要求：
1. 按照感觉顺序组织（看→听→闻→尝→摸）
2. 语言生动活泼，适合${grade}年级水平
3. 300-400字左右
4. 多用比喻，让描写更形象
5. 开头吸引人，结尾有感悟
`;
}


// ═══════════════════════════════════════════════════════════════
// 六、能力指数系统
// ═══════════════════════════════════════════════════════════════

/**
 * 根据年级初始化能力指数
 * 一年级 → 1.5，六年级 → 3.5，初三 → 5.0
 */
export const GRADE_ABILITY_MAP = {
  1: 1.5,  // 小学一年级
  2: 2.0,  // 小学二年级
  3: 2.5,  // 小学三年级
  4: 3.0,  // 小学四年级
  5: 3.5,  // 小学五年级
  6: 4.0,  // 小学六年级
  7: 4.3,  // 初中一年级
  8: 4.6,  // 初中二年级
  9: 5.0,  // 初中三年级
};

/**
 * 根据能力指数获取难度层级
 * @param {number} abilityIndex
 * @returns {number} 1|2|3
 */
export function getDifficultyLevel(abilityIndex) {
  if (abilityIndex < 2.0) return 1;
  if (abilityIndex < 4.0) return 2;
  return 3;
}

/**
 * 更新能力指数（每次答题后调用）
 * @param {number} currentIndex - 当前能力指数
 * @param {boolean} isCorrect - 是否答对
 * @param {number} difficulty - 题目难度（1-3）
 * @param {number} responseTimeMs - 答题用时（毫秒）
 * @returns {number} 新的能力指数
 */
export function updateAbilityIndex(currentIndex, isCorrect, difficulty, responseTimeMs) {
  let delta = isCorrect ? 0.2 : -0.3;

  // 响应时间修正：
  // 答对且 < 3秒（可能是猜的），奖励减半
  // 答错且 > 30秒（认真思考了仍错），惩罚加倍
  if (isCorrect && responseTimeMs < 3000) {
    delta *= 0.5;
  } else if (!isCorrect && responseTimeMs > 30000) {
    delta *= 2;
  }

  // 难度修正：
  // 答对高难度题，奖励更多；答错低难度题，惩罚更多
  const difficultyFactor = isCorrect
    ? (difficulty / 2.0)       // 难度越高，奖励越多
    : (2.0 / difficulty);      // 难度越低，惩罚越多

  delta *= difficultyFactor;

  // 限制在 1.0 ~ 5.0 范围内
  return Math.max(1.0, Math.min(5.0, parseFloat((currentIndex + delta).toFixed(2))));
}

/**
 * 获取能力指数对应的称号
 * @param {number} abilityIndex
 * @returns {string}
 */
export function getAbilityTitle(abilityIndex) {
  if (abilityIndex >= 4.5) return '感觉大师 🏆';
  if (abilityIndex >= 4.0) return '感觉达人 ⭐';
  if (abilityIndex >= 3.0) return '感觉探索者 🔍';
  if (abilityIndex >= 2.0) return '感觉新手 🌱';
  return '感觉初学者 🐣';
}


// ═══════════════════════════════════════════════════════════════
// 七、五感雷达图数据生成（供学习报告使用）
// ═══════════════════════════════════════════════════════════════

/**
 * 五感与课程对应关系（用于生成五感能力雷达图）
 */
export const SENSE_RADAR_CONFIG = [
  { key: 'look',   label: '视觉（看）', lessonIds: [5],       color: '#FF8FAB' },
  { key: 'listen', label: '听觉（听）', lessonIds: [6],       color: '#82C4E8' },
  { key: 'smell',  label: '嗅觉（闻）', lessonIds: [7],       color: '#A8D8A8' },
  { key: 'taste',  label: '味觉（尝）', lessonIds: [8],       color: '#FFD580' },
  { key: 'touch',  label: '触觉（摸）', lessonIds: [9],       color: '#C8A8E8' },
];

// 知识点1-4和10属于综合基础，影响所有五感的综合评分
export const FOUNDATION_LESSON_IDS = [1, 2, 3, 4, 10];

/**
 * 根据 lessonProgress 数据计算五感能力评分
 * @param {Object} lessonProgress - store 中的 lessonProgress 数据
 * @returns {Array} 五感评分数组，每项包含 key/label/score/color
 */
export function calcSenseRadarScores(lessonProgress) {
  // 计算基础课程（1-4, 10）的平均掌握度，作为加成系数
  const foundationScores = FOUNDATION_LESSON_IDS.map(id => {
    const p = lessonProgress[id];
    if (!p || !p.passed) return 0;
    return Math.min(100, (p.stars || 0) * 33.3);
  });
  const foundationAvg = foundationScores.reduce((a, b) => a + b, 0) / foundationScores.length;
  const foundationBonus = foundationAvg * 0.3; // 基础课最多加成30分

  return SENSE_RADAR_CONFIG.map(sense => {
    const scores = sense.lessonIds.map(id => {
      const p = lessonProgress[id];
      if (!p || !p.passed) return 0;
      return Math.min(100, (p.stars || 0) * 33.3);
    });
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const finalScore = Math.min(100, Math.round(avgScore * 0.7 + foundationBonus));

    return {
      key: sense.key,
      label: sense.label,
      score: finalScore,
      color: sense.color,
    };
  });
}
