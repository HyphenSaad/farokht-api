import express from 'express'
import { AddShipmentCost, UpdateShipmentCost, GetAllShipmentCosts, GetShipmentCost } from '../controllers/index.js'

const router = express.Router()

router.route('/').post(AddShipmentCost)
router.route('/').get(GetAllShipmentCosts)
router.route('/:id').get(GetShipmentCost)
router.route('/:id').patch(UpdateShipmentCost)

export default router