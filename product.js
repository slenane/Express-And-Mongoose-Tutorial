const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/productApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("ERROR");
        console.log(err);
    })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    // This will accept an array of strings and will use type coersion to turn numbers to strings
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0,
        },
        inStore: {
            type: Number,
            default: 0,
        }
    },
    size: {
        type: String,
        // This means that the value of size must exactly match one of the below
        enum: ["S", "M", "L"],
    }
});

//###### METHODS #######

// THE BELOW METHODS ARE CALLED ON THE INDIVDUAL INSTANCE
// this. refers to the instance

// (1) The keyword this inside this method refers to the individual instance
productSchema.methods.info = function () {
    console.log("SOME INFORMATION ABOUT THE PRODUCT");
    console.log(`${this.name}`);
    console.log(`${this.price}`);
    console.log(`Is on sale: ${this.onSale}`);
}

// (2) This is set up for every instance - asynchronously call it in the findProduct method below
productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
}

// (3) Functionality to add categories 
productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
}

// THE BELOW METHODS ARE CALLED ON THE PRODUCT ITSELF AND NOT THE INSTANCE
// this. refers to the Product class

// (1) Add a fire sale to all products
productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
}



const Product = mongoose.model("Product", productSchema);

const bike = new Product({ name: "Bike Helmet", price: 29.99, size: "M" });

//####### SAVE ITEMS TO DB ##########
/*
// .save() adds the item to the database through mongoose
bike.save()
    // .then does something when the above action is completed successfully
    .then(data => {
        console.log("IT WORKED!!");
        console.log(data);
    })
    // .catch does something if there is an error
    .catch(err => {
        console.log("OH NOOOOOO!");
        console.log(err);
    })
*/

//####### UPDATE DB ITEMS ##########
/*
// Find the item that we are looking for based on it's name, then update the price
// Add the new:true property so that the new item is returned
// runValidators will ensure that all the parameters you set for the products will have to be met in order to update
Product.findOneAndUpdate({ name: "Bike Helmet"}, { price: 100 }, { new: true, runValidators: true })
    .then(data => {
        console.log("OH YEAAAHHHHH!!");
        console.log(data);
    })
    .catch(err => {
        console.log("OH NOOOOOO!");
        console.log(err);
    })
*/

//##### CALLING METHODS ON DB ITEMS ######

/*
// (1) Find product and print info
const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: "Bike Helmet" });
    foundProduct.info();
}
*/

/*
// (2) Find product and toggle onSale
const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: "Bike Helmet" });
    console.log(foundProduct);
    // Asynchronously run and return this code 
    await foundProduct.toggleOnSale();
    console.log(foundProduct)
}
*/

/*
// (3) Find products and add a category
const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: "Bike Helmet" });
    console.log(foundProduct);
    // Asynchronously run and return this code 
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
    await foundProduct.addCategory("Outdoors");
    console.log(foundProduct);
}
*/

//findProduct();

// Product.fireSale().then(res => console.log(res));