
const mongoose = require("mongoose");
const Suppliers = mongoose.model("Suppliers");
const Users = mongoose.model("Users");
const moment = require('moment')

require("dotenv").config({ path: ".variables.env" });

// exports.list = async (req, res) => {
//   try {
//     const casheir = await Casheirs.find();
//     const sales = await Sales.find();
//     const date = new Date();
//     var todaySale = 0;
//     var todayrevenue = 0;
  
//     for(var i = 0;i<sales.length;i++)
//        {
//         if(moment(sales[i].createdAt).format('DD/MM/YYYY') == moment(date).format('DD/MM/YYYY'))
//           {
//             todaySale += (sales[i].paid + sales[i].unpaid) ;
//             todayrevenue += sales[i].paid ;
//       }}

//       return res.status(200).json({
//         total:casheir[0].total,
//         todaySale,
//         todayrevenue
//        });

//   } catch (err) {
//      res.status(500).json({message: err.message });
//   }
// };


// exports.partnerlist = async (req, res) => {
//   try {

//     const users = await Users.find();

//     if (!users)
//       return res.status(400).json({
//         message: "Sales doesn't exist."
//       });

//       return res.status(200).json({
//         partners:users
//        });

//   } catch (err) {
//      res.status(500).json({message: err.message });
//   }
// };

// exports.unpaidList = async (req, res) => {
//   try {

//     const sales = await Sales.find();
//     var unpaidData = [];

//     for(var i = 0 ; i<sales.length ; i++)
//       if( sales[i].unpaid > 0 )
//         unpaidData.push(sales[i]);

//       return res.status(200).json({
//         unpaid:unpaidData
//        });

//   } catch (err) {
//      res.status(500).json({message: err.message });
//   }
// };

