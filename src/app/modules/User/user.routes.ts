import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import { fileUploader } from '../../../helpers/fileUploaders';

const router = express.Router();

router.post(
    "/",
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),userController.createAdmin);

export const userRoutes = router;