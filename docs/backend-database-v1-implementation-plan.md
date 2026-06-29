# 后台数据库 V1 实施方案

## 1. 背景与目标

当前“杨老师感觉训练写作营”已经是可用的纯前端原生 Web App，核心学习流程、专题训练、错题本、学习报告都已经稳定运行。现阶段所有学生数据主要保存在浏览器 `localStorage`，核心 key 为 `ganjue_training_state`，由 `js/store.js` 统一管理，当前 `schemaVersion` 为 4。

这带来三个现实问题：

1. 学生换设备或清缓存后，学习记录会丢失。
2. 老师和运营无法在后台集中查看学生学习进度、错题情况和专题作文。
3. 上线到正式环境后，继续完全依赖本地存储，不利于账号体系、数据备份和后续扩展。

因此，后台数据库 V1 的目标不是推翻现有前端，也不是一次性把整个系统重写成前后端分离，而是：

- 在现有纯前端 App 之上，补一层“账号 + 云端同步 + 管理后台”；
- 保留 `localStorage` 作为前端运行时缓存和离线兜底；
- 让现有 `store.js` 能逐步演进为“本地状态 + 云端同步状态”的结构，而不是让所有页面立刻重写；
- 为后续 Node.js API、MySQL、ECS 部署和教师后台开发提供可直接落地的蓝图。

## 2. 设计原则

### 2.1 V1 的基本定位

V1 是“云端账号与学习数据同步底座”，不是完整教务系统，也不是 CMS。

### 2.2 不重写前端

现有前端仍然按原生 HTML/CSS/JS 运行，页面层尽量不感知数据库细节。优先把变化收敛在以下位置：

- `views/onboarding.js`：从本地账号模拟切到真实登录/注册 API；
- `js/store.js`：补充云端同步状态、同步时间戳、脏数据标记、合并逻辑；
- 少量数据提交点：基础答题、错题复测、挑战赛、专题作文提交后触发同步。

### 2.3 localStorage 继续保留

保留本地存储的原因不是“过渡一下”，而是它在 V1 里仍有明确职责：

- 页面渲染时的首屏数据来源；
- 离线情况下的继续学习能力；
- 接口偶发失败时的兜底缓存；
- 云端数据首次接入时的历史数据迁移来源。

### 2.4 服务端不信任客户端

未来所有同步接口都必须把前端视为不可信输入：

- 不能相信客户端传来的 `userId` 直接落库；
- 不能允许前端随意读取其他学生数据；
- 进度、星星、错题状态等都要按登录身份校验数据归属。

这也是本方案对 threat model 中 T-quick-260629-02 的直接落实。

## 3. V1 功能范围

## V1 功能范围

V1 必做范围如下。

### 3.1 学生账号体系

支持最小可用的学生账号体系：

- 学生注册/创建账号；
- 学生登录并获取会话凭证；
- 学生登录后绑定自己的云端学习档案；
- 支持至少一个基础身份字段集合：姓名、手机号或账号、年级。

说明：V1 不追求复杂登录方式，先满足“同一学生跨设备找回自己的学习记录”。

### 3.2 学习数据云端同步

把现有 `store.js` 中以下核心数据纳入同步范围：

- `user`
- `lessonProgress`
- `mistakes`
- `challengeRecords`
- 专题作文/分段书写记录
- 必要的同步元数据

### 3.3 后台管理最小闭环

提供给管理员/老师查看的最小后台能力：

- 学生列表；
- 学生详情；
- 学习进度总览；
- 错题记录查看；
- 专题作文/评分记录查看；
- 基础数据概览。

### 3.4 ECS 单机部署方案

基于现有 `train.tybqcloud.com` 所在 ECS，规划同机部署：

- nginx 继续服务当前静态前端；
- 新增 Node.js API 服务；
- 新增 MySQL 数据库；
- 配置日志、备份、回滚和进程守护。

## 4. V1 暂不做

## 暂不做

为了避免范围蔓延，以下能力明确不放进 V1：

1. 不做训练内容管理系统（课程、题库、专题内容仍由现有前端静态文件维护）。
2. 不做实时协作、多人同时编辑作文、教师在线批改工作流。
3. 不做复杂学校/机构多租户架构。
4. 不做家长端、小程序端、独立教师端 App。
5. 不做全量历史行为埋点分析平台。
6. 不做消息中心、短信服务、找回密码自动化闭环。
7. 不做本次前端技术栈重构，不引入框架、构建工具或 SSR。
8. 不做完整安全改造大项目；但会在本方案中明确数据库密码、API key、鉴权、最小权限和代理边界。
9. 不做 AI 密钥代理的完整实施，只在部署与安全章节说明其必须与后台方案协同。

## 5. 当前前端数据边界

现有前端运行边界建议保持如下：

| 层级 | 当前职责 | V1 后职责 |
|---|---|---|
| `views/*.js` | 渲染页面、收集用户输入 | 基本不变，只改调用数据入口 |
| `js/store.js` | 本地状态与 `localStorage` 持久化 | 本地状态 + 同步元数据 + 合并入口 |
| `localStorage` | 唯一持久化来源 | 本地缓存、离线兜底、迁移来源 |
| Node.js API | 无 | 账号、鉴权、同步、后台查询 |
| MySQL | 无 | 学生主档案、学习记录、后台查询数据 |

V1 的关键边界结论：

- 前端继续以本地状态驱动 UI；
- 云端负责权威存档、跨设备同步和后台查询；
- 不要求每次点击都实时写库，但关键学习事件必须可同步；
- 不把服务端查询模型直接泄露给前端页面。

## 6. localStorage 兼容同步策略

## localStorage 兼容同步策略

本章节是 V1 的核心。目标是让现有 `ganjue_training_state` 平滑进入云端，而不是让学生清空重来。

### 6.1 本地数据继续保留的字段

以下字段在 V1 仍保留本地兜底：

- `schemaVersion`
- `user`
- `lessonProgress`
- `mistakes`
- `challengeRecords`
- `_session`（仅本地，不上云）
- 新增同步字段，例如：
  - `syncMeta.lastSyncAt`
  - `syncMeta.lastPullAt`
  - `syncMeta.pendingEvents`
  - `syncMeta.deviceId`
  - `syncMeta.cloudUserId`
  - `syncMeta.cloudRevision`

建议将 `_session` 明确保持为本地临时态，不进入云端，以免跨设备恢复出无意义的半题会话。

### 6.2 首次登录时机与上传策略

**触发时机：**
- 学生在新版本前端首次成功登录；
- 且本地存在 `ganjue_training_state`；
- 且本地尚未绑定 `syncMeta.cloudUserId`。

**处理步骤：**
1. 前端读取本地完整状态。
2. 调用 `POST /api/v1/sync/bootstrap` 上传本地快照。
3. 服务端根据登录身份建立云端档案，并返回：
   - `cloudUserId`
   - 服务端接受后的标准化用户数据
   - `cloudRevision`
   - `serverTime`
4. 前端将返回结果合并回本地，并写入 `syncMeta`。

**冲突处理：**
- 若该账号云端没有历史数据：以本地数据为初始化来源。
- 若云端已有数据但本地也有数据：以“更完整优先 + 时间更新优先”的合并规则执行，具体如下：
  - `user`：以云端账号主档案为准，年级等学生基础字段若本地为空可用云端补齐；
  - `lessonProgress`：同一课按“更高星级、已通关优先、XP 取更大值、视频已看取 OR、轮次取更优记录”；
  - `mistakes`：按 `questionId + status` 合并，保留时间更新更晚和 `reviewStreak` 更高的记录；
  - `challengeRecords`：按本地临时 ID 或时间戳去重后并集保留；
  - 专题作文记录：按 `topicId + subId + taskType + createdAt` 去重，保留全部历史。

**失败兜底：**
- `bootstrap` 失败时，前端继续使用本地数据，不清空、不覆盖；
- 在 `syncMeta.pendingEvents` 中记录“待首次同步”；
- 下次登录成功、页面进入训练营、或用户主动点击“同步数据”时再次重试。

### 6.3 日常下发与合并策略

**触发时机：**
- 登录成功后；
- App 冷启动时且已有有效登录态；
- 从后台页返回训练页时可选触发轻量刷新；
- 用户主动下拉刷新或点击“同步”按钮时。

**处理步骤：**
1. 前端先从 `localStorage` 渲染首屏。
2. 后台异步请求 `GET /api/v1/me/state` 或增量同步接口。
3. 获取云端状态后执行字段级合并。
4. 合并成功后覆盖本地缓存，并更新 `lastPullAt` / `cloudRevision`。

**冲突处理：**
- 若本地有未上云的 `pendingEvents`，先上送再拉取；
- 若拉取时发现服务端版本更新，但本地也有未同步改动，则以事件重放方式合并，不直接用云端全量覆盖；
- 若检测到同一条记录云端和本地都改了：
  - `lessonProgress` 使用字段级最大/最优策略；
  - `mistakes` 以 `status='cleared'` 优先于 `open`，`reviewStreak` 取更高，`timestamp` 取更新；
  - `user.totalStars` 不以客户端数字直接覆盖，应由服务端按规则汇总生成，防止篡改；
  - 作文记录只追加，不做覆盖。

**失败兜底：**
- 拉取失败时保留当前本地缓存继续运行；
- 页面只提示“云端同步失败，当前使用本地数据”；
- 不阻塞做题、查看错题本、查看报告。

### 6.4 本地修改上送策略

**触发时机：**
- 完成课时通关后；
- 错题新增、错题复测状态变化后；
- 挑战赛提交后；
- 专题分段书写或作文评分完成后；
- 修改个人资料后。

**处理步骤：**
1. 先正常写入本地 `store.js`，保证现有前端行为不变。
2. 同时生成一条或多条 `pendingEvents`，例如：
   - `lesson_progress_upsert`
   - `mistake_upsert`
   - `mistake_review_update`
   - `challenge_record_create`
   - `topic_composition_create`
3. 在页面空闲时、离开当前流程前、或定时批量调用同步接口上送。

**冲突处理：**
- 事件必须带 `deviceId`、本地事件 ID、事件时间、对象主键，服务端按幂等键去重；
- 已被服务端确认的事件，从 `pendingEvents` 移除；
- 若同一事件重复发送，服务端返回已处理即可。

**失败兜底：**
- 接口失败时事件继续留在本地队列；
- 下次联网、重新进入页面、重新登录时重试；
- 不因同步失败而回滚学生刚完成的本地学习结果。

### 6.5 离线策略

**触发时机：** 浏览器离线、接口超时、ECS API 服务短暂不可用。

**行为规则：**
- 登录后的已缓存学生可继续学习；
- 新学习数据先只落本地并进入 `pendingEvents`；
- 进入需要后台实时查询的页面时，优先显示本地最后一次同步结果；
- 若完全没有本地缓存且必须登录后才能继续，可提示联网登录。

**失败兜底：**
- 离线期间不清空数据；
- 恢复在线后自动尝试同步；
- 若连续三次同步失败，提示用户稍后重试，但学习流程仍可继续。

### 6.6 schemaVersion 演进策略

当前 `store.js` 为 `schemaVersion: 4`，且版本不匹配会清空 `localStorage`。这对接入云端后风险过高，因此 V1 建议：

1. 将未来 schemaVersion 升级为 5。
2. 把“版本不匹配立即清空”改为“迁移优先、无法迁移才降级兜底”。
3. 新增本地迁移函数，例如：
   - v4 -> v5：补 `syncMeta`、补作文记录字段、补云端映射字段；
   - 若迁移失败，保留原始快照到 `ganjue_training_state_backup` 后再回退默认状态。
4. 服务端单独维护 `cloud_schema_version`，不要强绑定前端版本号。

**触发时机：** 前端加载 store 时。

**冲突处理：**
- 本地 schema 旧但云端数据可用：先拉云端，再尝试迁移本地；
- 本地 schema 新但云端字段少：服务端按兼容字段返回，不让老字段阻塞前端。

**失败兜底：**
- 迁移失败先备份本地原始 JSON，再提示“本地数据结构升级失败，已保留备份”；
- 若用户已登录且云端有档案，可从云端恢复基本数据。

## 7. 数据模型总览

建议 V1 数据分三层：

1. **账户层**：学生账号、管理员/教师账号、登录会话；
2. **学习状态层**：课程进度、错题记录、挑战记录、专题作文记录；
3. **同步治理层**：同步日志、事件幂等、设备记录。

## 8. 数据库表结构

## 数据库表结构

以下以 MySQL 8 为目标。

### 8.1 `student_users` 学生主表

**用途：** 保存学生账号和主档案。

| 字段 | 类型建议 | 说明 | 约束/索引 | 对应 store 字段 |
|---|---|---|---|---|
| id | bigint unsigned | 主键 | PK, auto increment | `syncMeta.cloudUserId` |
| student_uid | varchar(32) | 对外展示的学生编号 | UNIQUE | 无，本次新增 |
| phone | varchar(20) | 登录账号，可为空视确认而定 | UNIQUE | `views/onboarding.js` 本地手机号 |
| password_hash | varchar(255) | 密码哈希 | 非空 | 本地密码迁移后不再明文存本地 |
| name | varchar(50) | 学生姓名 | INDEX(name) | `user.name` |
| grade | tinyint unsigned | 年级 1-12 | INDEX(grade) | `user.grade` |
| stage | char(1) | S/C/H | INDEX(stage) | `store.getStage()` 推导后可冗余存储 |
| ability_index | decimal(4,2) | 能力指数 |  | `user.abilityIndex` |
| total_stars | int unsigned | 总星星数 |  | `user.totalStars`，但以服务端汇总为准 |
| status | tinyint unsigned | 1=正常 0=禁用 | INDEX(status) | 新增 |
| last_login_at | datetime | 最近登录时间 | INDEX | 新增 |
| created_at | datetime | 创建时间 | INDEX | 新增 |
| updated_at | datetime | 更新时间 |  | 新增 |

**说明：**
- `stage` 可由年级推导，但为了后台查询方便可以冗余存储；
- `total_stars` 不能完全信任客户端上送，应由服务端按事件和记录计算或校正。

### 8.2 `student_devices` 学生设备表

**用途：** 记录设备与同步来源，支撑 `deviceId` 和审计。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| student_user_id | bigint unsigned | 学生 ID | INDEX |
| device_id | varchar(64) | 前端生成设备 ID | UNIQUE |
| last_seen_at | datetime | 最近活跃时间 | INDEX |
| app_version | varchar(32) | 前端版本号 |  |
| schema_version | int | 本地 schemaVersion |  |
| created_at | datetime | 创建时间 |  |
| updated_at | datetime | 更新时间 |  |

### 8.3 `student_lesson_progress` 课程进度表

**用途：** 存储每个学生每节课的聚合进度。

| 字段 | 类型建议 | 说明 | 约束/索引 | 对应 store 字段 |
|---|---|---|---|---|
| id | bigint unsigned | 主键 | PK | 新增 |
| student_user_id | bigint unsigned | 学生 ID | UNIQUE(student_user_id, lesson_id) | 外键映射 |
| lesson_id | tinyint unsigned | 课时 1-10 | UNIQUE 组合键 | `lessonProgress[lessonId]` |
| passed | tinyint(1) | 是否通关 |  | `passed` |
| stars | tinyint unsigned | 星级 0-3 |  | `stars` |
| xp | int unsigned | 当前课获得 XP |  | `xp` |
| total_xp | int unsigned | 课程总 XP |  | `totalXp` |
| attempt_count | int unsigned | 累计尝试次数 |  | `attemptCount` |
| video_watched | tinyint(1) | 是否看过视频 |  | `videoWatched` |
| rounds_used | int unsigned | 最优通过轮次 |  | `roundsUsed` |
| first_passed_at | datetime | 首次通关时间 | INDEX | 新增 |
| updated_at | datetime | 更新时间 | INDEX | 新增 |

### 8.4 `student_mistakes` 错题记录表

**用途：** 保存错题本状态，而不是仅保存错题快照。

| 字段 | 类型建议 | 说明 | 约束/索引 | 对应 store 字段 |
|---|---|---|---|---|
| id | bigint unsigned | 主键 | PK | 本地 `mistake.id` 映射云端主键 |
| student_user_id | bigint unsigned | 学生 ID | INDEX(student_user_id, status) | 外键 |
| lesson_id | tinyint unsigned | 所属课时 | INDEX | `lessonId` |
| question_id | varchar(64) | 题目编号 | INDEX(student_user_id, question_id) | `questionId` |
| question_text | text | 题干快照 |  | `questionText` |
| user_answer | varchar(128) | 学生答案 |  | `userAnswer` |
| correct_answer | varchar(128) | 正确答案 |  | `correctAnswer` |
| difficulty | tinyint unsigned | 难度 | INDEX | `difficulty` |
| explanation | text | 解析快照 |  | `explanation` |
| reviewed | tinyint(1) | 是否已复习 |  | `reviewed` |
| reward_claimed | tinyint(1) | 奖励是否已发 |  | `rewardClaimed` |
| status | varchar(16) | `open` / `cleared` | INDEX | `status` |
| review_streak | tinyint unsigned | 连对次数 |  | `reviewStreak` |
| first_wrong_at | datetime | 首次记录时间 | INDEX | `timestamp` 可拆分 |
| last_review_at | datetime | 最近复习时间 | INDEX | 新增 |
| updated_at | datetime | 更新时间 | INDEX | 新增 |

**唯一性建议：**
- V1 保持“同一学生同一题只保留一条当前错题状态”，可设唯一键 `(student_user_id, question_id)`。

### 8.5 `student_challenge_records` 挑战记录表

| 字段 | 类型建议 | 说明 | 约束/索引 | 对应 store 字段 |
|---|---|---|---|---|
| id | bigint unsigned | 主键 | PK | 本地 `id` 映射 |
| student_user_id | bigint unsigned | 学生 ID | INDEX(student_user_id, created_at) | 外键 |
| score | int unsigned | 得分 | INDEX | `score` |
| accuracy | decimal(5,2) | 正确率 |  | `accuracy` |
| duration | int unsigned | 用时秒数/毫秒数，需统一 |  | `duration` |
| source_event_id | varchar(64) | 客户端事件 ID | UNIQUE | 新增幂等键 |
| created_at | datetime | 创建时间 | INDEX | `timestamp` |

### 8.6 `topic_compositions` 专题书写/作文记录表

**用途：** 保存专题训练中的分段写作、综合作文、AI 评分与 OCR 来源痕迹。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| student_user_id | bigint unsigned | 学生 ID | INDEX(student_user_id, topic_id, sub_id) |
| topic_id | varchar(32) | 专题模块 ID，如 `jingwu`/`scenery` | INDEX |
| sub_id | varchar(64) | 子内容 ID | INDEX |
| task_type | varchar(16) | `typeA` / `typeB` / `typeC` | INDEX |
| unit_key | varchar(64) | 分段单元标识；综合作文可为空 |  |
| content_text | mediumtext | 学生写作内容 |  |
| ai_total_score | int unsigned | AI 总分 | INDEX |
| ai_score_payload | json | 各维度细节 JSON |  |
| passed | tinyint(1) | 是否通过 | INDEX |
| stars_awarded | int unsigned | 奖励星星数 |  |
| source | varchar(16) | `manual` / `ocr_append` |  |
| source_event_id | varchar(64) | 客户端幂等事件 ID | UNIQUE |
| created_at | datetime | 创建时间 | INDEX |
| updated_at | datetime | 更新时间 |  |

**说明：**
- 该表覆盖 `views/topicCompose.js` 与未来专题分段书写的存档需求；
- `ai_score_payload` 保存 `highlights`、`suggestions`、分维度得分，方便后台回看。

### 8.7 `admin_users` 管理员/教师账号表

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| username | varchar(64) | 登录名 | UNIQUE |
| password_hash | varchar(255) | 密码哈希 | 非空 |
| display_name | varchar(64) | 显示名称 |  |
| role | varchar(16) | `admin` / `teacher` / `viewer` | INDEX |
| status | tinyint unsigned | 1=正常 | INDEX |
| last_login_at | datetime | 最近登录 | INDEX |
| created_at | datetime | 创建时间 |  |
| updated_at | datetime | 更新时间 |  |

### 8.8 `admin_student_scope` 教师可见范围表

**用途：** 若 V1 需要最小权限隔离，可用单独表维护教师可见学生范围。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| admin_user_id | bigint unsigned | 教师账号 ID | UNIQUE(admin_user_id, student_user_id) |
| student_user_id | bigint unsigned | 学生账号 ID | UNIQUE 组合键 |
| created_at | datetime | 创建时间 |  |

若 V1 先不做班级维度，可先让 admin 看全部、teacher 看授权学生。

### 8.9 `sync_events` 同步事件表

**用途：** 记录客户端增量上送事件，支撑幂等与排查。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| student_user_id | bigint unsigned | 学生 ID | INDEX(student_user_id, created_at) |
| device_id | varchar(64) | 设备 ID | INDEX |
| event_id | varchar(64) | 客户端事件 ID | UNIQUE |
| event_type | varchar(64) | 事件类型 | INDEX |
| entity_type | varchar(64) | 影响对象类型 | INDEX |
| entity_key | varchar(128) | 对象业务键 | INDEX |
| payload | json | 原始事件内容 |  |
| processed | tinyint(1) | 是否已处理 | INDEX |
| processed_at | datetime | 处理时间 |  |
| created_at | datetime | 创建时间 | INDEX |

### 8.10 `sync_snapshots` 同步快照表

**用途：** 记录首次 `bootstrap` 或重要全量快照，便于恢复。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| student_user_id | bigint unsigned | 学生 ID | INDEX |
| source | varchar(16) | `bootstrap` / `manual_backup` | INDEX |
| schema_version | int | 本地 schema 版本 |  |
| snapshot_json | longtext | 压缩或原始 JSON |  |
| created_at | datetime | 创建时间 | INDEX |

### 8.11 `sync_logs` 同步日志表

**用途：** 记录同步成功/失败，便于运维排错。

| 字段 | 类型建议 | 说明 | 约束/索引 |
|---|---|---|---|
| id | bigint unsigned | 主键 | PK |
| student_user_id | bigint unsigned | 学生 ID | INDEX |
| device_id | varchar(64) | 设备 ID | INDEX |
| action | varchar(32) | `bootstrap` / `push` / `pull` | INDEX |
| status | varchar(16) | `success` / `failed` | INDEX |
| message | varchar(255) | 摘要错误信息 |  |
| detail | text | 详细错误 |  |
| created_at | datetime | 创建时间 | INDEX |

## 9. API 接口设计

## API 接口

统一前缀建议：`/api/v1`

### 9.1 学生注册/创建账号

#### `POST /api/v1/auth/register`

**用途：** 创建学生账号。

**鉴权要求：** 无

**请求体示例：**

```json
{
  "name": "小明",
  "phone": "13800138000",
  "password": "plain-text-from-https",
  "grade": 4,
  "deviceId": "web-uuid-001",
  "localSchemaVersion": 4
}
```

**响应体示例：**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "accessToken": "jwt-or-session-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": 1001,
      "name": "小明",
      "grade": 4,
      "stage": "S",
      "abilityIndex": 4.0,
      "totalStars": 0
    },
    "cloudRevision": 1
  }
}
```

**错误处理：**
- `409` 手机号已存在；
- `400` 参数缺失或年级非法；
- `429` 短时间重复注册；
- `500` 服务异常。

### 9.2 学生登录

#### `POST /api/v1/auth/login`

**用途：** 学生登录。

**鉴权要求：** 无

**请求体示例：**

```json
{
  "phone": "13800138000",
  "password": "plain-text-from-https",
  "deviceId": "web-uuid-001"
}
```

**响应体：** 返回 token、学生摘要、是否需要 `bootstrap`。

**补充建议：**
- 增加 `needBootstrap` 布尔值，用于指示当前设备是否首次绑定本地数据；
- 登录成功更新 `student_devices.last_seen_at` 与 `student_users.last_login_at`。

**错误处理：**
- `401` 账号或密码错误；
- `403` 账号被禁用；
- `500` 服务异常。

### 9.3 获取当前用户数据

#### `GET /api/v1/me/state`

**用途：** 获取当前学生完整学习状态快照。

**鉴权要求：** 学生登录

**请求参数：**
- `sinceRevision` 可选，用于增量判断；
- `include=summary|full` 可选。

**响应体示例：**

```json
{
  "code": 0,
  "data": {
    "cloudRevision": 18,
    "serverTime": "2026-06-29T12:00:00Z",
    "user": {
      "id": 1001,
      "name": "小明",
      "grade": 4,
      "stage": "S",
      "abilityIndex": 4.2,
      "totalStars": 56
    },
    "lessonProgress": {
      "1": { "passed": true, "stars": 3, "xp": 100, "totalXp": 100, "attemptCount": 1, "videoWatched": true, "roundsUsed": 1 }
    },
    "mistakes": [],
    "challengeRecords": [],
    "topicCompositions": []
  }
}
```

**错误处理：**
- `401` token 无效或过期；
- `403` 访问非本人数据；
- `500` 查询失败。

### 9.4 首次本地数据导入

#### `POST /api/v1/sync/bootstrap`

**用途：** 首次登录后把本地 `ganjue_training_state` 导入云端。

**鉴权要求：** 学生登录

**请求体示例：**

```json
{
  "deviceId": "web-uuid-001",
  "localSchemaVersion": 4,
  "snapshot": {
    "schemaVersion": 4,
    "user": { "grade": 4, "abilityIndex": 4.0, "name": "小明", "totalStars": 22 },
    "lessonProgress": {},
    "mistakes": [],
    "challengeRecords": []
  }
}
```

**服务端处理要求：**
- 保存原始快照到 `sync_snapshots`；
- 校验登录身份，不接受客户端传 `userId` 直接指定归属；
- 合并或初始化云端状态；
- 返回规范化后的服务端状态。

**错误处理：**
- `400` 快照结构非法；
- `409` 设备已绑定其他账号；
- `422` schema 不可识别；
- `500` 导入失败。

### 9.5 全量/增量同步学习状态

#### `POST /api/v1/sync/push`

**用途：** 批量提交本地事件。

**鉴权要求：** 学生登录

**请求体示例：**

```json
{
  "deviceId": "web-uuid-001",
  "baseRevision": 18,
  "events": [
    {
      "eventId": "evt-lesson-001",
      "eventType": "lesson_progress_upsert",
      "occurredAt": "2026-06-29T12:10:00Z",
      "payload": {
        "lessonId": 3,
        "passed": true,
        "stars": 2,
        "xp": 80,
        "totalXp": 100,
        "attemptCount": 2,
        "videoWatched": true,
        "roundsUsed": 2
      }
    }
  ]
}
```

**响应体：**
- 返回已接收事件 ID；
- 返回最新 `cloudRevision`；
- 如有冲突，返回冲突摘要与建议重新拉取标记。

**错误处理：**
- `400` 事件格式错误；
- `401` 未登录；
- `409` `baseRevision` 过旧且需要重新拉取；
- `422` 非法对象归属；
- `500` 同步失败。

#### `GET /api/v1/sync/pull?sinceRevision=18`

**用途：** 增量拉取云端变化。

**鉴权要求：** 学生登录

**响应体：**
- `changes.user`
- `changes.lessonProgress`
- `changes.mistakes`
- `changes.challengeRecords`
- `changes.topicCompositions`
- `cloudRevision`

**错误处理：**
- `409` 本地版本太旧需走全量；
- `500` 拉取失败。

### 9.6 提交课时进度

#### `POST /api/v1/lesson-progress`

**用途：** 单次提交某节课聚合进度，适合不走统一事件接口时的简化实现。

**鉴权要求：** 学生登录

**请求体：**

```json
{
  "lessonId": 2,
  "passed": true,
  "stars": 3,
  "xp": 100,
  "totalXp": 100,
  "attemptCount": 1,
  "videoWatched": true,
  "roundsUsed": 1
}
```

**服务端规则：**
- 以当前登录用户为归属；
- 字段按最优值合并，不允许客户端把已通关降回未通关；
- `stars`、`xp` 只能变优或变新，不做回退覆盖。

**错误处理：**
- `400` lessonId 非法；
- `403` 试图写入非本人数据；
- `500` 保存失败。

### 9.7 提交错题状态

#### `POST /api/v1/mistakes`

**用途：** 新增或更新错题记录。

**鉴权要求：** 学生登录

**请求体：**

```json
{
  "questionId": "K1-D1-01",
  "lessonId": 1,
  "questionText": "题目内容",
  "userAnswer": "A",
  "correctAnswer": "B",
  "difficulty": 1,
  "explanation": "解析",
  "status": "open",
  "reviewed": false,
  "rewardClaimed": false,
  "reviewStreak": 0,
  "timestamp": 1751199000000
}
```

**服务端规则：**
- 按 `(student_user_id, question_id)` upsert；
- `status='cleared'` 优先级高于 `open`；
- `reviewStreak` 取更高，不能被旧设备覆盖更低值。

**错误处理：**
- `400` 题目字段缺失；
- `422` 状态非法；
- `500` 保存失败。

### 9.8 提交挑战记录

#### `POST /api/v1/challenge-records`

**用途：** 提交挑战赛成绩。

**鉴权要求：** 学生登录

**请求体：**

```json
{
  "eventId": "evt-ch-001",
  "score": 80,
  "accuracy": 80,
  "duration": 95,
  "timestamp": 1751199000000
}
```

**服务端规则：**
- 用 `eventId` 做幂等；
- 只允许当前登录用户写自己的记录。

### 9.9 提交专题作文/评分记录

#### `POST /api/v1/topic-compositions`

**用途：** 提交专题分段写作或综合作文。

**鉴权要求：** 学生登录

**请求体：**

```json
{
  "eventId": "evt-topic-001",
  "topicId": "dongwu",
  "subId": "jumao",
  "taskType": "typeC",
  "unitKey": null,
  "contentText": "学生作文正文",
  "aiResult": {
    "total": 86,
    "scores": {
      "组成完整": 26,
      "顺序正确": 25,
      "感觉点准确": 27,
      "语句通顺": 8
    },
    "highlights": ["结构清楚"],
    "suggestions": ["再补一个感觉点会更完整"],
    "encouragement": "继续加油"
  },
  "passed": true,
  "starsAwarded": 15,
  "source": "manual"
}
```

**服务端规则：**
- 保存作文正文与评分结果；
- 允许后台按学生、专题、时间查询；
- 如后续接入 AI 代理，可在服务端复核 `starsAwarded`，减少被篡改风险。

### 9.10 后台列表查询接口

#### `POST /api/v1/admin/auth/login`

**用途：** 管理员/教师登录后台。

**鉴权要求：** 无

#### `GET /api/v1/admin/dashboard`

**用途：** 获取概览数据。

**鉴权要求：** `admin` / `teacher`

**返回建议：**
- 学生总数；
- 今日活跃人数；
- 已完成课时数；
- 待改错总量；
- 最近作文提交数。

#### `GET /api/v1/admin/students`

**用途：** 学生列表分页查询。

**查询参数：**
- `keyword`
- `grade`
- `stage`
- `page`
- `pageSize`
- `sort=last_login_at|created_at|total_stars`

**鉴权要求：**
- admin 可查全部；
- teacher 仅查授权范围。

#### `GET /api/v1/admin/students/:id`

**用途：** 学生详情。

**返回内容：**
- 基本资料；
- 课程进度摘要；
- 错题统计；
- 挑战赛最佳成绩；
- 最近作文记录。

#### `GET /api/v1/admin/students/:id/mistakes`

**用途：** 学生错题列表查询。

#### `GET /api/v1/admin/students/:id/topic-compositions`

**用途：** 学生专题作文记录查询。

#### `GET /api/v1/admin/students/:id/challenge-records`

**用途：** 学生挑战记录查询。

**后台接口错误处理统一建议：**
- `401` 未登录；
- `403` 权限不足；
- `404` 学生不存在或不在可见范围；
- `500` 查询失败。

## 10. 鉴权与安全要求

### 10.1 学生侧鉴权

建议使用短期 `accessToken` + 较长期 `refreshToken`，或者服务端 session。V1 只要做到稳定即可，但必须满足：

- 所有 `/api/v1/me/*`、`/api/v1/sync/*`、学习数据写接口都要求登录；
- 服务端从 token/session 中识别当前学生，不从 body 中信任 `userId`；
- 登出时可使 refresh token 或 session 失效。

### 10.2 后台侧鉴权

后台必须单独账号体系，不与学生共用 token。原因：

- 学生接口是自助写入型；
- 后台接口是批量读取未成年人学习数据，风险更高。

建议后台接口按最小权限控制：

- `admin`：全量查看；
- `teacher`：仅查看授权学生；
- `viewer`：只读且无导出权限。

### 10.3 数据最小暴露

落实 threat model 中 T-quick-260629-01：

- 学生数据不能放在可枚举、无鉴权的公开接口；
- 后台列表必须鉴权后才可访问；
- 不提供“按手机号直接查学生详情”的匿名接口；
- 生产环境数据库密码、JWT 密钥、API key 都放环境变量，不写死在仓库。

### 10.4 AI 代理边界

本方案主题不是 API key 代理改造，但要明确：

- `js/config.js` 中现有 AI key 不能长期继续暴露在前端；
- 后台 V1 上线前，至少要把 AI 请求迁到阿里云 FC 代理或 Node.js 服务端代理；
- 数据库 V1 可先做学习同步与后台查询，但正式对外前应把该安全项与部署一并处理。

## 11. 后台页面结构

## 后台页面结构

V1 后台建议做成最小 Web 管理台，可独立于学生端静态站点存在。

### 11.1 登录页

**目标：** 管理员/老师登录后台。

**页面元素：**
- 用户名
- 密码
- 登录按钮
- 登录失败提示

### 11.2 数据概览页

**目标：** 一眼看整体运行情况。

**核心模块：**
- 学生总数
- 最近 7 天活跃数
- 各年级人数分布
- 已完成课时数总计
- 错题总数 / 已通过率
- 最近专题作文提交数

### 11.3 学生列表页

**目标：** 查找某个学生。

**筛选项：**
- 姓名/手机号关键字
- 年级
- 学段
- 最近登录时间

**列表字段：**
- 学生姓名
- 年级
- 学段
- 星星数
- 已完成课时
- 未清错题数
- 最近登录时间
- 查看详情按钮

### 11.4 学生详情/学习报告页

**目标：** 查看单个学生的总体学习表现。

**页面分区：**
- 基本资料卡
- 10 节课进度表
- 能力指数 / 星星总数
- 错题统计
- 挑战赛最佳成绩与最近记录
- 最近专题作文列表

### 11.5 错题记录页

**目标：** 查看学生错题本情况。

**支持：**
- 按学生筛选
- 按课时筛选
- 按状态筛选（open / cleared）
- 查看题干、学生答案、正确答案、解析、连对次数、更新时间

### 11.6 作文/专题记录页

**目标：** 查看专题写作成果。

**支持：**
- 按专题、子内容、时间筛选
- 查看作文正文
- 查看 AI 分数与亮点建议
- 查看是否通过、奖励星星

### 11.7 挑战记录页（可并入学生详情）

V1 可不单独做菜单页，也可并入学生详情页中的一个 Tab。

## 12. ECS 部署方案

## ECS 部署方案

### 12.1 现有部署关系

当前正式站点为 `https://train.tybqcloud.com`，已在 ECS 上通过 nginx 提供静态站点，发布方式为 `git pull`。

V1 推荐保持原关系不变，再在同一台 ECS 上新增：

- Node.js API 服务
- MySQL 8 服务
- 后台管理前端（可静态部署，也可与 Node 一起托管）

### 12.2 推荐目录结构

```bash
/www/wwwroot/train.tybqcloud.com/           # 现有学生端静态站点
/www/wwwroot/train-admin/                    # 后台前端静态文件（若独立构建）
/www/server/train-api/                       # Node.js API 项目
/www/server/train-api/shared-backups/        # 导出与备份脚本目录
/www/server/mysql-backups/                   # MySQL 备份目录
/www/logs/train-api/                         # API 日志
```

### 12.3 nginx 反向代理建议

建议保留：
- `https://train.tybqcloud.com/` -> 学生端静态文件

新增：
- `https://train.tybqcloud.com/api/` -> 反向代理到 Node.js API，例如 `127.0.0.1:3000`
- `https://admin.train.tybqcloud.com/` 或 `https://train.tybqcloud.com/admin/` -> 后台前端
- 后台前端调用 `/api/v1/admin/*` 同样走 nginx 代理到 Node.js

**建议优先级：**
- 若域名管理方便，优先独立子域名 `admin.train.tybqcloud.com`；
- 若短期内不增子域名，可先挂在 `/admin/`。

### 12.4 Node.js 进程管理

必须使用进程守护工具，例如 PM2 或 systemd。要求：

- 开机自启；
- 崩溃自动重启；
- 日志可分文件查看；
- 部署时支持平滑重启。

### 12.5 MySQL 配置要求

- 仅监听内网/本机，不对公网裸露 3306；
- 创建独立数据库账号，最小权限；
- 开启慢查询日志（可选）；
- 每日自动备份；
- 至少保留近 7 天备份。

### 12.6 环境变量要求

生产环境通过环境变量管理：

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET` 或 session secret
- `REFRESH_TOKEN_SECRET`
- `API_BASE_URL`
- AI 代理相关 key（若由 Node 承担）

禁止把上述值提交到 git。

### 12.7 日志、备份、回滚

落实 threat model 中 T-quick-260629-03：

**日志要求：**
- API 访问日志
- 应用错误日志
- 同步失败日志
- 后台登录日志

**备份要求：**
- MySQL 每日全量备份；
- 关键表可选每小时 binlog/增量；
- 备份文件定期校验可恢复性。

**回滚要求：**
- 保留最近稳定 API 版本目录或 git tag；
- 数据库变更要先备份后执行；
- 部署脚本要有“回到上一版本”步骤；
- 遇到严重同步 bug 时，可先停用云端写入，仅保留只读与本地模式。

## 13. 开发顺序

## 开发顺序

开发顺序必须按可验证里程碑推进，避免一口气大改。

### 里程碑 1：数据库初始化

**目标：** MySQL 表结构可创建、可手工验证。

**内容：**
- 建立 `student_users`、`student_lesson_progress`、`student_mistakes`、`student_challenge_records`、`topic_compositions`、`admin_users`、`sync_events` 等表；
- 初始化管理员账号；
- 准备样例测试数据。

**成功标准：**
- 能在本地或测试 ECS 上建表成功；
- 关键索引存在；
- 能查出一名样例学生的完整数据链路。

### 里程碑 2：API 骨架

**目标：** 完成登录、获取当前用户状态、基础写入接口。

**内容：**
- 学生注册/登录
- `GET /api/v1/me/state`
- `POST /api/v1/sync/bootstrap`
- `POST /api/v1/sync/push`
- 后台登录与学生列表只读接口

**成功标准：**
- Postman/脚本能完成注册、登录、拉取状态、首次导入；
- 同一事件重复提交不会产生重复记录。

### 里程碑 3：前端同步适配

**目标：** 不重写页面的前提下，让现有前端接入云端。

**内容：**
- `views/onboarding.js` 从本地账号改为真实 API；
- `js/store.js` 增加 `syncMeta`、迁移逻辑、`pendingEvents`；
- 课时进度、错题、挑战、作文流程中埋入同步触发点。

**成功标准：**
- 学生在 A 设备学习后，B 设备登录可看到同步结果；
- API 断开时仍能继续用本地数据学习；
- 恢复网络后数据可补传。

### 里程碑 4：后台页面

**目标：** 老师可查看学生数据。

**内容：**
- 登录页
- 概览页
- 学生列表页
- 学生详情页
- 错题记录页
- 作文记录页

**成功标准：**
- 能搜索到学生；
- 能查看课程进度、错题、作文记录；
- 权限受控，教师不能查看越权数据。

### 里程碑 5：部署联调

**目标：** 在 ECS 测试环境联通完整链路。

**内容：**
- nginx 代理配置
- Node.js 部署与守护
- MySQL 连接与备份脚本
- 前端 API 地址切换

**成功标准：**
- `train.tybqcloud.com` 前端可登录并同步；
- 后台可正常访问；
- 日志可查、服务可重启。

### 里程碑 6：数据备份/回滚演练

**目标：** 上线前具备可恢复能力。

**内容：**
- 数据库备份恢复演练
- API 版本回滚演练
- 同步故障时降级预案验证

**成功标准：**
- 可从备份恢复测试库；
- 回滚后前端仍能本地运行；
- 出现同步异常时不会造成学生数据整批丢失。

## 14. 验收清单

## 验收清单

- [ ] 学生可完成注册、登录、跨设备查看自己的学习数据。
- [ ] 首次登录可把本地 `ganjue_training_state` 导入云端。
- [ ] `lessonProgress`、`mistakes`、`challengeRecords`、专题作文记录可同步。
- [ ] 离线或接口失败时，前端仍可继续使用本地数据。
- [ ] `schemaVersion` 升级不再默认清空历史数据，而是可迁移或可恢复。
- [ ] 后台可查看学生列表、学生详情、错题记录、作文记录、概览数据。
- [ ] 所有学生数据接口都有鉴权与归属校验。
- [ ] ECS 上具备日志、备份、回滚、进程守护能力。
- [ ] AI key 与数据库密码通过环境变量或代理管理，不再直接暴露在生产前端。

## 15. 实施前待确认问题

## 实施前待确认

以下问题需要在正式开发前由用户/客户确认，否则容易反复返工。

1. **账号主键用什么登录？**
   - 手机号必填，还是允许“姓名 + 班级 + 密码”模式？
2. **密码规则是什么？**
   - 仅 6 位以上即可，还是要更严格？是否需要找回密码？
3. **学生资料字段到什么程度？**
   - 是否只保留姓名、手机号、年级；是否要加班级、学校、家长手机号？
4. **教师权限粒度如何控制？**
   - teacher 是看全部学生，还是只看自己班级/授权名单？
5. **是否保留历史本地数据迁移？**
   - 已在客户设备上使用过的浏览器数据，是否要求首次登录自动迁移？
6. **挑战赛时长单位统一为秒还是毫秒？**
   - 需避免前后端字段含义不一致。
7. **专题分段写作是否也要入库，还是只保存 C 类综合作文？**
   - 若都要保存，需要补齐 `unitKey` 命名规范。
8. **后台是否需要导出 Excel？**
   - 若要，需单列为 V1.1，避免本次扩 scope。
9. **正式上线前 AI 代理由谁承担？**
   - 阿里云 FC 还是 Node.js API 统一代理，需要和部署一起拍板。
10. **是否允许学生离线登录后长期使用？**
   - 涉及 token 过期、缓存期限和风控策略。

## 16. 结论

V1 的正确方向不是“重写前端”，而是“给现有成熟前端补齐云端身份、学习数据同步和后台查询能力”。

只要严格遵守以下三点，后续开发就能可控推进：

1. 前端 UI 继续由现有原生页面驱动，核心改动集中在登录与 `store.js` 同步层；
2. 云端把 MySQL 作为权威存档，把 Node.js API 作为鉴权与同步边界；
3. `localStorage` 在 V1 继续承担缓存、离线与迁移职责，而不是被一次性废弃。

按本方案实施后，团队可以继续拆出后续真实开发任务：数据库初始化、API 开发、前端同步适配、后台页面和 ECS 联调，而不会打乱当前客户测试中的前端主流程。
