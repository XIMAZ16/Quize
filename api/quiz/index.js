const crypto = require('crypto');
const { redis, sha, clean, send } = require('../_lib');

// POST /api/quiz -> { id, token }
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  try {
    const c = clean(req.body);
    if (c.error) return send(res, 400, { error: c.error });
    const token = crypto.randomBytes(24).toString('base64url');
    for (let tries = 0; tries < 5; tries++) {
      const id = crypto.randomBytes(6).toString('base64url');
      const data = { id, title: c.title, questions: c.questions, th: sha(token), at: Date.now() };
      if (await redis.set('quiz:' + id, data, { nx: true })) return send(res, 201, { id, token });
    }
    return send(res, 500, { error: 'id_collision' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'server_error' });
  }
};
