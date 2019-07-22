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
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      passwordConfirm: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const user = await User.findByPk(req.userId);
    if (user.email !== req.body.email) {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (
      req.body.oldPassword &&
      !(await user.checkPassword(req.body.oldPassword))
    ) {
      return res.status(401).json({ error: 'Password wrong' });
    }
    const { name, email } = await user.update(req.body);
    return res.json({ name, email });
  }
}
export default new UserController();
