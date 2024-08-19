import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    setUserPlayerIdHandler
} from "../controllers/user.controllers";

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/player/:userId', setUserPlayerIdHandler);

export { router as UserRoutes };
