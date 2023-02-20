import express from 'express'
import { AdminAuthorization, TokenAuthorization } from '../middlewares/index.js'
import AuthRouter from './authorizationRoutes.js'
import ItemRouter from './itemRoutes.js'
import UnitOfMeasureRouter from './unitOfMeasureRoutes.js'
import AttributeRouter from './attributeRoutes.js'
import TagRouter from './tagRoutes.js'
import UserManagementRouter from './userManagementRoutes.js'

const router = express.Router()
router.use('/auth/', AuthRouter)
router.use('/item/', TokenAuthorization, ItemRouter)
router.use('/uom/', TokenAuthorization, UnitOfMeasureRouter)
router.use('/attribute/', TokenAuthorization, AttributeRouter)
router.use('/tag/', TokenAuthorization, TagRouter)
router.use('/user/', TokenAuthorization, AdminAuthorization, UserManagementRouter)
// router.use('/unitOfMeasure/', TokenAuthorization, UnitOfMeasureRouter)

export default router