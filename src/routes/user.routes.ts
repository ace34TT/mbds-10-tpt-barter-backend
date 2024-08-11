import express from "express";
import { createUser,getUsers,getUserById,updateUser,deleteUser, getUsersAdminHandler } from "../controllers/user.controllers";

const router = express.Router();
// admin
router.get('/admin', getUsersAdminHandler);

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export { router as UserRoutes };
