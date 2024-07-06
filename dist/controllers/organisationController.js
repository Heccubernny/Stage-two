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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const organisationService_1 = require("../services/organisationService");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
class OrganisationController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const organisations = yield organisationService_1.OrganisationService.getAllOrganisations(userId);
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.ORG.RETREIVE_SUCCESS, {
                    organisations,
                });
            }
            catch (error) {
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN), http_status_codes_1.default.INTERNAL_SERVER_ERROR);
            }
        });
    }
    static getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orgId } = req.params;
                const userId = req.user.userId;
                const organisation = yield organisationService_1.OrganisationService.getOneOrganisation(orgId, userId);
                if (!organisation) {
                    return response_1.ResponseHandler.error(res, constant_1.ERROR_MESSAGE.ORG.NOT_FOUND, http_status_codes_1.default.NOT_FOUND);
                }
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.ORG.RETREIVE_SUCCESS, organisation);
            }
            catch (error) {
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN), http_status_codes_1.default.INTERNAL_SERVER_ERROR);
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                const userId = req.user.userId;
                const organisation = yield organisationService_1.OrganisationService.createOrganisation(name, description, userId);
                const data = {
                    orgId: organisation.orgId,
                    name: organisation.name,
                    description: organisation.description,
                };
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.ORG.CREATE_SUCCESS, data);
            }
            catch (error) {
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN), http_status_codes_1.default.BAD_REQUEST);
            }
        });
    }
    static addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orgId } = req.params;
                const { userId } = req.body;
                yield organisationService_1.OrganisationService.addUserToOrganisation(orgId, userId);
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.ORG.ADD_USER_SUCCESS, []);
            }
            catch (error) {
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN), http_status_codes_1.default.NOT_FOUND);
            }
        });
    }
}
exports.OrganisationController = OrganisationController;
