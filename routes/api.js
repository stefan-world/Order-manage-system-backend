const express = require("express");
const { catchErrors } = require("../handlers/errorHandlers");
const multer = require('multer');
const uuidv4 = require('uuid/v1');

const router = express.Router();

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/products/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload1 = multer({storage:storage1});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/Orders/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload2 = multer({storage:storage2});

const Users =require("../controllers/authController");
const Suppliers =require("../controllers/suppliersController");
const Reports =require("../controllers/reportsController");
const Products =require("../controllers/productsController");
const Orders = require("../controllers/ordersController");
const Accounts = require("../controllers/accountsController")

// --------------- accounts router -------------------

router.route("/accounts/list").post(catchErrors(Accounts.list));
router.route("/accounts/delete/:id").post(catchErrors(Accounts.delete));
router.route("/accounts/edit/:id").get(catchErrors(Accounts.edit));
router.route("/accounts/update").post(catchErrors(Accounts.update));
router.route("/accounts/create").post(catchErrors(Accounts.create));

router.route("/users/list").post(catchErrors(Users.list));
router.route("/users/delete/:id").post(catchErrors(Users.delete));
router.route("/users/edit/:id").get(catchErrors(Users.edit));
router.route("/users/update").post(catchErrors(Users.update));

// --------------- suppliers router -------------------

router.route("/suppliers/list/:id").get(catchErrors(Suppliers.list));
router.route("/suppliers/create").post(catchErrors(Suppliers.create));
router.route("/suppliers/delete/:id").get(catchErrors(Suppliers.delete));
router.route("/suppliers/edit").post(catchErrors(Suppliers.edit));
router.route("/suppliers/update").post(catchErrors(Suppliers.update));

// --------------- reports router -------------------

router.route("/reports/list").get(catchErrors(Reports.list));
router.route("/reports/partnerlist").get(catchErrors(Reports.partnerlist));
router.route("/reports/unpaidList").get(catchErrors(Reports.unpaidList));

// --------------- products router -------------------
router.route("/product/list/:id").get(catchErrors(Products.list));
router.route("/product/create").post(upload1.single('image'), catchErrors(Products.create));
router.route("/product/create/noimage").post(catchErrors(Products.createnoimage));
router.route("/product/delete/:id").get(catchErrors(Products.delete));
router.route("/product/edit").post(catchErrors(Products.edit));
router.route("/product/update").post(upload1.single('image'), catchErrors(Products.update));
router.route("/product/update/noimage").post(catchErrors(Products.updatenoimage));
router.route("/product/importcsv").post(catchErrors(Products.importcsv));

router.route("/ordersList/create").post(catchErrors(Orders.create));
router.route("/ordersList/updateState").post(catchErrors(Orders.updateState));
router.route("/ordersList/update").post(catchErrors(Orders.update));
router.route("/ordersList/list/:id").get(catchErrors(Orders.list));
router.route("/ordersList/delete/:id").get(catchErrors(Orders.delete));
router.route("/order/list/:id").get(catchErrors(Orders.itemsList));


module.exports = router;
