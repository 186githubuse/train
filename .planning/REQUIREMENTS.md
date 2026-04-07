# Requirements: 杨老师感觉训练写作营

**Defined:** 2026-04-08
**Core Value:** 学生能通过闯关答题感受到"用感觉写作文"的方法，并用魔法机器把自己的感觉素材变成一篇作文。

## v1 Requirements

### Security（安全）

- [ ] **SEC-01**: API 密钥从客户端代码中移除，`js/config.js` 删除，AI 调用通过 CloudBase 云函数代理
- [ ] **SEC-02**: 两个 API 密钥（Claude、Gemini）立即 rotate，git 历史中的旧密钥作废
- [ ] **SEC-03**: AI 生成内容（魔法机器作文）在云函数层加内容安全过滤，适配6-12岁用户
- [ ] **SEC-04**: `store.isUnlocked()` 的 `return true` 改为 `DEV_MODE` 开关控制，生产环境恢复顺序解锁

### Compliance（合规）

- [ ] **COMP-01**: 页脚显示 ICP 备案号（备案完成后填入）
- [ ] **COMP-02**: 隐私政策页面（说明数据收集范围、存储方式、用户权利）
- [ ] **COMP-03**: 用户协议页面（服务条款，注册时需勾选同意）

### Cloud Infrastructure（云端基础设施）

- [ ] **CLOUD-01**: 接入 CloudBase JS SDK（CDN 引入，无需构建），替换 localStorage 账号系统为手机号 SMS 登录
- [ ] **CLOUD-02**: 学习进度、积分、错题本数据同步到 CloudBase 数据库
- [ ] **CLOUD-03**: 首次登录时执行 `migrateIfNeeded(uid)`：将 localStorage 数据迁移到云端（远端有数据则拉取，无数据则上传）
- [ ] **CLOUD-04**: CloudBase 数据库安全规则：用户只能读写自己的数据，禁止跨用户访问

### Bug Fixes（Bug 修复）

- [ ] **BUG-01**: 挑战赛防刷星星：每日首次完成才发放奖励，或按得分比例发放
- [ ] **BUG-02**: 错题本双重记录修复：`quiz.js` 不再直接调用 `store._addMistake()`，统一通过 `store.advanceSession()` 处理
- [ ] **BUG-03**: `trainingCamp.js` 事件监听器泄漏修复：Tab 切换前先 `removeEventListener`，防止多次绑定
- [ ] **BUG-04**: 能力指数初始化与年级解耦：统一初始值为 2.5，或按年级映射（1-3年级→1.5，4-6年级→2.5）

### Content（内容完善）

- [ ] **CONT-01**: 题库更新：客户审阅 Word 文档后，将修改同步到 `js/data/questions.js`
- [ ] **CONT-02**: 第4课、第10课视频替换为正式版（腾讯云 COS）
- [ ] **CONT-03**: 专题训练 5 个模块填充内容（静物/景物/动物/人/事），去掉"即将上线"占位

### Teacher Portal（教师端）

- [ ] **TEACH-01**: 教师只读看板：查看班级学生列表、各课完成情况、能力指数、积分排名
- [ ] **TEACH-02**: 教师账号注册/登录（独立于学生账号，角色区分）

### Launch Readiness（上线准备）

- [ ] **LAUNCH-01**: Tailwind CSS 和 Phosphor Icons 静态资源本地化，去掉 CDN 依赖
- [ ] **LAUNCH-02**: PWA manifest + service worker（cache-first，支持添加到主屏幕）
- [ ] **LAUNCH-03**: 生产环境硬化：隐藏 `window.__store`，移除调试入口，`DEV_MODE=false`
- [ ] **LAUNCH-04**: 低配安卓设备兼容性测试（目标：Android 8+，Chrome 80+）

## v2 Requirements

### Parental Features（家长端）

- **PARENT-01**: 家长只读视图：查看孩子的课程进度、准确率、勋章
- **PARENT-02**: 家长同意机制（PIPL 14岁以下用户需家长手机号验证）— 视用户年龄分布决定优先级

### Advanced Features（进阶功能）

- **ADV-01**: 微信登录（Open Platform OAuth）
- **ADV-02**: 学生作文导出（PDF/图片分享）
- **ADV-03**: 教师批量导入学生账号
- **ADV-04**: 挑战赛多人排行榜
- **ADV-05**: 后台管理端（内容管理、用户管理）

### Compliance（合规 v2）

- **COMP-V2-01**: AIGC 备案（生成式人工智能服务管理暂行办法）— 视法律咨询结果决定是否需要
- **COMP-V2-02**: 网络文化经营许可证 — 视教育内容分类决定

## Out of Scope

| Feature | Reason |
|---------|--------|
| 原生 App（iOS/Android） | Web 优先，上线验证后再考虑 |
| 实时多人对战 | 复杂度高，非核心价值 |
| 自动化测试套件 | 纯前端手动验证足够，无构建工具 |
| 视频制作/编辑 | 视频由外部团队提供 |
| 家长-教师 IM 聊天 | 合规负担高，非核心 |
| 算法推荐内容 | 未成年人保护法限制，风险高 |
| 应用内购买 | 商业模式未定，合规复杂 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |
| SEC-04 | Phase 1 | Pending |
| COMP-01 | Phase 1 | Pending |
| COMP-02 | Phase 1 | Pending |
| COMP-03 | Phase 1 | Pending |
| CLOUD-01 | Phase 2 | Pending |
| CLOUD-02 | Phase 2 | Pending |
| CLOUD-03 | Phase 2 | Pending |
| CLOUD-04 | Phase 2 | Pending |
| BUG-01 | Phase 3 | Pending |
| BUG-02 | Phase 3 | Pending |
| BUG-03 | Phase 3 | Pending |
| BUG-04 | Phase 3 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |
| TEACH-01 | Phase 4 | Pending |
| TEACH-02 | Phase 4 | Pending |
| LAUNCH-01 | Phase 5 | Pending |
| LAUNCH-02 | Phase 5 | Pending |
| LAUNCH-03 | Phase 5 | Pending |
| LAUNCH-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after initial definition*
