'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrganisationController = void 0;
const class_validator_1 = require('class-validator');
const data_source_1 = require('../data-source');
const Organisation_1 = require('../entities/Organisation');
const User_1 = require('../entities/User');
class OrganisationController {
  static getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const userId = req.user.userId;
      const organisationRespository =
        yield data_source_1.AppDataSource.getRepository(
          Organisation_1.Organisation
        );
      const organisations = organisationRespository
        .createQueryBuilder('organisation')
        .innerJoin('organisation.users', 'user', 'user.userId = :userId', {
          userId,
        })
        .getMany();
      res.status(200).json({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: { organisations },
      });
    });
  }
  static getOne(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { orgId } = req.params;
      const userId = req.user.userId;
      const organisation = yield data_source_1.AppDataSource.getRepository(
        Organisation_1.Organisation
      )
        .createQueryBuilder('organisation')
        .innerJoin('organisation.users', 'user', 'user.userId = :userId', {
          userId,
        })
        .where('organisation.orgId = :orgId', { orgId })
        .getOne();
      if (!organisation) {
        return res
          .status(404)
          .json({ status: 'Not found', message: 'Organisation not found' });
      }
      res.status(200).json({
        status: 'success',
        message: 'Organisation retrieved successfully',
        data: organisation,
      });
    });
  }
  static create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { name, description } = req.body;
      const userId = req.user.userId;
      const organisation = new Organisation_1.Organisation();
      organisation.name = name;
      organisation.description = description;
      const user = yield data_source_1.AppDataSource.getRepository(
        User_1.User
      ).findOneBy({ userId });
      organisation.users = [user];
      const errors = yield (0, class_validator_1.validate)(organisation);
      if (errors.length > 0) {
        return res.status(422).json({ errors });
      }
      yield data_source_1.AppDataSource.getRepository(
        Organisation_1.Organisation
      ).save(organisation);
      res.status(201).json({
        status: 'success',
        message: 'Organisation created successfully',
        data: {
          orgId: organisation.orgId,
          name: organisation.name,
          description: organisation.description,
        },
      });
    });
  }
  static addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { orgId } = req.params;
      const { userId } = req.body;
      const organisation = yield data_source_1.AppDataSource.getRepository(
        Organisation_1.Organisation
      ).findOneBy({ orgId });
      const user = yield data_source_1.AppDataSource.getRepository(
        User_1.User
      ).findOneBy({ userId });
      if (!organisation || !user) {
        return res.status(404).json({
          status: 'Not found',
          message: 'Organisation or User not found',
        });
      }
      organisation.users.push(user);
      yield data_source_1.AppDataSource.getRepository(
        Organisation_1.Organisation
      ).save(organisation);
      res.status(200).json({
        status: 'success',
        message: 'User added to organisation successfully',
      });
    });
  }
}
exports.OrganisationController = OrganisationController;
