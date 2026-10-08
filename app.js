// How Well Do You Know Me? — vanilla ES module SPA (no build step).
const $app = document.getElementById('app');
const LS = 'hwdyk';

/* ---------- i18n ---------- */
const T = {
  en: {
    brand: 'How Well Do You Know Me?', tag: 'Make a quiz about yourself. Share the link. See who really knows you.',
    create: 'Create my quiz', mine: 'My quizzes', edit: 'Edit', open: 'Open', editTitle: 'Build your quiz',
    quizTitle: 'Quiz title', quizTitlePh: 'e.g. How well do you know Alex?', choice: 'Multiple choice', free: 'Free text',
    addChoice: 'Multiple choice', addFree: 'Free text', up: 'Move up', down: 'Move down', del: 'Delete',
    qPh: 'Type your question', optPh: 'Option', addOpt: 'Add option', rmOpt: 'Remove option', correct: 'Correct answer',
    pickCorrect: 'Tap the circle next to the correct option.', ansPh: 'The correct answer',
    looseHint: 'Matching ignores capitals, spaces, punctuation and accents.', preview: 'Preview', publish: 'Create share link',
    save: 'Save changes', previewMode: 'Preview mode', back: 'Back to editor', eTitle: 'Add a quiz title first.',
    eQ: 'Finish the highlighted question.', saved: 'Saved!', err: 'Something went wrong. Try again.', copy: 'Copy',
    copied: 'Copied!', shareHdr: 'Send this link to your friends', editHdr: 'Keep this private link to edit later',
    start: 'Start quiz', qs: 'questions', prev: 'Back', next: 'Next', finish: 'See my score', yourAns: 'Your answer',
    m4: 'You know me very well!', m3: 'You know me pretty well.', m2: 'Not bad, but there’s more to learn.',
    m1: 'We need to hang out more!', retry: 'Try again', makeOwn: 'Make your own quiz', nf: 'This quiz doesn’t exist.',
    delQuiz: 'Delete quiz', delQ: 'Delete this quiz forever?', noAccess: 'This edit link is missing or invalid.',
    home: 'Go home', loading: 'Loading…',
  },
  th: {
    brand: 'คุณรู้จักฉันดีแค่ไหน?', tag: 'สร้างควิซเกี่ยวกับตัวคุณ แชร์ลิงก์ แล้วดูว่าใครรู้จักคุณจริงๆ',
    create: 'สร้างควิซของฉัน', mine: 'ควิซของฉัน', edit: 'แก้ไข', open: 'เปิด', editTitle: 'สร้างควิซของคุณ',
    quizTitle: 'ชื่อควิซ', quizTitlePh: 'เช่น คุณรู้จักมินดีแค่ไหน?', choice: 'ตัวเลือก', free: 'พิมพ์ตอบ',
    addChoice: 'ข้อตัวเลือก', addFree: 'ข้อพิมพ์ตอบ', up: 'เลื่อนขึ้น', down: 'เลื่อนลง', del: 'ลบ',
    qPh: 'พิมพ์คำถาม', optPh: 'ตัวเลือก', addOpt: 'เพิ่มตัวเลือก', rmOpt: 'ลบตัวเลือก', correct: 'คำตอบที่ถูก',
    pickCorrect: 'แตะวงกลมหน้าตัวเลือกที่ถูกต้อง', ansPh: 'คำตอบที่ถูกต้อง',
    looseHint: 'ตรวจแบบหลวม: ไม่สนตัวพิมพ์เล็ก/ใหญ่ ช่องว่าง เครื่องหมายวรรคตอน และสำเนียง (accent)',
    preview: 'ทดลองเล่น', publish: 'สร้างลิงก์แชร์', save: 'บันทึก', previewMode: 'โหมดทดลองเล่น', back: 'กลับไปแก้ไข',
    eTitle: 'ใส่ชื่อควิซก่อน', eQ: 'กรอกข้อที่ไฮไลต์ให้ครบ', saved: 'บันทึกแล้ว!', err: 'เกิดข้อผิดพลาด ลองอีกครั้ง',
    copy: 'คัดลอก', copied: 'คัดลอกแล้ว!', shareHdr: 'ส่งลิงก์นี้ให้เพื่อนๆ', editHdr: 'เก็บลิงก์ส่วนตัวนี้ไว้แก้ไขภายหลัง',
    start: 'เริ่มทำควิซ', qs: 'ข้อ', prev: 'ย้อนกลับ', next: 'ถัดไป', finish: 'ดูคะแนน', yourAns: 'คำตอบของคุณ',
    m4: 'คุณรู้จักฉันดีมาก!', m3: 'คุณรู้จักฉันค่อนข้างดี', m2: 'ไม่เลว แต่ยังมีอีกเยอะที่ต้องรู้', m1: 'เราต้องไปเจอกันบ่อยๆ แล้ว!',
    retry: 'ลองอีกครั้ง', makeOwn: 'สร้างควิซของคุณเอง', nf: 'ไม่พบควิซนี้', delQuiz: 'ลบควิซ', delQ: 'ลบควิซนี้ถาวรใช่ไหม?',
    noAccess: 'ลิงก์แก้ไขไม่ถูกต้องหรือหายไป', home: 'กลับหน้าแรก', loading: 'กำลังโหลด…',
  },
};
let lang = localStorage.getItem(LS + ':lang') || ((navigator.language || '').startsWith('th') ? 'th' : 'en');
const t = (k) => T[lang][k] ?? T.en[k] ?? k;

const DEFAULTS = {
  en: [
    ['free', 'What is my favorite food?'],
    ['choice', 'Which drink would I pick?', ['Coffee', 'Tea', 'Bubble tea', 'Water']],
    ['choice', 'Am I a morning person or a night owl?', ['Morning person', 'Night owl']],
    ['free', 'Where would I most like to travel?'],
    ['choice', 'Which season do I like best?', ['Summer', 'Rainy season', 'Winter']],
    ['free', 'What is my dream job?'],
  ],
  th: [
    ['free', 'อาหารจานโปรดของฉันคืออะไร?'],
    ['choice', 'ฉันจะเลือกดื่มอะไร?', ['กาแฟ', 'ชา', 'ชานมไข่มุก', 'น้ำเปล่า']],
    ['choice', 'ฉันเป็นมนุษย์เช้าหรือมนุษย์ราตรี?', ['มนุษย์เช้า', 'มนุษย์ราตรี']],
    ['free', 'ที่ที่ฉันอยากไปเที่ยวมากที่สุดคือที่ไหน?'],
    ['choice', 'ฉันชอบฤดูไหนที่สุด?', ['ร้อน', 'ฝน', 'หนาว']],
    ['free', 'อาชีพในฝันของฉันคืออะไร?'],
  ],
};

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Same loose matching as api/_lib.js — used only for the local preview.
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/[\p{P}\p{S}\s]+/gu, '');
const uid = () => Math.random().toString(36).slice(2, 9);

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2200);
}

async function api(path, { method = 'GET', body, token } = {}) {
  const r = await fetch('/api' + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { 'x-edit-token': token } : {}) },
    body: body && JSON.stringify(body),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(d.error || 'error'), { status: r.status });
  return d;
}

const getMine = () => { try { return JSON.parse(localStorage.getItem(LS + ':mine')) || []; } catch { return []; } };
const setMine = (list) => { try { localStorage.setItem(LS + ':mine', JSON.stringify(list)); } catch { /* storage unavailable */ } };
const remember = (id, token, title) => setMine([{ id, token, title }, ...getMine().filter((m) => m.id !== id)]);

/* ---------- router + event delegation ---------- */
let view = () => {};   // re-renders the current screen (used by the language toggle)
let act = {};          // click handlers of the current screen: data-act="name"
let onIn = () => {};   // input handler of the current screen

const go = (p) => { history.pushState({}, '', p); route(); window.scrollTo(0, 0); };
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (a) { e.preventDefault(); return go(a.getAttribute('href')); }
  const b = e.target.closest('[data-act]');
  if (b && !b.disabled) act[b.dataset.act]?.(b, e);
});
$app.addEventListener('input', (e) => onIn(e));
$app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'fa') act.next?.(); });
addEventListener('popstate', route);

function setChrome() {
  document.documentElement.lang = lang;
  document.title = t('brand');
  document.getElementById('brand').textContent = t('brand');
  document.getElementById('lang').textContent = lang === 'th' ? 'EN' : 'ไทย';
}
document.getElementById('lang').addEventListener('click', () => {
  lang = lang === 'th' ? 'en' : 'th';
  localStorage.setItem(LS + ':lang', lang);
  setChrome();
  view();
});

function route() {
  const p = location.pathname;
  let m;
  if (p === '/new') return editor();
  if ((m = p.match(/^\/edit\/([\w-]+)$/))) return editor(m[1]);
  if ((m = p.match(/^\/q\/([\w-]+)$/))) return take(m[1]);
  return home();
}

function message(key) {
  view = () => message(key);
  act = {};
  $app.innerHTML = `<section class="wrap narrow center"><h2>${esc(t(key))}</h2><a class="btn" data-link href="/">${t('home')}</a></section>`;
}

/* ---------- home ---------- */
function home() {
  view = home;
  act = {};
  const mine = getMine();
  $app.innerHTML = `<section class="wrap">
    <div class="hero"><h1>${esc(t('brand'))}</h1><p>${esc(t('tag'))}</p>
      <a class="btn" data-link href="/new">${t('create')}</a></div>
    ${mine.length ? `<h2>${t('mine')}</h2><ul class="list">${mine.map((m) => `<li><span>${esc(m.title || m.id)}</span>
      <a class="link" data-link href="/edit/${esc(m.id)}#${esc(m.token)}">${t('edit')}</a>
      <a class="link" data-link href="/q/${esc(m.id)}">${t('open')}</a></li>`).join('')}</ul>` : ''}
  </section>`;
}

/* ---------- editor ---------- */
let D = null; // draft: { id, token, title, qs: [{ id, type, text, options, a, bad }], share }
const mk = ([type, text, opts]) => ({ id: uid(), type, text, options: opts ? [...opts] : ['', ''], a: type === 'choice' ? null : '' });
const hasAns = (q) => (q.type === 'choice' ? q.a !== null && q.a !== undefined : norm(q.a) !== '');
const badQ = (q) => !q.text.trim() || !hasAns(q) || (q.type === 'choice' && (q.options.length < 2 || q.options.some((o) => !o.trim())));

async function editor(id) {
  if (!id) {
    if (!D || D.id) D = { id: null, token: null, title: '', qs: DEFAULTS[lang].map(mk) };
    return drawEditor();
  }
  if (D?.id === id) return drawEditor();
  const token = location.hash.slice(1) || getMine().find((m) => m.id === id)?.token;
  if (!token) return message('noAccess');
  view = () => {};
  $app.innerHTML = `<p class="wrap center">${t('loading')}</p>`;
  try {
    const q = await api('/quiz/' + id, { token });
    D = { id, token, title: q.title, qs: q.questions.map((x) => ({ id: uid(), type: x.type, text: x.text, options: x.options || ['', ''], a: x.a })) };
    remember(id, token, q.title);
    drawEditor();
  } catch (e) { message(e.status === 404 ? 'nf' : 'noAccess'); }
}

const card = (q, i) => `<article class="card ${q.bad ? 'bad' : ''}" data-i="${i}">
  <header><b>${i + 1}</b><span class="tag">${t(q.type)}</span><div class="tools">
    <button data-act="up" aria-label="${t('up')}" ${i ? '' : 'disabled'}>↑</button>
    <button data-act="down" aria-label="${t('down')}" ${i < D.qs.length - 1 ? '' : 'disabled'}>↓</button>
    <button data-act="del" aria-label="${t('del')}">✕</button></div></header>
  <input data-f="text" maxlength="300" value="${esc(q.text)}" placeholder="${esc(t('qPh'))}" aria-label="${esc(t('qPh'))}">
  ${q.type === 'choice'
    ? `<div class="opts">${q.options.map((o, j) => `<div class="opt">
        <input type="radio" name="c${i}" data-f="correct" data-j="${j}" ${q.a === j ? 'checked' : ''} aria-label="${esc(t('correct'))}">
        <input data-f="opt" data-j="${j}" maxlength="120" value="${esc(o)}" placeholder="${esc(t('optPh'))} ${j + 1}">
        ${q.options.length > 2 ? `<button data-act="rmopt" data-j="${j}" aria-label="${t('rmOpt')}">✕</button>` : ''}</div>`).join('')}
      ${q.options.length < 6 ? `<button class="link" data-act="addopt">+ ${t('addOpt')}</button>` : ''}
      <p class="hint">${t('pickCorrect')}</p></div>`
    : `<div class="opts"><input data-f="ans" maxlength="120" value="${esc(q.a)}" placeholder="${esc(t('ansPh'))}" aria-label="${esc(t('ansPh'))}">
      <p class="hint">${t('looseHint')}</p></div>`}
</article>`;

function shareBox() {
  const share = `${location.origin}/q/${D.id}`;
  const edit = `${location.origin}/edit/${D.id}#${D.token}`;
  const row = (h, url) => `<p><b>${h}</b></p><div><input readonly value="${esc(url)}" aria-label="${esc(h)}"><button class="btn" data-act="copy" data-url="${esc(url)}">${t('copy')}</button></div>`;
  return `<div class="share">${row(t('shareHdr'), share)}${row(t('editHdr'), edit)}</div>`;
}

function drawEditor() {
  view = drawEditor;
  const focus = document.activeElement?.dataset?.f;
  $app.innerHTML = `<section class="wrap">
    <h1>${t('editTitle')}</h1>
    <label class="f"><span>${t('quizTitle')}</span><input id="ttl" maxlength="80" value="${esc(D.title)}" placeholder="${esc(t('quizTitlePh'))}"></label>
    ${D.qs.map(card).join('')}
    <div class="row"><button class="btn ghost" data-act="add" data-type="choice">+ ${t('addChoice')}</button>
      <button class="btn ghost" data-act="add" data-type="free">+ ${t('addFree')}</button></div>
    ${D.share ? shareBox() : ''}
    ${D.id ? `<button class="link" data-act="remove">${t('delQuiz')}</button>` : ''}
    <div class="bar"><button class="btn ghost" data-act="preview">${t('preview')}</button>
      <button class="btn" data-act="save">${D.id ? t('save') : t('publish')}</button></div>
  </section>`;
  void focus;

  const idx = (b) => +b.closest('[data-i]').dataset.i;
  act = {
    add: (b) => { D.qs.push(mk([b.dataset.type])); drawEditor(); $app.querySelector('.card:last-of-type input')?.focus(); },
    del: (b) => { D.qs.splice(idx(b), 1); drawEditor(); },
    up: (b) => { const i = idx(b); [D.qs[i - 1], D.qs[i]] = [D.qs[i], D.qs[i - 1]]; drawEditor(); },
    down: (b) => { const i = idx(b); [D.qs[i + 1], D.qs[i]] = [D.qs[i], D.qs[i + 1]]; drawEditor(); },
    addopt: (b) => { D.qs[idx(b)].options.push(''); drawEditor(); },
    rmopt: (b) => {
      const q = D.qs[idx(b)], j = +b.dataset.j;
      q.options.splice(j, 1);
      q.a = q.a === j ? null : q.a > j ? q.a - 1 : q.a;
      drawEditor();
    },
    copy: async (b) => { try { await navigator.clipboard.writeText(b.dataset.url); toast(t('copied')); } catch { b.previousElementSibling.select(); } },
    preview: () => {
      if (!validate()) return;
      const questions = D.qs.map((q, i) => ({ ...q, id: String(i) }));
      play({ title: D.title, questions }, {
        preview: true, exit: drawEditor,
        score: async (A) => {
          const results = questions.map((q) => (q.type === 'choice' ? A[q.id] === q.a : norm(A[q.id]) === norm(q.a)));
          return { score: results.filter(Boolean).length, total: results.length, results };
        },
      });
    },
    save: async () => {
      if (!validate()) return;
      const body = { title: D.title.trim(), questions: D.qs.map(({ type, text, options, a }) => ({ type, text, options, a })) };
      try {
        if (D.id) await api('/quiz/' + D.id, { method: 'PUT', token: D.token, body });
        else { const r = await api('/quiz', { method: 'POST', body }); D.id = r.id; D.token = r.token; }
        remember(D.id, D.token, body.title);
        D.share = true;
        drawEditor();
        toast(t('saved'));
        $app.querySelector('.share')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch { toast(t('err')); }
    },
    remove: async () => {
      if (!confirm(t('delQ'))) return;
      try {
        await api('/quiz/' + D.id, { method: 'DELETE', token: D.token });
        setMine(getMine().filter((m) => m.id !== D.id));
        D = null;
        go('/');
      } catch { toast(t('err')); }
    },
  };
  onIn = (e) => {
    const el = e.target;
    if (el.id === 'ttl') { D.title = el.value; return; }
    const card = el.closest('[data-i]');
    if (!card) return;
    const q = D.qs[+card.dataset.i], j = +el.dataset.j;
    if (el.dataset.f === 'text') q.text = el.value;
    else if (el.dataset.f === 'opt') q.options[j] = el.value;
    else if (el.dataset.f === 'correct') q.a = j;
    else if (el.dataset.f === 'ans') q.a = el.value;
    q.bad = false;
    card.classList.remove('bad');
  };
}

function validate() {
  if (!D.title.trim()) { toast(t('eTitle')); $app.querySelector('#ttl')?.focus(); return false; }
  const bad = D.qs.findIndex(badQ);
  D.qs.forEach((q, i) => { q.bad = i === bad; });
  if (bad > -1) { drawEditor(); toast(t('eQ')); $app.querySelector('.card.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
  return true;
}

/* ---------- take a quiz ---------- */
async function take(id) {
  view = () => {};
  $app.innerHTML = `<p class="wrap center">${t('loading')}</p>`;
  try {
    const qz = await api('/quiz/' + id);
    play(qz, { score: (answers) => api('/quiz/' + id, { method: 'POST', body: { answers } }) });
  } catch (e) { message(e.status === 404 ? 'nf' : 'err'); }
}

function play(qz, o) {
  let i = 0, A = {};
  const n = qz.questions.length;
  const cur = () => qz.questions[i];
  const ok = () => { const v = A[cur().id]; return typeof v === 'number' || String(v ?? '').trim() !== ''; };
  const pill = o.preview ? `<div class="pill">${t('previewMode')} · <button class="link" data-act="exit">${t('back')}</button></div>` : '';
  const exit = () => o.exit?.();

  const intro = () => {
    view = intro;
    act = { start: () => { i = 0; A = {}; draw(); }, exit };
    $app.innerHTML = `<section class="wrap narrow center">${pill}<h1>${esc(qz.title)}</h1><p class="hint">${n} ${t('qs')}</p>
      <button class="btn" data-act="start">${t('start')}</button></section>`;
  };

  const draw = () => {
    view = draw;
    const q = cur();
    act = {
      exit,
      pick: (b) => { A[q.id] = +b.dataset.j; draw(); },
      prev: () => { i--; draw(); },
      next: () => { if (!ok()) return; if (i < n - 1) { i++; draw(); } else finish(); },
    };
    onIn = (e) => {
      if (e.target.id !== 'fa') return;
      A[q.id] = e.target.value;
      $app.querySelector('[data-act=next]').disabled = !ok();
    };
    $app.innerHTML = `<section class="wrap narrow">${pill}
      <div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${i + 1}"><i style="width:${((i + 1) / n) * 100}%"></i></div>
      <p class="hint">${i + 1} / ${n}</p><h2>${esc(q.text)}</h2>
      ${q.type === 'choice'
        ? q.options.map((x, j) => `<button class="choice ${A[q.id] === j ? 'on' : ''}" data-act="pick" data-j="${j}">${esc(x)}</button>`).join('')
        : `<input id="fa" maxlength="300" autocomplete="off" value="${esc(A[q.id] ?? '')}" placeholder="${esc(t('yourAns'))}" aria-label="${esc(t('yourAns'))}">`}
      <div class="bar">${i ? `<button class="btn ghost" data-act="prev">${t('prev')}</button>` : '<span></span>'}
        <button class="btn" data-act="next" ${ok() ? '' : 'disabled'}>${i === n - 1 ? t('finish') : t('next')}</button></div>
    </section>`;
    $app.querySelector('#fa')?.focus();
  };

  const finish = async () => {
    try { result(await o.score(A)); } catch { toast(t('err')); }
  };

  const result = (r) => {
    view = () => result(r);
    const p = r.score / r.total;
    const msg = t(p >= 0.8 ? 'm4' : p >= 0.6 ? 'm3' : p >= 0.4 ? 'm2' : 'm1');
    act = { retry: intro, exit };
    $app.innerHTML = `<section class="wrap narrow center">${pill}
      <h2 class="score"><b>${r.score}/${r.total}</b>${esc(msg)}</h2>
      <div class="dots">${r.results.map((x) => `<i class="${x ? 'y' : 'n'}" aria-label="${x ? 'correct' : 'wrong'}">${x ? '✓' : '✗'}</i>`).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn ghost" data-act="retry">${t('retry')}</button>
        ${o.preview ? `<button class="btn" data-act="exit">${t('back')}</button>` : `<a class="btn" data-link href="/new">${t('makeOwn')}</a>`}</div>
    </section>`;
  };

  intro();
}

setChrome();
route();
