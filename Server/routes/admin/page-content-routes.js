const express = require('express');
const router = express.Router();
const pageContentController = require('../../controllers/admin/page-content-controller');

// Admin Routes (no auth for now to match existing pattern)
router.get('/admin/page-content', pageContentController.getAllPages);
router.put('/admin/page-content/:slug', pageContentController.updatePageBySlug);

// Public Route
router.get('/page-content/:slug', pageContentController.getPageBySlug);

module.exports = router;
