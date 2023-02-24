import express from 'express'
import { AddTag, UpdateTag, GetAllTags, GetTag } from '../controllers/index.js'

const router = express.Router()

router.route('/').post(AddTag)
router.route('/').get(GetAllTags)
router.route('/:id').get(GetTag)
router.route('/:id').patch(UpdateTag)

export default router