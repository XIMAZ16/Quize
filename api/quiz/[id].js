const { redis, sha, same, clean, publicQuiz, ownerQuiz, score, send } = require('../_lib');

// GET    /api/quiz/:id  public quiz, or full quiz with a valid x-edit-token
// POST   /api/quiz/:id  { answers } -> { score, total, results }
// PUT    /api/quiz/:id  update (x-edit-token)
// DELETE /api/quiz/:id  delete (x-edit-token)
module.exports = async (req, res) => {
  try {
    const id = String(req.query.id || '').replace(/[^\w-]/g, '').slice(0, 32);
    const key = 'quiz:' + id;
    const quiz = id && (await redis.get(key));
    if (!quiz) return send(res, 404, { error: 'not_found' });

    const token = req.headers['x-edit-token'];
    const owner = Boolean(token) && same(sha(token), quiz.th);

    if (req.method === 'POST') return send(res, 200, score(quiz, req.body?.answers));

    if (req.method === 'GET') {
      if (token && !owner) return send(res, 403, { error: 'forbidden' });
      return send(res, 200, owner ? ownerQuiz(quiz) : publicQuiz(quiz));
    }

    if (!owner) return send(res, 403, { error: 'forbidden' });

    if (req.method === 'PUT') {
      const c = clean(req.body);
      if (c.error) return send(res, 400, { error: c.error });
      await redis.set(key, { ...quiz, title: c.title, questions: c.questions, updated: Date.now() });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'DELETE') {
      await redis.del(key);
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'server_error' });
  }
};
