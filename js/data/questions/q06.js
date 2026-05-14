/**
 * 知识点6：口尝感觉点专项
 * D1×9 + D2×9 + D3×12（含学段标签 S/C/H） = 30 题
 * 来源：感觉训练基础模块题库_300题-5.14.docx
 */
export const Q06 = [
  {
    id: 'K7-D1-01',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '“这柠檬汁真酸”，这里的“酸”属于“口尝”感觉点中的（ ）。',
    options: { A: '气味', B: '味道', C: '口感', D: '声音' },
    correct: 'B',
  },

  {
    id: 'K7-D1-02',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '吃了花椒后，舌头那种酥酥的、有点木木的感觉叫（ ）。',
    options: { A: '辣', B: '麻', C: '涩', D: '苦' },
    correct: 'B',
  },

  {
    id: 'K7-D1-03',
    lessonId: 6,
    difficulty: 1,
    qtype: 'judge',
    text: '“口尝”感觉点下，包含了酸、甜、苦、辣、咸、麻、涩七种不同的味道。',
    options: { A: '正确', B: '错误' },
    correct: 'A',
  },

  {
    id: 'K7-D1-05',
    lessonId: 6,
    difficulty: 1,
    qtype: 'link',
    text: '将味道与常见例子连线。',
    leftItems: { '①': '酸', '②': '甜', '③': '涩' },
    rightItems: { 'A': '未熟的柿子', 'B': '蜂蜜', 'C': '醋' },
    correct: { '①': 'C', '②': 'B', '③': 'A' },
  },

  {
    id: 'K7-D1-06',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '“这碗汤有点淡，再放点盐”中的“淡”，指的是缺少（ ）味。',
    options: { A: '酸', B: '甜', C: '苦', D: '咸' },
    correct: 'D',
  },

  {
    id: 'K7-D1-07',
    lessonId: 6,
    difficulty: 1,
    qtype: 'single',
    text: '“口尝”的七种味道，都属于同一个感觉点，即味道。',
    options: { A: '气味', B: '味道', C: '口感', D: '声音' },
    correct: 'B',
  },

  {
    id: 'K7-D1-08',
    lessonId: 6,
    difficulty: 1,
    qtype: 'multi',
    text: '以下描述中，属于“口尝”感觉的有（ ）。',
    options: { A: '咖啡的苦涩', B: '话梅的酸甜', C: '麻辣火锅的过瘾', D: '薄荷糖的清凉' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K7-D1-09',
    lessonId: 6,
    difficulty: 1,
    qtype: 'judge',
    text: '“她很伤心，心里很苦。”这里的“苦”是口尝到的味道。',
    options: { A: '正确', B: '错误 (这里是比喻，表示心里难受)' },
    correct: 'B',
  },

  {
    id: 'K7-D2-01',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '你第一次喝“黑咖啡”，最可能尝到的主要味道是（ ），可能还带一点（ ）。',
    options: { A: '甜，酸', B: '苦，酸', C: '辣，麻', D: '咸，涩' },
    correct: 'B',
  },

  {
    id: 'K7-D2-02',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '“生活就像一盒巧克力，你永远不知道下一块是什么味道。”这句电影台词中，“味道”比喻生活的（ ）。',
    options: { A: '颜色', B: '不确定性 (用味觉比喻体验)', C: '形状', D: '温度' },
    correct: 'B',
  },

  {
    id: 'K7-D2-03',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '小红写：“这道菜好看又好吃！”老师建议她写写怎么“好吃”。她改写为：“这道糖醋鱼，外面炸得酥脆，里面的鱼肉鲜嫩，酱汁酸甜可口，特别开胃。”她补充的“酸甜”属于（ ）。',
    options: { A: '鼻闻', B: '口尝-味道', C: '手摸', D: '眼看' },
    correct: 'B',
  },

  {
    id: 'K7-D2-05',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '“哑巴吃黄连——有苦说不出”这个歇后语，源于黄连极（ ）的味道。',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'C',
  },

  {
    id: 'K7-D2-06',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '品尝“一颗话梅”时，味觉可能依次是： ① 入口先是明显的（ ）味 (咸) ② 然后是强烈的（ ）味弥漫 (酸) ③ 最后唾液分泌后，留下淡淡的（ ）味 (甜/甘草甜)',
    options: { A: '咸，酸，甜', B: '酸，甜，咸', C: '甜，咸，酸', D: '苦，辣，麻' },
    correct: 'A',
  },

  {
    id: 'K7-D2-07',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '“味觉小考官”上线！将以下“体验”归入对应的味道。 体验：① 抿一口陈醋 ② 咬一口黑巧克力 ③ 吃一口生柿子 味道：A.酸 B.苦 C.涩 正确匹配是（ ）。',
    options: { A: '①-A, ②-B, ③-C', B: '①-B, ②-C, ③-A', C: '①-C, ②-A, ③-B', D: '①-A, ②-C, ③-B' },
    correct: 'A',
  },

  {
    id: 'K7-D2-08',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '“梅子留酸软齿牙，芭蕉分绿与窗纱。”诗句中“留酸软齿牙”生动写出了梅子（ ）味之重，给人带来的生理反应。',
    options: { A: '甜', B: '酸', C: '苦', D: '辣' },
    correct: 'B',
  },

  {
    id: 'K7-D2-09',
    lessonId: 6,
    difficulty: 2,
    qtype: 'single',
    text: '你要为一种新式“跳跳糖”写广告语，强调其独特的舌尖体验。以下哪句最侧重“口尝”及相关感觉？',
    options: { A: '包装绚丽，闪闪发光。', B: '放入口中，噼啪跳跃，体验前所未有的刺激乐趣！(结合触觉/听觉，但核心是口腔内的新奇体验)', C: '静静地融化，细腻柔滑。', D: '闻起来有水果香。' },
    correct: 'B',
  },

  {
    id: 'K7-D3-S01',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '为你最喜欢的零食写一句“推荐语”，要写出它好吃的味道。以下哪句最具体？',
    options: { A: '这个零食太好吃了！', B: '这个薯片又脆又香。', C: '这包芒果干，咬下去酸甜适中，有浓浓的芒果味，嚼起来很有韧劲。', D: '大家都来买。' },
    correct: 'C',
  },

  {
    id: 'K7-D3-S02',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '我的味道很特别，能让舌头觉得刺痛、发热，很多人一边吃我一边流汗喝水。我是（ ）。',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'D',
  },

  {
    id: 'K7-D3-S03',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '小亮写：“妈妈熬的中药很难喝。”老师批注：“怎么个难喝法？是苦，是涩，还是有什么怪味？”小亮可以怎么改？（选一项）',
    options: { A: '妈妈熬的中药颜色很深，很难喝。', B: '妈妈熬的中药，闻起来就很苦，喝下去更是从舌头苦到喉咙，让人忍不住皱眉。', C: '妈妈熬的中药很有用。', D: '我不喜欢喝中药。' },
    correct: 'B',
  },

  {
    id: 'K7-D3-S04',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '人们常用“甜甜的”形容幸福的感觉，用“酸酸的”形容嫉妒，用“苦”形容艰辛。这说明“味道”常常可以用来比喻（ ）。',
    options: { A: '颜色', B: '声音', C: '内心的情感和体验', D: '温度' },
    correct: 'C',
  },

  {
    id: 'K7-D3-S05',
    lessonId: 6,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你要设计一句宣传“老陈醋”的标语，突出其传统工艺和风味。以下哪句最合适？',
    options: { A: '老陈醋，年代久远。', B: '精选粮食，古法酿造，酸香醇厚，回味悠长。', C: '老陈醋瓶子很好看。', D: '老陈醋，价格便宜。' },
    correct: 'B',
  },

  {
    id: 'K7-D3-C01',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '《平凡的世界》中，孙少平在学校吃“非洲面”（最差的黑面馍）就咸菜，却觉得“津津有味”。这里的“味”更多指的是（ ）。',
    options: { A: '黑面馍本身的美味', B: '在极度饥饿与清贫中，食物带来的生理满足感，以及蕴含的奋斗滋味', C: '咸菜的味道', D: '无味' },
    correct: 'B',
  },

  {
    id: 'K7-D3-C02',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '《骆驼祥子》中，祥子在烈日下拉车后，“拿起芭蕉扇扇扇，凉风往他身上吹，他感到一点舒服……他喝了瓢凉水。”这段描写没有直接写“口尝”，但“喝凉水”的动作暗示了他当时最需要的是（ ），从侧面写出了天气的酷热和身体的需求。',
    options: { A: '甜的饮料', B: '解渴的、无味的清水', C: '辣的食物', D: '苦的茶' },
    correct: 'B',
  },

  {
    id: 'K7-D3-C03',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '同是写“吃”，《孔乙己》中“便排出九文大钱，要酒要豆”，重在人物动作与性格；而《社戏》中归航偷豆“豆熟了，便任凭航船浮着，都围起来用手撮着吃”，重在（ ）。',
    options: { A: '豆子的具体味道', B: '孩子们天真快乐的野趣（虽未细写味道，但“撮着吃”的动作传递了趣味）', C: '批判偷盗行为', D: '描写煮豆的技术' },
    correct: 'B',
  },

  {
    id: 'K7-D3-C04',
    lessonId: 6,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '你要写一篇关于“家乡的味道”的短文。以下哪种“味道”最具象且能承载情感？',
    options: { A: '家乡的味道就是爱的味道。 (抽象)', B: '家乡的味道，是清晨巷口豆浆的醇厚微甜，是傍晚家家户户飘出的、混杂着葱姜爆锅的饭菜香，是永远忘不掉的味道。 (具体味觉与嗅觉结合)', C: '家乡发展很快，味道变了。', D: '我不知道家乡什么味道。' },
    correct: 'B',
  },

  {
    id: 'K7-D3-H01',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '钱钟书在《围城》中写方鸿渐喝外国葡萄酒：“这葡萄酒的滋味，……仿佛看见一串紫葡萄渐渐变成一汪深红的血液。”这种将味觉转化为恐怖视觉意象的描写，旨在（ ）。',
    options: { A: '赞美酒的美味', B: '表现人物彼时低落、厌世乃至有些病态的心理感受', C: '说明酒的酿造过程', D: '介绍葡萄酒知识' },
    correct: 'B',
  },

  {
    id: 'K7-D3-H02',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '古诗“试问岭南应不好，却道：此心安处是吾乡。”（苏轼）其中“岭南”的生活，在旁人看来是“酸”的（艰苦），但在当事人心中却因“心安”而化为了“甜”。这揭示了“味道”的感受具有强烈的（ ）。',
    options: { A: '客观性', B: '主观性与相对性，受心境和情感深刻影响', C: '科学性', D: '不变性' },
    correct: 'B',
  },

  {
    id: 'K7-D3-H03',
    lessonId: 6,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '“酸甜苦辣”常被用来比喻人生的丰富经历。这体现了汉语文化中（ ）的思维特点，即善于用具体、可感的身体经验（味觉）来理解和表达抽象、复杂的人生况味。',
    options: { A: '逻辑分析', B: '具身隐喻', C: '科学实证', D: '宗教神秘' },
    correct: 'B',
  },

  {
    id: 'K7-D4-04',
    lessonId: 6,
    difficulty: 4,
    qtype: 'multi',
    text: '以下通常属于“口尝-味道”的有（ ）。',
    options: { A: '糖的甜', B: '药的苦', C: '辣椒的辣', D: '冰淇淋的凉' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K7-D4-04',
    lessonId: 6,
    difficulty: 4,
    qtype: 'multi',
    text: '描写“一颗新鲜的山楂”，可能涉及以下哪些“口尝”感觉？（ ）',
    options: { A: '强烈的酸味', B: '一丝淡淡的甜味', C: '果皮的微涩感', D: '果肉的绵软口感 (口感，属手摸)' },
    correct: ['A', 'B', 'C'],
  },
];
