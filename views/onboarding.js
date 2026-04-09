/**
 * views/onboarding.js
 * ─────────────────────────────────────────────────────────────
 * 感觉训练系统 — 注册 / 登录
 *
 * 流程：
 *   Step 1：欢迎页
 *   Step 2：注册 Tab / 登录 Tab
 *   Step 3（注册）：选择年级
 *   → 完成后保存到 store，跳转训练营
 *
 * 上线改造说明：
 *   所有账号数据目前存 localStorage（store）。
 *   上线接入 CloudBase 时，只需把 _doRegister / _doLogin 里的
 *   store 调用换成云函数 API，视图层无需改动。
 * ─────────────────────────────────────────────────────────────
 */

import { store } from '../js/store.js';

// ── IP 图片 ──
const IP_BASE = 'https://yanglaoshi-videos-1308089417.cos.ap-beijing.myqcloud.com/IP/';
const IP_POSES = {
  teach:   IP_BASE + 'pose1.png',  // 指教学（默认/欢迎）
  shy:     IP_BASE + 'pose2.png',  // 捂眼睛（密码输入中）
  clap:    IP_BASE + 'pose3.png',  // 鼓掌（表单填写完整）
  no:      IP_BASE + 'pose4.png',  // 摇手（校验失败）
  approve: IP_BASE + 'pose5.png',  // 点头竖拇指（登录成功前）
};

// ── IP 气泡 & 装饰配置 ──
const IP_META = {
  teach:   { bubble: '欢迎来到感觉训练营！✨', decos: ['✨', '📚', '🌟'] },
  shy:     { bubble: '放心输入，我不偷看～', decos: ['🙈', '🔒', '💜'] },
  clap:    { bubble: '棒棒的！继续加油！', decos: ['👏', '🎉', '⭐'] },
  no:      { bubble: '再检查一下哦～', decos: ['💡', '🔍', '❤️'] },
  approve: { bubble: '太好了，出发！🚀', decos: ['🎊', '🌈', '⚡'] },
};

// ── 状态 ──
let _step = 1;          // 1=欢迎 | 2=注册/登录 | 3=选年级
let _tab  = 'register'; // 'register' | 'login'
let _name = '';
let _phone = '';
let _password = '';
let _grade = null;
let _container = null;
let _currentPose = 'teach';

// ── 年级配置 ──
const GRADES = [
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
];

// ── HTML 构建 ─────────────────────────────────────────────────

function buildStep1HTML() {
  return `
<div class="ob-page">
  <div class="ob-hero">
    ${buildIPWrap('teach', 'ob-ip-float')}
    <div class="ob-hero-title">感觉训练营</div>
    <div class="ob-hero-subtitle">用五感发现世界<br>让作文充满生命力</div>
  </div>

  <div class="ob-features">
    <div class="ob-feature-item">
      <span class="ob-feature-icon">
        <ph-books weight="fill" color="#A78BFA" size="28"></ph-books>
      </span>
      <div>
        <div class="ob-feature-name">10节感觉训练课</div>
        <div class="ob-feature-desc">从看、听、闻、尝、摸，全方位训练感知力</div>
      </div>
    </div>
    <div class="ob-feature-item">
      <span class="ob-feature-icon">
        <ph-robot weight="fill" color="#A78BFA" size="28"></ph-robot>
      </span>
      <div>
        <div class="ob-feature-name">AI 魔法机器</div>
        <div class="ob-feature-desc">拍照或输入题目，AI 一步步引导你写作文</div>
      </div>
    </div>
    <div class="ob-feature-item">
      <span class="ob-feature-icon">
        <ph-lightning weight="fill" color="#A78BFA" size="28"></ph-lightning>
      </span>
      <div>
        <div class="ob-feature-name">挑战赛 &amp; 错题本</div>
        <div class="ob-feature-desc">巩固所学，看见自己的成长</div>
      </div>
    </div>
  </div>

  <button class="ob-primary-btn" id="ob-next-1">开始我的训练</button>

  <div class="ob-dots">
    <span class="ob-dot ob-dot-active"></span>
    <span class="ob-dot"></span>
  </div>
</div>`;
}

function buildStep2HTML() {
  const isReg = _tab === 'register';
  return `
<div class="ob-page ob-page-form">
  <div class="ob-step-header">
    ${buildIPWrap(_currentPose, 'ob-ip-small')}
    <div class="ob-step-title">感觉训练营</div>
  </div>

  <!-- Tab 切换 -->
  <div class="ob-tab-bar">
    <button class="ob-tab ${isReg ? 'ob-tab-active' : ''}" data-tab="register">注册</button>
    <button class="ob-tab ${!isReg ? 'ob-tab-active' : ''}" data-tab="login">登录</button>
  </div>

  <!-- 表单区 -->
  <div class="ob-form">
    ${isReg ? `
    <!-- 注册：姓名 -->
    <div class="ob-field">
      <div class="ob-field-label">
        <ph-user weight="bold" color="#A78BFA" size="16"></ph-user>
        学生姓名
      </div>
      <input type="text" id="ob-name-input" class="ob-input"
        placeholder="输入你的名字" maxlength="10" value="${escHtml(_name)}">
    </div>
    ` : ''}

    <!-- 手机号 -->
    <div class="ob-field">
      <div class="ob-field-label">
        <ph-device-mobile weight="bold" color="#A78BFA" size="16"></ph-device-mobile>
        手机号
      </div>
      <input type="tel" id="ob-phone-input" class="ob-input"
        placeholder="输入手机号" maxlength="11" value="${escHtml(_phone)}">
    </div>

    <!-- 密码 -->
    <div class="ob-field">
      <div class="ob-field-label">
        <ph-lock-simple weight="bold" color="#A78BFA" size="16"></ph-lock-simple>
        密码
      </div>
      <div class="ob-password-wrap">
        <input type="password" id="ob-password-input" class="ob-input ob-input-password"
          placeholder="${isReg ? '设置密码（至少6位）' : '输入密码'}" value="${escHtml(_password)}">
        <button class="ob-eye-btn" id="ob-eye-btn" type="button">
          <ph-eye id="ob-eye-icon" weight="bold" color="#C4B5E8" size="20"></ph-eye>
        </button>
      </div>
    </div>

    <button class="ob-primary-btn ob-form-btn" id="ob-form-submit">
      ${isReg ? '下一步，选年级' : '登录进入训练营'}
    </button>
  </div>

  <div class="ob-dots">
    <span class="ob-dot"></span>
    <span class="ob-dot ob-dot-active"></span>
  </div>
</div>`;
}

function buildStep3HTML() {
  const gradeButtons = GRADES.map(g => `
    <button class="ob-grade-btn ${_grade === g.value ? 'ob-grade-selected' : ''}"
            data-grade="${g.value}">
      ${g.label}
    </button>`).join('');

  return `
<div class="ob-page ob-page-form">
  <div class="ob-step-header">
    ${buildIPWrap('clap', 'ob-ip-small')}
    <div class="ob-step-title">你在几年级？</div>
    <div class="ob-step-desc">帮我为你调整合适的题目难度</div>
  </div>

  <div class="ob-grade-grid">
    ${gradeButtons}
  </div>

  <button class="ob-primary-btn ${_grade === null ? 'ob-btn-disabled' : ''}"
          id="ob-finish" ${_grade === null ? 'disabled' : ''}>
    进入训练营
  </button>

  <div class="ob-dots">
    <span class="ob-dot"></span>
    <span class="ob-dot"></span>
    <span class="ob-dot ob-dot-active"></span>
  </div>
</div>`;
}

// ── 工具 ──

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isValidPhone(p) {
  return /^1[3-9]\d{9}$/.test(p);
}

/** 构建 IP 图片 + 气泡 + 装饰的包裹 HTML */
function buildIPWrap(pose, extraClass = '') {
  const meta = IP_META[pose] || IP_META.teach;
  const isSmall = extraClass === 'ob-ip-small';
  const decos = meta.decos.map((d, i) => `<span class="ob-ip-deco ob-ip-deco-${i + 1}">${d}</span>`).join('');
  const bubble = isSmall ? '' : `<div class="ob-ip-bubble${extraClass === 'ob-ip-float' ? ' ob-ip-bubble-large' : ''}" id="ob-ip-bubble">${meta.bubble}</div>`;
  return `
<div class="ob-ip-wrap">
  ${decos}
  <img class="ob-ip-img${extraClass ? ' ' + extraClass : ''}" src="${IP_POSES[pose]}" alt="杨老师" id="ob-ip">
  ${bubble}
</div>`;
}

// ── 业务逻辑（上线时替换为云函数调用）──────────────────────

/**
 * 注册：把账号信息存 localStorage
 * 上线时：改为调 CloudBase 注册接口，返回 token 后再 setUserProfile
 */
function _doRegister(name, phone, password, grade) {
  // 简单防重：同手机号不能重复注册
  const accounts = JSON.parse(localStorage.getItem('ob_accounts') || '[]');
  if (accounts.find(a => a.phone === phone)) {
    return { ok: false, msg: '该手机号已注册，请直接登录' };
  }
  accounts.push({ phone, password, name, grade });
  localStorage.setItem('ob_accounts', JSON.stringify(accounts));
  store.setUserProfile(name, grade);
  return { ok: true };
}

/**
 * 登录：校验 localStorage 中的账号
 * 上线时：改为调 CloudBase 登录接口
 */
function _doLogin(phone, password) {
  const accounts = JSON.parse(localStorage.getItem('ob_accounts') || '[]');
  const account = accounts.find(a => a.phone === phone && a.password === password);
  if (!account) {
    return { ok: false, msg: '手机号或密码错误' };
  }
  store.setUserProfile(account.name, account.grade);
  return { ok: true };
}

// ── 完成引导，进入训练营 ──

function _enterApp(name) {
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = '';
  window.__showToast(`欢迎你，${name}！训练开始咯 🌸`);
  window.__router.navigate('trainingCamp', {}, false);
}

// ── 渲染 & 事件 ──────────────────────────────────────────────

function rerender() {
  if (!_container) return;
  if (_step === 1)      _container.innerHTML = buildStep1HTML();
  else if (_step === 2) _container.innerHTML = buildStep2HTML();
  else if (_step === 3) _container.innerHTML = buildStep3HTML();
  bindEvents();
}

function bindEvents() {
  // IP 姿势切换工具函数
  function setPose(pose) {
    if (_currentPose === pose) return;
    _currentPose = pose;
    const img = document.getElementById('ob-ip');
    const bubble = document.getElementById('ob-ip-bubble');
    const meta = IP_META[pose] || IP_META.teach;
    if (img) {
      img.style.opacity = '0';
      img.style.transform = img.classList.contains('ob-ip-small')
        ? 'scale(0.92)' : 'translateY(-4px) scale(0.95)';
      setTimeout(() => {
        img.src = IP_POSES[pose];
        img.style.opacity = '1';
        img.style.transform = '';
      }, 150);
    }
    if (bubble) {
      bubble.style.opacity = '0';
      setTimeout(() => {
        bubble.textContent = meta.bubble;
        bubble.style.opacity = '1';
      }, 150);
    }
    // update deco icons
    const wrap = img?.closest('.ob-ip-wrap');
    if (wrap) {
      wrap.querySelectorAll('.ob-ip-deco').forEach((el, i) => {
        setTimeout(() => { el.textContent = meta.decos[i] || ''; }, 100);
      });
    }
  }

  // Step 1 → Step 2
  document.getElementById('ob-next-1')?.addEventListener('click', () => {
    _currentPose = 'teach';
    _step = 2;
    rerender();
  });

  // Tab 切换
  document.querySelectorAll('.ob-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _tab = btn.dataset.tab;
      rerender();
      // 聚焦第一个输入框
      setTimeout(() => {
        const first = _container.querySelector('.ob-input');
        first?.focus();
      }, 100);
    });
  });

  // 输入框监听 → 切换姿势
  const phoneInput = document.getElementById('ob-phone-input');
  const nameInput  = document.getElementById('ob-name-input');
  const pwdInput2  = document.getElementById('ob-password-input');

  pwdInput2?.addEventListener('focus', () => setPose('shy'));
  pwdInput2?.addEventListener('blur', () => {
    const phone = phoneInput?.value.trim() || '';
    const name  = nameInput?.value.trim() || '';
    const pwd   = pwdInput2?.value || '';
    const formOk = _tab === 'login'
      ? (isValidPhone(phone) && pwd.length >= 6)
      : (name.length > 0 && isValidPhone(phone) && pwd.length >= 6);
    setPose(formOk ? 'clap' : 'teach');
  });

  phoneInput?.addEventListener('input', () => {
    const phone = phoneInput.value.trim();
    if (phone.length > 0 && !isValidPhone(phone)) setPose('no');
    else if (isValidPhone(phone)) setPose('teach');
  });

  // 密码显示/隐藏
  const eyeBtn = document.getElementById('ob-eye-btn');
  const pwdInput = document.getElementById('ob-password-input');
  eyeBtn?.addEventListener('click', () => {
    const isHidden = pwdInput.type === 'password';
    pwdInput.type = isHidden ? 'text' : 'password';
    const icon = document.getElementById('ob-eye-icon');
    if (icon) {
      icon.outerHTML = isHidden
        ? `<ph-eye-slash id="ob-eye-icon" weight="bold" color="#A78BFA" size="20"></ph-eye-slash>`
        : `<ph-eye id="ob-eye-icon" weight="bold" color="#C4B5E8" size="20"></ph-eye>`;
    }
  });

  // 表单提交（注册 or 登录）
  document.getElementById('ob-form-submit')?.addEventListener('click', () => {
    const phoneVal = document.getElementById('ob-phone-input')?.value.trim() || '';
    const pwdVal = document.getElementById('ob-password-input')?.value || '';

    if (!isValidPhone(phoneVal)) {
      window.__showToast('请输入正确的手机号');
      document.getElementById('ob-phone-input')?.focus();
      setPose('no');
      return;
    }
    if (pwdVal.length < 6) {
      window.__showToast('密码至少6位');
      document.getElementById('ob-password-input')?.focus();
      setPose('no');
      return;
    }

    _phone = phoneVal;
    _password = pwdVal;

    if (_tab === 'register') {
      const nameVal = document.getElementById('ob-name-input')?.value.trim() || '';
      if (!nameVal) {
        window.__showToast('请输入你的名字');
        document.getElementById('ob-name-input')?.focus();
        setPose('no');
        return;
      }
      _name = nameVal;
      // 进入选年级步骤
      _step = 3;
      rerender();
    } else {
      // 登录
      const result = _doLogin(_phone, _password);
      if (!result.ok) {
        window.__showToast(result.msg);
        setPose('no');
        return;
      }
      setPose('approve');
      setTimeout(() => {
        const name = store.getUser().name || '同学';
        _enterApp(name);
      }, 600);
    }
  });

  // Step 3：年级选择
  document.querySelectorAll('.ob-grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _grade = Number(btn.dataset.grade);
      rerender();
    });
  });

  // 完成注册
  document.getElementById('ob-finish')?.addEventListener('click', () => {
    if (_grade === null) return;
    const result = _doRegister(_name, _phone, _password, _grade);
    if (!result.ok) {
      window.__showToast(result.msg);
      _step = 2;
      _tab = 'login';
      rerender();
      return;
    }
    _enterApp(_name);
  });
}

// ── 主入口 ────────────────────────────────────────────────────

export function renderOnboarding() {
  _container = document.getElementById('app-content');
  if (!_container) return;

  // 隐藏顶部 header
  const header = document.getElementById('app-header');
  if (header) header.innerHTML = '';

  // 隐藏底部导航，防止跳过引导
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none';

  _step = 1;
  _tab = 'register';
  _name = '';
  _phone = '';
  _password = '';
  _grade = null;

  rerender();
}
