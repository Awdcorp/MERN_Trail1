router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
