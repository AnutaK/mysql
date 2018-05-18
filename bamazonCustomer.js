let mysql = require("mysql");
let inquirer = require("inquirer");
let idList = [];

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (obj in res) {
            idList.push(res[obj].item_id);
        };
        console.log("Below are the products available for sale: ");
        console.log("-----------------------------------");
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("-----------------------------------");
        start();
    });
}

function start() {
    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Please enter the ID of the Product you would like to buy: ",
        }, {
            name: "quantity",
            type: "input",
            message: "How many units of the selected Product would you like to buy?",

        }])
        .then(function (choice) {
            if (idList.indexOf(parseInt(choice.productID)) > -1) {

                connection.query("SELECT item_id,product_name,stock_quantity,price FROM products WHERE ?", {
                        item_id: choice.productID
                    },
                    function (err, results) {
                        if (err) throw err;
                        if (results.stock_quantity < choice.quantity) //name of the variable from inquirer 
                        {
                            console.log(`Your order exceeds the store max stock! ${results[0].stock_quantity} ${results[0].product_name} available for purchase.`)
                            start();
                        } else {
                            //passes the item_id and quantity to a function that updates the database
                            var stock = results[0].stock_quantity - choice.quantity
                            var quantity = choice.quantity;
                            console.log("Checking Purchase quantity " + quantity)
                            var id = choice.productID;
                            var item = results[0].product_name;
                            var price = results[0].price;
                            stockUpdate(stock, id);
                            productSales(item, quantity, price);
                        }

                    });
            } else {
                console.log(`Something went wrong with your order. Please enter your item ID and quantity again.`);
                start();
            }
        });
}

function stockUpdate(stock, id) {
    var stringId = id.toString();
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: stock
            },
            {
                item_id: stringId
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("Inventory Updated!");
            connection.end();
        }
    );
}

function productSales(item, quantity, price) {
    console.log("Order Complete!");
    console.log("Your order is: ");
    console.log(`Quantity: ${quantity} ${item}`);
    console.log(`Your final price is: ${quantity * price}`);
}