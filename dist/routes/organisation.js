"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organisationController_1 = require("../controllers/organisationController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default.authenticateJWT, organisationController_1.OrganisationController.getAll);
router.get('/:orgId', auth_1.default.authenticateJWT, organisationController_1.OrganisationController.getOne);
router.post('/', auth_1.default.authenticateJWT, organisationController_1.OrganisationController.create);
router.post('/:orgId/users', auth_1.default.authenticateJWT, organisationController_1.OrganisationController.addUser);
exports.default = router;
