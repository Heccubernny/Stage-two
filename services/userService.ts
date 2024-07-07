import { Organisation } from '../entities/Organisation';
import { User } from '../entities/User';

export class UserService {
  static async findUserById(userId: string) {
    return User.findOne({ where: { userId } });
  }

  static async checkUserAccess(userId: string, requesterId: string) {
    const organisations = await Organisation.createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.users', 'user')
      .where('user.userId = :userId', { userId: requesterId })
      .getMany();

    return organisations.some((org) =>
      org.users.some((u) => u.userId === userId)
    );
  }
}
