const express = require('express');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    markAsSold
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createProduct);
router.get('/', getProducts);
router.get('/my-products', auth, getMyProducts);
router.post('/mark-sold', auth, markAsSold);
router.get('/:id', getProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;