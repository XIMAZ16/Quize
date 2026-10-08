const { Redis } = require('@upstash/redis');
const crypto = require('crypto');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const str = (v, n) => String(v ?? '').trim().slice(0, n);

// Loose match: ignore case, spaces, punctuation and Latin accents (Thai marks are kept).
const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, '');

// Validate and normalise a quiz payload. Question ids become their index.
function clean(b = {}) {
  const title = str(b.title, 80);
  const qs = Array.isArray(b.questions) ? b.questions.slice(0, 50) : [];
  if (!title || !qs.length) return { error: 'title_or_questions_missing' };
  const questions = [];
  for (const [i, q] of qs.entries()) {
    const text = str(q?.text, 300);
    if (!text) return { error: 'empty_question' };
    const id = String(i);
    if (q.type === 'choice') {
      const options = Array.isArray(q.options) ? q.options.slice(0, 6).map((o) => str(o, 120)) : [];
      if (options.length < 2 || options.some((o) => !o) || !Number.isInteger(q.a) || q.a < 0 || q.a >= options.length)
        return { error: 'bad_choice' };
      questions.push({ id, type: 'choice', text, options, a: q.a });
    } else {
      const a = str(q.a, 120);
      if (!norm(a)) return { error: 'empty_answer' };
      questions.push({ id, type: 'free', text, a });
    }
  }
  return { title, questions };
}

const publicQuiz = (q) => ({
  id: q.id,
  title: q.title,
  questions: q.questions.map(({ id, type, text, options }) => ({ id, type, text, options })),
});
const ownerQuiz = ({ th, ...q }) => q;

function score(quiz, answers = {}) {
  const results = quiz.questions.map((q) => {
    const v = answers[q.id];
    return q.type === 'choice' ? v === q.a : norm(str(v, 300)) === norm(q.a);
  });
  return { score: results.filter(Boolean).length, total: results.length, results };
}

function send(res, code, data) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(code).json(data);
}

module.exports = { redis, sha, same, norm, clean, publicQuiz, ownerQuiz, score, send };
