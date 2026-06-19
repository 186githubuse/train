# 架构文档

## 概述

杨老师感觉训练营是一个面向1-12年级学生的写作感知力培养应用，采用纯原生Web技术栈，无框架、无构建工具，通过10节基础课程和6大类专题训练帮助学生掌握"用感觉写作文"的方法。

## 技术架构

### 核心设计原则

1. **零依赖**：纯原生HTML/CSS/JavaScript，无npm包，无构建步骤
2. **懒加载**：视图按需加载，首屏快速
3. **响应式**：移动优先，PC/iPad横屏优化
4. **状态集中**：单一localStorage持久化

### 技术栈

- **前端框架**：无（纯原生ES Module）
- **样式**：Tailwind CSS (CDN) + 自定义CSS（马卡龙液态玻璃风格）
- **路由**：自实现懒加载路由（`js/router.js`）
- **状态管理**：单例Store + localStorage（`js/store.js`）
- **图标**：Phosphor Icons Web Components (CDN)
- **动画**：canvas-confetti (CDN)

### 目录结构

```
├── index.html                # 入口 + DOM shell
├── css/
│   ├── style.css            # 全局样式（色系、布局、动画）
│   ├── components.css       # 通用组件
│   └── views/               # 视图独立样式
├── js/
│   ├── main.js              # 应用初始化
│   ├── router.js            # 路由系统
│   ├── store.js             # 状态管理
│   ├── config.js            # API配置（未提交git）
│   ├── tts.js / sfx.js      # 音效系统
│   └── data/
│       ├── lessons.js       # 10节课定义
│       ├── courseLogic.js   # 教学逻辑
│       ├── questions/       # 基础题库（297题）
│       └── topics/          # 专题题库（288道选择题 + A/B/C书写任务）
└── views/
    ├── trainingCamp.js      # 训练营主页
    ├── quiz.js              # 基础答题
    ├── topicQuiz.js         # 专题答题
    ├── topicCompose.js      # 专题写作 + AI评分
    └── ...                  # 其他视图
```

## 核心模块

### 1. 路由系统（router.js）

**职责：**
- 视图注册与懒加载
- 导航历史管理
- 底部导航高亮同步

**关键API：**
```javascript
window.__router.navigate(viewName, params, pushHistory)
window.__router.goBack()
```

**视图注册表：**
```javascript
const VIEW_MAP = {
  onboarding:    () => import('../views/onboarding.js').then(m => m.renderOnboarding),
  trainingCamp:  () => import('../views/trainingCamp.js').then(m => m.renderTrainingCamp),
  // ... 11个视图
}
```

### 2. 状态管理（store.js）

**数据结构：**
```javascript
{
  schemaVersion: 4,
  user: { grade, abilityIndex, name, totalStars },
  lessonProgress: { [lessonId]: { passed, stars, xp, ... } },
  mistakes: [{ id, lessonId, questionId, ... }],
  challengeRecords: [{ score, accuracy, ... }],
  _session: null  // 临时会话，不持久化
}
```

**核心方法：**
- `getUser()` / `setUserProfile(name, grade)`
- `getProgress(lessonId)` / `updateProgress(lessonId, delta)`
- `addMistake(mistakeData)` / `clearMistake(mistakeId)`
- `startSession(lessonId, questions)` / `endSession()`

### 3. 课程系统（lessons.js + courseLogic.js）

**10节课结构：**
```javascript
{
  id: 1,
  title: "什么是感觉",
  icon: "eye",
  colorClass: "macaron-rose",
  videoUrl: "https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/lesson1.mov",
  totalXp: 30,
  ...
}
```

**教学逻辑（courseLogic.js）：**
- 15个感觉点定义
- 引用诗句库
- 知识点核心内容

### 4. 题库系统

**基础训练（297题）：**
- 分布：10个知识点 × (D1 10题 + D2 10题 + D3 学段题10题)
- 编码：`K1-D1-01` / `K1-D3-S01`（知识点-难度-学段-序号）
- 题型：single（单选）/ multi（多选）/ judge（判断）/ link（连线）

**专题训练（288道选择题 + A/B/C书写任务）：**
- 6大类：静物/植物/动物/景物/人物/事件
- 已开放：静物3个 + 植物3个 + 动物5个 + 景物2个 = 13个子内容
- 统一结构：所有开放子内容均为 `schema:'unit'` 单元模块化「边学边写」
- 流程：A类选择题+组成书写 → B类单元选择题+分段书写 → C类综合书写
- 暂未开放：人物/事件

### 5. AI系统（topicAI.js）

**功能：**
1. LLM评分（comfly + gpt-4o-mini）
2. OCR识别（itlsj + gemini-3-flash）
3. 评分维度：组成完整/顺序正确/感觉点准确/语句通顺（30/30/30/10）

**安全注意：**
- API密钥当前在`config.js`（未提交git）
- ⚠️ 上线前必须迁移到后端代理

### 6. 音效系统（tts.js + sfx.js）

**TTS语音：**
- 提供商：MiniMax
- 音色：女声 female-tianmei
- 触发：答对、通过、等待场景

**音效：**
- 5个免费音效（Pixabay）
- 撒花动画：canvas-confetti

## 响应式设计

### 移动端（<768px）
- 竖向布局
- 单列卡片
- 底部导航栏

### 平板（768px-1023px）
- 居中420px卡片
- 底部导航栏保留

### PC/iPad横屏（≥1024px）
**v2.0布局（2026-06-15）：**
- 左侧196px竖向导航栏（由底部导航变形）
- 右侧820px内容卡片（onboarding自动扩宽到1000px）
- **训练营页面**：
  - 基础训练：2列网格（移除竖向闯关地图）
  - 专题训练：3列网格
- **onboarding页面**：
  - 欢迎页：IP左 + 特性右
  - 表单页：IP左 + 表单右
- **色彩优化**：马卡龙饱和度降低15-20%

### 超宽屏（≥1440px）
- 内容卡片扩至880px
- onboarding扩至1200px

## 数据流

```
用户交互 → View组件
    ↓
调用 Store API
    ↓
更新内存 _state
    ↓
持久化到 localStorage
    ↓
返回新状态
    ↓
View重新渲染
```

**关键点：**
- 所有mutating操作立即`_save()`
- `_session`字段不持久化
- Schema版本控制（当前v4）

## 部署架构

### 正式环境
- **域名**：https://train.tybqcloud.com
- **服务器**：阿里云ECS（39.96.194.18）
- **Web服务器**：Nginx
- **部署方式**：SSH + git pull

### 测试环境（自动部署）
1. EdgeOne Pages（腾讯云）
2. Vercel
3. GitHub Pages

### 发版流程
```bash
# 本地提交
git push origin main

# SSH到ECS
ssh root@39.96.194.18

# 拉取最新代码
cd /www/wwwroot/train.tybqcloud.com
git pull
```

## 性能优化

1. **懒加载**：视图按需import()
2. **CDN缓存**：Tailwind + Phosphor Icons + canvas-confetti
3. **localStorage**：避免服务器请求
4. **CSS版本号**：破缓存机制（`?v=20260615b`）

## 安全考虑

⚠️ **当前风险（上线前必须解决）：**

1. **API密钥暴露**：
   - 问题：comfly + itlsj密钥在前端`config.js`
   - 方案：阿里云函数计算FC代理

2. **localStorage限制**：
   - 问题：5MB上限，跨设备不同步
   - 方案：接入云数据库（MySQL + Node.js后端）

3. **XSS防护**：
   - 已实现：所有用户输入通过`escHtml()`转义

## 扩展性

### 新增视图
1. 在`views/`创建`newView.js`，导出`renderNewView(params)`
2. 在`router.js`的`VIEW_MAP`注册
3. 在`css/views/`创建样式文件

### 新增题库
1. 基础训练：在`js/data/questions/`添加题目
2. 专题训练：在`js/data/topics/`添加子内容
3. 更新题号编码规则

### 新增模块
当前app只实现了"感觉训练"模块，未来扩展：
- 思维训练
- 综合训练
- 同步作文

**扩展方式：** 待客户决策后，可能需要重构顶层导航结构。

## 浏览器兼容性

- **推荐**：Chrome/Safari/Edge（现代版本）
- **最低要求**：支持ES Module的浏览器
- **不支持**：IE11及以下

## 技术债务

1. ⚠️ API密钥前端暴露（优先级：高）
2. ⚠️ localStorage容量限制（优先级：高）
3. K2-D1-04题目内容缺失（优先级：低）

## 相关文档

- [开发指南](development.md)（待创建）
- [部署手册](deployment.md)（待创建）
- [API文档](api.md)（待创建）
