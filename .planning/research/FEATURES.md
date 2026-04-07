# Feature Landscape: Production Launch

**Domain:** Chinese K12 education web app (小学生作文训练)
**Researched:** 2026-04-08
**Context:** All core learning features complete. Researching what's needed for production launch with ~5000 students, teachers, and parents.

---

## Table Stakes

Features that must exist before going live. Missing any of these = blocked launch or legal exposure.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| ICP 备案 | 法律要求，无备案域名被封 | Low (process, not code) | 已在进行中，备案完成才能上线 |
| 隐私政策页面 | PIPL 第17条强制要求 | Low | 必须在注册前展示并获得同意 |
| 家长/监护人同意机制 | PIPL 第31条：14岁以下用户数据必须获得家长同意 | Medium | 注册流程中加入家长手机号确认步骤 |
| 用户协议页面 | 标准合规要求 | Low | 注册时勾选同意 |
| 数据最小化收集 | PIPL 敏感数据规定 | Low | 只收集姓名/年级/手机号，不收集位置/设备指纹 |
| 账号注销功能 | PIPL 第47条：用户有权要求删除数据 | Medium | 注销后清除云端所有用户数据 |
| API 密钥后端代理 | 安全硬性要求，当前密钥暴露在 js/config.js | High | 上线前必须完成，否则密钥会被滥用 |
| 云端数据存储 | localStorage 5MB 上限，多设备无法同步 | High | 迁移至腾讯云 CloudBase |
| 教师端：班级学生进度总览 | 学校采购决策者（教师）的核心需求 | Medium | 无此功能教师无法向学校推荐 |
| 家长端：子女学习记录查看 | 家长付费意愿的核心驱动 | Medium | 查看完成课程数、答题正确率、获得勋章 |
| 内容安全：AI生成作文审核 | 《生成式人工智能服务管理暂行办法》要求 | Medium | 魔法机器输出需过滤违规内容 |
| 错误上报/反馈入口 | 小学生遇到问题无法自行解决，需要联系渠道 | Low | 简单的"问题反馈"按钮即可 |

---

## Differentiators

Features that set this app apart. Not expected by default, but create strong word-of-mouth.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 家长周报推送（微信模板消息） | 家长不用主动打开 App 就能了解孩子进度 | Medium | 腾讯云 CloudBase 支持微信模板消息 |
| 教师批量导入学生（Excel/CSV） | 学校部署时教师不用逐个注册，降低推广阻力 | Medium | 50人班级手动注册是不可接受的 |
| 班级排行榜（可选关闭） | 激发竞争动力，但需要家长可关闭选项 | Low | 用积分/星星排名，不显示真实姓名 |
| 学生作文导出（PDF/图片） | 家长可保存孩子作品，天然传播素材 | Low | 魔法机器生成的作文一键导出 |
| 教师布置作业功能 | 教师可指定学生完成特定课程，形成教学闭环 | High | v2 功能，v1 先做只读的进度查看 |
| 学习时长统计 | 家长关心孩子用了多少时间，不是只看分数 | Low | 每次会话记录开始/结束时间 |

---

## Anti-Features

Features to explicitly NOT build in v1.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| 学生自由文字输入（作文批改） | 内容审核成本极高，AIGC 合规复杂，小学生输入质量差 | 保持魔法机器的选项引导式输入（已验证的好决策） |
| 实时聊天/讨论区 | 未成年人社交功能触发额外监管（网络保护条例第三章） | 用静态评论展示代替，或完全不做 |
| 家长与教师之间的消息系统 | IM 功能需要单独的增值电信业务许可证 | 用微信群/家校通替代，App 只做学习数据 |
| 推荐算法/个性化内容推送 | 《未成年人网络保护条例》第40条限制向未成年人推送算法内容 | 固定课程顺序，不做个性化推荐 |
| 第三方广告 | 教育类 App 向未成年人投放广告违规 | 完全不接广告 |
| 微信/QQ 社交分享排名 | 可能引发攀比焦虑，家长投诉风险高 | 只做私下的个人成就展示 |
| 付费解锁内容（应用内购买） | 向未成年人直接收费需要家长二次确认，实现复杂 | 学校/机构统一采购，学生账号由教师开通 |

---

## Compliance Requirements (中国特有)

### 必须满足的法规

**PIPL（个人信息保护法）— 高置信度，已验证**
- 14岁以下用户的个人信息属于"敏感个人信息"，适用最严格规则
- 必须单独获得家长/监护人同意（不能与用户协议合并）
- 必须制定专门针对未成年人的个人信息处理规则
- 用户有权要求删除数据（账号注销功能）
- 收集前必须告知处理目的、方式、范围

**《生成式人工智能服务管理暂行办法》（2023年8月生效）— 中置信度**
- 使用 AI 生成内容（魔法机器）需要对输出内容负责
- 需要建立内容安全审核机制
- 若面向公众提供 AIGC 服务，服务提供者需在 CAC 备案（小规模内部使用可能豁免，需法律确认）

**《未成年人网络保护条例》（2024年1月生效）— 中置信度，基于训练数据**
- 禁止向未成年人推送算法个性化内容
- 网络服务提供者不得诱导未成年人沉迷
- 家长有权查看子女使用记录

**ICP 备案 — 高置信度**
- 在中国大陆服务器托管的网站必须完成 ICP 备案
- 教育类内容可能需要额外的 EDU 资质（需确认是否适用于非学历教育）
- 备案完成前不能正式对外运营

---

## Feature Dependencies

```
ICP备案 → 正式上线（备案是前提）
家长同意机制 → 云端账号系统（localStorage 无法跨设备验证家长身份）
云端数据存储 → 教师端/家长端（没有云端就没有多端数据共享）
API密钥后端代理 → 魔法机器上线（密钥暴露不能上线）
教师端进度查看 → 学校采购决策（教师看不到数据就不会推荐给学校）
```

---

## MVP Launch Recommendation

**Phase 1（上线最低要求）：**
1. ICP 备案完成
2. 隐私政策 + 用户协议页面
3. 家长手机号确认（注册时）
4. API 密钥迁移到后端代理
5. 云端数据存储（CloudBase）
6. 账号注销功能
7. 内容安全过滤（魔法机器输出）

**Phase 2（上线后 30 天内）：**
1. 教师端：班级学生进度总览（只读）
2. 家长端：子女学习记录查看（只读）
3. 学生作文导出（PDF/图片）
4. 错误反馈入口

**Defer（v2）：**
- 教师布置作业功能（复杂度高，先验证用户粘性）
- 家长周报微信推送（需要微信公众号/小程序资质）
- 批量导入学生（先手动注册验证规模需求）

---

## What Chinese School Apps Commonly Get Wrong at Launch

### 1. 家长同意走过场
注册时只有一个"我已阅读并同意"勾选框，没有真正验证家长身份。PIPL 要求的是家长的"单独同意"，不是学生代替家长点击。实践中：注册时要求填写家长手机号并发送验证码。

### 2. 隐私政策是复制粘贴的模板
监管机构会检查隐私政策是否与实际数据处理行为一致。如果政策说"不收集位置信息"但代码里有 `navigator.geolocation`，就是违规。

### 3. API 密钥暴露导致费用爆炸
客户端硬编码 AI API 密钥是最常见的上线事故。上线第一天就可能被爬虫扫描到，导致 API 费用暴增。这个项目当前就是这个状态（`js/config.js`），必须在上线前解决。

### 4. 没有教师端就进学校
学校采购决策者是教师，不是学生或家长。教师需要看到"我的学生用了这个，效果如何"。没有教师端的教育 App 很难进入学校渠道。

### 5. 数据迁移没有过渡期
从 localStorage 切换到云端时，如果没有迁移逻辑，测试期间学生积累的进度数据会全部丢失。需要在首次登录云端账号时，将本地数据上传合并。

### 6. 忽略弱网环境
小学生用的设备和网络质量参差不齐。AI 生成作文（魔法机器）在弱网下超时没有友好提示，会让学生以为 App 坏了。需要明确的加载状态和超时重试机制。

### 7. 内容审核缺失导致舆情
AI 生成的作文偶尔会产生不适合小学生的内容。没有内容过滤直接展示给学生，一旦出现问题会引发家长投诉甚至媒体报道。

---

## Sources

- PIPL Article 31 (minors under 14): Stanford DigiChina translation — HIGH confidence
- PIPL sensitive data classification (Article 28): Wikipedia PIPL entry — HIGH confidence
- 《生成式人工智能服务管理暂行办法》: Training data — MEDIUM confidence (verify current enforcement scope)
- 《未成年人网络保护条例》2024: Training data — MEDIUM confidence (verify specific article numbers)
- ICP 备案要求: Training data + domain knowledge — HIGH confidence (well-established requirement)
- Teacher/parent feature expectations: Domain knowledge from Chinese edtech market — MEDIUM confidence
- Common launch mistakes: Domain knowledge + pattern analysis — MEDIUM confidence
