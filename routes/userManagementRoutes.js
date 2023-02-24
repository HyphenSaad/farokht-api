import express from 'express'
import { CreateUser, UpdateUser, DeleteUser, GetUser, GetAllUsers } from '../controllers/index.js'

const router = express.Router()
router.route('/').post(CreateUser)
router.route('/').get(GetAllUsers)
router.route('/:userId').patch(UpdateUser)
router.route('/:userId').delete(DeleteUser)
router.route('/:userId').get(GetUser)

export default router