import {
  startOfDay,
  endOfDay,
  format,
  getTime,
  parseISO,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;
    const searchDate = parseISO(date);
    const meetup = await Meetup.findAll({
      where: {
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(meetup);
  }

  async store(req, res) {
    const { title, description, location, date, file_id } = req.body;
    const searchDate = getTime(Number(date));

    if (isBefore(searchDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Cannot register events on this date' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date: format(searchDate, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      user_id: req.userId,
      file_id,
    });
    return res.json(meetup);
  }

  async update(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to edit this meeting.' });
    }
    if (meetup.past) {
      return res.status(400).json({ error: 'This event cannot be edited.' });
    }
    const { title, description } = await meetup.update(req.body);

    return res.json({ title, description });
  }

  async delete(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to cancel this meeting.' });
    }
    if (meetup.past) {
      return res.status(400).json({ error: 'This event cannot be canceled.' });
    }
    await meetup.destroy();
    return res.status(204).json({ ok: 'ok' });
  }
}
export default new MeetupController();
