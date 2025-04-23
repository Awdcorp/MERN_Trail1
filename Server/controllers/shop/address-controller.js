// controllers/shop/address-controller.js
const Address = require("../../models/Address");

// POST /api/shop/address/add
const addAddress = async (req, res) => {
  try {
    const { userId, guestId, address, city, pincode, phone, notes } = req.body;
    if (!(userId || guestId) || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }
    const newlyCreatedAddress = new Address({ userId: userId || null, guestId: guestId || null, address, city, pincode, notes, phone });
    await newlyCreatedAddress.save();
    return res.status(201).json({ success: true, data: newlyCreatedAddress });
  } catch (e) {
    console.error("❌ addAddress error:", e);
    return res.status(500).json({ success: false, message: "Error adding address" });
  }
};

// GET /api/shop/address/get/:userId (ownerId may be userId or guestId)
const fetchAllAddress = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner id is required!" });
    }
    const addressList = await Address.find({ $or: [{ userId: ownerId }, { guestId: ownerId }] });
    return res.status(200).json({ success: true, data: addressList });
  } catch (e) {
    console.error("❌ fetchAllAddress error:", e);
    return res.status(500).json({ success: false, message: "Error fetching addresses" });
  }
};

// PUT /api/shop/address/update/:userId/:addressId
const editAddress = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const addressId = req.params.addressId;
    const formData = req.body;
    if (!ownerId || !addressId) {
      return res.status(400).json({ success: false, message: "Owner and address id are required!" });
    }
    const updated = await Address.findOneAndUpdate(
      { _id: addressId, $or: [{ userId: ownerId }, { guestId: ownerId }] },
      formData,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found!" });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (e) {
    console.error("❌ editAddress error:", e);
    return res.status(500).json({ success: false, message: "Error editing address" });
  }
};

// DELETE /api/shop/address/delete/:userId/:addressId
const deleteAddress = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const addressId = req.params.addressId;
    if (!ownerId || !addressId) {
      return res.status(400).json({ success: false, message: "Owner and address id are required!" });
    }
    const deleted = await Address.findOneAndDelete({ _id: addressId, $or: [{ userId: ownerId }, { guestId: ownerId }] });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found!" });
    }
    return res.status(200).json({ success: true, message: "Address deleted!" });
  } catch (e) {
    console.error("❌ deleteAddress error:", e);
    return res.status(500).json({ success: false, message: "Error deleting address" });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
