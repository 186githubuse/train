/**
 * js/data/questions.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 题库数据
 * 10个知识点 × 3难度层级 × 5题 = 150题
 * 综合挑战 3层级 × 10题 = 30题
 * 总计：180题
 *
 * 题号编码：`知识点-难度层级-题序号`，如 1-2-3
 * ─────────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} Question
 * @property {string}  id         - 题号，如 "1-1-1"
 * @property {number}  lessonId   - 所属知识点（1-10，11=综合挑战）
 * @property {number}  difficulty - 难度层级（1=基础, 2=中等, 3=挑战）
 * @property {string}  text       - 题目文本
 * @property {Object}  options    - 选项 { A, B, C, D }
 * @property {string}  correct    - 正确答案 'A'|'B'|'C'|'D'
 * @property {string}  hint       - 答案解析/要点
 */

/** @type {Question[]} */
export const QUESTIONS = [

  // ═══════════════════════════════════════════════════
  // 知识点1：什么是感觉
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '1-1-1', lessonId: 1, difficulty: 1,
    text: '小明用鼻子闻了闻妈妈做的红烧肉，觉得好香。请问，小明是在运用哪种感觉？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'C', hint: '鼻子闻红烧肉',
  },
  {
    id: '1-1-2', lessonId: 1, difficulty: 1,
    text: '下列哪个行为，是在运用"感觉"来认识世界？',
    options: { A: '闭上眼睛想明天吃什么', B: '闭上眼睛听窗外的雨声', C: '心里默算一道数学题', D: '回忆昨天看过的电影' },
    correct: 'B', hint: '闭眼听=运用感觉；想/算/回忆≠感觉',
  },
  {
    id: '1-1-3', lessonId: 1, difficulty: 1,
    text: '孟浩然的《春晓》中写道："夜来风雨声，花落知多少。"诗人是通过什么感觉知道昨夜有风雨的？',
    options: { A: '眼睛看', B: '耳朵听', C: '鼻子闻', D: '手摸' },
    correct: 'B', hint: '"夜来风雨声"',
  },
  {
    id: '1-1-4', lessonId: 1, difficulty: 1,
    text: '老师说，感觉是我们认识世界的第一步。如果我们想了解一个苹果，下列哪种方式不属于"感觉"？',
    options: { A: '看它的颜色', B: '摸它的表皮', C: '猜测它很甜', D: '闻它的香气' },
    correct: 'C', hint: '猜测不属于感觉',
  },
  {
    id: '1-1-5', lessonId: 1, difficulty: 1,
    text: '白居易在《赋得古原草送别》中写道："野火烧不尽，春风吹又生。"诗人是通过什么感觉知道"春风吹又生"的？',
    options: { A: '眼睛看', B: '耳朵听', C: '鼻子闻', D: '手摸' },
    correct: 'A', hint: '看到"春风吹又生"',
  },

  // ── 难度2（中等）──
  {
    id: '1-2-1', lessonId: 1, difficulty: 2,
    text: '叶绍翁《游园不值》中"春色满园关不住，一枝红杏出墙来"，诗人用哪种感觉知道园内春色？',
    options: { A: '听', B: '看', C: '闻', D: '摸' },
    correct: 'B', hint: '"一枝红杏出墙来"',
  },
  {
    id: '1-2-2', lessonId: 1, difficulty: 2,
    text: '下列选项中，哪一项是同时运用了两种不同感觉？',
    options: { A: '听到鸟叫', B: '看到花开', C: '闻到花香并看到颜色', D: '摸到石头' },
    correct: 'C', hint: '同时运用两种感觉',
  },
  {
    id: '1-2-3', lessonId: 1, difficulty: 2,
    text: '"感觉"这个词在本课中特指什么？',
    options: { A: '心里的想法', B: '身体器官对外界的感知', C: '对未来的猜测', D: '对过去的回忆' },
    correct: 'B', hint: '感觉的定义',
  },
  {
    id: '1-2-4', lessonId: 1, difficulty: 2,
    text: '王安石《梅花》中"遥知不是雪，为有暗香来"，诗人用哪种感觉判断出是梅花？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'C', hint: '"暗香来"=鼻子闻',
  },
  {
    id: '1-2-5', lessonId: 1, difficulty: 2,
    text: '如果要描写一个"苹果"，下列哪一项不是通过感觉获得的？',
    options: { A: '苹果是红色的', B: '苹果闻起来很香', C: '苹果应该是甜的', D: '苹果摸起来光滑' },
    correct: 'C', hint: '"应该是"=猜测，非感觉',
  },

  // ── 难度3（挑战）──
  {
    id: '1-3-1', lessonId: 1, difficulty: 3,
    text: '下列诗句中，哪一句主要运用了"听觉"感觉？',
    options: { A: '日出江花红胜火', B: '春来江水绿如蓝', C: '夜来风雨声', D: '为有暗香来' },
    correct: 'C', hint: '听觉',
  },
  {
    id: '1-3-2', lessonId: 1, difficulty: 3,
    text: '"感觉"与"想象"最大的区别是什么？',
    options: { A: '感觉依赖身体器官，想象依赖大脑', B: '感觉是真实的，想象是虚假的', C: '感觉只能用于作文，想象不能', D: '感觉比想象更重要' },
    correct: 'A', hint: '感觉vs想象的区别',
  },
  {
    id: '1-3-3', lessonId: 1, difficulty: 3,
    text: '刘禹锡《秋词》中"晴空一鹤排云上，便引诗情到碧霄"，诗人用哪种感觉获得写作素材？',
    options: { A: '听', B: '看', C: '闻', D: '摸' },
    correct: 'B', hint: '"晴空一鹤排云上"',
  },
  {
    id: '1-3-4', lessonId: 1, difficulty: 3,
    text: '如果我们想描写"春天来了"，下列哪一组感觉都能提供素材？',
    options: { A: '看到绿色、听到鸟鸣、闻到花香', B: '想到的快乐、回忆去年春天', C: '猜测的天气、计划的春游', D: '读到的古诗、听到的故事' },
    correct: 'A', hint: '三种感觉都是直接感知',
  },
  {
    id: '1-3-5', lessonId: 1, difficulty: 3,
    text: '下列哪个选项中的诗句，没有直接使用"感觉"？',
    options: { A: '夜来风雨声', B: '春色满园关不住', C: '遥知不是雪', D: '举头望明月，低头思故乡' },
    correct: 'D', hint: '"思"是想象/情感，非直接感觉',
  },

  // ═══════════════════════════════════════════════════
  // 知识点2：感觉与作文的关系
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '2-1-1', lessonId: 2, difficulty: 1,
    text: '老师说"写好作文离不开感觉"。这句话的意思是？',
    options: { A: '感觉能让我们考高分', B: '感觉能为我们提供写作的素材', C: '写作文时要用到很多感觉器官', D: '写作文前要先深呼吸' },
    correct: 'B', hint: '',
  },
  {
    id: '2-1-2', lessonId: 2, difficulty: 1,
    text: '小明写作文写不出来，脑子里一片空白。最可能的原因是什么？',
    options: { A: '他读的书太少', B: '他写字太慢', C: '他没有仔细去观察和感觉', D: '他没用上成语' },
    correct: 'C', hint: '',
  },
  {
    id: '2-1-3', lessonId: 2, difficulty: 1,
    text: '为什么骆宾王能把《咏鹅》写得那么生动？',
    options: { A: '因为他很喜欢鹅', B: '因为他认识很多字', C: '因为他的老师教得好', D: '因为他看到了、听到了鹅的样子和声音' },
    correct: 'D', hint: '',
  },
  {
    id: '2-1-4', lessonId: 2, difficulty: 1,
    text: '杜甫的诗句"两个黄鹂鸣翠柳"中，诗人用了哪两种感觉？',
    options: { A: '看和闻', B: '听和尝', C: '看和听', D: '摸和看' },
    correct: 'C', hint: '黄鹂=看，鸣=听',
  },
  {
    id: '2-1-5', lessonId: 2, difficulty: 1,
    text: '写作就像做饭，"感觉"相当于什么？',
    options: { A: '锅和铲子', B: '厨师', C: '原材料', D: '食谱' },
    correct: 'C', hint: '感觉=做饭的食材',
  },

  // ── 难度2（中等）──
  {
    id: '2-2-1', lessonId: 2, difficulty: 2,
    text: '王维《山居秋暝》中"明月松间照，清泉石上流"，诗人运用了哪种感觉？',
    options: { A: '只有看', B: '只有听', C: '看和听', D: '闻和摸' },
    correct: 'C', hint: '明月松间照=看，清泉石上流=听',
  },
  {
    id: '2-2-2', lessonId: 2, difficulty: 2,
    text: '如果一个人从来没有见过大海，他能写出关于大海的精彩作文吗？',
    options: { A: '能，可以想象', B: '能，可以听别人说', C: '不能，因为没有亲身感觉', D: '能，可以查资料' },
    correct: 'C', hint: '',
  },
  {
    id: '2-2-3', lessonId: 2, difficulty: 2,
    text: '下列哪个选项最能说明"感觉是作文的源泉"？',
    options: { A: '好词好句很重要', B: '多读书才能写好作文', C: '亲身感受过才能写得真实', D: '作文需要很多修辞手法' },
    correct: 'C', hint: '',
  },
  {
    id: '2-2-4', lessonId: 2, difficulty: 2,
    text: '写"雨"的作文，下列哪种感觉最能帮助写出意境？',
    options: { A: '回忆昨天看过的雨', B: '听别人说下雨的感觉', C: '亲身站在雨中感受', D: '想象下雨的场景' },
    correct: 'C', hint: '',
  },
  {
    id: '2-2-5', lessonId: 2, difficulty: 2,
    text: '白居易《钱塘湖春行》中"乱花渐欲迷人眼，浅草才能没马蹄"，诗人通过什么获得写作素材？',
    options: { A: '听别人描述', B: '想象出来的', C: '亲身观察感觉', D: '书本上读到的' },
    correct: 'C', hint: '',
  },

  // ── 难度3（挑战）──
  {
    id: '2-3-1', lessonId: 2, difficulty: 3,
    text: '下列诗句中，哪一句最能体现"感觉是写作源泉"这一观点？',
    options: { A: '读书破万卷，下笔如有神', B: '纸上得来终觉浅，绝知此事要躬行', C: '熟读唐诗三百首，不会作诗也会吟', D: '书山有路勤为径' },
    correct: 'B', hint: '',
  },
  {
    id: '2-3-2', lessonId: 2, difficulty: 3,
    text: '如果让你写一篇《第一次吃榴莲》的作文，最应该依靠什么？',
    options: { A: '查榴莲的资料', B: '看别人吃榴莲的视频', C: '自己亲自闻、尝、摸榴莲', D: '想象榴莲的味道' },
    correct: 'C', hint: '',
  },
  {
    id: '2-3-3', lessonId: 2, difficulty: 3,
    text: '苏轼"欲把西湖比西子，淡妆浓抹总相宜"中，诗人没有直接运用感觉，但前提是什么？',
    options: { A: '他读过很多书', B: '他亲眼看过西湖', C: '他听过别人描述西湖', D: '他想象过西湖的样子' },
    correct: 'B', hint: '比喻的前提是有真实感觉',
  },
  {
    id: '2-3-4', lessonId: 2, difficulty: 3,
    text: '以下哪种情况最可能导致作文"空洞无物"？',
    options: { A: '用了太多成语', B: '句子写得太短', C: '只凭想象，没有真实感觉', D: '没有用修辞手法' },
    correct: 'C', hint: '',
  },
  {
    id: '2-3-5', lessonId: 2, difficulty: 3,
    text: '下列选项中，哪一项是"感觉"与"想象"在写作中的正确关系？',
    options: { A: '感觉可以替代想象', B: '想象可以替代感觉', C: '感觉是想象的基础', D: '感觉和想象无关' },
    correct: 'C', hint: '',
  },

  // ═══════════════════════════════════════════════════
  // 知识点3：用什么感觉
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '3-1-1', lessonId: 3, difficulty: 1,
    text: '听到窗外传来"轰隆隆"的打雷声，我们主要用到了哪个感觉器官？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '手' },
    correct: 'B', hint: '听到打雷声',
  },
  {
    id: '3-1-2', lessonId: 3, difficulty: 1,
    text: '王维的诗句"空山不见人，但闻人语响"中，"闻"指的是用了哪个感觉器官？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '嘴巴' },
    correct: 'B', hint: '"闻人语响"的"闻"=听',
  },
  {
    id: '3-1-3', lessonId: 3, difficulty: 1,
    text: '用来感觉"甜"、"苦"、"酸"这些味道的主要器官是？',
    options: { A: '鼻子', B: '眼睛', C: '舌头', D: '皮肤' },
    correct: 'C', hint: '甜苦酸是味觉',
  },
  {
    id: '3-1-4', lessonId: 3, difficulty: 1,
    text: '春天来了，我们看到公园里的花开了，红的、黄的、紫的，美丽极了。这句话主要运用了哪种感觉？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'A', hint: '看到花的颜色',
  },
  {
    id: '3-1-5', lessonId: 3, difficulty: 1,
    text: '下列哪一项，是"鼻子侦探"的工作？',
    options: { A: '看到了天上的白云', B: '听到了优美的音乐', C: '闻到了面包的香味', D: '尝到了冰淇淋的甜' },
    correct: 'C', hint: '鼻子侦探的工作',
  },

  // ── 难度2（中等）──
  {
    id: '3-2-1', lessonId: 3, difficulty: 2,
    text: '杜牧《山行》中"停车坐爱枫林晚，霜叶红于二月花"，诗人用哪种感觉器官？',
    options: { A: '耳朵', B: '眼睛', C: '鼻子', D: '手' },
    correct: 'B', hint: '"霜叶红于二月花"=看',
  },
  {
    id: '3-2-2', lessonId: 3, difficulty: 2,
    text: '"妈妈做的红烧肉闻起来真香！"这句话主要用了哪个感觉器官？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '舌头' },
    correct: 'C', hint: '闻起来香',
  },
  {
    id: '3-2-3', lessonId: 3, difficulty: 2,
    text: '下列哪个感觉器官能同时感知"冷"和"热"？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '皮肤' },
    correct: 'D', hint: '冷热=触觉',
  },
  {
    id: '3-2-4', lessonId: 3, difficulty: 2,
    text: '李白《静夜思》中"床前明月光"，诗人用哪个感觉器官？',
    options: { A: '耳朵', B: '鼻子', C: '眼睛', D: '手' },
    correct: 'C', hint: '"床前明月光"=看',
  },
  {
    id: '3-2-5', lessonId: 3, difficulty: 2,
    text: '想了解一块石头的"粗糙"程度，应该用哪个感觉器官？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '手' },
    correct: 'D', hint: '粗糙=触觉',
  },

  // ── 难度3（挑战）──
  {
    id: '3-3-1', lessonId: 3, difficulty: 3,
    text: '下列哪句诗主要运用了"听觉"感觉器官？',
    options: { A: '日照香炉生紫烟', B: '两岸猿声啼不住', C: '窗含西岭千秋雪', D: '一行白鹭上青天' },
    correct: 'B', hint: '听觉',
  },
  {
    id: '3-3-2', lessonId: 3, difficulty: 3,
    text: '柳宗元《江雪》中"千山鸟飞绝，万径人踪灭"，诗人主要用哪种感觉器官？',
    options: { A: '听觉', B: '嗅觉', C: '视觉', D: '触觉' },
    correct: 'C', hint: '看到"千山鸟飞绝"',
  },
  {
    id: '3-3-3', lessonId: 3, difficulty: 3,
    text: '如果你想描写"春风"，可以用哪些感觉器官？',
    options: { A: '只有皮肤（触觉）', B: '皮肤和耳朵（听风声）', C: '眼睛、皮肤、耳朵', D: '只有眼睛' },
    correct: 'C', hint: '春风可看（柳动）、可感（温暖）、可听（风声）',
  },
  {
    id: '3-3-4', lessonId: 3, difficulty: 3,
    text: '下列选项中，哪一项不是通过"皮肤"感觉到的？',
    options: { A: '凉', B: '热', C: '光滑', D: '甜' },
    correct: 'D', hint: '甜=味觉，非皮肤感觉',
  },
  {
    id: '3-3-5', lessonId: 3, difficulty: 3,
    text: '一个人同时用眼睛看、耳朵听、鼻子闻、手摸来感受一朵花，这体现了什么？',
    options: { A: '感觉器官各有分工', B: '多种感觉可以同时使用', C: '有些感觉没必要', D: '感觉越多越混乱' },
    correct: 'B', hint: '',
  },

  // ═══════════════════════════════════════════════════
  // 知识点4：怎么感觉及结果
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '4-1-1', lessonId: 4, difficulty: 1,
    text: '小红用手摸了摸刚从冰箱里拿出来的冰棍，感觉冰冰凉。这里，"冰冰凉"属于什么？',
    options: { A: '感觉器官', B: '感觉动作', C: '感觉结果', D: '感觉想象' },
    correct: 'C', hint: '"冰冰凉"是结果',
  },
  {
    id: '4-1-2', lessonId: 4, difficulty: 1,
    text: '在"我用耳朵听，听到了小鸟的歌声"这句话中，"听"属于哪个部分？',
    options: { A: '感觉器官', B: '感觉动作', C: '感觉结果', D: '感觉过程' },
    correct: 'B', hint: '"听"是动作',
  },
  {
    id: '4-1-3', lessonId: 4, difficulty: 1,
    text: '下列选项中，完整地包含"感觉器官+感觉动作+感觉结果"的是？',
    options: { A: '我看到了', B: '饭菜很香', C: '我用鼻子闻', D: '我用鼻子闻到了饭菜的香味' },
    correct: 'D', hint: '完整三要素',
  },
  {
    id: '4-1-4', lessonId: 4, difficulty: 1,
    text: '"我用眼睛看，看到了蓝天白云。"这句话中，"蓝天白云"是？',
    options: { A: '感觉器官', B: '感觉动作', C: '感觉结果', D: '感觉工具' },
    correct: 'C', hint: '"蓝天白云"是结果',
  },
  {
    id: '4-1-5', lessonId: 4, difficulty: 1,
    text: '分析诗句"日出江花红胜火"，这里的感觉结果是什么？',
    options: { A: '日出', B: '江花', C: '红', D: '胜火' },
    correct: 'C', hint: '颜色是感觉结果',
  },

  // ── 难度2（中等）──
  {
    id: '4-2-1', lessonId: 4, difficulty: 2,
    text: '在"我用舌头尝，尝到了柠檬的酸味"中，"酸味"属于什么？',
    options: { A: '感觉器官', B: '感觉动作', C: '感觉结果', D: '感觉猜测' },
    correct: 'C', hint: '"酸味"是结果',
  },
  {
    id: '4-2-2', lessonId: 4, difficulty: 2,
    text: '下列哪个选项只包含了"感觉动作"？',
    options: { A: '眼睛', B: '看', C: '红色', D: '我看到红色' },
    correct: 'B', hint: '只有动作',
  },
  {
    id: '4-2-3', lessonId: 4, difficulty: 2,
    text: '如果我们想描述一个苹果的"甜"，应该先有什么？',
    options: { A: '用眼睛看', B: '用嘴巴尝', C: '用鼻子闻', D: '用手摸' },
    correct: 'B', hint: '甜=味觉',
  },
  {
    id: '4-2-4', lessonId: 4, difficulty: 2,
    text: '"感觉点"指的是什么？',
    options: { A: '感觉器官', B: '感觉动作', C: '感觉结果', D: '感觉过程' },
    correct: 'C', hint: '感觉点=感觉结果',
  },
  {
    id: '4-2-5', lessonId: 4, difficulty: 2,
    text: '白居易《忆江南》中"春来江水绿如蓝"，请分析感觉过程：感觉器官是？感觉动作是？感觉结果是？',
    options: { A: '眼睛/看/绿', B: '鼻子/闻/绿', C: '耳朵/听/蓝', D: '手/摸/蓝' },
    correct: 'A', hint: '',
  },

  // ── 难度3（挑战）──
  {
    id: '4-3-1', lessonId: 4, difficulty: 3,
    text: '下列哪一项正确描述了"感觉过程"的三个要素？',
    options: { A: '器官+结果=动作', B: '动作+结果=器官', C: '器官+动作=结果', D: '结果+器官=动作' },
    correct: 'C', hint: '',
  },
  {
    id: '4-3-2', lessonId: 4, difficulty: 3,
    text: '诗句"踏花归去马蹄香"中，诗人用了哪两种感觉？写出感觉结果分别是什么？',
    options: { A: '看/花，闻/香', B: '听/马蹄，闻/香', C: '看/马蹄，闻/花', D: '摸/马蹄，看/花' },
    correct: 'A', hint: '"踏花归去马蹄香"',
  },
  {
    id: '4-3-3', lessonId: 4, difficulty: 3,
    text: '"感觉点"和"感觉器官"的关系是？',
    options: { A: '感觉器官产生感觉点', B: '感觉点产生感觉器官', C: '两者没有关系', D: '感觉点就是感觉器官' },
    correct: 'A', hint: '',
  },
  {
    id: '4-3-4', lessonId: 4, difficulty: 3,
    text: '为什么说"感觉点"是写作的"基本单位"？',
    options: { A: '因为每个感觉点都很小', B: '因为所有作文内容都由感觉点组成', C: '因为感觉点很容易写', D: '因为感觉点很常见' },
    correct: 'B', hint: '',
  },
  {
    id: '4-3-5', lessonId: 4, difficulty: 3,
    text: '如果要写一篇《我的宠物狗》，我们可以从哪些"感觉点"入手？请选择最完整的一项。',
    options: { A: '颜色（黄色）、形状（胖）、动作（跑）', B: '声音（汪汪）、气味（狗味）、摸起来（毛茸茸）', C: '以上所有', D: '以上都不是' },
    correct: 'C', hint: '颜色+形状+动作+声音+气味+触感',
  },

  // ═══════════════════════════════════════════════════
  // 知识点5：精讲"看"
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '5-1-1', lessonId: 5, difficulty: 1,
    text: '"那只大白鹅伸着长长的脖子，对着天空唱歌。"这句话中，"长长的脖子"属于"看"到的哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'B', hint: '"长长的脖子"=形状',
  },
  {
    id: '5-1-2', lessonId: 5, difficulty: 1,
    text: '"操场上的国旗是鲜红的。"这句话描述的是"看"到的哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'A', hint: '"鲜红的"',
  },
  {
    id: '5-1-3', lessonId: 5, difficulty: 1,
    text: '"一辆汽车从马路上飞驰而过。"这句话中，"飞驰而过"属于哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'D', hint: '"飞驰而过"',
  },
  {
    id: '5-1-4', lessonId: 5, difficulty: 1,
    text: '描写"我的书包"时，写到"书包正面有一个米老鼠的图案，两侧各有一个网兜，背面是两条宽宽的背带。"这是在描写书包的什么？',
    options: { A: '颜色', B: '形状', C: '组成', D: '作用' },
    correct: 'C', hint: '正面/两侧/背面=组成部分',
  },
  {
    id: '5-1-5', lessonId: 5, difficulty: 1,
    text: '李白的诗句"飞流直下三千尺，疑是银河落九天"中，"飞流直下"描写的是什么感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'D', hint: '"飞流直下"',
  },

  // ── 难度2（中等）──
  {
    id: '5-2-1', lessonId: 5, difficulty: 2,
    text: '杜甫《绝句》中"窗含西岭千秋雪"，描写的是"看"到的哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '作用' },
    correct: 'A', hint: '"千秋雪"→白色',
  },
  {
    id: '5-2-2', lessonId: 5, difficulty: 2,
    text: '"看到粉笔，我就知道它是用来写字的。"这是"看"到的哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '作用' },
    correct: 'D', hint: '粉笔用来写字=作用',
  },
  {
    id: '5-2-3', lessonId: 5, difficulty: 2,
    text: '描写"一棵大树"时，写"它由树干、树枝和树叶组成"，这是什么感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'C', hint: '树干+树枝+树叶=组成',
  },
  {
    id: '5-2-4', lessonId: 5, difficulty: 2,
    text: '"月亮像一个大圆盘挂在天空。"描写的是哪个感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'B', hint: '"大圆盘"=形状',
  },
  {
    id: '5-2-5', lessonId: 5, difficulty: 2,
    text: '下列选项中，哪一项不是"看"能直接感觉到的？',
    options: { A: '苹果的红色', B: '河流的弯曲', C: '苹果是甜的', D: '小鸟在飞' },
    correct: 'C', hint: '甜是味觉，不是"看"',
  },

  // ── 难度3（挑战）──
  {
    id: '5-3-1', lessonId: 5, difficulty: 3,
    text: '刘禹锡"遥望洞庭山水翠，白银盘里一青螺"中，哪些是"看"到的感觉点？',
    options: { A: '颜色、形状', B: '组成、动作', C: '作用、颜色', D: '动作、形状' },
    correct: 'A', hint: '"翠"=颜色，"青螺"=形状',
  },
  {
    id: '5-3-2', lessonId: 5, difficulty: 3,
    text: '杜甫《绝句》中哪句诗描写了"看"到的动作或组成？',
    options: { A: '两个黄鹂鸣翠柳', B: '一行白鹭上青天', C: '窗含西岭千秋雪', D: '门泊东吴万里船' },
    correct: 'D', hint: '"泊"=停靠，是看到的组成/场景',
  },
  {
    id: '5-3-3', lessonId: 5, difficulty: 3,
    text: '如果要从"看"的角度最全面地描写一座山，应该包含哪些感觉点？',
    options: { A: '只要颜色', B: '颜色、形状、组成', C: '颜色、动作', D: '形状、作用' },
    correct: 'B', hint: '最全面的描述山',
  },
  {
    id: '5-3-4', lessonId: 5, difficulty: 3,
    text: '"横看成岭侧成峰，远近高低各不同"中，诗人在描写庐山的什么"看"的感觉点？',
    options: { A: '颜色', B: '组成', C: '动作', D: '形状' },
    correct: 'D', hint: '"岭""峰"=形状变化',
  },
  {
    id: '5-3-5', lessonId: 5, difficulty: 3,
    text: '下列诗句中，哪一句不是在描写"看"到的感觉点？',
    options: { A: '日照香炉生紫烟', B: '春江水暖鸭先知', C: '两个黄鹂鸣翠柳', D: '一行白鹭上青天' },
    correct: 'B', hint: '"暖"是触觉，非视觉',
  },

  // ═══════════════════════════════════════════════════
  // 知识点6：精讲"听"
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '6-1-1', lessonId: 6, difficulty: 1,
    text: '下列哪一项属于"声息"（微弱的声音）？',
    options: { A: '雷声轰鸣', B: '大声呼喊', C: '钟表滴答滴答', D: '鞭炮炸响' },
    correct: 'C', hint: '微弱=声息',
  },
  {
    id: '6-1-2', lessonId: 6, difficulty: 1,
    text: '在人山人海的演唱会上，歌迷的呼喊声可以用哪个词来形容？',
    options: { A: '悄无声息', B: '震耳欲聋', C: '窃窃私语', D: '鸦雀无声' },
    correct: 'B', hint: '大声=声音',
  },
  {
    id: '6-1-3', lessonId: 6, difficulty: 1,
    text: '王维《鸟鸣涧》中"月出惊山鸟"的前句是"人闲桂花落"，桂花落地的声音属于？',
    options: { A: '声音', B: '声息', C: '噪音', D: '没有声音' },
    correct: 'B', hint: '桂花落地=微弱',
  },
  {
    id: '6-1-4', lessonId: 6, difficulty: 1,
    text: '下列哪种声音最适合描写"宁静的夜晚还充满生机"？',
    options: { A: '汽车喇叭声', B: '工地敲击声', C: '鸟儿细碎的鸣叫', D: '锣鼓喧天' },
    correct: 'C', hint: '宁静+生机=声息',
  },
  {
    id: '6-1-5', lessonId: 6, difficulty: 1,
    text: '下列选项中，哪一项属于"声音"（响亮的声音），而不是"声息"？',
    options: { A: '锣鼓喧天', B: '蚊子嗡嗡叫', C: '翻书的沙沙声', D: '钟摆滴答声' },
    correct: 'A', hint: '这是"声音"，其他三项是"声息"',
  },

  // ── 难度2（中等）──
  {
    id: '6-2-1', lessonId: 6, difficulty: 2,
    text: '下列诗句中，哪一句描写的是"声息"？',
    options: { A: '大弦嘈嘈如急雨', B: '处处闻啼鸟', C: '月出惊山鸟，时鸣春涧中', D: '两岸猿声啼不住' },
    correct: 'C', hint: '偶尔鸟鸣=声息',
  },
  {
    id: '6-2-2', lessonId: 6, difficulty: 2,
    text: '孟浩然《春晓》中"处处闻啼鸟"中的鸟叫声，属于"声音"还是"声息"？',
    options: { A: '声音', B: '声息', C: '噪音', D: '静音' },
    correct: 'A', hint: '啼鸟=清晰的叫声',
  },
  {
    id: '6-2-3', lessonId: 6, difficulty: 2,
    text: '"夜来风雨声"中的风雨声，属于"声音"还是"声息"？',
    options: { A: '声息', B: '声音', C: '噪音', D: '静音' },
    correct: 'B', hint: '雨势大=响亮',
  },
  {
    id: '6-2-4', lessonId: 6, difficulty: 2,
    text: '下列哪种场景最容易听到"声息"？',
    options: { A: '热闹的菜市场', B: '安静的图书馆', C: '喧闹的操场', D: '吵闹的工地' },
    correct: 'B', hint: '微弱声音=声息',
  },
  {
    id: '6-2-5', lessonId: 6, difficulty: 2,
    text: '"柴门闻犬吠"中的犬吠声属于？',
    options: { A: '声音', B: '声息', C: '噪音', D: '静音' },
    correct: 'A', hint: '犬吠=响亮的叫声',
  },

  // ── 难度3（挑战）──
  {
    id: '6-3-1', lessonId: 6, difficulty: 3,
    text: '白居易《琵琶行》中"大弦嘈嘈如急雨，小弦切切如私语"同时描写了？',
    options: { A: '声音和声息', B: '两种声音', C: '两种声息', D: '声音和噪音' },
    correct: 'A', hint: '嘈嘈=声音，切切=声息',
  },
  {
    id: '6-3-2', lessonId: 6, difficulty: 3,
    text: '下列哪首诗同时包含了"声音"和"声息"？',
    options: { A: '夜来风雨声，花落知多少', B: '两个黄鹂鸣翠柳', C: '日照香炉生紫烟', D: '窗含西岭千秋雪' },
    correct: 'A', hint: '风雨=声音，花落=声息',
  },
  {
    id: '6-3-3', lessonId: 6, difficulty: 3,
    text: '如果要描写"深夜的乡村"，最恰当的"听"的描写是？',
    options: { A: '汽车飞驰而过的轰鸣', B: '远处传来的犬吠声', C: '工厂机器的轰鸣声', D: '市场的叫卖声' },
    correct: 'B', hint: '深夜乡村的典型声音',
  },
  {
    id: '6-3-4', lessonId: 6, difficulty: 3,
    text: '下列哪个属于"声息"？',
    options: { A: '雷声滚滚', B: '鞭炮齐鸣', C: '窃窃私语', D: '锣鼓喧天' },
    correct: 'C', hint: '微弱=声息',
  },
  {
    id: '6-3-5', lessonId: 6, difficulty: 3,
    text: '描写"空山"的宁静，下列哪种"听"的描写最能营造意境？',
    options: { A: '锣鼓喧天的庙会', B: '震耳欲聋的音乐', C: '微风拂过树叶的沙沙声', D: '汽车鸣笛的声音' },
    correct: 'C', hint: '"空山"的氛围',
  },

  // ═══════════════════════════════════════════════════
  // 知识点7：精讲"闻"
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '7-1-1', lessonId: 7, difficulty: 1,
    text: '下列哪一项属于"气息"（清淡的味道）？',
    options: { A: '垃圾堆的恶臭', B: '汽油味', C: '若有若无的茉莉花香', D: '刺鼻的油漆味' },
    correct: 'C', hint: '清淡=气息',
  },
  {
    id: '7-1-2', lessonId: 7, difficulty: 1,
    text: '王安石《梅花》中"遥知不是雪，为有暗香来"的"暗香"属于？',
    options: { A: '气味', B: '气息', C: '臭味', D: '浓香' },
    correct: 'B', hint: '"暗香"=淡淡的',
  },
  {
    id: '7-1-3', lessonId: 7, difficulty: 1,
    text: '刚出炉的面包散发出浓浓的香味，这属于？',
    options: { A: '气味', B: '气息', C: '声音', D: '触觉' },
    correct: 'A', hint: '刚烤好=浓烈',
  },
  {
    id: '7-1-4', lessonId: 7, difficulty: 1,
    text: '春天的公园里，微风中飘来淡淡的花香，这属于？',
    options: { A: '气味', B: '声音', C: '触觉', D: '清香' },
    correct: 'D', hint: '清淡=气息',
  },
  {
    id: '7-1-5', lessonId: 7, difficulty: 1,
    text: '下列哪一项属于"气味"（浓烈的味道），而不是"气息"？',
    options: { A: '若有若无的清香', B: '垃圾堆的恶臭', C: '远处飘来的桂花香', D: '淡淡的泥土味' },
    correct: 'B', hint: '浓烈=气味',
  },

  // ── 难度2（中等）──
  {
    id: '7-2-1', lessonId: 7, difficulty: 2,
    text: '林逋"疏影横斜水清浅，暗香浮动月黄昏"中的"暗香"属于？',
    options: { A: '气味', B: '气息', C: '声音', D: '颜色' },
    correct: 'B', hint: '"暗香浮动"=淡',
  },
  {
    id: '7-2-2', lessonId: 7, difficulty: 2,
    text: '走进一家火锅店，扑面而来的麻辣味属于？',
    options: { A: '气味', B: '气息', C: '味觉', D: '触觉' },
    correct: 'A', hint: '麻辣味扑面=浓烈',
  },
  {
    id: '7-2-3', lessonId: 7, difficulty: 2,
    text: '下列哪种场景最能感受到"气息"？',
    options: { A: '垃圾处理场', B: '化学实验室', C: '清晨的森林', D: '烧烤摊旁边' },
    correct: 'C', hint: '淡淡的=气息',
  },
  {
    id: '7-2-4', lessonId: 7, difficulty: 2,
    text: '"遥知不是雪，为有暗香来"中，诗人是怎么判断不是雪而是梅花的？',
    options: { A: '看到了花瓣', B: '闻到了气息', C: '听到了花落的声音', D: '摸到了花瓣' },
    correct: 'B', hint: '"暗香来"判断不是雪',
  },
  {
    id: '7-2-5', lessonId: 7, difficulty: 2,
    text: '如果要描写"春天的田野"的味道，最恰当的是？',
    options: { A: '浓烈的汽油味', B: '刺鼻的化学味', C: '泥土和青草的气息', D: '腐烂的垃圾味' },
    correct: 'C', hint: '春天田野=清新气息',
  },

  // ── 难度3（挑战）──
  {
    id: '7-3-1', lessonId: 7, difficulty: 3,
    text: '下列诗句中，哪一句描写了"气息"？',
    options: { A: '日照香炉生紫烟', B: '飞流直下三千尺', C: '遥知不是雪，为有暗香来', D: '两岸猿声啼不住' },
    correct: 'C', hint: '"暗香"=气息',
  },
  {
    id: '7-3-2', lessonId: 7, difficulty: 3,
    text: '描写雨后的花园，下列哪种"闻"的描写最恰当？',
    options: { A: '散发着刺鼻的气味', B: '弥漫着浓烈的臭味', C: '飘着淡淡的清新味道', D: '充斥着呛人的烟味' },
    correct: 'C', hint: '气息=淡',
  },
  {
    id: '7-3-3', lessonId: 7, difficulty: 3,
    text: '为什么《梅花》中用"暗香"而不用"浓香"来描写梅花？',
    options: { A: '因为梅花没有香味', B: '因为梅花是淡雅的', C: '因为诗人闻不到', D: '因为浓香不好听' },
    correct: 'B', hint: '梅花清香=气息',
  },
  {
    id: '7-3-4', lessonId: 7, difficulty: 3,
    text: '下列哪个词语最能代表"气息"？',
    options: { A: '恶臭扑鼻', B: '浓烟滚滚', C: '暗香浮动', D: '臭气熏天' },
    correct: 'C', hint: '"暗"=淡=气息',
  },
  {
    id: '7-3-5', lessonId: 7, difficulty: 3,
    text: '描写"厨房里妈妈在炒菜"，最恰当的"闻"的描写应该是气味还是气息？',
    options: { A: '气息，因为炒菜味道很淡', B: '气味，因为炒菜味道浓烈', C: '都不是', D: '两者都是' },
    correct: 'B', hint: '',
  },

  // ═══════════════════════════════════════════════════
  // 知识点8：精讲"尝"
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '8-1-1', lessonId: 8, difficulty: 1,
    text: '中药的味道通常是？',
    options: { A: '甜', B: '辣', C: '苦', D: '麻' },
    correct: 'C', hint: '中药=苦',
  },
  {
    id: '8-1-2', lessonId: 8, difficulty: 1,
    text: '吃花椒时嘴巴会有什么感觉？',
    options: { A: '甜', B: '酸', C: '苦', D: '麻' },
    correct: 'D', hint: '花椒=麻',
  },
  {
    id: '8-1-3', lessonId: 8, difficulty: 1,
    text: '做菜时忘了放盐，吃起来会是什么感觉？',
    options: { A: '太甜了', B: '太辣了', C: '淡而无味，缺少咸味', D: '太苦了' },
    correct: 'C', hint: '',
  },
  {
    id: '8-1-4', lessonId: 8, difficulty: 1,
    text: '夏天吃西瓜，最主要的味道是？',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'B', hint: '西瓜=甜',
  },
  {
    id: '8-1-5', lessonId: 8, difficulty: 1,
    text: '吃没熟的青柿子，嘴里会有什么感觉？',
    options: { A: '甜', B: '辣', C: '麻', D: '涩' },
    correct: 'D', hint: '青柿子=涩',
  },

  // ── 难度2（中等）──
  {
    id: '8-2-1', lessonId: 8, difficulty: 2,
    text: '下列水果中，哪个最能代表"酸"这个味道？',
    options: { A: '西瓜', B: '柠檬', C: '香蕉', D: '苹果' },
    correct: 'B', hint: '柠檬=酸',
  },
  {
    id: '8-2-2', lessonId: 8, difficulty: 2,
    text: '话梅的味道除了"酸"，还有什么味道？',
    options: { A: '辣', B: '苦', C: '咸', D: '麻' },
    correct: 'C', hint: '话梅=酸+咸',
  },
  {
    id: '8-2-3', lessonId: 8, difficulty: 2,
    text: '下列哪些属于"尝"的感觉结果？',
    options: { A: '光滑/粗糙', B: '红色/绿色', C: '酸/甜/苦', D: '声音/声息' },
    correct: 'C', hint: '味觉',
  },
  {
    id: '8-2-4', lessonId: 8, difficulty: 2,
    text: '吃四川火锅时，除了辣，还会有什么特别的味觉感受？',
    options: { A: '酸', B: '涩', C: '麻', D: '苦' },
    correct: 'C', hint: '四川火锅=麻辣',
  },
  {
    id: '8-2-5', lessonId: 8, difficulty: 2,
    text: '用一个词来形容蜂蜜的味道，最恰当的是？',
    options: { A: '酸溜溜', B: '甜蜜蜜', C: '苦涩涩', D: '辣乎乎' },
    correct: 'B', hint: '',
  },

  // ── 难度3（挑战）──
  {
    id: '8-3-1', lessonId: 8, difficulty: 3,
    text: '下列诗句中，哪一句直接描写了味觉？',
    options: { A: '日照香炉生紫烟', B: '夜来风雨声', C: '遥知不是雪', D: '入口甘香冰玉寒' },
    correct: 'D', hint: '直接描写味觉',
  },
  {
    id: '8-3-2', lessonId: 8, difficulty: 3,
    text: '描写"童年的夏天"，用哪种味觉最能唤起回忆？',
    options: { A: '苦味/中药', B: '辣味/火锅', C: '甜味/冰棍西瓜', D: '酸味/醋' },
    correct: 'C', hint: '童年夏天=甜',
  },
  {
    id: '8-3-3', lessonId: 8, difficulty: 3,
    text: '下列哪种食物最能同时写出多种味道（酸甜苦辣咸麻涩中的3种以上）？',
    options: { A: '白米饭', B: '白开水', C: '四川麻辣烫', D: '馒头' },
    correct: 'C', hint: '包含多种味道',
  },
  {
    id: '8-3-4', lessonId: 8, difficulty: 3,
    text: '苏轼"日啖荔枝三百颗"中的荔枝主要是什么味道？',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'B', hint: '荔枝=甜',
  },
  {
    id: '8-3-5', lessonId: 8, difficulty: 3,
    text: '为什么吃未熟的柿子会"涩"？',
    options: { A: '因为太甜了', B: '因为太酸了', C: '因为太苦了', D: '以上都是（鞣酸导致涩味、不舒服、未熟）' },
    correct: 'D', hint: '鞣酸导致涩味+不舒服+未熟',
  },

  // ═══════════════════════════════════════════════════
  // 知识点9：精讲"摸"
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '9-1-1', lessonId: 9, difficulty: 1,
    text: '丝绸摸起来是什么感觉？',
    options: { A: '光滑', B: '粗糙', C: '尖', D: '硬' },
    correct: 'A', hint: '丝绸=光滑',
  },
  {
    id: '9-1-2', lessonId: 9, difficulty: 1,
    text: '冬天摸铁栏杆会有什么感觉？',
    options: { A: '热', B: '软', C: '干', D: '冷' },
    correct: 'D', hint: '冬天铁栏杆=冷',
  },
  {
    id: '9-1-3', lessonId: 9, difficulty: 1,
    text: '刚洗完的毛巾摸起来是？',
    options: { A: '干', B: '热', C: '湿', D: '尖' },
    correct: 'C', hint: '刚洗完=湿',
  },
  {
    id: '9-1-4', lessonId: 9, difficulty: 1,
    text: '不小心碰到仙人掌的刺，感觉是？',
    options: { A: '光滑', B: '尖', C: '软', D: '湿' },
    correct: 'B', hint: '仙人掌刺=尖',
  },
  {
    id: '9-1-5', lessonId: 9, difficulty: 1,
    text: '下列哪一组是通过"摸"能感觉到的？',
    options: { A: '酸/甜', B: '光滑/粗糙', C: '红色/绿色', D: '声音/声息' },
    correct: 'B', hint: '触觉',
  },

  // ── 难度2（中等）──
  {
    id: '9-2-1', lessonId: 9, difficulty: 2,
    text: '河边的鹅卵石摸起来是？',
    options: { A: '粗糙', B: '光滑', C: '尖', D: '软' },
    correct: 'B', hint: '鹅卵石=光滑',
  },
  {
    id: '9-2-2', lessonId: 9, difficulty: 2,
    text: '夏天在太阳底下晒了一天的石板，摸起来是？',
    options: { A: '冷', B: '热', C: '湿', D: '软' },
    correct: 'B', hint: '太阳晒一天=热',
  },
  {
    id: '9-2-3', lessonId: 9, difficulty: 2,
    text: '海绵摸起来最明显的感觉是？',
    options: { A: '硬', B: '软', C: '尖', D: '冷' },
    correct: 'B', hint: '海绵=软',
  },
  {
    id: '9-2-4', lessonId: 9, difficulty: 2,
    text: '下列哪一项不是"摸"的感觉结果？',
    options: { A: '光滑', B: '冷', C: '甜', D: '硬' },
    correct: 'C', hint: '甜是味觉，不是触觉',
  },
  {
    id: '9-2-5', lessonId: 9, difficulty: 2,
    text: '铅笔一头尖一头平，这属于摸的哪组感觉？',
    options: { A: '光滑/粗糙', B: '软/硬', C: '尖/平', D: '干/湿' },
    correct: 'C', hint: '笔尖vs橡皮头',
  },

  // ── 难度3（挑战）──
  {
    id: '9-3-1', lessonId: 9, difficulty: 3,
    text: '描写"海边的沙滩"，用"摸"的感觉最全面的是？',
    options: { A: '光滑/冷', B: '硬/干', C: '软/干/热', D: '湿/尖' },
    correct: 'C', hint: '沙滩=软+干+热',
  },
  {
    id: '9-3-2', lessonId: 9, difficulty: 3,
    text: '下列哪句诗涉及"摸"的感觉？',
    options: { A: '日出江花红胜火', B: '锄禾日当午，汗滴禾下土', C: '两个黄鹂鸣翠柳', D: '遥知不是雪' },
    correct: 'B', hint: '"汗"=热的触觉',
  },
  {
    id: '9-3-3', lessonId: 9, difficulty: 3,
    text: '"摸"的感觉中，"冷/热"这一组感觉最常出现在什么场景？',
    options: { A: '看书的时候', B: '冬天冷，夏天热', C: '吃饭的时候', D: '听音乐的时候' },
    correct: 'B', hint: '',
  },
  {
    id: '9-3-4', lessonId: 9, difficulty: 3,
    text: '下列哪个物品同时具有"光滑+硬+冷"三种触觉？',
    options: { A: '棉花糖', B: '玻璃杯', C: '毛毯', D: '面包' },
    correct: 'B', hint: '光滑+硬+冷',
  },
  {
    id: '9-3-5', lessonId: 9, difficulty: 3,
    text: '描写"刚出笼的包子"，用"摸"的感觉应该是？',
    options: { A: '冷/硬', B: '热/软', C: '干/尖', D: '光滑/冷' },
    correct: 'B', hint: '刚出笼包子=热+软',
  },

  // ═══════════════════════════════════════════════════
  // 知识点10：15个基本感觉点总结
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '10-1-1', lessonId: 10, difficulty: 1,
    text: '"颜色"是哪种感觉的结果？',
    options: { A: '听', B: '看', C: '闻', D: '摸' },
    correct: 'B', hint: '眼看的结果',
  },
  {
    id: '10-1-2', lessonId: 10, difficulty: 1,
    text: '"光滑/粗糙"是哪种感觉的结果？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'D', hint: '光滑粗糙=触觉',
  },
  {
    id: '10-1-3', lessonId: 10, difficulty: 1,
    text: '"声息"是哪种感觉的结果？',
    options: { A: '看', B: '闻', C: '听', D: '摸' },
    correct: 'C', hint: '耳听的结果',
  },
  {
    id: '10-1-4', lessonId: 10, difficulty: 1,
    text: '"尝"的感觉结果有几个？',
    options: { A: '2个', B: '5个', C: '7个', D: '3个' },
    correct: 'C', hint: '酸甜苦辣咸麻涩',
  },
  {
    id: '10-1-5', lessonId: 10, difficulty: 1,
    text: '描写一个苹果，可以用到哪些感觉点？',
    options: { A: '颜色（红）', B: '形状（圆）', C: '光滑', D: '甜' },
    correct: 'A', hint: '多选题，颜色+形状+触感+味觉都可以',
  },

  // ── 难度2（中等）──
  {
    id: '10-2-1', lessonId: 10, difficulty: 2,
    text: '"眼睛看"的感觉结果包含哪些？',
    options: { A: '声音/声息', B: '颜色/形状/组成/作用/动作', C: '气味/气息', D: '酸甜苦辣咸' },
    correct: 'B', hint: '眼看的结果',
  },
  {
    id: '10-2-2', lessonId: 10, difficulty: 2,
    text: '"酸甜苦辣咸麻涩"属于哪种感觉的结果？',
    options: { A: '看', B: '听', C: '闻', D: '尝' },
    correct: 'D', hint: '味道=味觉',
  },
  {
    id: '10-2-3', lessonId: 10, difficulty: 2,
    text: '"鼻子闻"的感觉结果分为哪两种？',
    options: { A: '声音/声息', B: '光滑/粗糙', C: '气味/气息', D: '酸/甜' },
    correct: 'C', hint: '鼻闻的结果',
  },
  {
    id: '10-2-4', lessonId: 10, difficulty: 2,
    text: '五种感觉中，哪种的感觉结果数量最多？',
    options: { A: '看（5个）', B: '听（2个）', C: '摸（5个）', D: '尝（7个）' },
    correct: 'D', hint: '最多',
  },
  {
    id: '10-2-5', lessonId: 10, difficulty: 2,
    text: '要全面描写"春天的花园"，应该用到哪些感觉点？',
    options: { A: '颜色+声音+气味+触感', B: '只有颜色', C: '只有气味', D: '只有声音' },
    correct: 'A', hint: '最全面',
  },

  // ── 难度3（挑战）──
  {
    id: '10-3-1', lessonId: 10, difficulty: 3,
    text: '杜甫"两个黄鹂鸣翠柳，一行白鹭上青天"中包含了哪些感觉点？',
    options: { A: '颜色（黄、翠、白、青）+声音（鸣）+动作（上）', B: '只有颜色', C: '只有声音', D: '只有动作' },
    correct: 'A', hint: '黄=颜色，鸣=声音，翠=颜色',
  },
  {
    id: '10-3-2', lessonId: 10, difficulty: 3,
    text: '如果要描写"冬天"，最全面的感觉点组合是？',
    options: { A: '白色+冷+风声', B: '只有白色', C: '只有冷', D: '只有风声' },
    correct: 'A', hint: '最全面描写冬天',
  },
  {
    id: '10-3-3', lessonId: 10, difficulty: 3,
    text: '15个基本感觉点的分布是：看几个、听几个、闻几个、尝几个、摸几个？',
    options: { A: '看5/听2/闻2/尝7/摸5', B: '看3/听3/闻3/尝3/摸3', C: '看7/听2/闻2/尝2/摸2', D: '看2/听5/闻5/尝2/摸1' },
    correct: 'A', hint: '正确数量',
  },
  {
    id: '10-3-4', lessonId: 10, difficulty: 3,
    text: '为什么说掌握了15个基本感觉点就能写好任何事物？',
    options: { A: '因为15个数量刚好', B: '因为所有事物都可以用这些点来描述', C: '因为老师这样说的', D: '因为考试会考' },
    correct: 'B', hint: '',
  },
  {
    id: '10-3-5', lessonId: 10, difficulty: 3,
    text: '下列哪一项不属于15个基本感觉点？',
    options: { A: '颜色', B: '声音', C: '气味', D: '情绪（开心难过）' },
    correct: 'D', hint: '情绪不是基本感觉点',
  },

  // ═══════════════════════════════════════════════════
  // 综合挑战题（lessonId = 11）
  // ═══════════════════════════════════════════════════

  // ── 难度1（基础）──
  {
    id: '综-1-1', lessonId: 11, difficulty: 1,
    text: '下列哪一项是直接运用"感觉"的行为？',
    options: { A: '想象石头的样子', B: '回忆石头的颜色', C: '用手摸石头', D: '猜测石头的重量' },
    correct: 'C', hint: '直接感觉',
  },
  {
    id: '综-1-2', lessonId: 11, difficulty: 1,
    text: '写好作文最重要的基础是什么？',
    options: { A: '背很多好词好句', B: '多运用感觉观察', C: '多看作文书', D: '多写多练' },
    correct: 'B', hint: '',
  },
  {
    id: '综-1-3', lessonId: 11, difficulty: 1,
    text: '闻到花香，用到的感觉器官是？',
    options: { A: '眼睛', B: '耳朵', C: '鼻子', D: '舌头' },
    correct: 'C', hint: '',
  },
  {
    id: '综-1-4', lessonId: 11, difficulty: 1,
    text: '"苹果是红色的"，这里用到了哪种感觉？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'A', hint: '"红色"=颜色=视觉',
  },
  {
    id: '综-1-5', lessonId: 11, difficulty: 1,
    text: '"西瓜圆圆的"，这里的"圆"是什么感觉点？',
    options: { A: '颜色', B: '形状', C: '组成', D: '动作' },
    correct: 'B', hint: '圆=形状=视觉',
  },
  {
    id: '综-1-6', lessonId: 11, difficulty: 1,
    text: '钟表"滴答滴答"的声音属于？',
    options: { A: '声音', B: '声息', C: '气味', D: '触觉' },
    correct: 'B', hint: '微弱=声息',
  },
  {
    id: '综-1-7', lessonId: 11, difficulty: 1,
    text: '冰淇淋的味道主要是？',
    options: { A: '酸', B: '甜', C: '苦', D: '辣' },
    correct: 'B', hint: '',
  },
  {
    id: '综-1-8', lessonId: 11, difficulty: 1,
    text: '棉花摸起来是什么感觉？',
    options: { A: '硬', B: '尖', C: '软', D: '粗糙' },
    correct: 'C', hint: '',
  },
  {
    id: '综-1-9', lessonId: 11, difficulty: 1,
    text: '"暗香来"中的"暗香"属于？',
    options: { A: '气味', B: '气息', C: '声音', D: '颜色' },
    correct: 'B', hint: '淡淡的=气息',
  },
  {
    id: '综-1-10', lessonId: 11, difficulty: 1,
    text: '感觉过程的三要素是？',
    options: { A: '器官+动作+结果', B: '看+听+闻', C: '想象+猜测+回忆', D: '读书+写字+思考' },
    correct: 'A', hint: '',
  },

  // ── 难度2（中等）──
  {
    id: '综-2-1', lessonId: 11, difficulty: 2,
    text: '下列诗句中，哪一句运用了"听觉"？',
    options: { A: '日出江花红胜火', B: '夜来风雨声', C: '春来江水绿如蓝', D: '遥知不是雪' },
    correct: 'B', hint: '听觉',
  },
  {
    id: '综-2-2', lessonId: 11, difficulty: 2,
    text: '"遥知不是雪，为有暗香来"运用了哪种感觉？',
    options: { A: '看', B: '听', C: '闻', D: '摸' },
    correct: 'C', hint: '暗香=嗅觉',
  },
  {
    id: '综-2-3', lessonId: 11, difficulty: 2,
    text: '柠檬的主要味道是？',
    options: { A: '甜', B: '苦', C: '酸', D: '辣' },
    correct: 'C', hint: '味觉',
  },
  {
    id: '综-2-4', lessonId: 11, difficulty: 2,
    text: '在沙漠里行走，皮肤最主要的感觉是？',
    options: { A: '冷', B: '热', C: '湿', D: '软' },
    correct: 'B', hint: '沙漠=热',
  },
  {
    id: '综-2-5', lessonId: 11, difficulty: 2,
    text: '下列诗句中，哪一句包含了最多种感觉？',
    options: { A: '春眠不觉晓，处处闻啼鸟', B: '日出江花红胜火', C: '窗含西岭千秋雪', D: '门泊东吴万里船' },
    correct: 'A', hint: '闻=听+啼鸟=听觉',
  },
  {
    id: '综-2-6', lessonId: 11, difficulty: 2,
    text: '描写"操场"时，可以用到哪些感觉？',
    options: { A: '只有看', B: '看和听', C: '看、听、摸', D: '所有五种感觉' },
    correct: 'D', hint: '操场可以看(颜色形状)、听(声音)、闻(草香)、摸(地面)、尝(汗水)',
  },
  {
    id: '综-2-7', lessonId: 11, difficulty: 2,
    text: '"声音"和"声息"的区别是？',
    options: { A: '声音好听，声息难听', B: '声音响亮，声息微弱', C: '声音远，声息近', D: '没有区别' },
    correct: 'B', hint: '',
  },
  {
    id: '综-2-8', lessonId: 11, difficulty: 2,
    text: '"气味"和"气息"的区别是？',
    options: { A: '气味浓烈，气息清淡', B: '气味好闻，气息难闻', C: '没有区别', D: '气味远，气息近' },
    correct: 'A', hint: '',
  },
  {
    id: '综-2-9', lessonId: 11, difficulty: 2,
    text: '摸的感觉结果有哪5组？',
    options: { A: '酸甜苦辣咸', B: '光滑粗糙/软硬/干湿/冷热/尖平凸钝', C: '颜色形状组成作用动作', D: '声音声息气味气息' },
    correct: 'B', hint: '',
  },
  {
    id: '综-2-10', lessonId: 11, difficulty: 2,
    text: '写好作文的关键是？',
    options: { A: '多用成语', B: '多用修辞', C: '多用心观察和感觉', D: '多抄范文' },
    correct: 'C', hint: '',
  },

  // ── 难度3（挑战）──
  {
    id: '综-3-1', lessonId: 11, difficulty: 3,
    text: '如果要写"夏天"，最全面的感觉点组合是？',
    options: { A: '热+蝉鸣+绿+西瓜甜', B: '只有热', C: '只有绿', D: '只有蝉鸣' },
    correct: 'A', hint: '最全面',
  },
  {
    id: '综-3-2', lessonId: 11, difficulty: 3,
    text: '杜甫"两个黄鹂鸣翠柳"中包含了最多几种感觉点？',
    options: { A: '颜色+声音=最多', B: '只有颜色', C: '只有声音', D: '只有动作' },
    correct: 'A', hint: '颜色+声音=最多',
  },
  {
    id: '综-3-3', lessonId: 11, difficulty: 3,
    text: '描写"花园里的玫瑰"，至少可以用到哪两种感觉？',
    options: { A: '看和听', B: '看和闻', C: '听和摸', D: '闻和尝' },
    correct: 'B', hint: '花=看，香=闻',
  },
  {
    id: '综-3-4', lessonId: 11, difficulty: 3,
    text: '下列哪一项不属于15个基本感觉点？',
    options: { A: '颜色', B: '声息', C: '快乐', D: '气息' },
    correct: 'C', hint: '情绪不是感觉点',
  },
  {
    id: '综-3-5', lessonId: 11, difficulty: 3,
    text: '妈妈给你一个拥抱，你能感受到哪些感觉点？',
    options: { A: '温暖（触觉）', B: '妈妈身上的香味（嗅觉）', C: '妈妈说的话（听觉）', D: '以上都可以' },
    correct: 'D', hint: '香味+拥抱+声音=多感觉',
  },
  {
    id: '综-3-6', lessonId: 11, difficulty: 3,
    text: '看到一朵红花，正确的感觉过程描述是？',
    options: { A: '眼睛→看→红色', B: '鼻子→闻→红色', C: '手→摸→红色', D: '耳朵→听→红色' },
    correct: 'A', hint: '正确的三要素',
  },
  {
    id: '综-3-7', lessonId: 11, difficulty: 3,
    text: '描写"冬天的早晨"，最全面的感觉点是？',
    options: { A: '白色+冷+风声', B: '只有白色', C: '只有冷', D: '只有风声' },
    correct: 'A', hint: '最全面',
  },
  {
    id: '综-3-8', lessonId: 11, difficulty: 3,
    text: '下列哪首诗同时包含了"看"和"闻"两种感觉？',
    options: { A: '夜来风雨声，花落知多少', B: '遥知不是雪，为有暗香来', C: '两个黄鹂鸣翠柳', D: '床前明月光' },
    correct: 'B', hint: '雪=视觉，暗香=嗅觉',
  },
  {
    id: '综-3-9', lessonId: 11, difficulty: 3,
    text: '"摸"的感觉结果分为几组？',
    options: { A: '2组', B: '3组', C: '4组', D: '5组' },
    correct: 'D', hint: '光滑粗糙/软硬/干湿/冷热/尖平凸钝',
  },
  {
    id: '综-3-10', lessonId: 11, difficulty: 3,
    text: '学完所有感觉知识后，写好作文的秘诀是什么？',
    options: { A: '多背好词好句', B: '多看别人的作文', C: '多用心观察和感觉', D: '多做阅读理解' },
    correct: 'C', hint: '',
  },
];

// ═══════════════════════════════════════════════════
// 辅助函数
// ═══════════════════════════════════════════════════

/**
 * 获取某个知识点某个难度层级的所有题目
 * @param {number} lessonId    知识点ID（1-10，11=综合挑战）
 * @param {number} difficulty  难度层级（1-3）
 * @returns {Question[]}
 */
export function getQuestions(lessonId, difficulty) {
  return QUESTIONS.filter(q => q.lessonId === lessonId && q.difficulty === difficulty);
}

/**
 * 从指定知识点和难度中随机抽取 n 道题
 * @param {number} lessonId
 * @param {number} difficulty
 * @param {number} [count=5] 抽取数量
 * @returns {Question[]}
 */
export function pickRandomQuestions(lessonId, difficulty, count = 5) {
  const pool = getQuestions(lessonId, difficulty);
  // Fisher-Yates 洗牌
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * 为指定课程生成一组答题题目（根据能力指数自动选择难度，带跨难度补充）
 * @param {number} lessonId
 * @param {number} currentDifficulty 当前难度层级（1-3）
 * @param {number} [count=5] 需要的题目数量
 * @returns {Question[]}
 */
export function generateQuizSet(lessonId, currentDifficulty, count = 5) {
  // 主要从当前难度抽题
  let questions = pickRandomQuestions(lessonId, currentDifficulty, count);

  // 如果当前难度题不够，从相邻难度补充
  if (questions.length < count) {
    const adjacent = currentDifficulty < 3 ? currentDifficulty + 1 : currentDifficulty - 1;
    const extra = pickRandomQuestions(lessonId, adjacent, count - questions.length);
    questions = [...questions, ...extra];
  }

  return questions;
}
