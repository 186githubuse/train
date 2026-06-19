/**
 * 专题训练 · 状元桥
 * ─────────────────────────────────────────────────────────────
 * 来源：0619 最新《感觉训练专题模块开发大纲（新6.0简版）612》DOCX 提取文本
 * 结构：单元模块化（schema: 'unit'）
 * 图片：正式主图使用腾讯云 COS；局部题按 imageOverride 切换细节图。
 * ─────────────────────────────────────────────────────────────
 */

export const ZHUANGYUANQIAO = {
  "id": "zhuangyuanqiao",
  "topicId": "scenery",
  "schema": "unit",
  "title": "状元桥",
  "subtitle": "桥面 · 护栏 · 桥身 · 桥洞",
  "difficulty": 3,
  "image": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao.png",
  "imageAlt": "一座浅米白色单孔石拱桥，桥面有台阶，两侧石质护栏带小石狮，桥身下方有椭圆形拱状桥洞",
  "typeA": {
    "questions": [
      {
        "id": "TZ-JW-ZY-01",
        "type": "single",
        "dim": "单选 · 基础识别",
        "text": "观察状元桥，第一步应该做什么？",
        "options": {
          "A": "触摸石材表面纹路",
          "B": "拆分固有结构：桥面、护栏、桥身、桥洞",
          "C": "观察桥下水流",
          "D": "清点装饰摆件"
        },
        "correct": "B",
        "hint": "感觉三步第一步为看组成，优先拆分物体固有结构，暂不观察细节与周边环境。"
      },
      {
        "id": "TZ-JW-ZY-02",
        "type": "single",
        "dim": "单选 · 简单应用",
        "text": "描写状元桥，适合的观察顺序是？",
        "options": {
          "A": "桥洞→桥身→护栏→桥面",
          "B": "护栏→桥面→桥洞→桥身",
          "C": "桥面→护栏→桥身→桥洞",
          "D": "桥身→桥面→护栏→尾巴"
        },
        "correct": "C",
        "hint": "按照由上到下的顺序，依次描写桥面、护栏、桥身、桥洞。"
      },
      {
        "id": "TZ-JW-ZY-03",
        "type": "single",
        "dim": "单选 · 情景辨析",
        "text": "有同学杂乱描写：“桥洞呈拱形，桥面是石质，栏杆有石狮子。” 这段话主要问题是？",
        "options": {
          "A": "缺少优美语句",
          "B": "未介绍建筑名称",
          "C": "文章字数过少",
          "D": "描写顺序混乱，未遵循由上到下规则"
        },
        "correct": "D",
        "hint": "内容打乱上下空间结构，写作顺序无序，不符合观察规范。"
      },
      {
        "id": "TZ-JW-ZY-04",
        "type": "single",
        "dim": "单选 · 逻辑排序",
        "text": "感觉三步法的正确流程是？",
        "options": {
          "A": "再感觉 → 看组成 → 排顺序",
          "B": "排顺序 → 看组成 → 再感觉",
          "C": "看组成 → 排顺序 → 再感觉",
          "D": "再感觉 → 排顺序 → 看组成"
        },
        "correct": "C",
        "hint": "标准流程：先观察组成，再梳理观察顺序，最后感知细节特征。"
      },
      {
        "id": "TZ-JW-ZY-05",
        "type": "single",
        "dim": "单选 · 方案评价",
        "text": "描写大型室外石桥，观察重点应为？",
        "options": {
          "A": "只记录细小数据",
          "B": "大量加入个人情感",
          "C": "只描写单一颜色",
          "D": "整体造型、外观形态、特色装饰"
        },
        "correct": "D",
        "hint": "大型室外静物侧重整体样貌与标志性装饰，无需纠结细碎数据与主观感受。"
      }
    ],
    "write": {
      "id": "ZHUANGYUANQIAO-WA",
      "prompt": "用一句话写出状元的主要组成。",
      "requirement": "用一句完整的话概括组成；按由上到下组织，不添加与观察无关的内容。",
      "treeMap": {
        "title": "状元桥·组成",
        "nodes": [
          "桥面",
          "护栏",
          "桥身",
          "桥洞"
        ]
      },
      "points": [
        "桥面",
        "护栏",
        "桥身",
        "桥洞"
      ],
      "reference": "状元桥主要由桥面、护栏、桥身、桥洞四个部分组成。"
    }
  },
  "typeB": {
    "units": [
      {
        "id": "unit-1",
        "name": "桥面",
        "color": "#F5A2BC",
        "questions": [
          {
            "id": "TZ-JW-ZY-06",
            "type": "single",
            "dim": "单选 · 眼看 - 形状",
            "text": "状元桥桥面整体形状是？",
            "options": {
              "A": "完全水平",
              "B": "波浪状起伏",
              "C": "整体凹陷",
              "D": "中间高、两端低的拱形坡面，有台阶"
            },
            "correct": "D",
            "hint": "单孔石拱桥的桥面呈拱形，中部位置最高，向两侧缓缓降低。"
          },
          {
            "id": "TZ-JW-ZY-07",
            "type": "single",
            "dim": "单选 · 手摸 - 触感",
            "text": "触摸桥面石材，表面感受是？",
            "options": {
              "A": "粗糙扎手",
              "B": "湿滑发黏",
              "C": "松软易碎",
              "D": "平整坚硬"
            },
            "correct": "D",
            "hint": "汉白玉石面经过修整，表面平整，质地坚硬。"
          }
        ],
        "treeMap": {
          "title": "状元桥·桥面",
          "nodes": [
            "眼看-形状：中间高、两端低的拱形坡面有台阶",
            "手摸-触感：表面平整、质地坚硬"
          ]
        },
        "write": {
          "id": "ZHUANGYUANQIAO-WB1",
          "prompt": "概括桥面的特点。",
          "requirement": "完整包含树形图所有感知点，语句通顺；仅做基础语句衔接，不随意编造内容。",
          "points": [
            "眼看-形状：中间高、两端低的拱形坡面有台阶",
            "手摸-触感：表面平整、质地坚硬"
          ],
          "reference": "桥面为中间高、两端低的拱形坡面设有台阶，石面平整坚硬。"
        }
      },
      {
        "id": "unit-2",
        "name": "护栏",
        "color": "#88D8B0",
        "questions": [
          {
            "id": "TZ-JW-ZY-11",
            "type": "single",
            "dim": "单选 · 眼看 - 位置",
            "text": "石狮子安在护栏的？",
            "options": {
              "A": "底部",
              "B": "桥面边缘",
              "C": "侧面中间",
              "D": "栏柱顶端"
            },
            "correct": "D",
            "hint": "石狮子统一雕刻、安置在每根栏柱的顶端。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-rail.png",
            "imageOverrideAlt": "状元桥护栏与栏柱石狮子特写"
          },
          {
            "id": "TZ-JW-ZY-12",
            "type": "single",
            "dim": "单选 · 眼看 - 形态",
            "text": "护栏整体样貌是？",
            "options": {
              "A": "长长的",
              "B": "歪斜残缺",
              "C": "高低错落杂乱",
              "D": "分段断裂"
            },
            "correct": "A",
            "hint": "桥梁两侧护栏长长的，规整大气。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-rail.png",
            "imageOverrideAlt": "状元桥长长石质护栏特写"
          },
          {
            "id": "TZ-JW-ZY-14",
            "type": "single",
            "dim": "单选 · 眼看 - 形态",
            "text": "石狮子整体外观风格是？",
            "options": {
              "A": "简约单调",
              "B": "通体光滑无纹路",
              "C": "粗糙简陋",
              "D": "雕刻精致、造型生动"
            },
            "correct": "D",
            "hint": "石狮子雕刻工艺细致，造型生动，是桥梁主要看点。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-rail.png",
            "imageOverrideAlt": "状元桥栏柱石狮子雕刻特写"
          },
          {
            "id": "TZ-JW-ZY-15",
            "type": "single",
            "dim": "单选 · 手摸 - 触感",
            "text": "触摸石狮雕刻表面，感受是？",
            "options": {
              "A": "纹路清晰、质地坚硬",
              "B": "松软易掉渣",
              "C": "湿滑油腻",
              "D": "大面积凹凸扎手"
            },
            "correct": "A",
            "hint": "石雕纹路清晰，石材本身坚硬稳固。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-rail.png",
            "imageOverrideAlt": "状元桥石狮雕刻表面纹路特写"
          }
        ],
        "treeMap": {
          "title": "状元桥·护栏",
          "nodes": [
            "眼看-形态：长长的",
            "眼看-形态：形态各异、雕刻精致",
            "手摸-触感：雕刻纹路清晰、质地坚硬"
          ]
        },
        "write": {
          "id": "ZHUANGYUANQIAO-WB2",
          "prompt": "概括护栏与石狮子的特点。",
          "requirement": "完整包含树形图所有感知点，语句通顺；仅做基础语句衔接，不随意编造内容。",
          "points": [
            "眼看-形态：长长的",
            "眼看-形态：形态各异、雕刻精致",
            "手摸-触感：雕刻纹路清晰、质地坚硬"
          ],
          "reference": "桥梁两侧护栏长长的，规整大气。栏柱顶端立有石狮子，它们形态不一、雕刻精致，石面纹路清晰且质地坚硬。"
        }
      },
      {
        "id": "unit-3",
        "name": "桥身",
        "color": "#84C7F2",
        "questions": [
          {
            "id": "TZ-JW-ZY-16",
            "type": "single",
            "dim": "单选 · 眼看 - 形状",
            "text": "状元桥的主体结构是？",
            "options": {
              "A": "平直平板桥",
              "B": "多拱连体桥",
              "C": "单孔石拱结构",
              "D": "钢架桥梁"
            },
            "correct": "C",
            "hint": "状元桥为典型单孔石拱桥。"
          },
          {
            "id": "TZ-JW-ZY-17",
            "type": "single",
            "dim": "单选 · 眼看 - 颜色",
            "text": "桥身主体颜色是？",
            "options": {
              "A": "深灰发黑",
              "B": "浅米白色（汉白玉原色）",
              "C": "土黄色",
              "D": "暗红色"
            },
            "correct": "B",
            "hint": "汉白玉天然色泽为浅米白色。"
          },
          {
            "id": "TZ-JW-ZY-19",
            "type": "single",
            "dim": "单选 · 手摸 - 触感",
            "text": "桥身石材表面触感是？",
            "options": {
              "A": "粗糙不平",
              "B": "湿滑发黏",
              "C": "松软易变形",
              "D": "平整厚实"
            },
            "correct": "D",
            "hint": "桥身石面平整，石材厚实坚固。"
          }
        ],
        "treeMap": {
          "title": "状元桥·桥身",
          "nodes": [
            "眼看-形状：单孔石拱",
            "眼看-颜色：浅米白色",
            "手摸-触感：表面平整、石材厚实"
          ]
        },
        "write": {
          "id": "ZHUANGYUANQIAO-WB3",
          "prompt": "概括桥身的特点。",
          "requirement": "完整包含树形图所有感知点，语句通顺；仅做基础语句衔接，不随意编造内容。",
          "points": [
            "眼看-形状：单孔石拱",
            "眼看-颜色：浅米白色",
            "手摸-触感：表面平整、石材厚实"
          ],
          "reference": "护栏下方的桥身为单孔石拱结构，通体呈浅米白色，石面平整厚实。"
        }
      },
      {
        "id": "unit-4",
        "name": "桥洞",
        "color": "#FFD166",
        "questions": [
          {
            "id": "TZ-JW-ZY-20",
            "type": "single",
            "dim": "单选 · 眼看 - 形状",
            "text": "桥洞整体形状是？",
            "options": {
              "A": "标准方形",
              "B": "三角形",
              "C": "椭圆形拱状",
              "D": "细长条状"
            },
            "correct": "C",
            "hint": "单孔拱桥的桥洞呈现椭圆形拱状。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-arch.png",
            "imageOverrideAlt": "状元桥单孔石拱桥洞特写"
          },
          {
            "id": "TZ-JW-ZY-24",
            "type": "single",
            "dim": "单选 · 眼看 - 作用",
            "text": "桥的主要作用是？",
            "options": {
              "A": "装点风景，美化湖畔环境",
              "B": "横跨湖面，方便行人通行",
              "C": "遮挡阳光，降低周围温度",
              "D": "积蓄湖水，调节水域水位"
            },
            "correct": "B",
            "hint": "桥梁修建在湖面之上，核心作用是连接两岸，方便行人往来通行。",
            "imageOverride": "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/scenery/zhuangyuanqiao-arch.png",
            "imageOverrideAlt": "状元桥桥身和桥洞连接两岸的特写"
          }
        ],
        "treeMap": {
          "title": "状元桥·桥洞",
          "nodes": [
            "眼看-形状：椭圆形拱状",
            "眼看-作用：连接两岸，方便行人往来通行。"
          ]
        },
        "write": {
          "id": "ZHUANGYUANQIAO-WB4",
          "prompt": "概括桥洞的特点。",
          "requirement": "完整包含树形图所有感知点，语句通顺；仅做基础语句衔接，不随意编造内容。",
          "points": [
            "眼看-形状：椭圆形拱状",
            "眼看-作用：连接两岸，方便行人往来通行。"
          ],
          "reference": "桥身正下方是椭圆形的桥洞，整个桥连接两岸，方便行人往来通行。"
        }
      }
    ]
  },
  "typeC": {
    "totalTreeMap": {
      "object": "状元桥",
      "order": "由上到下",
      "overview": "状元桥主要由桥面、护栏、桥身、桥洞四个部分组成。",
      "units": [
        {
          "name": "桥面",
          "color": "#F5A2BC",
          "nodes": [
            "眼看-形状：中间高、两端低的拱形坡面有台阶",
            "手摸-触感：表面平整、质地坚硬"
          ],
          "overview": "桥面为中间高、两端低的拱形坡面设有台阶，石面平整坚硬。"
        },
        {
          "name": "护栏",
          "color": "#88D8B0",
          "nodes": [
            "眼看-形态：长长的",
            "眼看-形态：形态各异、雕刻精致",
            "手摸-触感：雕刻纹路清晰、质地坚硬"
          ],
          "overview": "桥梁两侧护栏长长的，规整大气。栏柱顶端立有石狮子，它们形态不一、雕刻精致，石面纹路清晰且质地坚硬。"
        },
        {
          "name": "桥身",
          "color": "#84C7F2",
          "nodes": [
            "眼看-形状：单孔石拱",
            "眼看-颜色：浅米白色",
            "手摸-触感：表面平整、石材厚实"
          ],
          "overview": "护栏下方的桥身为单孔石拱结构，通体呈浅米白色，石面平整厚实。"
        },
        {
          "name": "桥洞",
          "color": "#FFD166",
          "nodes": [
            "眼看-形状：椭圆形拱状",
            "眼看-作用：连接两岸，方便行人往来通行。"
          ],
          "overview": "桥身正下方是椭圆形的桥洞，整个桥连接两岸，方便行人往来通行。"
        }
      ]
    },
    "essay": {
      "id": "ZHUANGYUANQIAO-WC",
      "title": "写一写：状元桥",
      "order": "由上到下",
      "requirements": [
        "按照由上到下的顺序组织内容。",
        "完整包含树形总图中的主要感觉点。",
        "语句通顺，主要做基础衔接，不随意编造。",
        "不少于 120 字。"
      ],
      "rubric": [
        "组成完整（30 分）：写清对象组成或场景单元。",
        "顺序正确（30 分）：符合指定观察顺序。",
        "感觉点准确（30 分）：覆盖树形图中的主要感觉点。",
        "语句通顺（10 分）：表达连贯，无明显病句。"
      ],
      "sample": "状元桥是一座修建在湖面上的石拱桥，主要由桥面、护栏、桥身、桥洞四个部分组成。\n桥面为中间高、两端低的拱形坡面设有台阶，石面平整坚硬。\n桥梁两侧护栏长长的，规整大气。栏柱顶端立有石狮子，它们形态不一、雕刻精致，石面纹路清晰且质地坚硬。\n护栏下方的桥身为单孔石拱结构，通体呈浅米白色，石面平整厚实。\n桥身正下方是椭圆形的桥洞，整座桥梁横跨湖面，连通水域两岸，主要方便行人往来通行。"
    }
  }
};
