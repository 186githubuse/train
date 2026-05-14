/**
 * 知识点1：什么是感觉
 * D1×9 + D2×9 + D3×12（含学段标签 S/C/H） = 30 题
 * 来源：感觉训练基础模块题库_300题-5.14.docx
 */
export const Q01 = [
  {
    id: 'K1-D1-01',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '要了解一个苹果甜不甜，我们应该用（ ）。',
    options: { A: '眼睛看', B: '鼻子闻', C: '嘴巴尝', D: '手去摸' },
    correct: 'C',
  },

  {
    id: 'K1-D1-02',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '“感觉”指的是（ ）。',
    options: { A: '心里的喜怒哀乐', B: '眼看、耳听、鼻闻、口尝、手摸', C: '大脑的思考和想象', D: '跑步和跳跃' },
    correct: 'B',
  },

  {
    id: 'K1-D1-03',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '“雷声轰隆隆”主要是通过（ ）感觉到的。',
    options: { A: '眼看', B: '耳听', C: '鼻闻', D: '手摸' },
    correct: 'B',
  },

  {
    id: 'K1-D1-04',
    lessonId: 1,
    difficulty: 1,
    qtype: 'judge',
    text: '“想一想这道数学题怎么做”属于感觉活动。',
    options: { A: '正确', B: '错误' },
    correct: 'B',
  },

  {
    id: 'K1-D1-05',
    lessonId: 1,
    difficulty: 1,
    qtype: 'link',
    text: '请将左边的活动与右边的感觉方式连线。',
    leftItems: { '①': '看烟花绽放的颜色', '②': '闻妈妈做的饭菜香', '③': '听小鸟叽叽喳喳叫' },
    rightItems: { 'A': '耳听', 'B': '眼看', 'C': '鼻闻' },
    correct: { '①': 'B', '②': 'C', '③': 'A' },
  },

  {
    id: 'K1-D1-06',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '诗人写“白毛浮绿水”，他必须用到（ ）。',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '舌头' },
    correct: 'A',
  },

  {
    id: 'K1-D1-07',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '下列行为中，不属于“感觉”的是（ ）。',
    options: { A: '摸一摸小猫柔软的毛', B: '尝一尝柠檬的酸味', C: '猜一猜盒子里是什么礼物', D: '闻一闻雨后泥土的气息' },
    correct: 'C',
  },

  {
    id: 'K1-D1-08',
    lessonId: 1,
    difficulty: 1,
    qtype: 'multi',
    text: '我们的感觉器官主要包括（ ）。',
    options: { A: '眼', B: '耳', C: '鼻', D: '口（舌） E. 手（皮肤）' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K1-D1-09',
    lessonId: 1,
    difficulty: 1,
    qtype: 'single',
    text: '“为有暗香来”中的“暗香”，诗人是用（ ）感觉到的。',
    options: { A: '眼', B: '耳', C: '鼻', D: '口' },
    correct: 'C',
  },

  {
    id: 'K1-D2-01',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '小美想描写“春游时的樱花林”，她最应该先（ ）。',
    options: { A: '上网抄一篇范文', B: '去樱花林看看、闻闻、听听', C: '想一个深刻的道理', D: '问别人樱花林什么样' },
    correct: 'B',
  },

  {
    id: 'K1-D2-02',
    lessonId: 1,
    difficulty: 2,
    qtype: 'multi',
    text: '要生动地描写“爆米花”，我们可以从哪些方面获取素材？（ ）',
    options: { A: '看它金黄的色泽和蓬松的形状', B: '闻它浓郁的奶油香味', C: '听它“嘭”的一声爆开的巨响', D: '尝它酥脆香甜的味道 E. 思考它为什么能爆开' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K1-D2-03',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '“两个黄鹂鸣翠柳”这句诗，主要来源于诗人对（ ）的感知。',
    options: { A: '颜色和声音', B: '气味和味道', C: '形状和温度', D: '软硬和干湿' },
    correct: 'A',
  },

  {
    id: 'K1-D2-04',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '你要向从未见过雪的朋友描述“雪”，以下哪种做法最能获得丰富、真实的描述素材？',
    options: { A: '查字典里“雪”的解释', B: '在冬天，用手接住雪花，看看它的样子，感觉它的冰凉', C: '背诵一首关于雪的古诗', D: '想象雪是白色的糖' },
    correct: 'B',
  },

  {
    id: 'K1-D2-05',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '“稻花香里说丰年，听取蛙声一片。”词人辛弃疾在这句词中，主要运用了哪两种感觉来描绘夏夜场景？',
    options: { A: '眼看和口尝', B: '鼻闻和耳听', C: '手摸和眼看', D: '口尝和手摸' },
    correct: 'B',
  },

  {
    id: 'K1-D2-06',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '小明写：“我的书包很大，能装下很多梦想。”老师评语：“‘梦想’不是感觉到的，是想到的。请写写书包看起来、摸起来怎么样。”老师是想提醒小明写作要（ ）。',
    options: { A: '多用比喻', B: '基于感觉获得的真实素材', C: '写长句子', D: '抒发情感' },
    correct: 'B',
  },

  {
    id: 'K1-D2-07',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '如果把骆宾王写《咏鹅》时的耳朵捂住，他可能会失去诗中哪部分内容？（ ）',
    options: { A: '曲项向天歌', B: '白毛浮绿水', C: '红掌拨清波', D: '鹅，鹅，鹅' },
    correct: 'A',
  },

  {
    id: 'K1-D2-08',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '请将“了解一个橘子”的合理步骤排序。 ① 尝一尝橘子的酸甜 ② 看一看橘子的颜色和形状 ③ 闻一闻橘子皮的清香',
    options: { A: '②-③-①', B: '①-②-③', C: '③-②-①', D: '②-①-③' },
    correct: 'A',
  },

  {
    id: 'K1-D2-09',
    lessonId: 1,
    difficulty: 2,
    qtype: 'single',
    text: '“写好作文离不开感觉”，这句话最恰当的理解是（ ）。',
    options: { A: '感觉好的人作文一定好', B: '感觉是凭空想象的', C: '感觉能为作文提供具体、生动的素材来源', D: '作文只需要写感觉就行' },
    correct: 'C',
  },

  {
    id: 'K1-D3-S01',
    lessonId: 1,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你是“校园小主播”，要向广播站介绍“热闹的大课间”。以下哪种准备方式能让你获得最生动的播报内容？',
    options: { A: '坐在教室里想象同学们在玩什么。', B: '走到操场上，看看同学们奔跑跳跃的样子，听听大家的笑声和呼喊声，感受那种欢快的气氛。', C: '查阅体育活动的专业术语。', D: '采访一位同学，问他对大课间的看法。' },
    correct: 'B',
  },

  {
    id: 'K1-D3-S02',
    lessonId: 1,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '读下面这首儿童诗《雾》：“雾来了，踮着猫的细步。他弓起腰蹲着，静静地俯视海港和城市，再往前一滑，又走了。”诗人把雾想象成一只猫。诗人能进行这样有趣的想象，首先必须（ ）。',
    options: { A: '知道很多关于猫的知识', B: '仔细观察过雾朦胧、缓慢移动的样子', C: '会用“踮”、“弓”、“滑”这些动词', D: '喜欢猫这种动物' },
    correct: 'B',
  },

  {
    id: 'K1-D3-S03',
    lessonId: 1,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '方方和圆圆比赛描写“风”。方方写：“风真大，吹得我走不动路。”圆圆写：“风呼呼地吼着，路旁的小树被吹弯了腰，地上的落叶打着旋儿飞上了天。”老师表扬了圆圆的描写，主要是因为圆圆的句子（ ）。',
    options: { A: '更长', B: '用了拟人手法', C: '通过眼睛看、耳朵听，写出了风带来的具体变化', D: '表达了害怕的心情' },
    correct: 'C',
  },

  {
    id: 'K1-D3-S04',
    lessonId: 1,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '小华的作文写道：“我的妈妈很爱我。”老师批注：“爱是抽象的情感。请通过一件小事，写写妈妈爱你时，你看到了什么、听到了什么、感受到了什么，让‘爱’变得看得见、摸得着。”老师的批注核心是希望小华（ ）。',
    options: { A: '换一个作文题目', B: '用具体的感觉材料来表现情感', C: '多使用“爱”这个字', D: '把作文写得更长' },
    correct: 'B',
  },

  {
    id: 'K1-D3-S05',
    lessonId: 1,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '甲说：写作文靠的是好词好句，多背些范文就行了。乙说：好词好句像漂亮的花，但种花需要泥土。感觉就是收集“写作的泥土”。谁的说法更有道理？',
    options: { A: '甲有道理', B: '乙有道理', C: '都有道理', D: '都没道理' },
    correct: 'B',
  },

  {
    id: 'K1-D3-C01',
    lessonId: 1,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '比较以下两位作家对“雨”的描写准备： 老舍：我会坐在那里，静静地看，看雨丝，看雨点，听雨声，甚至伸出手去接几滴雨。 某学生：我马上想到“雨水滋润万物”这个道理，然后开始找相关的好词好句。 两位准备方式最大的区别在于（ ）。',
    options: { A: '作家更悠闲', B: '作家更注重亲身观察和感受（感觉），学生更倾向于直接调用概念', C: '学生更有效率', D: '没有区别' },
    correct: 'B',
  },

  {
    id: 'K1-D3-C02',
    lessonId: 1,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '鲁迅在《从百草园到三味书屋》中写道：“不必说碧绿的菜畦，光滑的石井栏，高大的皂荚树，紫红的桑椹……单是周围的短短的泥墙根一带，就有无限趣味。”这段经典描写，其丰富性直接来源于作者（ ）。',
    options: { A: '高超的想象力', B: '童年时对百草园全面而细致的感官体验', C: '使用了大量的成语', D: '对植物学有深入研究' },
    correct: 'B',
  },

  {
    id: 'K1-D3-C03',
    lessonId: 1,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '你受邀为学校的“五味斋”食堂新菜品“糖醋里脊”写一段推荐语。为了写得诱人，你决定先去食堂“取材”。以下“取材”计划中最无效的一项是（ ）。',
    options: { A: '看：看它的金黄色泽和油亮酱汁。', B: '闻：闻它酸甜交织的扑鼻香气。', C: '尝：尝一块，感受外酥里嫩的口感和酸甜比例。', D: '想：想象它背后的烹饪文化和历史故事。 E. 听：听听同学们咀嚼时酥脆的“咔嚓”声和评价。' },
    correct: 'D',
  },

  {
    id: 'K1-D3-C04',
    lessonId: 1,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '朱自清在《春》中写“风里带来些新翻的泥土的气息，混着青草味儿，还有各种花的香”，如果没有敏锐的（ ），他就无法捕捉并写出春天空气里这种复杂而微妙的“气息”。',
    options: { A: '视觉', B: '听觉', C: '嗅觉', D: '味觉' },
    correct: 'C',
  },

  {
    id: 'K1-D3-H01',
    lessonId: 1,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '诗人顾城写道：“黑夜给了我黑色的眼睛，我却用它寻找光明。”有评论说，这句诗的成功，根源在于诗人对“黑暗”与“光明”这两种最原始的视觉体验有着刻骨铭心的生命感受。这印证了在文学创作中（ ）。',
    options: { A: '感觉经验是孕育深刻哲思与意象的土壤', B: '诗歌不需要具体感觉描写', C: '思想比感觉更重要', D: '感觉只适用于描写具体事物' },
    correct: 'A',
  },

  {
    id: 'K1-D3-H02',
    lessonId: 1,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '作家莫言曾说：“作家是用鼻子写作的。”他解释，当他描写一个场景时，首先会在脑海中唤起那个场景的气味。这种说法强调了（ ）在文学建构中的独特作用和基础地位。',
    options: { A: '听觉想象力', B: '嗅觉感觉以及感官记忆', C: '逻辑推理能力', D: '词汇量大小' },
    correct: 'B',
  },

  {
    id: 'K1-D3-H03',
    lessonId: 1,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '在学习绘画时，老师常强调“要学会观察”，不仅是看物体的轮廓，还要看它的色彩、明暗、质感，甚至去触摸感受。这其实与写作中的“感觉训练”异曲同工，都说明了（ ）。',
    options: { A: '艺术门类之间完全相通', B: '任何创造性的表达，都始于对世界精细、深入的感知', C: '画画比写作更需要观察', D: '观察是唯一的创作方法' },
    correct: 'B',
  },
];
