const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log("🔍 [SEARCH PRODUCTS] Keyword received:", keyword);

    if (!keyword || typeof keyword !== "string") {
      console.warn("⚠️ [SEARCH PRODUCTS] Invalid keyword");
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    console.log("📦 [SEARCH PRODUCTS] Query being used:", createSearchQuery);

    const searchResults = await Product.find(createSearchQuery);
    console.log(`✅ [SEARCH PRODUCTS] Found ${searchResults.length} results`);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("❌ [SEARCH PRODUCTS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
