/**
 * 知识点4：耳听感觉点专项（声音·声息）
 * D1×9 + D2×9 + D3×12（含学段标签 S5/C4/H3） = 30 题
 * 来源：作文训练系统之---感觉训练基础模块开发标准文档3.0-5.19.docx（v4.0）
 */
export const Q04 = [
  /* ─────────── 难度 1：基础识别（9题） ─────────── */
  {
    id: 'K4-D1-01',
    lessonId: 4,
    difficulty: 1,
    qtype: 'single',
    text: '"轰隆隆的雷声"属于"耳听"感觉点中的（ ）。',
    options: { A: '声音', B: '声息', C: '气味', D: '动作' },
    correct: 'A',
    explanation: '雷声响亮明显，属于"声音"。',
  },

  {
    id: 'K4-D1-02',
    lessonId: 4,
    difficulty: 1,
    qtype: 'single',
    text: '"他悄悄地叹了口气"，这"叹气声"通常属于（ ）。',
    options: { A: '声音', B: '声息', C: '味道', D: '颜色' },
    correct: 'B',
    explanation: '叹气是细微、轻柔的气息声，属于"声息"。',
  },

  {
    id: 'K4-D1-03',
    lessonId: 4,
    difficulty: 1,
    qtype: 'judge',
    text: '"教室里安静得能听到针落地的声音"，这里的"针落地"属于"声息"。',
    options: { A: '正确', B: '错误' },
    correct: 'A',
    explanation: '针落地的声音极其微弱，只有在安静环境下才能察觉，属于声息。',
  },

  {
    id: 'K4-D1-04',
    lessonId: 4,
    difficulty: 1,
    qtype: 'multi',
    text: '以下哪些通常属于"耳听-声音"？（ ）',
    options: { A: '鞭炮的爆炸声', B: '观众的欢呼声', C: '微风吹过树叶的沙沙声', D: '深夜自己的心跳声' },
    correct: ['A', 'B'],
    explanation: '鞭炮和欢呼都是明显响动属"声音"；沙沙和心跳属于细微的"声息"。',
  },

  {
    id: 'K4-D1-05',
    lessonId: 4,
    difficulty: 1,
    qtype: 'link',
    text: '请将下面的声音例子与类别连线。',
    leftItems: { '①': '清脆的鸟鸣', '②': '笔尖在纸上的摩擦声', '③': '溪水潺潺的流动声' },
    rightItems: { 'A': '声音', 'B': '声息' },
    correct: { '①': 'A', '②': 'B', '③': 'A' },
    explanation: '鸟鸣和溪水潺潺是明显可闻的声音；笔尖摩擦声极轻微，属声息。',
  },

  {
    id: 'K4-D1-06',
    lessonId: 4,
    difficulty: 1,
    qtype: 'single',
    text: '下列选项中，主要属于"声息"的是（ ）。',
    options: { A: '闹钟刺耳的铃声', B: '舞台上激昂的演讲', C: '深夜里时钟的滴答声', D: '节日欢快的锣鼓声' },
    correct: 'C',
    explanation: '深夜里时钟的滴答声细微轻柔，需要安静环境才能感受到，属于声息。',
  },

  {
    id: 'K4-D1-07',
    lessonId: 4,
    difficulty: 1,
    qtype: 'single',
    text: '"声息"通常指（ ）的声音，需要相对安静的环境才能察觉。',
    options: { A: '响亮', B: '微弱', C: '悦耳', D: '嘈杂' },
    correct: 'B',
    explanation: '声息的核心特征就是微弱、细腻，与"声音"（明显响动）相对。',
  },

  {
    id: 'K4-D1-08',
    lessonId: 4,
    difficulty: 1,
    qtype: 'multi',
    text: '"耳听"的两个基本感觉点是（ ）。',
    options: { A: '音乐', B: '声音', C: '声息', D: '噪音' },
    correct: ['B', 'C'],
    explanation: '耳听只有"声音"和"声息"两个标准感觉点；音乐和噪音不是感觉点分类。',
  },

  {
    id: 'K4-D1-09',
    lessonId: 4,
    difficulty: 1,
    qtype: 'judge',
    text: '"声音"和"声息"的划分是绝对的，与环境和音量无关。',
    options: { A: '正确', B: '错误' },
    correct: 'B',
    explanation: '声音和声息的区分是相对的，同一种响动在不同环境中可能被归为不同类别。',
  },

  /* ─────────── 难度 2：简单应用（9题） ─────────── */
  {
    id: 'K4-D2-01',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '你想在作文中表现"图书馆的安静"，以下哪种"耳听"描写最合适？',
    options: {
      A: '同学们翻书的哗哗声和走路的咚咚声。',
      B: '窗外嘈杂的汽车鸣笛声。',
      C: '偶尔的咳嗽声、书页翻动的轻响，以及空调低低的送风声。',
      D: '完全静默，没有任何声音。',
    },
    correct: 'C',
    explanation: '用细微的声息（轻响、低低的送风声）来反衬安静，比"完全无声"更真实生动。',
  },

  {
    id: 'K4-D2-02',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '"夜深了，只听见远处传来几声零星的狗吠，更衬托出乡村的宁静。"这句话中，用来"以声衬静"的是（ ）。',
    options: { A: '声音（狗吠）', B: '声息', C: '噪音', D: '音乐' },
    correct: 'A',
    explanation: '狗吠是明显响动属"声音"，用少量的声音反衬出整体环境的安静。',
  },

  {
    id: 'K4-D2-03',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '小明把"比赛现场真热闹"改为"观众的呐喊声、加油声此起彼伏，裁判的哨声格外尖锐"。他补充的主要是（ ）。',
    options: { A: '视觉', B: '听觉-声音', C: '嗅觉', D: '触觉' },
    correct: 'B',
    explanation: '呐喊声、加油声、哨声都是明显的声音，属于听觉描写。',
  },

  {
    id: 'K4-D2-04',
    lessonId: 4,
    difficulty: 2,
    qtype: 'multi',
    text: '描写"夏夜的池塘"，可能用到以下哪些"耳听"感觉点？（ ）',
    options: { A: '青蛙"呱呱"的叫声', B: '鱼儿跃出水面的"扑通"声', C: '微风拂过荷叶的细微沙沙声', D: '自己的呼吸声' },
    correct: ['A', 'B', 'C', 'D'],
    explanation: 'A、B 是声音（明显响动），C、D 是声息（细微气息），都属于耳听感觉点。',
  },

  {
    id: 'K4-D2-05',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '"姑苏城外寒山寺，夜半钟声到客船。"这里的"钟声"在静夜中传来，属于（ ），营造了空旷、孤寂的意境。',
    options: { A: '刺耳的噪音', B: '洪亮的声音', C: '声息', D: '音乐' },
    correct: 'B',
    explanation: '寺院钟声是明显、洪亮的响动，属于"声音"。',
  },

  {
    id: 'K4-D2-06',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '请将下列声音按从"声息"到"声音"的音量大小排序：① 蚊子的嗡嗡声  ② 人们的窃窃私语  ③ 雷鸣般的掌声',
    options: { A: '①-②-③', B: '③-②-①', C: '②-①-③', D: '③-①-②' },
    correct: 'A',
    explanation: '蚊子嗡嗡最轻→窃窃私语稍大→雷鸣掌声最大，从声息到声音依次递增。',
  },

  {
    id: 'K4-D2-07',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '"声音侦探"请办案！"炸雷、雪落枝头、悄悄话、火车汽笛"中，归入"声息"的是哪两项？',
    options: {
      A: '雪落枝头、悄悄话',
      B: '炸雷、火车汽笛',
      C: '炸雷、雪落枝头',
      D: '悄悄话、火车汽笛',
    },
    correct: 'A',
    explanation: '雪落枝头和悄悄话都是极微弱的声音，属声息；炸雷和火车汽笛是明显的声音。',
  },

  {
    id: 'K4-D2-08',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '"他屏住呼吸，只感到自己心脏在胸腔里\'咚咚\'狂跳。"在这句描写紧张情绪的句子里，"心跳声"属于（ ）。',
    options: { A: '声音', B: '声息', C: '视觉', D: '触觉' },
    correct: 'B',
    explanation: '心跳声在"屏住呼吸"的极致安静下才被感知到，是极细微的声息。',
  },

  {
    id: 'K4-D2-09',
    lessonId: 4,
    difficulty: 2,
    qtype: 'single',
    text: '你要录制一段"春日清晨的公园"自然音效。以下哪种声音组合最能体现宁静与生机？',
    options: {
      A: '广场舞的音乐和孩子的哭闹。',
      B: '清脆的鸟鸣，蜜蜂飞舞的嗡嗡声，微风拂过树叶的沙沙声。',
      C: '施工的电钻声。',
      D: '完全无声。',
    },
    correct: 'B',
    explanation: '鸟鸣（声音）+ 嗡嗡和沙沙（声息），声音与声息搭配营造出宁静而有生机的画面。',
  },

  /* ─────────── 难度 3：综合迁移（12题） ─────────── */
  /* (S) 小学段 5 题 */
  {
    id: 'K4-D3-S01',
    lessonId: 4,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '写"下雨了"的日记，你想让读者"听"到雨。以下哪种写法最好？',
    options: {
      A: '下雨了，雨很大。',
      B: '下雨了，雨点打在窗户上"噼里啪啦"响，顺着水管流下来的水"哗啦啦"地唱歌。',
      C: '下雨让人心情不好。',
      D: '下雨有利于植物生长。',
    },
    correct: 'B',
    explanation: 'B 用了"噼里啪啦""哗啦啦"具体的声音描写，让读者能"听"到雨。',
  },

  {
    id: 'K4-D3-S02',
    lessonId: 4,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你蒙上眼睛，听到：① 远处隐约的广播操音乐 ② 近处同学们跑跳的脚步声和笑闹声 ③ 头顶电风扇"呼呼"转动声。你很可能在（ ）。',
    options: { A: '深夜的卧室', B: '课间的操场边', C: '中午的教室里', D: '图书馆' },
    correct: 'B',
    explanation: '广播操音乐+跑跳笑闹+电风扇，符合课间操场边教室的场景。',
  },

  {
    id: 'K4-D3-S03',
    lessonId: 4,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '小亮写："家里真安静。"老师批注："可以用细微声音来表现安静。"以下哪个修改最好？',
    options: {
      A: '家里真安静，我很喜欢。',
      B: '家里真安静，静得能听到冰箱工作的轻微嗡嗡声，和墙上钟表指针走动的滴答声。',
      C: '家里真安静，因为没人说话。',
      D: '家里不安静，有电视声。',
    },
    correct: 'B',
    explanation: 'B 用"嗡嗡声""滴答声"（声息）来以声衬静，具体而生动。',
  },

  {
    id: 'K4-D3-S04',
    lessonId: 4,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '"风声雨声读书声，声声入耳。"这句儿歌强调了用（ ）来感受世界的丰富。',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '手' },
    correct: 'B',
    explanation: '"风声""雨声""读书声"都是耳朵听到的，强调了听觉的丰富性。',
  },

  {
    id: 'K4-D3-S05',
    lessonId: 4,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你要为"害怕走夜路"的主人公设计声音效果。以下哪种组合最能烘托恐惧？',
    options: {
      A: '欢快的儿歌。',
      B: '自己的呼吸声越来越粗重，总觉得身后有轻微的脚步声，突然一声野猫的尖厉叫声打破寂静。',
      C: '热闹的集市声。',
      D: '完全无声。',
    },
    correct: 'B',
    explanation: '先用声息（呼吸声、脚步声）营造紧张氛围，再用突然的声音（猫叫）制造惊吓。',
  },

  /* (C) 初中段 4 题 */
  {
    id: 'K4-D3-C01',
    lessonId: 4,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '"蝉噪林逾静，鸟鸣山更幽。"这句诗运用了"以声衬静"的手法，这里的"噪"和"鸣"属于（ ），用来反衬山林的幽静。',
    options: { A: '难听的噪音', B: '悦耳的音乐', C: '耳听-声音', D: '耳听-声息' },
    correct: 'C',
    explanation: '蝉噪和鸟鸣都是明显的响动属"声音"；正因有声，才反衬出林中的幽静。',
  },

  {
    id: 'K4-D3-C02',
    lessonId: 4,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '鲁迅《社戏》中写归航："那声音大概是横笛，宛转，悠扬，使我的心也沉静……"这里对笛声的描写，不仅写了声音的（ ），还写了它引起的心理感受。',
    options: { A: '颜色', B: '气味', C: '音色（宛转、悠扬）', D: '温度' },
    correct: 'C',
    explanation: '"宛转""悠扬"描述的是笛声的音色特征，属于声音的质感描写。',
  },

  {
    id: 'K4-D3-C03',
    lessonId: 4,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '同是写"静"，甲文"万籁俱寂"，乙文"庭下如积水空明，水中藻、荇交横，盖竹柏影也。"（苏轼《记承天寺夜游》）乙文的高明之处在于（ ）。',
    options: {
      A: '直接说"静"。',
      B: '用视觉的澄澈透明来通感"静"的意境，避开了直接的听觉描写，更含蓄优美。',
      C: '写了更多声音。',
      D: '篇幅更长。',
    },
    correct: 'B',
    explanation: '苏轼不直接写"静"，而用清透的视觉画面让读者自己感受到宁静——这是通感手法。',
  },

  {
    id: 'K4-D3-C04',
    lessonId: 4,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '你要写一篇关于"离别车站"的短文，想用声音烘托纷乱与伤感。以下哪种声音元素组合最贴切？',
    options: {
      A: '婚礼进行曲和人们的祝福声。',
      B: '火车的汽笛长鸣、广播里冰冷的女声、人群嘈杂的告别与哭泣、自己沉重的呼吸。',
      C: '考场里的写字声。',
      D: '音乐会的美妙乐章。',
    },
    correct: 'B',
    explanation: '汽笛/广播/哭泣是声音，沉重呼吸是声息，多层次声音营造离别的纷乱与伤感。',
  },

  /* (H) 高中段 3 题 */
  {
    id: 'K4-D3-H01',
    lessonId: 4,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '白居易《琵琶行》中"大弦嘈嘈如急雨，小弦切切如私语。嘈嘈切切错杂弹，大珠小珠落玉盘。"这段描写之所以成为千古绝唱，是因为它（ ）。',
    options: {
      A: '只记录了声音的大小',
      B: '运用精妙的比喻，将抽象的乐音转化为急雨、私语、珠落玉盘等可感意象，写出了声音的节奏、力度、音色之美',
      C: '说明了琵琶的构造',
      D: '描写了演奏者的外貌',
    },
    correct: 'B',
    explanation: '用视觉/触觉比喻来描写声音（通感），让读者"看见"声音的形态。',
  },

  {
    id: 'K4-D3-H02',
    lessonId: 4,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '古诗"哀筝一弄湘江曲，声声写尽湘波绿。"（晏几道）这里用"写尽湘波绿"来形容筝声，是运用了（ ）手法，将听觉与视觉沟通。',
    options: { A: '夸张', B: '拟人', C: '通感', D: '对比' },
    correct: 'C',
    explanation: '把听觉（哀筝声）转化为视觉（湘波绿），使乐声的哀怨情调具象化，是典型的通感。',
  },

  {
    id: 'K4-D3-H03',
    lessonId: 4,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '"暮鼓晨钟"这个词，不仅指示了声音和时间，更积淀了一种宗教的肃穆与时光的秩序感。这说明在文学中，特定的"声音"意象可以承载深厚的（ ）。',
    options: { A: '物理信息', B: '文化内涵与集体情感', C: '个人喜好', D: '科学原理' },
    correct: 'B',
    explanation: '"暮鼓晨钟"已超越物理声音，承载了佛教文化与时光感悟等集体情感。',
  },
];
