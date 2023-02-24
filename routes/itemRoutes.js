import express from 'express'
import { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems } from '../controllers/index.js'
import { AdminAuthorization, VendorAuthorization, RetailerAuthorization, ItemPrepare } from '../middlewares/index.js'

const router = express.Router()
// CREATE ITEM ROUTES
router.route('/admin').post(AdminAuthorization, ItemPrepare, CreateItem)
router.route('/vendor').post(VendorAuthorization, ItemPrepare, CreateItem)

// UPDATE ITEM ROUTES
router.route('/admin/:itemId').patch(AdminAuthorization, ItemPrepare, UpdateItem)
router.route('/vendor/:itemId').patch(VendorAuthorization, ItemPrepare, UpdateItem)

// DELETE ITEM ROUTES
router.route('/admin/:itemId').delete(AdminAuthorization, DeleteItem)
router.route('/vendor/:itemId').delete(VendorAuthorization, DeleteItem)

// FETCH SINGLE-ITEM ROUTES
router.route('/admin/:itemId').get(AdminAuthorization, GetItem)
router.route('/vendor/:itemId').get(VendorAuthorization, GetItem)
router.route('/retailer/:itemId').get(RetailerAuthorization, GetItem)

// FETCH ALL-USER-ITEMS ROUTES
router.route('/admin/getAll/:userId').get(AdminAuthorization, GetAllVendorItems)
router.route('/vendor/getAll/:userId').get(VendorAuthorization, GetAllVendorItems)
router.route('/retailer/getAll/:userId').get(RetailerAuthorization, GetAllVendorItems)

// FETCH ALL-ITEMS
router.route('/admin/getAll').get(AdminAuthorization, GetAllItems)
router.route('/vendor/getAll').get(VendorAuthorization, GetAllItems)
router.route('/retailer/getAll').get(RetailerAuthorization, GetAllItems)

export default router