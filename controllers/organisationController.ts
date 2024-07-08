import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { CustomRequest } from '../interfaces/authInterface';
import { OrganisationService } from '../services/organisationService';
import { ERROR_MESSAGE, SUCCESS_RESPONSE_CONSTANT } from '../utils/constant';
import { ResponseHandler } from '../utils/response';

export class OrganisationController {
  static async getAll(req: CustomRequest, res: Response) {
    try {
      const userId = req.user.userId;
      const organisations = await OrganisationService.getAllOrganisations(
        userId
      );
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.ORG.RETREIVE_SUCCESS,
        {
          organisations,
        }
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : new Error(ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN),
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async getOne(req: CustomRequest, res: Response) {
    try {
      const { orgId } = req.params;
      const userId = req.user.userId;
      const organisation = await OrganisationService.getOneOrganisation(
        orgId,
        userId
      );

      if (!organisation) {
        return ResponseHandler.error(
          res,
          ERROR_MESSAGE.ORG.NOT_FOUND,
          HttpStatusCodes.NOT_FOUND
        );
      }

      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.ORG.RETREIVE_SUCCESS,
        organisation
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        new Error(ERROR_MESSAGE.ORG.CLIENT_ERROR),
        HttpStatusCodes.BAD_REQUEST
      );
    }
  }

  static async create(req: CustomRequest, res: Response) {
    try {
      const { name, description } = req.body;
      const userId = req.user.userId;
      const organisation = await OrganisationService.createOrganisation(
        name,
        description,
        userId
      );

      const data = {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      };

      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.ORG.CREATE_SUCCESS,
        data
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : new Error(ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN),
        HttpStatusCodes.BAD_REQUEST
      );
    }
  }

  static async addUser(req: Request, res: Response) {
    try {
      const { orgId } = req.params;
      const { userId } = req.body;
      await OrganisationService.addUserToOrganisation(orgId, userId);
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.ORG.ADD_USER_SUCCESS,
        []
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : new Error(ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN),
        HttpStatusCodes.NOT_FOUND
      );
    }
  }
}
