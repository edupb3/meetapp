import { Router } from 'express';
import multer from 'multer';
import auth from './app/middlewares/auth';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const route = new Router();

const upload = multer(multerConfig);

route.post('/user', UserController.store);
route.post('/session', SessionController.store);

route.use(auth);
route.put('/user', UserController.update);
route.post('/files', upload.single('avatar'), FileController.store);

route.get('/', (req, res) => {
  return res.json({ message: 'Olá' });
});

export default route;
