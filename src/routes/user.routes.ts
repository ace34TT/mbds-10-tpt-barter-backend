import express from "express";
import { createUser,getUsers,getUserById,updateUser,deleteUser } from "../controllers/user.controllers";

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export { router as UserRoutes };
