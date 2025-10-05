const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryname: String,
    categorydescription: String,
    categoryimage: String
})

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;