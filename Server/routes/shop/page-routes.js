const express = require("express");
const router = express.Router();
const { getPageBySlug } = require("../../controllers/shop/page-controller");

router.get("/:slug", getPageBySlug); // GET /api/pages/:slug

module.exports = router;
// This route handles fetching a page by its slug. The slug is a unique identifier for the page, typically used in the URL to identify the page being requested. The controller function `getPageBySlug` is responsible for querying the database and returning the appropriate page data.
// The route is defined using the Express router, which allows for modular routing in the application. The `getPageBySlug` function is imported from the `page-controller` module, which contains the logic for handling the request and response.