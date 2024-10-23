const prompt = require('prompt-sync')();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Customer = require("./models/customer.js")

async function connect() {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on("connected", () => {
        console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
    });

    console.log('Welcome to the CRM');
    console.log('1. Create a customer.');
    console.log('2. View a customer.');
    console.log('3. Update a customer.');
    console.log('4. Delete a customer.');
    console.log('5. Quit application.');

    const action = parseInt(prompt('Pick a number of what you would like to do? '));
    if (action === 1) {
        createCustomer()
    } else if (action === 2) {
        viewCustomers()
    } else if (action === 3) {
        updateCustomer()
    } else if (action === 4) {
        deleteCustomer()
    } else if (action === 5) {
        quitApp()
    } else {
        console.log('The number you have chosen has an invalid output.')
    }
}

connect()

async function createCustomer() {
    const name = prompt('Enter customer name: ');
    const age = prompt('Enter customer age: ');

    const newCustomer = new Customer({ name, age });
    
    await newCustomer.save();
    console.log('Customer created successfully.');

    connect();
}

async function viewCustomers() {
    const customers = await Customer.find();
    console.log('Customers:');
    customers.forEach((customer) => {
        console.log(`- ${customer.name} (${customer.age}): ${customer._id}`);
    });
  
    connect();
}

async function updateCustomer() {
    const id = prompt('Enter customer ID to update: ');
    const newName = prompt('Update name: ');
    const newAge = prompt('Update age: ');

    const result = await Customer.findByIdAndUpdate(id, {name: newName, age: newAge});
        if (result) {
            console.log('Customer updated successfully.');
        } else {
            console.log('Customer not found.');
        }

    connect();
}

async function deleteCustomer() {
    const id = prompt('Enter customer ID to delete: ');

    const result = await Customer.findByIdAndDelete(id);
        if (result) {
            console.log('Customer deleted successfully.');
        } else {
            console.log('Customer not found.');
        }

    connect();
}

async function quitApp() {
    console.log('Exiting...');

    await mongoose.connection.close();
    process.exit();
}