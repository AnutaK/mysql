let mysql = require("mysql");
let inquirer = require("inquirer")
let idList = [];

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rampage",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});


function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Please make a selection below: ",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (choice) {
            if (choice.action === "View Products for Sale") {
                productDisplay()
            }
            if (choice.action === "View Low Inventory") {
                lowInventory();
            }

            //   If a manager selects Add to Inventory, your app should display a prompt 
            //that will let the manager "add more" of any item currently in the store.
            if (choice.action === "Add to Inventory") {
                addToInventoryPrompt();
            }
            //   If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
            if (choice.action === "Add New Product") {
                addNewProduct();
            }
        });
}

var currentProduct = [];

function productDisplay() {
    connection.query("SELECT item_id,product_name,price,stock_quantity from products", function (err, res) {
        if (err) throw err;
        currentProduct = res;
        console.log("-----------------------------------");
        console.log("Below are the products available for sale: ");
        console.log("-----------------------------------");
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("-----------------------------------");
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products GROUP BY stock_quantity HAVING stock_quantity < 5", function (err, res) {
        if (err) throw err;

        console.log("Below are the products with low inventory: ");
        console.log("-----------------------------------");
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        start();
    });

}

function addToInventoryPrompt() {

    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Please enter the ID of the Product you would like to update: ",
        }, {
            name: "quantity",
            type: "input",
            message: "How many units of the selected Product would you like to add to the Inventory?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
        .then(function (choice) {

            connection.query("SELECT item_id,product_name,stock_quantity,price FROM products WHERE ?", {
                    item_id: choice.productID
                },

                function (err, res) {
                    if (err) throw err;

                    const totalInventory = parseInt(res[0].stock_quantity);
                    let id = choice.productID;
                    let quantity = parseInt(choice.quantity);
                    addToInventory(quantity, id, totalInventory);
                }

            );
        })

}

function addToInventory(stock, id, inventory) {
    console.log(`${stock} units will be added to products table with id: ${id}`)
    var stringId = id.toString();
    let newInventory = stock + inventory;
    let inventoryString = newInventory.toString();
    console.log(currentProduct);
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: inventoryString
            },
            {
                item_id: stringId
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("Inventory Updated!");

        })
    console.log(`The new Inventory ${inventoryString}`);
    start();
}

function addNewProduct() {

    inquirer
        .prompt([{
                name: "productName",
                type: "input",
                message: "Please enter the name of the new product: "
            },
            {
                name: "departmentName",
                type: "input",
                message: "What's the department' name for the new product?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "What's the quantity of the new product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    productDisplay();

                }
            );
        });

}