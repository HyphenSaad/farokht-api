import express from 'express'
import { AddAttribute, UpdateAttribute, GetAllAttributes, GetAttribute } from '../controllers/index.js'
import { AdminAuthorization } from '../middlewares/index.js'

const router = express.Router()

router.route('/').post(AdminAuthorization, AddAttribute)
router.route('/').get(GetAllAttributes)
router.route('/:id').get(GetAttribute)
router.route('/:id').patch(AdminAuthorization, UpdateAttribute)

export default router