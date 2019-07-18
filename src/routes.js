import { Router } from 'express';

const route = new Router();

route.get('/', (req, res) => {
  return res.json({ message: 'Olá' });
});

export default route;
