import express from 'express'
import AuthorizationMiddleware from '../middlewares/index.js'
import AuthRouter from './authorizationRoutes.js'
import ItemRouter from './itemRoutes.js'
import UnitOfMeasureRouter from './unitOfMeasureRoutes.js'
import AttributeRouter from './attributeRoutes.js'
import TagRouter from './tagRoutes.js'
import UserManagementRouter from './userManagementRoutes.js'

const router = express.Router()

router.use('/auth/', AuthRouter)
router.use('/item/', AuthorizationMiddleware, ItemRouter)
router.use('/uom/', AuthorizationMiddleware, UnitOfMeasureRouter)
router.use('/attribute/', AuthorizationMiddleware, AttributeRouter)
router.use('/tag/', AuthorizationMiddleware, TagRouter)
router.use('/user/', AuthorizationMiddleware, UserManagementRouter)

export default router