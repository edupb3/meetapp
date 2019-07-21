import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }
    const checkUser = await User.findOne({ where: { email: req.body.email } });
    if (checkUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { name, email } = await User.create(req.body);
    return res.json({ name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({ error: 'User do not exists' });
    }
    if (!(await user.checkPassword(req.body.password))) {
      return res.status(400).json({ error: 'Password wrong' });
    }
    const { name, email } = await user.update(req.body);
    return res.json({ name, email });
  }
}
export default new UserController();
