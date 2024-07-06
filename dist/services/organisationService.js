"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationService = void 0;
const class_validator_1 = require("class-validator");
const data_source_1 = require("../data-source");
const Organisation_1 = require("../entities/Organisation");
const User_1 = require("../entities/User");
class OrganisationService {
    static getAllOrganisations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organisationRepository = data_source_1.AppDataSource.getRepository(Organisation_1.Organisation);
            return organisationRepository
                .createQueryBuilder('organisation')
                .innerJoin('organisation.users', 'user', 'user.userId = :userId', {
                userId,
            })
                .getMany();
        });
    }
    static getOneOrganisation(orgId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return data_source_1.AppDataSource.getRepository(Organisation_1.Organisation)
                .createQueryBuilder('organisation')
                .innerJoin('organisation.users', 'user', 'user.userId = :userId', {
                userId,
            })
                .where('organisation.orgId = :orgId', { orgId })
                .getOne();
        });
    }
    static createOrganisation(name, description, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            const organisationRepository = data_source_1.AppDataSource.getRepository(Organisation_1.Organisation);
            const organisation = new Organisation_1.Organisation();
            organisation.name = name;
            organisation.description = description;
            const user = yield userRepository.findOneBy({ userId });
            organisation.users = [user];
            const errors = yield (0, class_validator_1.validate)(organisation);
            if (errors.length > 0) {
                throw new Error(' Client error');
            }
            return organisationRepository.save(organisation);
        });
    }
    static addUserToOrganisation(orgId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organisationRespository = data_source_1.AppDataSource.getRepository(Organisation_1.Organisation);
            const organisation = yield organisationRespository.findOneBy({ orgId });
            const userRespository = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRespository.findOneBy({ userId });
            if (!organisation || !user) {
                throw new Error('Organisation or User not found');
            }
            console.log({ organisation, user });
            if (!organisation.users) {
                organisation.users = [];
            }
            organisation.users.push(user);
            console.log({ organisation, user });
            return organisationRespository.save(organisation);
        });
    }
}
exports.OrganisationService = OrganisationService;
