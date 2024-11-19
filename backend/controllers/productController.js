const Product = require('../models/productModel'); // Ensure the path is correct

const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Store uploaded images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Add timestamp to filenames to avoid collisions
    }
});

const upload = multer({ storage: storage });

// Create product
const createProduct = async (req, res) => {
    // Validate request
    const { productName, price, ingredients } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("Image URL:", image);  // Add this to check the value

    // Check if all required fields are provided
    if (!productName || !price || !ingredients || !image) {
        return res.status(400).json({ error: 'Product name, price, ingredients, and image are required.' });
    }

    try {
        // Create new product
        const product = new Product({ productName, price, ingredients, image });
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get single product by ID
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a product by ID
const updateProduct = (req, res) => {
    // Handle the case when no file is uploaded (optional, depends on your requirements)
    const { productName, price, ingredients } = req.body;
    const image = req.file ? req.file.path : null; // Get the file path if a new file is uploaded

    if (!productName || !price || !ingredients) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Your logic to update the product in the database
    // Assume you have a Product model and you're using Mongoose
    Product.findByIdAndUpdate(req.params.id, {
        productName,
        price,
        ingredients,
        image
    }, { new: true })
    .then(updatedProduct => {
        res.json(updatedProduct); // Send the updated product as the response
    })
    .catch(error => {
        res.status(500).json({ error: "Error updating product" });
    });
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    upload // Export multer instance for use in routes
};
