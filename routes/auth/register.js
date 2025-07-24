import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  // lógica de registro
  res.json({ ok: true });
});

export default router;

