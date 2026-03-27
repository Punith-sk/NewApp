const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createPost, getPosts } = require('../controllers/postController');

router.use(protect);
router.get('/', getPosts);
router.post('/', createPost);

module.exports = router;
