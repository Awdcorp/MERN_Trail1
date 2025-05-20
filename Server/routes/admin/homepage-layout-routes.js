const router = require("express").Router();
const {
  getHomepageLayout,
  updateHomepageLayout
} = require("../../controllers/admin/homepage-layout-controller");

router.get("/", getHomepageLayout);
router.put("/", updateHomepageLayout);

module.exports = router;
