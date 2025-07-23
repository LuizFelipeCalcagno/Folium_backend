import express from 'express';

import registerRouter from './register.js';
import loginRouter from './login.js';
import confirmRouter from './confirm.js';
import logoutRouter from './logout.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/confirm', confirmRouter);
router.use('/logout', logoutRouter);

export default router;
