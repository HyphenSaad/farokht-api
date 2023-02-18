import express from 'express'
import { AdminAuthorization, TokenAuthorization } from '../middlewares/index.js'
import AuthRouter from './authorizationRoutes.js'
import ItemRouter from './itemRoutes.js'
import UserManagementRouter from './userManagementRoutes.js'

const router = express.Router()
router.use('/auth/', AuthRouter)
router.use('/item/', TokenAuthorization, ItemRouter)
router.use('/user/', TokenAuthorization, AdminAuthorization, UserManagementRouter)

export default router