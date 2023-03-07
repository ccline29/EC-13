const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// API call for all categories and associated products
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: [{ model: Product }], 
    }); 
    res.status(200).json(allCategories)
  } catch (err) {
    res.status(500).json(err); 
  }
});


// API call for category by ID number and associated products
router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }], 
    }); 

    if (!catData) {
      res.status(400).json({ message: 'No category found with that ID!'}); 
    }

    res.status(200).json(catData); 
  } catch (err) {
    res.status(500).json(err); 
  }
});


// API post to add a new category
router.post('/', async (req, res) => {
  const catData = await Category.create(req.body); 

  return res.json(catData); 
});


// API put request to update category
router.put('/:id', async (req, res) => {
  const catData = await Category.update(
    {
      category_name: req.body.category_name
    }, 
    {
      where: {
        id: req.params.id
      },
    }
  
  ); 
  const updatedCatData = await Category.findOne({ where: {id: req.params.id} }); 
  // Having trouble getting the updated category to display, reflected properly in all categories list
  return res.json(updatedCatData)

});


// API delete for specific category by ID
router.delete('/:id', async (req, res) => {
  const catData = await Category.destroy({
    where: {
      id: req.params.id
    },
  });

  // Having trouble getting the updated category to display, reflected properly in all categories list
  return res.json( {message: "Category deleted successfully." }); 

});

module.exports = router;