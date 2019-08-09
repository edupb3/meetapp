import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const { user } = req.body;
    const { meetupId } = req.params;
    const {
      id,
      user_id,
      title,
      description,
      location,
      date,
    } = await Meetup.findByPk(meetupId);
    const { name, email } = await User.findByPk(user_id);

    const subscriber = await User.findAll({
      where: { email: user.email },
      attributes: ['id', 'name', 'email'],
    });

    const subscriptionDetails = await Subscription.create({
      user_id: subscriber[0].id,
      meetup_id: meetupId,
    });

    return res.json({
      meetup: { id, title, description, location, date },
      organizer: { id: user_id, name, email },
      subscriber,
      subscriptionDetails,
    });
  }
}
export default new SubscriptionController();
