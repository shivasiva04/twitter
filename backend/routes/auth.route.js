import express from 'express'
import protectRoute from '../middleware/protectRoute.js'


import {signup, login, logout , getMe} from '../controllers/auth.controller.js'

const app = express();
app.use(express.json());

const router = express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)


router.get('/signup',signup)
router.get('/login',login)
router.get('/logout',logout)
router.get('/getMe',protectRoute,getMe)


export default router;