/**
 * 知识点6：口尝感觉点专项（酸·甜·苦·辣·咸·麻·涩）
 * D1×9 + D2×9 + D3×12（含学段标签 S5/C4/H3） = 30 题
 * 来源：作文训练系统之---感觉训练基础模块开发标准文档3.0-5.19.docx（v4.0）
 */
export const Q06 = [
  /* ─────────── 难度 1：基础识别（9题） ─────────── */
  {
    id: 'K6-D1-01',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '"这柠檬汁真酸"，这里的"酸"属于"口尝"感觉点中的（ ）。',
    options: { A: '气味', B: '味道', C: '口感', D: '声音' },
    correct: 'B',
    explanation: '酸是七种基本味道之一，属于"口尝-味道"感觉点。',
  },

  {
    id: 'K6-D1-02',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '吃了花椒后，舌头那种酥酥的、有点木木的感觉叫（ ）。',
    options: { A: '辣', B: '麻', C: '涩', D: '苦' },
    correct: 'B',
    explanation: '花椒带来的舌头发麻、酥颤感就是"麻"味。',
  },

  {
    id: 'K6-D1-03',
    lessonId: 6,
    difficulty: 1,
    qtype: 'judge',
    text: '"口尝"感觉点下，包含了酸、甜、苦、辣、咸、麻、涩七种不同的味道。',
    options: { A: '正确', B: '错误' },
    correct: 'A',
    explanation: '口尝是 1 个感觉点——味道，下面包含 7 种子类。',
  },

  {
    id: 'K6-D1-04',
    lessonId: 6,
    difficulty: 1,
    qtype: 'multi',
    text: '以下通常属于"口尝-味道"的有（ ）。',
    options: { A: '糖的甜', B: '药的苦', C: '辣椒的辣', D: '冰淇淋的凉' },
    correct: ['A', 'B', 'C'],
    explanation: '甜、苦、辣都是味道；"凉"是温度感觉，属于手摸-冷/热。',
  },

  {
    id: 'K6-D1-05',
    lessonId: 6,
    difficulty: 1,
    qtype: 'link',
    text: '请将味道与常见例子连线。',
    leftItems: { '①': '酸', '②': '甜', '③': '涩' },
    rightItems: { 'A': '未熟的柿子', 'B': '蜂蜜', 'C': '醋' },
    correct: { '①': 'C', '②': 'B', '③': 'A' },
    explanation: '醋是酸的代表，蜂蜜是甜的代表，未熟柿子是涩的代表。',
  },

  {
    id: 'K6-D1-06',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '"这碗汤有点淡，再放点盐"中的"淡"，指的是缺少（ ）味。',
    options: { A: '酸', B: '甜', C: '苦', D: '咸' },
    correct: 'D',
    explanation: '"淡"在这里指咸味不够，需要加盐提味。',
  },

  {
    id: 'K6-D1-07',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '"口尝"的七种味道，都属于同一个感觉点，即（ ）。',
    options: { A: '气味', B: '味道', C: '口感', D: '声音' },
    correct: 'B',
    explanation: '口尝只算 1 个感觉点——味道；酸甜苦辣咸麻涩是味道的七个种类。',
  },

  {
    id: 'K6-D1-08',
    lessonId: 6,
    difficulty: 1,
    qtype: 'multi',
    text: '以下描述中，属于"口尝"感觉的有（ ）。',
    options: { A: '咖啡的苦涩', B: '话梅的酸甜', C: '麻辣火锅的过瘾', D: '薄荷糖的清凉' },
    correct: ['A', 'B', 'C'],
    explanation: '苦涩、酸甜、麻辣都是味道；"清凉"是温度/气息的通感，不完全属于口尝。',
  },

  {
    id: 'K6-D1-09',
    lessonId: 6,
    difficulty: 1,
    qtype: 'judge',
    text: '"她很伤心，心里很苦。"这里的"苦"是口尝到的味道。',
    options: { A: '正确', B: '错误' },
    correct: 'B',
    explanation: '这里的"苦"是比喻，表达心情难受，不是真正的味觉体验。',
  },

  /* ─────────── 难度 2：简单应用（9题） ─────────── */
  {
    id: 'K6-D2-01',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '你第一次喝"黑咖啡"，最可能尝到的主要味道是（ ），可能还带一点（ ）。',
    options: { A: '甜，酸', B: '苦，酸', C: '辣，麻', D: '咸，涩' },
    correct: 'B',
    explanation: '黑咖啡主味是苦，好的黑咖啡会带一点酸味（果酸感）。',
  },

  {
    id: 'K6-D2-02',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '"生活就像一盒巧克力，你永远不知道下一块是什么味道。"这句电影台词中，"味道"比喻生活的（ ）。',
    options: { A: '颜色', B: '不确定性', C: '形状', D: '温度' },
    correct: 'B',
    explanation: '用味觉的丰富多变来比喻生活的不确定性和多样体验。',
  },

  {
    id: 'K6-D2-03',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '小红把"这道菜好吃"改为"这道糖醋鱼，外面炸得酥脆，里面鱼肉鲜嫩，酱汁酸甜可口"。她补充的"酸甜"属于（ ）。',
    options: { A: '鼻闻', B: '口尝-味道', C: '手摸', D: '眼看' },
    correct: 'B',
    explanation: '"酸甜"是靠舌头尝出来的味道。',
  },

  {
    id: 'K6-D2-04',
    lessonId: 6,
    difficulty: 2,
    qtype: 'multi',
    text: '描写"一颗新鲜的山楂"，可能涉及以下哪些"口尝"感觉？（ ）',
    options: { A: '强烈的酸味', B: '一丝淡淡的甜味', C: '果皮的微涩感', D: '果肉的绵软口感' },
    correct: ['A', 'B', 'C'],
    explanation: '酸、甜、涩都是味道（口尝）；D 的"绵软"是触觉口感，属手摸。',
  },

  {
    id: 'K6-D2-05',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '"哑巴吃黄连——有苦说不出"这个歇后语，源于黄连极（ ）的味道。',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'C',
    explanation: '黄连是中药里极苦的代表，"苦"既是味觉又比喻了有苦难言。',
  },

  {
    id: 'K6-D2-06',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '品尝一颗话梅时，味觉可能依次是：① 入口先是明显的咸味 ② 然后是强烈的酸味 ③ 最后留下淡淡的甜味。正确的味觉顺序是（ ）。',
    options: { A: '咸→酸→甜', B: '酸→甜→咸', C: '甜→咸→酸', D: '苦→辣→麻' },
    correct: 'A',
    explanation: '话梅通常先有腌制的咸味，再是梅子的酸味，最后甘草的回甘。',
  },

  {
    id: 'K6-D2-07',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '"味觉小考官"上线！"抿一口陈醋、咬一口黑巧克力、吃一口生柿子"分别对应的味道是（ ）。',
    options: {
      A: '酸、苦、涩',
      B: '苦、涩、酸',
      C: '涩、酸、苦',
      D: '酸、涩、苦',
    },
    correct: 'A',
    explanation: '陈醋=酸，黑巧克力=苦，生柿子=涩。',
  },

  {
    id: 'K6-D2-08',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '"梅子留酸软齿牙，芭蕉分绿与窗纱。"诗句中"留酸软齿牙"生动写出了梅子（ ）味之重，给人带来的生理反应。',
    options: { A: '甜', B: '酸', C: '苦', D: '辣' },
    correct: 'B',
    explanation: '"留酸""软齿牙"形象地写出了酸味导致牙齿发软的生理反应。',
  },

  {
    id: 'K6-D2-09',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '你要为一种新式"跳跳糖"写广告语，强调其独特的舌尖体验。以下哪句最侧重"口尝"及相关感觉？',
    options: {
      A: '包装绚丽，闪闪发光。',
      B: '放入口中，噼啪跳跃，体验前所未有的刺激乐趣！',
      C: '静静地融化，细腻柔滑。',
      D: '闻起来有水果香。',
    },
    correct: 'B',
    explanation: 'B 描述了放入口中的体验（味觉+口腔触感+声音），最能调动口尝相关感觉。',
  },

  /* ─────────── 难度 3：综合迁移（12题） ─────────── */
  /* (S) 小学段 5 题 */
  {
    id: 'K6-D3-S01',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '为你最喜欢的零食写一句"推荐语"，要写出它好吃的味道。以下哪句最具体？',
    options: {
      A: '这个零食太好吃了！',
      B: '这个薯片又脆又香。',
      C: '这包芒果干，咬下去酸甜适中，有浓浓的芒果味，嚼起来很有韧劲。',
      D: '大家都来买。',
    },
    correct: 'C',
    explanation: 'C 写出了酸甜（味道）+芒果味（气味）+韧劲（口感），最具体生动。',
  },

  {
    id: 'K6-D3-S02',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '我的味道很特别，能让舌头觉得刺痛、发热，很多人一边吃我一边流汗喝水。我是（ ）。',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'D',
    explanation: '刺痛、发热、流汗是辣味的典型生理反应。',
  },

  {
    id: 'K6-D3-S03',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '小亮写："妈妈熬的中药很难喝。"老师批注："怎么个难喝法？"以下哪个修改最好？',
    options: {
      A: '妈妈熬的中药颜色很深，很难喝。',
      B: '妈妈熬的中药，闻起来就有一股苦涩味，喝下去更是从舌头苦到喉咙，让人忍不住皱眉。',
      C: '妈妈熬的中药很有用。',
      D: '我不喜欢喝中药。',
    },
    correct: 'B',
    explanation: 'B 用了鼻闻（苦涩味）和口尝（从舌苦到喉）+生理反应（皱眉），最具体。',
  },

  {
    id: 'K6-D3-S04',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '人们常用"甜甜的"形容幸福，用"酸酸的"形容嫉妒，用"苦"形容艰辛。这说明"味道"常常可以用来比喻（ ）。',
    options: { A: '颜色', B: '声音', C: '内心的情感和体验', D: '温度' },
    correct: 'C',
    explanation: '味道是具体的身体经验，常被借来比喻抽象的情感——这是具身隐喻。',
  },

  {
    id: 'K6-D3-S05',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你要设计一句宣传"老陈醋"的标语，突出其传统工艺和风味。以下哪句最合适？',
    options: {
      A: '老陈醋，年代久远。',
      B: '精选粮食，古法酿造，酸香醇厚，回味悠长。',
      C: '老陈醋瓶子很好看。',
      D: '老陈醋，价格便宜。',
    },
    correct: 'B',
    explanation: '"酸香醇厚，回味悠长"直接描述了味觉和嗅觉体验，突出风味。',
  },

  /* (C) 初中段 4 题 */
  {
    id: 'K6-D3-C01',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '《平凡的世界》中，孙少平在学校吃"非洲面"（最差的黑面馍）就咸菜，却觉得"津津有味"。这里的"味"更多指的是（ ）。',
    options: {
      A: '黑面馍本身的美味',
      B: '在极度饥饿与清贫中，食物带来的生理满足感，以及蕴含的奋斗滋味',
      C: '咸菜的味道',
      D: '无味',
    },
    correct: 'B',
    explanation: '"津津有味"在这里超越了食物本身的味道，表达的是生活的"滋味"——一种精神感受。',
  },

  {
    id: 'K6-D3-C02',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '《骆驼祥子》中祥子烈日拉车后"喝了瓢凉水"。这段没有直接写味道，但"喝凉水"暗示了他当时最需要的是（ ），从侧面写出天气的酷热。',
    options: { A: '甜的饮料', B: '解渴的清水', C: '辣的食物', D: '苦的茶' },
    correct: 'B',
    explanation: '极度口渴时，无味的清水就是最大的满足——以行为暗示味觉/身体需求。',
  },

  {
    id: 'K6-D3-C03',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '同是写"吃"，《孔乙己》中"排出九文大钱，要酒要豆"重在人物性格；而《社戏》中"都围起来用手撮着吃"重在（ ）。',
    options: {
      A: '豆子的具体味道',
      B: '孩子们天真快乐的野趣',
      C: '批判偷盗行为',
      D: '描写煮豆的技术',
    },
    correct: 'B',
    explanation: '虽未细写味道，但"撮着吃"的动作本身传递了孩子们的天真和自由快乐。',
  },

  {
    id: 'K6-D3-C04',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '你要写一篇关于"家乡的味道"的短文。以下哪种描写最具象且能承载情感？',
    options: {
      A: '家乡的味道就是爱的味道。',
      B: '家乡的味道，是清晨巷口豆浆的醇厚微甜，是傍晚家家户户飘出的混杂着葱姜爆锅的饭菜香，是永远忘不掉的味道。',
      C: '家乡发展很快，味道变了。',
      D: '我不知道家乡什么味道。',
    },
    correct: 'B',
    explanation: 'B 用具体味觉（醇厚微甜）+嗅觉（葱姜香）承载了对家乡的情感记忆。',
  },

  /* (H) 高中段 3 题 */
  {
    id: 'K6-D3-H01',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '钱钟书在《围城》中写方鸿渐喝葡萄酒："仿佛看见一串紫葡萄渐渐变成一汪深红的血液。"这种将味觉转化为恐怖视觉意象的描写，旨在（ ）。',
    options: {
      A: '赞美酒的美味',
      B: '表现人物彼时低落、厌世乃至病态的心理感受',
      C: '说明酒的酿造过程',
      D: '介绍葡萄酒知识',
    },
    correct: 'B',
    explanation: '将味觉扭曲为恐怖视觉，折射出人物当时消极厌世的心理状态。',
  },

  {
    id: 'K6-D3-H02',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '"试问岭南应不好，却道：此心安处是吾乡。"（苏轼）岭南生活在旁人看来是"酸"的，但当事人因"心安"而化为了"甜"。这揭示了"味道"的感受具有强烈的（ ）。',
    options: { A: '客观性', B: '主观性与相对性，受心境和情感深刻影响', C: '科学性', D: '不变性' },
    correct: 'B',
    explanation: '同样的经历，心境不同味道就不同——味觉感受具有强烈的主观性。',
  },

  {
    id: 'K6-D3-H03',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '"酸甜苦辣"常被用来比喻人生的丰富经历。这体现了汉语文化中（ ）的思维特点，即善于用具体的身体经验来表达抽象的人生况味。',
    options: { A: '逻辑分析', B: '具身隐喻', C: '科学实证', D: '宗教神秘' },
    correct: 'B',
    explanation: '用味觉的具体身体经验来理解/表达抽象的人生情感，是典型的具身隐喻思维。',
  },
];
