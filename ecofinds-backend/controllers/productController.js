const Product = require('../models/Product');
const User = require('../models/User');
const Purchase = require('../models/Purchase');

const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, images } = req.body;
        const seller = req.user._id;

        // Validate required fields
        if (!title || !description || !price || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure images array exists
        const productImages = images && images.length > 0 ? images : ['https://via.placeholder.com/400x300?text=Product+Image'];

        const product = new Product({
            title,
            description,
            price: Number(price),
            category,
            images: productImages,
            seller
        });

        await product.save();
        await product.populate('seller', 'username trustScore');

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, minTrust } = req.query;
        
        const query = { status: 'available' }; // Only show available products
        
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };

        let products = await Product.find(query)
            .populate('seller', 'username trustScore')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Filter by minimum trust score if specified
        if (minTrust) {
            products = products.filter(product => product.seller.trustScore >= minTrust);
        }

        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'username trustScore profileImage createdAt');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, description, price, category, images } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        if (product.status === 'sold') {
            return res.status(400).json({ message: 'Cannot edit sold products' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { title, description, price, category, images },
            { new: true }
        ).populate('seller', 'username trustScore');

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        if (product.status === 'sold') {
            return res.status(400).json({ message: 'Cannot delete sold products' });
        }

        await Product.findByIdAndDelete(productId);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id })
            .populate('seller', 'username trustScore')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark product as sold and create purchase record
const markAsSold = async (req, res) => {
    try {
        const { productId, buyerId, paymentId } = req.body;

        const product = await Product.findById(productId).populate('seller');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.status === 'sold') {
            return res.status(400).json({ message: 'Product already sold' });
        }

        // Mark product as sold
        await Product.findByIdAndUpdate(productId, {
            status: 'sold',
            soldTo: buyerId,
            soldAt: new Date()
        });

        // Create purchase record
        const purchase = new Purchase({
            buyer: buyerId,
            product: productId,
            seller: product.seller._id,
            orderAmount: product.price,
            paymentId: paymentId || `demo_${Date.now()}`,
            purchaseDate: new Date(),
            status: 'completed'
        });

        await purchase.save();

        res.json({ message: 'Product marked as sold and purchase recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    markAsSold
};