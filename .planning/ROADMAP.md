# Roadmap: 杨老师感觉训练写作营

**Milestone:** v1 上线
**Created:** 2026-04-08
**Phases:** 5

## Phase Overview

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | Security & Compliance Hardening | API 密钥安全代理 + 合规页面就位 | SEC-01, SEC-02, SEC-03, SEC-04, COMP-01, COMP-02, COMP-03 | Pending |
| 2 | Cloud Infrastructure | 用户数据从 localStorage 迁移到 CloudBase 云端 | CLOUD-01, CLOUD-02, CLOUD-03, CLOUD-04 | Pending |
| 3 | Bug Fixes & Content | 已知 Bug 修复 + 内容填充完整 | BUG-01, BUG-02, BUG-03, BUG-04, CONT-01, CONT-02, CONT-03 | Pending |
| 4 | Teacher Portal | 教师端账号与班级看板可用 | TEACH-01, TEACH-02 | Pending |
| 5 | Launch Readiness | 应用可离线访问、生产环境硬化、兼容目标设备 | LAUNCH-01, LAUNCH-02, LAUNCH-03, LAUNCH-04 | Pending |

## Phase Details

### Phase 1: Security & Compliance Hardening
**Goal:** API 密钥从客户端移除并通过云函数代理，合规页面（隐私政策、用户协议、ICP 备案号）在应用内可访问
**Depends on:** Nothing (first phase)
**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04, COMP-01, COMP-02, COMP-03
**Success Criteria:**
1. 用户打开应用，浏览器开发者工具中找不到任何 API 密钥明文
2. 魔法机器生成作文功能正常，AI 调用经由云函数代理完成
3. 注册页面显示用户协议勾选框，未勾选无法完成注册
4. 应用底部或设置页可访问隐私政策和 ICP 备案号页面
**Plans:** TBD
**UI hint:** yes

### Phase 2: Cloud Infrastructure
**Goal:** 用户可用手机号注册/登录，学习进度和积分数据保存在云端，换设备后数据不丢失
**Depends on:** Phase 1
**Requirements:** CLOUD-01, CLOUD-02, CLOUD-03, CLOUD-04
**Success Criteria:**
1. 用户用手机号 + 短信验证码完成注册和登录
2. 用户完成一节课后，清除浏览器缓存重新登录，进度数据仍然存在
3. 用户在新设备登录，历史学习数据自动从云端拉取
4. 用户 A 无法通过任何方式读取或修改用户 B 的数据
**Plans:** TBD

### Phase 3: Bug Fixes & Content
**Goal:** 已知 Bug 全部修复，题库和视频内容为客户审阅后的正式版，专题训练模块内容可用
**Depends on:** Phase 2
**Requirements:** BUG-01, BUG-02, BUG-03, BUG-04, CONT-01, CONT-02, CONT-03
**Success Criteria:**
1. 挑战赛每日只发放一次星星奖励，重复完成不再刷分
2. 错题本中每道错题只出现一次，不存在重复记录
3. 专题训练 5 个模块（静物/景物/动物/人/事）均有实际内容，无"即将上线"占位
4. 第 4 课和第 10 课播放正式视频，题库内容与客户审阅后的 Word 文档一致
**Plans:** TBD
**UI hint:** yes

### Phase 4: Teacher Portal
**Goal:** 教师可用独立账号登录，查看班级学生的课程完成情况和能力指数排名
**Depends on:** Phase 2
**Requirements:** TEACH-01, TEACH-02
**Success Criteria:**
1. 教师用独立账号注册/登录，与学生账号角色区分，无法进入学生答题流程
2. 教师登录后可看到班级学生列表，包含各课完成状态、能力指数和积分排名
**Plans:** TBD
**UI hint:** yes

### Phase 5: Launch Readiness
**Goal:** 应用支持离线访问和添加到主屏幕，生产环境无调试入口，在 Android 8+ / Chrome 80+ 设备上正常运行
**Depends on:** Phase 3, Phase 4
**Requirements:** LAUNCH-01, LAUNCH-02, LAUNCH-03, LAUNCH-04
**Success Criteria:**
1. 断网状态下打开应用，已缓存的页面和资源正常加载
2. 用户可将应用添加到手机主屏幕，图标和启动画面正常显示
3. 生产环境中 `window.__store` 不可访问，控制台无调试日志
4. 在 Android 8 + Chrome 80 真机上完整走通注册 → 答题 → 魔法机器流程无崩溃
**Plans:** TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Security & Compliance Hardening | 0/? | Not started | - |
| 2. Cloud Infrastructure | 0/? | Not started | - |
| 3. Bug Fixes & Content | 0/? | Not started | - |
| 4. Teacher Portal | 0/? | Not started | - |
| 5. Launch Readiness | 0/? | Not started | - |
