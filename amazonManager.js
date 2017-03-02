const mysql = require("mysql");
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost", port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "amazon"
});

connection.connect(err => {
    if (err) 
        throw err;
        //   console.log(connection.threadId);
    }
);

function managerLevel() {
    inquirer
        .prompt([
        {
            type: "list",
            name: "managerSelection",
            message: "What would you like to do?",
            choices: ["Products For Sale", "Low Inventory", "Add To Inventory", "Add New Product"]
        }
    ])
        .then((answers) => {
            var selection = answers.managerSelection;
            if (selection === "Products For Sale") {
                list();
            } else if (selection === "Low Inventory") {
                listLowInventory();
            } else if(selection === "Add New Product") {
                addProduct();
            } else if(selection === "Add To Inventory") {
                addInventory();
            }
        })
}

function list() {
    connection.query("SELECT * FROM products", function (error, res, fields) {
            for (let i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);
            }
        });
}

function listLowInventory() {
    connection.query("SELECT item_id,stock_quantity, product_name FROM products WHERE stock_quantity < 5", function (error, res, fields) {
            for (let i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Stock: " + res[i].stock_quantity);
            }
        });
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "Enter Product Name"
        },{
            type: "input",
            name: "productDepartment",
            message: "Enter Department"
        },{
            type: "input",
            name: "productPrice",
            message: "Enter Product Price"
        },{
            type: "input",
            name: "productStock",
            message: "Enter Stock Quantity"
        }

    ]).then((answers) => {
        connection.query("INSERT INTO products SET ?",{ 
            product_name: answers.productName, 
            department_name: answers.productDepartment, 
            price: answers.productPrice, 
            stock_quantity: answers.productStock
        }, function(err, res, field) {
            console.log(res);
        })
    })
}

function addInventory() {
    list();

    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the ID of the item you would like to update"
        },
        {
             type: "input",
            name: "addAmount",
            message: "Enter the amount to add"
        }
    ]).then((answers) => {
        var id = answers.itemID;
        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answers.addAmount, answers.itemID], function(err, res, fields) {
            if(res.changedRows > 0) {
                console.log("Add more!");
            }
        })
    })
}


managerLevel();