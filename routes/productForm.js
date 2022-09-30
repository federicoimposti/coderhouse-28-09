const express = require('express');
const productFormRouter = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User'); 

productFormRouter.get("/", auth, async (req, res) => {
  const { username } = await User.findById(req.user._id);
  res.render("pages/productForm", {
    user: username,
  });
});

module.exports = productFormRouter;