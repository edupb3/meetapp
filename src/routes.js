import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';

const route = new Router();

route.post('/user', UserController.store);
route.post('/session', SessionController.store);

route.use(auth);
route.put('/user', UserController.update);

route.get('/', (req, res) => {
  return res.json({ message: 'Olá' });
});

export default route;
