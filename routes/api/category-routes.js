const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

//http://localhost:3001/api/categories
router.get("/", async (req, res) => {
  // find all categories
  // include associated Products
  try {
    const categoriesData = await Category.findAll({
      include: [{ model: Product }],
    });
    return res.json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});
//http://localhost:3001/api/categories/:id -> param
router.get("/:id", async (req, res) => {
  try {
    const categoriesData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!userData) {
      res.status(404).json({ message: "No user with this id!" });
      return;
    }
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/categories
router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoriesData = await Category.create(req.body);
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//http://localhost:3001/api/categories/:id -> param
router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoriesData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!userData[0]) {
      res.status(404).json({ message: "No user with this id!" });
      return;
    }
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/categories/:id -> param
router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoriesData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!userData) {
      res.status(404).json({ message: "No user with this id!" });
      return;
    }
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;