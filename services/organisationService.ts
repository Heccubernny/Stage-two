import { validate } from "class-validator";
import { AppDataSource } from "../data_source";
import { Organisation } from "../entities/Organisation";
import { User } from "../entities/User";

export class OrganisationService {
  static async getAllOrganisations(userId?: string) {
    const organisationRepository = AppDataSource.getRepository(Organisation);
    return (
      organisationRepository
        .createQueryBuilder("organisation")
        // .innerJoin('organisation.users', 'user', 'user.userId = :userId', {
        //   userId,
        // })
        .getMany()
    );
  }

  static async getOneOrganisation(orgId: string, userId: string) {
    return AppDataSource.getRepository(Organisation)
      .createQueryBuilder("organisation")
      .innerJoin("organisation.users", "user", "user.userId = :userId", {
        userId,
      })
      .where("organisation.orgId = :orgId", { orgId })
      .getOne();
  }

  static async createOrganisation(
    name: string,
    description: string,
    userId: string
  ) {
    const userRepository = AppDataSource.getRepository(User);
    const organisationRepository = AppDataSource.getRepository(Organisation);

    const organisation = new Organisation();
    organisation.name = name;
    organisation.description = description;
    const user = await userRepository.findOneBy({ userId });
    organisation.users = [user!];

    const errors = await validate(organisation);
    if (errors.length > 0) {
      throw new Error(" Client error");
    }

    return organisationRepository.save(organisation);
  }

  static async addUserToOrganisation(orgId: string, userId: string) {
    const organisationRespository = AppDataSource.getRepository(Organisation);
    const organisation = await organisationRespository.findOneBy({ orgId });
    const userRespository = AppDataSource.getRepository(User);
    const user = await userRespository.findOneBy({ userId });

    if (!organisation || !user) {
      throw new Error("Organisation or User not found");
    }

    if (!organisation.users) {
      organisation.users = [];
    }
    organisation.users.push(user);

    return organisationRespository.save(organisation);
  }
}
