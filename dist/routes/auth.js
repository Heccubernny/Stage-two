"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
exports.default = router;
