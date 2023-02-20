import express from 'express'
import { AddTag, UpdateTag, GetAllTags, GetTag } from '../controllers/index.js'
import { AdminAuthorization } from '../middlewares/index.js'

const router = express.Router()

router.route('/').post(AdminAuthorization, AddTag)
router.route('/').get(GetAllTags)
router.route('/:id').get(GetTag)
router.route('/:id').patch(AdminAuthorization, UpdateTag)

export default router