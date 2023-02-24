import express from 'express'
import { AddAttribute, UpdateAttribute, GetAllAttributes, GetAttribute } from '../controllers/index.js'

const router = express.Router()

router.route('/').post(AddAttribute)
router.route('/').get(GetAllAttributes)
router.route('/:id').get(GetAttribute)
router.route('/:id').patch(UpdateAttribute)

export default router