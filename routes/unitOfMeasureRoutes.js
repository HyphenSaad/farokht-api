import express from 'express'
import { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures, GetUnitOfMeasure } from '../controllers/index.js'

const router = express.Router()

router.route('/').post(AddUnitOfMeasure)
router.route('/').get(GetAllUnitOfMeasures)
router.route('/:id').get(GetUnitOfMeasure)
router.route('/:id').patch(UpdateUnitOfMeasure)

export default router