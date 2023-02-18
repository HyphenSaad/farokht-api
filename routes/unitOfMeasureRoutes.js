import express from 'express'
import { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures } from '../controllers/index.js'
import { AdminAuthorization } from '../middlewares/index.js'

const router = express.Router()

router.route('/create').post(AdminAuthorization, AddUnitOfMeasure)
router.route('/update/:id').patch(AdminAuthorization, UpdateUnitOfMeasure)
router.route('/get').get(GetAllUnitOfMeasures)

export default router