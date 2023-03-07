// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Establishes "parent" one-to-many relationship between Category and Product
Category.hasMany(Product, {
  foreignKey: 'category_id', 
  onDelete: 'CASCADE', 
}); 

// Establishes "child" one-to-many relationship between Category and Product
Product.belongsTo(Category, {
  foreignKey: 'category_id', 
}); 

// Establishes many-to-many relationship between Product and Tag through the pre-defined columns in ProductTag
Product.belongsToMany(Tag, {
  through: ProductTag, 
  foreignKey: 'product_id', 
}); 

// Establishes many-to-many relationship between Product and Tag through the pre-defined columns in ProductTag
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id', 
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};