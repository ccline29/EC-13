const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


// GET All tags
router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [{ model: Product }], 
    }); 
    res.status(200).json(allTags)
  } catch (err) {
    console.log(err); 
    res.status(500).json(err); 
  }
});


// GET tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({ where: {id: req.params.id} }, {
      include: [{ model: Product }, { model: ProductTag }], 
    }); 

    if (!tagData) {
      res.status(400).json({ message: 'No tag found with that ID!'}); 
    }

    res.status(200).json(tagData); 
  } catch (err) {
    res.status(500).json(err); 
  }
});



router.post('/', async (req, res) => {
  const tagData = await Tag.create(req.body); 

  return res.json(tagData); 
});


router.put('/:id', async (req, res) => {
  const tagData = await Tag.update(
    {
      id: req.body.id, 
      tag_name: req.body.tag_name
    }, 
    {
      where: {
        id: req.params.id
      },
    }
  ); 

  return res.json( {message: "Tag updated successfully." }); 
});



router.delete('/:id', async (req, res) => {
  const tagData = await Tag.destroy({
    where: {
      id: req.params.id
    },
  });

  return res.json( {message: "Tag deleted successfully." }); 
});

module.exports = router;