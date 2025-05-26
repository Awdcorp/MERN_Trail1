// File: Server/scripts/seed-header-menu.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Menu = require("../models/Menu");

const fromStaticMegaMenu = {
  "Party Supplies": {
    "Tableware": ["Cups", "Plates", "Napkins", "Cutlery", "Serveware", "Drinkware", "Food Picks", "Tablecovers"],
    "Decorations": ["Banners", "Confetti", "Garlands", "Centrepieces", "Scene Setters", "Door Decorations", "Hanging Decorations"],
    "Party Essentials": ["Wearables", "Cake / Cupcake Toppers", "Tattoos", "Yard Signs", "Horns And Blowers", "Pinatas", "Confetti Poppers", "Invitation Cards", "Candles"],
    "Party Packages": ["The Value Package", "The Value Plus Package", "The Entertainment Package", "The Premium Package", "The Superior Package", "The Deluxe Package", "The Ultimate Package", "SEE ALL"],
    "Party Favors And Gifts": ["Gifts", "Favor Bags", "Party Favors"],
    "Art & Craft Stationary & Games": ["Arts & Crafts", "Stationary", "Games & Toys"],
    "By Theme": ["All Themes"],
    "By Occasions": ["All Occasions"],
    "Age": ["Toddler", "Baby", "Child", "Teen", "Adult"]
  },
  "Balloons": {
    "Birthdays": ["1st Birthday Balloons", "Adult Birthday Balloons", "Kids Birthday Balloons", "Teens Birthday Balloons", "Father's Birthday Balloons", "Mom's Birthday Balloons", "All Birthdays"],
    "Occasions": ["Birthday", "Anniversary", "Baby Shower", "Gender Reveal", "Bridal/Wedding", "Mother's Day", "Graduation", "Valentine's Day", "Ramadan/Eid", "UAE National Day", "Halloween", "New Year's", "Seasonal"],
    "Balloon Bouquets": ["Age Foil Balloon Bouquets", "Birthday Foil Balloon Bouquets", "Custom Age Balloon Bouquets", "Latex Balloon Bouquets", "Chrome Balloon Bouquets", "Printed Balloon Bouquets", "Foil Balloon Bouquets", "All Balloon Bouquets"],
    "Custom Text Balloons": ["Bubble Balloons With Mini", "Balloon Filling", "Bubble Balloons With Confetti Filling", "Colour Balloons With Custom Text", "All Balloons"],
    "Balloon Types": ["Balloon Banners", "Number Balloons", "Letter Balloons", "Latex Balloons", "Plain Foil Balloons", "Chrome Latex Balloons", "Metallic Latex Balloons", "Printed Latex Balloons", "Foil Balloons", "Air Balloons", "Latex Balloon Packets", "All Types"],
    "Accessories": ["Balloon Tassels", "Weights", "Confettis", "Inflation Pumps", "Balloon Ribbons", "Balloon Stickers", "Balloon Cup & Sticks", "Double-Sided Stickers"],
    "Balloon Decorations": ["Balloon Arches", "Personalised Backdrops", "Balloon Pillars", "Hollow Letters", "Bedroom Decorations", "Welcome Board Balloons", "Balloons Sculptures", "Balloons Garlands", "Customised Decorations", "All Decorations"],
    "Shape & Size": ["Standard", "Supershape", "Jumbo", "Airwalker", "Orbz", "18 Inch", "24 Inch", "32 Inch", "38 Inch", "All Sizes"]
  },
  "Costumes": {
    "Costume By Category": ["Animals", "Professions", "Cartoons Characters", "Superheroes", "Historical", "Sports", "TV And Movies", "Book Characters", "Warriors", "Princes & Princesses", "Retro", "All Categories"],
    "Costume Accessories": ["Armors & Weapons", "Bandanas", "Glasses/Eye Accessories", "Face Masks", "Fake Items", "Helmets", "Jewellery", "Nose & Ear Accessories", "Nails", "Tattoos", "Beards & Moustaches", "Wings", "All Accessories"],
    "Halloween": ["Devils", "Ghosts", "Skeletons", "Vampires", "Zombies", "Witches & Wizards", "Pumpkins", "All Halloween"],
    "Costume By Age": ["Baby", "Toddler", "Child", "Adult", "All Ages"],
    "Costume By Gender": ["Male", "Female", "Unisex", "All Gender"]
  }
};

const defaultHeaderMenu = Object.entries(fromStaticMegaMenu).map(([label, sub]) => ({
  label,
  type: "internal",
  link: `/shop/category/${label.toLowerCase().replace(/\s+/g, '-')}`,
  children: Object.entries(sub).map(([category, items]) => ({
    label: category,
    type: "internal",
    link: `/shop/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    children: items.map(item => ({
      label: item,
      type: "internal",
      link: `/shop/category/${item.toLowerCase().replace(/\s+/g, '-')}`
    }))
  }))
}));

async function seedHeaderMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await Menu.findOne({ name: "header" });
    if (existing) {
      existing.items = defaultHeaderMenu;
      await existing.save();
      console.log("✅ Updated existing header menu.");
    } else {
      await Menu.create({ name: "header", items: defaultHeaderMenu });
      console.log("✅ Created new header menu.");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Failed to seed header menu:", err);
    mongoose.connection.close();
  }
}

seedHeaderMenu();