/**
 * 静物专题 · 子内容：书包
 * ─────────────────────────────────────────────────────────────
 * 依据《感觉训练专题模块开发大纲（静物精简版1.0）-台灯-柳树-书包-笔袋-5.23》
 * 编号体系：TZ-JW-SB-A01 ~ TZ-JW-SB-D01
 * 题量：5(A) + 18(B) + 6(C) + 1(D) = 30 题
 * 顺序原则：由外到内、整体到局部
 * ─────────────────────────────────────────────────────────────
 */

export const SHUBAO = {
  id: 'shubao',
  topicId: 'still-life',
  title: '书包',
  subtitle: '组合结构 · 由外到内 · 多袋多隔层',
  difficulty: 3,
  // TODO: 客户提供书包参考图后，替换为正式 COS URL
  image: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao.png',
  imageAlt: '一个深蓝色 / 藏青色方正立体型书包，宽厚带软垫的背带，正面有前袋，左右有侧袋，顶部银色拉链',

  // ─── A 类：建立感觉框架 · 感觉三步法（共 5 题）───
  typeA: [
    {
      id: 'TZ-JW-SB-A01', type: 'single', dim: '看组成',
      text: '观察书包，第一步"看组成"应该先做什么？',
      options: {
        A: '看颜色好不好看',
        B: '拆分书包固有的部分：主袋、前袋、侧袋、背带、提手、拉链',
        C: '摸一摸软不软',
        D: '闻一闻味道',
      },
      correct: 'B',
      hint: '感觉三步法第一步是看组成，必须拆分事物本身固有的部分，不涉及颜色、触感、气味等细节。',
    },
    {
      id: 'TZ-JW-SB-A02', type: 'single', dim: '排顺序',
      text: '描写书包最合理、最常用的顺序是？',
      options: {
        A: '随便写，想到哪写到哪',
        B: '由外到内：整体外观 → 外部组成 → 内部结构',
        C: '只写最喜欢的部分',
        D: '由内到外：先写内部再写外观',
      },
      correct: 'B',
      hint: '书包是立体静物，最符合观察习惯的顺序是由外到内、由整体到局部。',
    },
    {
      id: 'TZ-JW-SB-A03', type: 'multi', dim: '看组成',
      text: '下列哪些属于书包本身固有的组成部分？（可多选）',
      options: {
        A: '主袋',
        B: '前袋',
        C: '侧袋',
        D: '书桌上的课本',
      },
      correct: ['A', 'B', 'C'],
      hint: '"看组成"只能选取书包自身的结构，课本、书桌是外部物品，不属于书包组成。',
    },
    {
      id: 'TZ-JW-SB-A04', type: 'single', dim: '结构规划',
      text: '你要按"由外到内"写书包，正确的描写顺序方案是？',
      options: {
        A: '内部 → 侧袋 → 前袋 → 背带',
        B: '整体外观 → 背带 → 前袋 → 侧袋 → 主袋 → 内部',
        C: '只写拉链',
        D: '侧袋 → 内部 → 背带',
      },
      correct: 'B',
      hint: '由外到内的顺序是从整体外观开始，依次描写外部部件，最后进入内部结构。',
    },
    {
      id: 'TZ-JW-SB-A05', type: 'single', dim: '结构诊断',
      text: '小明描写书包："内部很大，背带舒服，颜色红蓝相间，拉链很好拉。"这篇文章在结构上最主要的问题是什么？',
      options: {
        A: '没有使用比喻句',
        B: '描写顺序混乱，没有遵循清晰次序',
        C: '字数太少',
        D: '没有写品牌',
      },
      correct: 'B',
      hint: '文章在内部、背带、颜色、拉链间跳跃，没有遵循"看组成 → 排顺序 → 再感觉"的逻辑。',
    },
  ],

  // ─── B 类：有序感知细节 · 五感 15 点（共 18 题）───
  typeB: [
    // —— 整体外观（3 题）——
    {
      id: 'TZ-JW-SB-B01', type: 'single', dim: '整体 · 颜色',
      text: '书包主体颜色是？',
      options: { A: '深蓝色 / 藏青色', B: '纯白色', C: '大红色', D: '浅黄色' },
      correct: 'A',
      hint: '图片中书包主体为深蓝色 / 藏青色，直接提取客观视觉特征。',
    },
    {
      id: 'TZ-JW-SB-B02', type: 'single', dim: '整体 · 形状',
      text: '书包整体形状是？',
      options: { A: '不规则', B: '方正立体型', C: '圆形', D: '细长条' },
      correct: 'B',
      hint: '图片中书包呈方正立体、轮廓规整，直接提取客观形状特征。',
    },
    {
      id: 'TZ-JW-SB-B03', type: 'single', dim: '整体 · 作用',
      text: '书包的主要作用是？',
      options: {
        A: '装文具、书本，方便携带学习用品',
        B: '当玩具',
        C: '装饰房间',
        D: '发热取暖',
      },
      correct: 'A',
      hint: '书包核心功能为收纳课本、文具，便于学生背负携带。',
    },

    // —— 背带（3 题）——
    {
      id: 'TZ-JW-SB-B04', type: 'single', dim: '背带 · 颜色',
      text: '背带的颜色是？',
      options: { A: '黑色', B: '白色', C: '深蓝色（与主体一致）', D: '彩色' },
      correct: 'C',
      hint: '图片中背带与书包主体同色，为深蓝色。',
    },
    {
      id: 'TZ-JW-SB-B05', type: 'single', dim: '背带 · 形状',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-strap.png',
      text: '背带的形状与特点是？',
      options: { A: '细短、无软垫', B: '圆形', C: '弹性绳状', D: '宽厚、加长、有软垫' },
      correct: 'D',
      hint: '图片中背带宽厚、带软垫、长度适中，符合减负设计。',
    },
    {
      id: 'TZ-JW-SB-B06', type: 'single', dim: '背带 · 触感',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-strap.png',
      text: '用手摸背带，触感是？',
      options: { A: '柔软、厚实、舒适', B: '粗糙、扎手', C: '冰凉坚硬', D: '黏黏的' },
      correct: 'A',
      hint: '背带为海绵加厚材质，触感柔软、厚实、舒适。',
    },

    // —— 前袋（3 题）——
    {
      id: 'TZ-JW-SB-B07', type: 'single', dim: '前袋 · 颜色',
      text: '前袋的颜色是？',
      options: { A: '白色', B: '深蓝色（主体色）', C: '浅蓝色拼接', D: '黑色' },
      correct: 'B',
      hint: '图片中前袋与主体同色，为深蓝色。',
    },
    {
      id: 'TZ-JW-SB-B08', type: 'single', dim: '前袋 · 形状',
      text: '前袋的形状是？',
      options: { A: '正方形', B: '三角形', C: '扁平长方形', D: '圆形' },
      correct: 'C',
      hint: '图片中前袋呈扁平长方形，位于正面下方。',
    },
    {
      id: 'TZ-JW-SB-B09', type: 'single', dim: '前袋 · 作用',
      text: '前袋的作用是？',
      options: {
        A: '装小物件：橡皮、尺子、钥匙、口罩',
        B: '装大课本',
        C: '装水杯',
        D: '装饰',
      },
      correct: 'A',
      hint: '前袋空间较小，用于收纳小型学习用品与随身物品。',
    },

    // —— 侧袋（3 题）——
    {
      id: 'TZ-JW-SB-B10', type: 'single', dim: '侧袋 · 数量',
      text: '侧袋数量与位置是？',
      options: {
        A: '左右各 1 个，共 2 个',
        B: '只有左侧 1 个',
        C: '只有右侧 1 个',
        D: '没有侧袋',
      },
      correct: 'A',
      hint: '图片中书包左右两侧各有一个弹性侧袋。',
    },
    {
      id: 'TZ-JW-SB-B11', type: 'single', dim: '侧袋 · 形状',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-side.png',
      text: '侧袋的形状是？',
      options: { A: '密封方形', B: '细长条状', C: '圆形', D: '敞口、弹性、弧形兜状' },
      correct: 'D',
      hint: '侧袋为弹性网兜 / 弧形兜状，敞口设计。',
    },
    {
      id: 'TZ-JW-SB-B12', type: 'single', dim: '侧袋 · 作用',
      text: '侧袋的主要作用是？',
      options: { A: '放水杯、雨伞', B: '装铅笔盒', C: '装作业本', D: '装外套' },
      correct: 'A',
      hint: '侧袋适合放置水杯、折叠雨伞等长条状物品。',
    },

    // —— 拉链与面料（3 题）——
    {
      id: 'TZ-JW-SB-B13', type: 'single', dim: '拉链 · 颜色',
      text: '拉链头颜色是？',
      options: { A: '蓝色', B: '银色 / 金属色', C: '黑色', D: '红色' },
      correct: 'B',
      hint: '图片中拉链头为银色金属材质。',
    },
    {
      id: 'TZ-JW-SB-B14', type: 'single', dim: '拉链 · 声音',
      text: '拉动拉链时发出的声音是？',
      options: { A: '沙沙声', B: '没有声音', C: '轻微"呲啦"声', D: '巨大轰隆声' },
      correct: 'C',
      hint: '金属拉链拉动时发出轻微、顺畅的呲啦声。',
    },
    {
      id: 'TZ-JW-SB-B15', type: 'single', dim: '面料 · 触感',
      text: '用手摸书包面料，表面是？',
      options: { A: '粗糙、起球', B: '毛茸茸', C: '黏腻', D: '平滑、挺括、耐磨' },
      correct: 'D',
      hint: '书包为牛津布 / 尼龙面料，触感平滑、挺括、耐磨。',
    },

    // —— 内部结构（3 题）——
    {
      id: 'TZ-JW-SB-B16', type: 'single', dim: '内部 · 分层',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-inside.png',
      text: '书包内部分层是？',
      options: {
        A: '大容量主袋 + 内隔夹层',
        B: '只有一层无分隔',
        C: '多层密封格子',
        D: '没有内部结构',
      },
      correct: 'A',
      hint: '图片中内部为大容量主袋 + 内隔夹层，分类收纳。',
    },
    {
      id: 'TZ-JW-SB-B17', type: 'single', dim: '内部 · 颜色',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-inside.png',
      text: '内部面料颜色是？',
      options: { A: '浅灰色 / 浅蓝色', B: '黑色', C: '深蓝色', D: '彩色' },
      correct: 'A',
      hint: '内部衬里为浅灰色 / 浅蓝色，明亮好找东西。',
    },
    {
      id: 'TZ-JW-SB-B18', type: 'single', dim: '内部 · 空间',
      imageOverride: 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/jingwu/shubao-inside.png',
      text: '内部空间特点是？',
      options: {
        A: '宽敞、分层多、能装大量书本',
        B: '狭小、只能装少量东西',
        C: '软塌塌、无支撑',
        D: '密封不透气',
      },
      correct: 'A',
      hint: '内部空间宽敞、立体支撑、分层清晰，收纳能力强。',
    },
  ],

  // ─── C 类：指导整合成文 · 启发式连词成文（共 6 题）───
  typeC: [
    {
      id: 'TZ-JW-SB-C01', type: 'single', dim: '总起句',
      text: '写《我的书包》第一段总起句，下列哪一句最符合感觉三步法"看组成"要求？',
      options: {
        A: '我的书包很漂亮，我很喜欢它。',
        B: '我的书包主要由主体、背带、前袋、侧袋和内部隔层组成。',
        C: '书包是蓝色的，很大。',
        D: '书包是妈妈送给我的礼物。',
      },
      correct: 'B',
      hint: '总起段必须先写清楚组成，这是"感觉三步法"固定结构，不能只写情感或外观。',
    },
    {
      id: 'TZ-JW-SB-C02', type: 'single', dim: '段落顺序',
      text: '如果你已经收集好书包所有感觉点，下列哪一种段落推进顺序最通顺、最有逻辑？',
      options: {
        A: '先写内部 → 再写背带 → 再写侧袋 → 最后写整体',
        B: '整体外观 → 背带 → 前袋与侧袋 → 内部结构',
        C: '想到什么写什么',
        D: '只写颜色和大小',
      },
      correct: 'B',
      hint: '写作必须遵循由外到内、由整体到局部的观察顺序，文章才不乱。',
    },
    {
      id: 'TZ-JW-SB-C03', type: 'single', dim: '段落衔接',
      text: '写完背带，要过渡到前袋，下列哪一句过渡最自然？',
      options: {
        A: '背带很好。前袋也很好。',
        B: '书包正面下方还有一个扁平的前袋，专门用来放小文具。',
        C: '我喜欢前袋。',
        D: '前袋是蓝色的。',
      },
      correct: 'B',
      hint: '好的过渡要交代位置、承接上文、引出下文，让段落连起来不生硬。',
    },
    {
      id: 'TZ-JW-SB-C04', type: 'single', dim: '素材取舍',
      text: '描写侧袋时，下列哪一组信息最完整、最符合写作要求？',
      options: {
        A: '侧袋左右各一个，弧形兜状，专门放水杯和雨伞。',
        B: '侧袋好看。',
        C: '侧袋是蓝色的。',
        D: '侧袋有用。',
      },
      correct: 'A',
      hint: '专题训练要求必须写出形状 + 位置 + 作用，不能只写单一特点。',
    },
    {
      id: 'TZ-JW-SB-C05', type: 'single', dim: '表达升级',
      text: '把"内部大、浅灰色、能装书"连成通顺高级的句子，最佳是？',
      options: {
        A: '内部大浅灰色能装书。',
        B: '书包内部宽敞明亮，衬里是浅灰色，分层设计能整齐放下许多课本。',
        C: '内部很大。',
        D: '内部能装书。',
      },
      correct: 'B',
      hint: '要把空间、颜色、结构、功能四要素有序组合，句子才具体饱满。',
    },
    {
      id: 'TZ-JW-SB-C06', type: 'single', dim: '自检方法',
      text: '写完书包作文，下列哪一项是最正确的自检步骤？',
      options: {
        A: '只看字数够不够',
        B: '检查组成是否完整、顺序是否正确、感觉点是否齐全、语句是否通顺',
        C: '只看有没有好词',
        D: '只看有没有比喻',
      },
      correct: 'B',
      hint: '专题评分标准 = 组成完整 30% + 顺序正确 30% + 感觉点准确 30% + 语句通顺 10%。',
    },
  ],

  // ─── D 类：参照树形结构图 · 书写成文（1 大题）───
  typeD: {
    id: 'TZ-JW-SB-D01',
    title: '参照树形结构图，写一篇《我的书包》',
    requirements: [
      '按"总-分"式结构（整体 → 局部、由外到内）书写',
      '第一段总起：写清书包完整组成',
      '第二段：整体外观 + 背带',
      '第三段：前袋 + 侧袋',
      '第四段：内部结构与空间',
      '语句平实准确，不编造，不使用修辞',
    ],

    treeMap: {
      root: '书包',
      branches: [
        {
          name: '1. 整体外观（由外到内 · 整体）', color: '#5470AD',
          children: [
            { name: '眼看-颜色：深蓝色 / 藏青色' },
            { name: '眼看-形状：方正立体型' },
            { name: '眼看-作用：装书本、文具' },
          ],
        },
        {
          name: '2. 背带（外部第一部分）', color: '#88D8B0',
          children: [
            { name: '眼看-颜色：深蓝色' },
            { name: '眼看-形状：宽厚、带软垫' },
            { name: '手摸-软/硬：柔软厚实' },
          ],
        },
        {
          name: '3. 前袋（外部第二部分）', color: '#F5A2BC',
          children: [
            { name: '眼看-颜色：深蓝色' },
            { name: '眼看-形状：扁平长方形' },
            { name: '眼看-作用：放小物件' },
          ],
        },
        {
          name: '4. 侧袋（外部第三部分）', color: '#FFD580',
          children: [
            { name: '眼看-数量：左右各 1 个' },
            { name: '眼看-形状：弧形兜状、弹性' },
            { name: '眼看-作用：放水杯、雨伞' },
          ],
        },
        {
          name: '5. 拉链（外部第四部分）', color: '#C8A8E9',
          children: [
            { name: '眼看-颜色：银色' },
            { name: '耳听-声音：轻微"呲啦"声' },
          ],
        },
        {
          name: '6. 内部结构（由外到内 · 内部）', color: '#82C9F0',
          children: [
            { name: '眼看-颜色：浅灰色' },
            { name: '眼看-结构：主隔层 + 小插袋' },
            { name: '眼看-空间：宽敞、能装书本' },
          ],
        },
      ],
    },

    rubric: [
      { dim: '组成完整', weight: 30, desc: '清晰体现"看组成 → 排顺序 → 再感觉"，按四段结构书写' },
      { dim: '顺序正确', weight: 30, desc: '描写顺序与"由外到内、整体到局部"一致' },
      { dim: '感觉点准确', weight: 30, desc: '完整、准确包含树形图中的感觉点（深蓝、方正、柔软厚实、银色、呲啦声等）' },
      { dim: '语句通顺', weight: 10, desc: '用词准确，句子衔接流畅，无语病' },
    ],

    sample: '我的书包是我每天上学的好伙伴，它主要由主体、宽厚的背带、前袋、左右侧袋和内部隔层组成。\n我的书包整体是深蓝色的，形状方方正正，看起来立体又精神。书包的背带也是深蓝色的，非常宽厚，还带有柔软的软垫，摸起来厚实又舒服，背在肩上不会觉得累。\n书包正面下方有一个扁平的长方形前袋，是装橡皮、尺子这类小文具的好地方。书包左右两边各有一个弹性弧形侧袋，左边可以放水杯，右边可以放折叠雨伞，拿取非常方便。\n书包的内部宽敞又明亮，衬里是浅灰色的，里面有一个大隔层和一个小插袋。大隔层可以整齐地放下课本和作业本，小插袋可以放练习卷和便签，让所有学习用品都分类摆放，一目了然。',
  },
};
