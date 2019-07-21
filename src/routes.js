import { Router } from 'express';
import UserController from './app/controllers/UserController';

const route = new Router();

route.post('/user', UserController.store);
route.put('/user', UserController.update);

route.get('/', (req, res) => {
  return res.json({ message: 'Olá' });
});

export default route;
