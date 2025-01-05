import { Router } from "express";
import { OrganisationController } from "../controllers/organisationController";
import AuthMiddleware from "../middleware/auth";

const router = Router();

router.get("/", OrganisationController.getAll);
router.get(
  "/:orgId",
  AuthMiddleware.authenticateJWT,
  OrganisationController.getOne
);
router.post("/", AuthMiddleware.authenticateJWT, OrganisationController.create);
router.post(
  "/:orgId/users",
  AuthMiddleware.authenticateJWT,
  OrganisationController.addUser
);

export default router;
