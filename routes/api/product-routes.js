const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
//http://localhost:3001/api/products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  //use join - sequelize
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    return res.json(productData);
  } catch (err) {
    res.status(500).json(err);
    console.log("Testing Error");
    //catch error here
  }
});

// get one product
//http://localhost:3001/api/products/:id -> param
router.get("/:id", async (req, res) => {
  //res.param.id
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json(err);
  }
});

// create new product
//http://localhost:3001/api/products

router.post("/", async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    if (req.body.tagIds.length) {
      // Mapping over req.body.tagIds >
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          //return each productData.id & tag_id
          product_id: productData.id,
          tag_id,
        };
      });
      // returns a new array of all req.body.tagIds??
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json(productTagIds);
    }
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
//http://localhost:3001/api/catergories/:id -> param
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

      // run both actions
      return Promise.all([ProductTag.destroy({ where: { id: productTagsToRemove } }), ProductTag.bulkCreate(newProductTags)]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({ message: "No product with this id!" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;