// routes/auth/register.js
import express from 'express';
import { registerUser } from '../../controllers/registerController.js'; // ajuste conforme onde seu controller está

const router = express.Router();

router.post('/', registerUser);

export default router;
