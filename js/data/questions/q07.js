/**
 * 知识点7：手摸感觉点专项
 * D1×9 + D2×9 + D3×12（含学段标签 S/C/H） = 30 题
 * 来源：感觉训练基础模块题库_300题-5.14.docx
 */
export const Q07 = [
  {
    id: 'K8-D1-01',
    lessonId: 7,
    difficulty: 1,
    qtype: 'single',
    text: '“玻璃桌面摸起来很滑”，这里的“滑”属于“手摸”感觉点中的（ ）。',
    options: { A: '光滑/粗糙', B: '软/硬', C: '干/湿', D: '冷/热' },
    correct: 'A',
  },

  {
    id: 'K8-D1-02',
    lessonId: 7,
    difficulty: 1,
    qtype: 'single',
    text: '“棉花糖软绵绵的”，这里的“软”属于（ ）。',
    options: { A: '光滑/粗糙', B: '软/硬', C: '干/湿', D: '冷/热' },
    correct: 'B',
  },

  {
    id: 'K8-D1-03',
    lessonId: 7,
    difficulty: 1,
    qtype: 'judge',
    text: '“这块石头被太阳晒得热乎乎的”，主要描写了“手摸-冷/热”的感觉。',
    options: { A: '正确', B: '错误' },
    correct: 'A',
  },

  {
    id: 'K8-D1-04',
    lessonId: 7,
    difficulty: 1,
    qtype: 'multi',
    text: '以下通常属于“手摸-光滑/粗糙”描述的有（ ）。',
    options: { A: '细腻的丝绸', B: '砂纸的表面', C: '坚硬的核桃壳', D: '潮湿的毛巾' },
    correct: ['A', 'B'],
  },

  {
    id: 'K8-D1-05',
    lessonId: 7,
    difficulty: 1,
    qtype: 'link',
    text: '将触感与例子连线。',
    leftItems: { '①': '光滑/粗糙', '②': '冷/热', '③': '软/硬' },
    rightItems: { 'A': '冬天的铁栏杆', 'B': '新生婴儿的皮肤', 'C': '粗糙的树皮' },
    correct: { '①': 'C', '②': 'A', '③': 'B' },
  },

  {
    id: 'K8-D1-06',
    lessonId: 7,
    difficulty: 1,
    qtype: 'single',
    text: '“毛笔的笔尖是尖的，笔杆是圆的”，这里“尖”和“圆”主要涉及“手摸”中的（ ）。',
    options: { A: '光滑/粗糙', B: '软/硬', C: '干/湿', D: '尖/钝' },
    correct: 'D',
  },

  {
    id: 'K8-D1-07',
    lessonId: 7,
    difficulty: 1,
    qtype: 'single',
    text: '“手摸”的五类感觉点是：光滑/粗糙、软/硬、干/湿、冷/热和尖/钝。',
    options: { A: '轻重', B: '香臭', C: '尖/钝', D: '大小' },
    correct: 'C',
  },

  {
    id: 'K8-D1-08',
    lessonId: 7,
    difficulty: 1,
    qtype: 'multi',
    text: '以下描述中，属于“手摸”感觉的有（ ）。',
    options: { A: '毛绒玩具的柔软', B: '雨后的树叶湿润', C: '开水的滚烫', D: '岩石的棱角分明' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K8-D1-09',
    lessonId: 7,
    difficulty: 1,
    qtype: 'judge',
    text: '“这个苹果脆脆的”，这里的“脆”主要是“口尝”的口感，但也隐含了咬下去时“手摸-软/硬”的触觉体验。',
    options: { A: '正确', B: '错误' },
    correct: 'A',
  },

  {
    id: 'K8-D2-01',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '你想告诉朋友如何挑选一个“好抱枕”，以下哪条描述最关键？',
    options: { A: '颜色要鲜艳。', B: '摸起来要柔软蓬松，枕上去要有支撑感。(软/硬)', C: '闻起来要有香味。', D: '价格要昂贵。' },
    correct: 'B',
  },

  {
    id: 'K8-D2-02',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '“他小心翼翼地抚摸着爷爷留下的旧怀表，表壳光滑冰凉，上面还有几道细微的划痕。”这句话没有直接写到的“手摸”感觉点是（ ）。',
    options: { A: '光滑/粗糙', B: '冷/热', C: '软/硬', D: '尖/钝 (划痕的边缘可能隐含)' },
    correct: 'C',
  },

  {
    id: 'K8-D2-03',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '小华写：“雪真冷啊！”老师建议他写写怎么个“冷”法。他改写为：“我抓起一把雪，瞬间感到刺骨的冰凉，手指很快就冻得发麻。”他补充的主要是（ ）。',
    options: { A: '眼看', B: '鼻闻', C: '手摸-冷/热', D: '耳听' },
    correct: 'C',
  },

  {
    id: 'K8-D2-04',
    lessonId: 7,
    difficulty: 2,
    qtype: 'multi',
    text: '描写“一块刚从河里捞起的鹅卵石”，可能用到以下哪些“手摸”感觉点？（ ）',
    options: { A: '光滑 (被水流冲刷)', B: '冰凉 (河水温度)', C: '坚硬', D: '湿润' },
    correct: ['A', 'B', 'C', 'D'],
  },

  {
    id: 'K8-D2-05',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '“朱门酒肉臭，路有冻死骨”，如果从触觉角度理解“冻死骨”，主要让人联想到（ ）的可怕。',
    options: { A: '光滑/粗糙', B: '软/硬', C: '干/湿', D: '冷/热 (极致的冰冷)' },
    correct: 'D',
  },

  {
    id: 'K8-D2-06',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '请将触摸“一片沾了晨露的玫瑰花瓣”时，可能依次感受到的触觉排序： ① 指尖先感到（ ）(凉) ② 然后是（ ）(湿) ③ 最后是花瓣本身（ ）的质地 (柔软细腻)',
    options: { A: '冰凉， 湿润， 柔软细腻', B: '柔软， 干燥， 温暖', C: '粗糙， 湿热， 坚硬', D: '光滑， 冰冷， 黏糊' },
    correct: 'A',
  },

  {
    id: 'K8-D2-07',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '“触觉小精灵”来分类！将以下“感觉”归入正确的类别。 感觉：① 毛茸茸 ② 硬邦邦 ③ 湿漉漉 ④ 暖烘烘 类别：A.光滑/粗糙 B.软/硬 C.干/湿 D.冷/热 正确匹配是（ ）。',
    options: { A: '①-A, ②-B, ③-C, ④-D', B: '①-B, ②-C, ③-D, ④-A', C: '①-A, ②-B, ③-D, ④-C', D: '①-C, ②-D, ③-A, ④-B' },
    correct: 'A',
  },

  {
    id: 'K8-D2-08',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '“忽然有种温暖而粗糙的感觉包裹了我的手——那是父亲的手。”这句话通过“温暖”(冷/热)和“粗糙”(光滑/粗糙)这两个“手摸”感觉点，传神地刻画了父亲手的特征，也隐含了（ ）。',
    options: { A: '父亲的工作辛苦', B: '岁月的痕迹与父爱的质感', C: '父亲的手很脏', D: '父亲的手很好看' },
    correct: 'B',
  },

  {
    id: 'K8-D2-09',
    lessonId: 7,
    difficulty: 2,
    qtype: 'single',
    text: '你要为“婴幼儿软胶玩具”写安全卖点，以下哪点最能从“手摸”角度体现？',
    options: { A: '颜色鲜艳，刺激视觉发育。', B: '材质柔软，边角圆润，不会划伤宝宝娇嫩皮肤。(软/硬, 尖/钝)', C: '摇动时有响声。', D: '有水果香味。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-S01',
    lessonId: 7,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你想为奶奶选一双手套，以下哪条描述是奶奶最可能喜欢的“手摸”感受？',
    options: { A: '造型很酷，有金属装饰。', B: '里面是柔软的绒，摸起来很暖和，戴上去很舒服。', C: '价格很贵，是名牌。', D: '颜色是黑色的。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-S02',
    lessonId: 7,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你闭眼摸一个盒子里的东西：表面毛毛的，有点扎手，形状不规则，摸起来有点干。它最可能是（ ）。',
    options: { A: '一个玻璃球', B: '一块松果', C: '一块肥皂', D: '一团棉花' },
    correct: 'B',
  },

  {
    id: 'K8-D3-S03',
    lessonId: 7,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '小亮写：“春天的小草很舒服。”老师批注：“怎么个舒服法？是看起来，还是摸起来？”小亮可以怎么改？（选一项）',
    options: { A: '春天的小草绿油油的，很舒服。', B: '春天的小草，摸上去柔柔软软的，带着湿湿的凉意，赤脚踩上去痒痒的，很舒服。', C: '春天的小草有香味，很舒服。', D: '我喜欢春天的小草。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-S04',
    lessonId: 7,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '儿童诗写道：“阳光是温暖的，像妈妈的怀抱；月光是清凉的，像夏夜的溪水。”这里把“阳光”和“月光”比喻成了不同的（ ）感受。',
    options: { A: '视觉', B: '听觉', C: '手摸-冷/热', D: '嗅觉' },
    correct: 'C',
  },

  {
    id: 'K8-D3-S05',
    lessonId: 7,
    difficulty: 3,
    stage: 'S',
    qtype: 'single',
    text: '你要设计一句“记忆棉床垫”的广告语，强调其睡眠体验。以下哪句最侧重“手摸”与身体感受？',
    options: { A: '奢华设计，尊贵享受。', B: '躺在上面，身体被温柔地包裹、支撑，仿佛睡在云端，压力瞬间消散。', C: '采用高科技材料。', D: '销量第一，值得信赖。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-C01',
    lessonId: 7,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '“母亲的手总是微热而粗糙的，那上面布满了生活和岁月的茧子。”这段描写通过“微热”(冷/热)和“粗糙”(光滑/粗糙)这两个触觉细节，生动地写出了（ ）。',
    options: { A: '母亲的手不好看', B: '母亲常年操劳的痕迹与不变的温暖', C: '母亲不讲卫生', D: '母亲的手很灵巧' },
    correct: 'B',
  },

  {
    id: 'K8-D3-C02',
    lessonId: 7,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '朱自清《背影》中写父亲爬月台：“他用两手攀着上面，两脚再向上缩；他肥胖的身子向左微倾，显出努力的样子。”“攀”、“缩”、“倾”这些动作描写，虽未直接写触觉，但能让读者感受到月台边缘的（ ）和父亲行动的艰难。',
    options: { A: '颜色', B: '高度和（想象中的）坚硬、粗糙', C: '气味', D: '温度' },
    correct: 'B',
  },

  {
    id: 'K8-D3-C03',
    lessonId: 7,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '同是写“水”，甲文“河水很凉”，乙文“我把手伸进河水，一股刺骨的寒意立刻顺着指尖蔓延开来，激得我打了个哆嗦。”乙文的高明之处在于（ ）。',
    options: { A: '直接说出了感受。', B: '通过动作(“伸进”)和身体反应(“打了个哆嗦”)，将“冷/热”的触觉体验过程化和具身化，更有感染力。', C: '字数更多。', D: '用了比喻。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-C04',
    lessonId: 7,
    difficulty: 3,
    stage: 'C',
    qtype: 'single',
    text: '你要写一段关于“陶艺体验”的文字，想突出泥土在手中的变化。以下哪种触觉描写最贴切？',
    options: { A: '陶泥看起来灰扑扑的。', B: '初触时，陶泥冰凉、湿软而顺从；在指尖的揉捏下，它渐渐变得温润、柔韧，有了生命般的形状。', C: '拉胚机转动的声音很好听。', D: '烧制后的陶器很漂亮。' },
    correct: 'B',
  },

  {
    id: 'K8-D3-H01',
    lessonId: 7,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '杜甫《茅屋为秋风所破歌》中“布衾多年冷似铁，娇儿恶卧踏里裂。”这里的“冷似铁”是（ ），形象地写出了棉被因多年使用、失去弹性而坚硬冰凉的触感，极具表现力地渲染了诗人生活的贫寒与艰辛。',
    options: { A: '夸张', B: '比喻 (将触感“冷”和“硬”比作铁)', C: '拟人', D: '对比' },
    correct: 'B',
  },

  {
    id: 'K8-D3-H02',
    lessonId: 7,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '古诗“冰丝玉缕簇青红，已逗花梢一信风。”中“冰丝”形容丝线，是典型的（ ）手法，用触觉上的“冰”感来修饰视觉上的“丝”，突出其光滑、凉爽、晶莹的特质。',
    options: { A: '视觉描写', B: '触觉通感', C: '听觉描写', D: '味觉描写' },
    correct: 'B',
  },

  {
    id: 'K8-D3-H03',
    lessonId: 7,
    difficulty: 3,
    stage: 'H',
    qtype: 'single',
    text: '中国传统文化中，玉的“温润”质感被赋予了“仁”的品德。这种将特定（ ）体验与道德品格相联系的观念，体现了“比德”的思维模式。',
    options: { A: '视觉', B: '听觉', C: '触觉', D: '嗅觉' },
    correct: 'C',
  },
];
