import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async store(req, res) {
    const { user } = req.body;
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    if (meetup.past) {
      return res.status(401).json({
        error: 'Unable to subscribe to events that have already expired',
      });
    }

    const subscriber = await User.findAll({
      where: { email: user.email },
      attributes: ['id', 'name', 'email'],
    });

    const checkSubscribe = await Subscription.findOne({
      where: { user_id: subscriber[0].id, meetup_id: meetupId },
    });

    if (checkSubscribe) {
      return res.status(400).json({
        error: 'User already subscribed to this event',
      });
    }

    const checkHour = await Subscription.findOne({
      where: { user_id: subscriber[0].id },
      include: [
        {
          model: Meetup,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkHour) {
      return res.status(400).json({
        error: 'User already subscribed to this time in other event',
      });
    }

    const subscriptionDetails = await Subscription.create({
      user_id: subscriber[0].id,
      meetup_id: meetupId,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      subscriber,
    });

    return res.json({
      meetup,
      subscriber,
      subscriptionDetails,
    });
  }
}
export default new SubscriptionController();
