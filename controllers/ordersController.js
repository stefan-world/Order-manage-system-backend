const express = require('express');
const mongoose = require('mongoose');
const product = require('../models/product');
const Orders = mongoose.model('Orders');
const Products = mongoose.model("Products");
const Suppliers = mongoose.model("Suppliers");
const Users = mongoose.model("Users");

require('dotenv').config({ path: ".variables.env" });

exports.create = async (req, res) => {
    try {
        let { products_id, products_quantity, status, account_id } = req.body;
        // let file_path = process.env.BASEURL + process.env.PORT + "/uploads/Orders/" + req.file.filename; 
        const allOrders = await Orders.find();
        const number = allOrders.length + 1;
        const altnum = number;
        const product1 = await Products.findOne({ _id: products_id[0] });
        const products = await Promise.all(products_id.map(async (productId) => {
            const product = await Products.findOne({ _id: productId });
            if (product.supplier_id != product1.supplier_id) {
                return res.status(400).json({
                    message: "Select products of only one supplier"
                });
            }
        }))

        const newOrder = new Orders({
            number,
            altnum,
            products_id,
            products_quantity,
            // file: file_path,
            status,
            supplier_id: product1.supplier_id,
            account_id,
        });

        const saveOrder = await newOrder.save();
        return res.status(200).json({
            order: saveOrder,
            message: "Successfully saved! Please check your Orders list!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.update = async (req, res) => {
    try {
        let { order_id, products_id, products_quantity, status, account_id } = req.body;
        // let file_path = process.env.BASEURL + process.env.PORT + "/uploads/Orders/" + req.file.filename; 
        console.log(req.body)
        const product1 = await Products.findOne({ _id: products_id[0] });
        const products = await Promise.all(products_id.map(async (productId) => {
            const product = await Products.findOne({ _id: productId });
            if (product.supplier_id != product1.supplier_id) {
                return res.status(400).json({
                    message: "Select products of only one supplier"
                });
            }
        }))

        const saveOrder = await Orders.findOneAndUpdate(
            { _id: order_id },
            {
                products_id,
                products_quantity,
                // file: file_path,
                status,
                supplier_id: product1.supplier_id,
                account_id,
            },
            {
                new: true
            }
        ).exec();

        return res.status(200).json({
            order: saveOrder,
            message: "Successfully updated! Please check your Orders list!"
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateState = async (req, res) => {
    try {
        let { id, status } = req.body;
        const order = await Orders.findOneAndUpdate({ _id: id }, { status }, { new: true });
        return res.status(200).json({
            message: "Successfully updated! Please check your Orders list!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.list = async (req, res) => {
    try {
        const account_id = req.params.id;
        const user = await Users.findOne({ _id: account_id });
        if (user.role == "admin")
            var orders_temp = await Orders.find();
        else
            var orders_temp = await Orders.find({ account_id: account_id });
        const orders = orders_temp;
        if (!orders)
            return res.status(400).json({
                message: "Orders doesn't exist."
            });

        const newOrders = await Promise.all(orders.map(async (order) => {
            const supplier = await Suppliers.findOne({ _id: order.supplier_id });
            return {
                _id: order._id,
                number: order.number,
                products_id: order.products_id,
                status: order.status,
                supplier: supplier.name,
                supplier_id: order.supplier_id,
                account: user.username,
                quantity: order.products_quantity,
                updatedAt: order.updatedAt
            }
        }))

        return res.status(200).json({
            orders: newOrders
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const number = await Orders.findOne({ _id: id });
        const orders = await Orders.find();

        const i = number.number;

        const result = await Orders.findOneAndDelete({ _id: id });

        if (!result)
            return res.status(400).json({
                message: "It doesn't exist."
            });

        for (j = i + 1; j <= orders.length; j++) {
            const changenumber = await Orders.findOneAndUpdate(
                { altnum: j },
                { number: j - 1 },
                {
                    new: true
                }
            );
        }
        for (j = i; j < orders.length; j++) {
            const changealtnum = await Orders.findOneAndUpdate(
                { number: j },
                { altnum: j },
                {
                    new: true
                }
            );
        }
        const newOrders_temp = await Orders.find();
        const newOrders = await Promise.all(newOrders_temp.map(async (order) => {
            const supplier = await Suppliers.findOne({ _id: order.supplier_id });
            const user = await Users.findOne({ _id: order.account_id });
            return {
                _id: order._id,
                number: order.number,
                products_id: order.products_id,
                status: order.status,
                supplier: supplier.name,
                account: user.username,
                quantity: order.products_quantity,
                updatedAt: order.updatedAt
            }
        }))

        return res.status(200).json({
            orders: newOrders
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.itemsList = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Orders.findOne({ _id: id })
        const products = await Promise.all(order.products_id.map(async (product_id, key) => {
            const orderedProduct = await Products.findOne({ _id: product_id });
            return {
                _id: product_id,
                order_id: order.number,
                number: orderedProduct.number,
                name: orderedProduct.name,
                quantity: order.products_quantity[key],
                supplier: orderedProduct.supplier_id,
                price: orderedProduct.price,
                description: orderedProduct.description,
                updatedAt: order.updatedAt
            };
        }))
        return res.status(200).json({ itemsList: products });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}