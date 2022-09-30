const express = require('express');
const router = express.Router();
const productFormRouter = require('./productForm');
const productsRouter = require('./products');
const productsFakerRouter = require('./productsFaker');
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const loginError = require('./loginError');

router.use('/', productFormRouter);
router.use('/productos', productsRouter);
router.use('/api/productos-test', productsFakerRouter);
router.use('/login', login);
router.use('/logout', logout);
router.use('/register', register);
router.use('/login-error', loginError);

module.exports = router;