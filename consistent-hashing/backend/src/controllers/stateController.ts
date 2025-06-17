import { Router } from 'express';
import { ConsistentHashing } from '../consistentHashing';

const ch = new ConsistentHashing(3);
const keys: string[] = [];

const router = Router();

router.post('/servers', (req, res) => {
  const { id, vnodeCount } = req.body;
  ch.addServer(id);
  res.json({ ok: true });
});

router.delete('/servers/:id', (req, res) => {
  ch.removeServer(req.params.id);
  res.json({ ok: true });
});

router.post('/keys', (req, res) => {
  const { key } = req.body;
  keys.push(key);
  res.json({ ok: true });
});

router.get('/state', (req, res) => {
  res.json(ch.getState(keys));
});

export default router;
