/**
 * js/topicAI.js
 * ─────────────────────────────────────────────────────────────
 * 专题训练共享 AI 工具
 *   - callLLM：comfly OpenAI 兼容格式（文本评分）
 *   - ocrHandwritingFromImage：itlsj Gemini Anthropic 兼容格式（手写识别）
 *   - compressImage / fileToBase64：图片预处理
 *   - gradeSegment：单元 / A 类分段书写的轻量评分（只看是否覆盖该单元感觉点 + 语句通顺）
 *   - gradeEssay：C 类综合大作文的完整 4 维评分（组成30/顺序30/感觉点30/通顺10）
 *
 * 被 views/topicQuiz.js 和 views/topicCompose.js 共用。
 * ─────────────────────────────────────────────────────────────
 */

import { API_CONFIG, VISION_CONFIG } from './config.js?v=20260528';

/* ─── 文本评分（comfly OpenAI 兼容格式） ─── */
export async function callLLM(messages, systemPrompt, maxTokens = 800) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[callLLM] ${res.status} from ${API_CONFIG.baseUrl}`, body);
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/* ─── 图片识别（Gemini 走 itlsj，Anthropic 兼容格式） ─── */
export async function ocrHandwritingFromImage(base64, mimeType) {
  const sysPrompt = `你是一个识别小学生手写内容的助手。
任务：把图片中的手写中文内容**忠实转录成文字**。
要求：
1. 只输出转录的文字本身，不要加任何解释、标题、引号、Markdown
2. 保留原文的换行和标点
3. 如果某个字辨认不出来，用 ◯ 占位
4. 如果图片里没有可识别的文字，返回：未识别到文字
5. 不要修改、润色、纠错任何内容`;

  const userPrompt = '请把这张图片里小学生写的内容一字一句转录出来。';

  const res = await fetch(`${VISION_CONFIG.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': VISION_CONFIG.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: VISION_CONFIG.model,
      max_tokens: 1500,
      system: sysPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: userPrompt },
        ],
      }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[ocr] ${res.status}`, body);
    throw new Error(`OCR API ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

/* 文件转 base64 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const parts = e.target.result.split(',');
      resolve({ base64: parts[1], mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* 图片压缩：长边 ≤ 1280px，JPEG 0.85（避免大图超过 API 限制） */
export async function compressImage(file) {
  const maxSize = 1280;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('压缩失败'));
        resolve(new File([blob], 'compressed.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* ─── 单元 / A 类分段书写：轻量评分 ─── */
/**
 * 评判学生写的「一小段」是否覆盖了该单元（或 A 类组成框架）应包含的要点。
 * 返回 { pass, total, missing[], highlight, suggestion, encouragement }
 * @param {string} text       学生写的小段
 * @param {string} objName    对象名（如「台灯」）
 * @param {string} unitName   单元名（如「底座」；A 类传「组成与顺序」）
 * @param {string[]} points   该单元应覆盖的要点（树形图节点文案）
 * @param {string} reference  参考答案（用于对照，不强制一致）
 */
export async function gradeSegment(text, { objName, unitName, points = [], reference = '' }) {
  const sys = `你是一位耐心温柔的小学语文老师，正在批改一位小学生写的一小段话，内容是描写「${objName}·${unitName}」。
本环节是"边学边写"的分段练习，只要求把给定的感觉要点用通顺的话串起来，不要求修辞，不要求华丽。

【评判要点】这一小段应该包含以下感觉点（覆盖到大意即可，用词不必完全一样）：
${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

【打分规则】满分 100：
- 覆盖了全部要点且语句通顺 → 85~100
- 漏了 1 个要点 → 70~84
- 漏了 2 个及以上要点 → 60~69
- 几乎没写到要点 / 跑题 → 60 以下
判定 pass 的门槛是 total ≥ 70。

【语气】鼓励为主，绝不出现"很差""不及格"等负面词；指出缺什么时用"如果再写上…就更完整啦"的句式。

【输出】严格返回 JSON，不要任何多余文字：
{
  "total": 数字,
  "missing": ["漏掉的要点(没有则空数组)"],
  "highlight": "写得好的一点(具体)",
  "suggestion": "一条温柔的小建议",
  "encouragement": "一句鼓励"
}`;

  const user = `【学生写的小段】
${text}

${reference ? `【老师参考(仅供你对照要点，不要求学生写得一样)】\n${reference}\n` : ''}
请按上述规则严格返回 JSON 评分。`;

  const raw = await callLLM([{ role: 'user', content: user }], sys, 600);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI 返回格式异常');
  return JSON.parse(match[0]);
}

/* ─── C 类综合大作文：完整 4 维评分 ─── */
/**
 * @param {string} text     学生作文
 * @param {object} opts     { objName, order, points[] }
 *   order  观察顺序文案（如「由下到上」「整体→局部、由外到内」）
 *   points 全局树形总图所有感觉点（用于"感觉点准确"维度核对）
 */
export async function gradeEssay(text, { objName, order = '', points = [] }) {
  const sys = `你是一位耐心温柔的小学语文老师，正在批改一位小学生写的描写${objName}的短文。

【整体原则】
- 鼓励为主，诊断具体。不要笼统说"写得好"，要指出好在哪里。
- 如果有问题，语气要柔和，用"如果…就更好了"这样的句式。
- 不要给负面评价（如"很差""很糟糕"），改用"再加点…会更完整"。
- 本期训练核心是掌握感觉方法与有序描写，不要求使用比喻、拟人等修辞手法，语言应平实、准确、具体。

【评分维度】（总分 100）
1. 组成完整 (30 分)：全文体现"看组成 → 排顺序 → 再感觉"逻辑，按"总-分-分-分"结构书写，第一段总起写组成，后续每段分别描写一个部分，部件、功能无缺失。
2. 顺序正确 (30 分)：各部分描写顺序与既定观察顺序${order ? `（${order}）` : ''}一致；段落内部对特征的描写有序。
3. 感觉点准确 (30 分)：完整、准确地包含下列全部感觉点（遗漏酌情扣分）：
${points.length ? points.map((p, i) => `   ${i + 1}. ${p}`).join('\n') : '   （颜色、形状、触感、声音、气息、作用等）'}
4. 语句通顺 (10 分)：用词准确，句子衔接流畅，文意连贯，无语病。

【补充规则】不要求使用比喻、拟人等修辞，使用修辞不加分、不扣分。

【输出格式】严格按 JSON 返回，不要加任何其他文字：
{
  "total": 总分数字,
  "scores": { "组成完整": 数字, "顺序正确": 数字, "感觉点准确": 数字, "语句通顺": 数字 },
  "highlights": ["写得好的地方1(具体)", "写得好的地方2"],
  "suggestions": ["如果..就更好(具体)", "可以再加.."],
  "encouragement": "一句温暖的鼓励话"
}`;

  const user = `这是一位小学生写的描写"${objName}"的短文，请按照上述 4 维标准评分：

【学生作品】
${text}

请严格按 JSON 格式返回评分结果。`;

  const raw = await callLLM([{ role: 'user', content: user }], sys, 900);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI 返回格式异常');
  return JSON.parse(match[0]);
}
