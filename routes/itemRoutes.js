import express from 'express'
import { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems } from '../controllers/index.js'
import { ItemPrepare } from '../middlewares/index.js'

const router = express.Router()

router.route('/').post(ItemPrepare, CreateItem)
router.route('/:itemId').patch(ItemPrepare, UpdateItem)
router.route('/:itemId').delete(DeleteItem)
router.route('/:itemId').get(GetItem)
router.route('/').get(GetAllItems)
router.route('/vendor/:userId').get(GetAllVendorItems)

export default router