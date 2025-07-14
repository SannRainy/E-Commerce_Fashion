const knex = require('../../db/knex');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await knex('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await knex('products').where({ id: req.params.id }).first();
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error });
    }
};

exports.createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !price || !stock) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const [productId] = await knex('products').insert({
            name,
            description,
            price,
            stock,
            imageUrl,
        });

        res.status(201).json({ id: productId, ...req.body, imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product.', error });
    }
};