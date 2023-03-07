const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products and associated categories and tags
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }], 
    }); 
    res.status(200).json(allProducts)
    // const productJson = allProducts.map((product) => product.get({ plain: true})); 
    // res.status(200).json(productJson); 
  } catch (err) {
    res.status(500).json(err); 
  }
});


// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findOne({ where: {id: req.params.id}}, {
      include: [{ model: Category }, { model: Tag }],  
    }); 

    if (!productData) {
      res.status(400).json({ message: 'No product found with that ID!'}); 
    }

    res.status(200).json(productData); 
  } catch (err) {
    res.status(500).json(err); 
  }
});



// Create new product
router.post('/', (req, res) => {
  
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // If there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond
      // Having trouble getting the new product to display in return
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




// Update product by ID
// WOULD LIKE TO UNDERSTAND WHAT IS HAPPENING HERE A LITTLE MORE
router.put('/:id', (req, res) => {
  // Update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // Find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // Get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // Create filtered list of new tag_ids
      const newProductTags = (req.body.tagIds || []) 
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // Figure out which ones to remove
      const productTagsToRemove = (productTags || [])
        .filter(({ tag_id }) => !(req.body.tagIds || []).includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then(async () => {
      const productData = await Product.findOne({ where: {id: req.params.id}}, {
        include: [{ model: Category }, { model: Tag }],  
      }); 
      res.json(productData);

    })
    .catch((err) => {
      console.log(err); 
      res.status(400).json(err);
    });
});



// Delete product by ID
router.delete('/:id', async (req, res) => {
  const productData = await Product.destroy({
    where: {
      id: req.params.id
    },
  });

  // Having trouble getting the updated category to display, reflected properly in all categories list
  return res.json( {message: "Product deleted successfully." }); 
});

module.exports = router;