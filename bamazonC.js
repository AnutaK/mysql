// let mysql = require("mysql");
// let inquirer = require("inquirer");
// let idList = [];

// let connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,

//     //your username
//     user: "root",

//     //your password
//     password: "rampage",
//     database: "bamazon"
// })

// connection.connect(function (err) {
//     if (err) throw err
//     queryAllproducts();
// })

// //This function displays the available products
// function queryAllProducts() {
//     connection.query("SELECT * FROM PRODUCTS", function (err, res) {
//         if (err) throw err
//         for (obj in res) {
//             idList.push(parseInt(res[obj].item_id))
//         }
//         for (let i = 0; i < res.length; i++) {
//             console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price)
//         }
//         console.log("-----------------------------------");
//         start();
//     })
// }

// function start() {
//     inquirer.
//     prompt([{
//             name: "productId",
//             type: "input",
//             message: "Please enter the ID of the Product you would like to buy: "
//         },
//         {
//             name: "quantity",
//             type: "input",
//             message: "How many units of the selected Product would you like to buy?"
//         }
//     ])
//     .then(function(choice){
//         if (idList.indexOf(parseInt(choice.productID)) > -1) {
//             connection.query("SELECT item_id,product_name,stock_quantity,price FROM products WHERE ?", {
//                 item_id: choice.productID
//             },
//             function(err,res){
//                 if(err) throw err

//             }


//     }



// }