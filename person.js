const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/productApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("ERROR");
        console.log(err);
    })

const personSchema = new mongoose.Schema({
    first: String,
    last: String,
})

// Virtual allows you to make new properties on instances that don't exist in the DB
personSchema.virtual("fullName").get(function () {
    return `${this.first} ${this.last}`;
})

//##### MIDDLEWARE #####

// This is middleware that will run before (pre) saving
personSchema.pre("save", async function () {
    console.log("ABOUT TO SAVE!")
})

// This is middleware that will run after (post) saving
personSchema.post("save", async function () {
    console.log("JUST SAVED!")
})

const Person = mongoose.model("Person", personSchema);

// Once you create a new instance you can then call the method on that instance and you will get back the full name
