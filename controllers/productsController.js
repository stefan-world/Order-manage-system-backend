
const mongoose = require("mongoose");
const Products = mongoose.model("Products");
const Suppliers = mongoose.model("Suppliers");
const Users = mongoose.model("Users");
const fs = require('fs');


require("dotenv").config({ path: ".variables.env" });

exports.create = async (req, res) => {
  try {
    let { name, description, price, barcode, status, supplier, quantity } = req.headers;
    let avatar = process.env.BASEURL + process.env.PORT + "/uploads/products/" + req.file.filename;
    let origin = req.file.filename;
    const allProducts = await Products.find();
    const number = allProducts.length + 1;
    const altnum = number;

    const newProduct = new Products({
      number,
      altnum,
      name,
      avatar,
      origin,
      description,
      price,
      barcode,
      quantity,
      status,
      supplier_id: supplier
    });

    const saveProduct = await newProduct.save();

    return res.status(200).json({
      message: "successfully Saved! Please check your products list!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createnoimage = async (req, res) => {

  try {

    let { name, description, price, barcode, quantity, status, supplier } = req.body;

    const allProducts = await Products.find();
    const number = allProducts.length + 1;
    const altnum = number;

    const newProduct = new Products({
      number,
      altnum,
      name,
      description,
      price,
      barcode,
      quantity,
      status,
      supplier_id: supplier
    });

    const saveProduct = await newProduct.save();

    return res.status(200).json({
      message: "successfully updated!"
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
    const account = await Users.findOne({_id: account_id});
    const products = await Products.find();
    const filtered_products = await Promise.all(products.map(async (product) => {
      const supplier = await Suppliers.findOne({ _id: product.supplier_id });
      return account.role=="admin" || account_id==supplier.account_id || supplier.account_id=="general_supplier" ? product : null ;
    }));

    const actual_products = filtered_products.filter(product => product !== null);
    if (!actual_products || actual_products.length === 0)
      return res.status(400).json({
        message: "Products doesn't exist."
      });
    return res.status(200).json({
      products: actual_products
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const number = await Products.findOne({ _id: id });
    const products = await Products.find();

    const i = number.number;

    var direct = 'public/uploads/products/' + number.origin;

    fs.unlink(direct, (err) => {
      if (err) {
        return;
      }
    });


    const result = await Products.findOneAndDelete({ _id: id });

    if (!result)
      return res.status(400).json({
        message: "It doesn't exist."
      });

    for (j = i + 1; j <= products.length; j++) {
      const changenumber = await Products.findOneAndUpdate(
        { altnum: j },
        { number: j - 1 },
        {
          new: true
        }
      );
    }
    for (j = i; j < products.length; j++) {
      const changealtnum = await Products.findOneAndUpdate(
        { number: j },
        { altnum: j },
        {
          new: true
        }
      );
    }

    const newProducts = await Products.find();

    return res.status(200).json({
      products: newProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.edit = async (req, res) => {
  try {

    const product = await Products.findOne({ _id: req.body.id });

    if (!product)
      return res.status(400).json({
        message: "Sales doesn't exist."
      });

    return res.status(200).json({
      product: product
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {

  try {

    let { name, description, price, barcode, quantity, status, supplier } = req.headers;
    let avatar = process.env.BASEURL + process.env.PORT + "/uploads/products/" + req.file.filename;
    let origin = req.file.filename;


    const before = await Products.findOne({ _id: id });
    var direct = 'public/uploads/products/' + before.origin;

    fs.unlink(direct, (err) => {
      if (err) {
        return;
      }
    });


    const updateData = await Products.findOneAndUpdate(
      { _id: id },
      {
        number,
        altnum,
        name,
        avatar,
        origin,
        description,
        price,
        barcode,
        quantity,
        status,
        supplier_id: supplier
      },
      {
        new: true
      }
    ).exec();

    return res.status(200).json({
      message: "successfully updated!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.updatenoimage = async (req, res) => {
  try {

    let { id, name, description, price, barcode, quantity, status, supplier } = req.body;

    const updateData = await Products.findOneAndUpdate(
      { _id: id },
      {
        name,
        description,
        price,
        barcode,
        quantity,
        status,
        supplier_id: supplier
      },
      {
        new: true
      }
    ).exec();

    return res.status(200).json({
      message: "successfully updated!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};