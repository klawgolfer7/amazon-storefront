const mysql = require("mysql");
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

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
});

function purchase(item, amount) {
    var itemAmt;

    connection.query("SELECT product_name, stock_quantity FROM products WHERE item_id = ?", [item], function (error, res, fields) {
        console.log("You selected: " + res[0].product_name);
        itemAmt = res[0].stock_quantity;
    });

    if (amount > itemAmt) {
        console.log('Insufficient quantity!');
    } else {
        connection
            .query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [
                amount, item
            ], function (error, res) {
                if (error)
                    throw error;
                if (res.changedRows > 0) {
                    connection.query("SELECT product_name, price FROM products WHERE item_id = ?", [item], function (error, res, fields) {
                        console.log('Your total is: ' + (res[0].price * amount).toFixed(2));
                    });
                }
            });
    }

}

function list() {
    connection
        .query("SELECT * FROM products", function (error, res, fields) {
            for (let i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);
            }
        });
}

function start() {

    list();

    inquirer.prompt([{
            type: "input",
            name: "user_select",
            message: "please enter the ID of the product you are interested in purchasing:"
        }, {
            type: "input",
            name: "quantity",
            message: "Please enter the quantity you wish to purchase."
        }

    ]).then((answers) => {
        purchase(parseInt(answers.user_select), parseInt(answers.quantity));
    })
}



start();