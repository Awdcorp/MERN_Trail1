// scripts/seedHomepageLayout.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const HomepageLayout = require("../models/HomepageLayout");

const MONGO_URL = process.env.MONGO_URL || "your_mongo_connection";

const run = async () => {
  await mongoose.connect(MONGO_URL);
  await HomepageLayout.deleteMany({});

  await HomepageLayout.create({
    sections: [
  {
    type: "slider",
    data: {}
  },
  {
    type: "product-slider",
    data: {
      title: "NEW ARRIVALS",
      categoryIds: ["67f844b7f1275889ad3993b8"],
      limit: 10
    }
  },
  {
    type: "category-grid",
    data: {
      title: "Shop by Occasion",
      isSlider: true,
      categories: [
        { name: "Birthday", image: "/placeholders/birthday.jpg", slug: "birthday" },
        { name: "Eid", image: "/placeholders/eid.jpg", slug: "eid" },
        { name: "Halloween", image: "/placeholders/halloween.jpg", slug: "halloween" },
        { name: "Graduation", image: "/placeholders/graduation.jpg", slug: "graduation" },
        { name: "Ramadan", image: "/placeholders/ramadan.jpg", slug: "ramadan" },
        { name: "Engagement", image: "/placeholders/engagement.jpg", slug: "engagement" },
        { name: "Gender Reveal", image: "/placeholders/gender-reveal.jpg", slug: "gender-reveal" }
      ]
    }
  },
  {
    type: "theme-grid",
    data: {
      title: "SHOP BY THEME",
      limit: 4
    }
  },
  {
    type: "product-slider",
    data: {
      title: "NEW ARRIVALS 2",
      categoryIds: ["67f844b7f1275889ad3993b8"],
      limit: 10
    }
  },
  {
    type: "category-grid",
    data: {
      title: "Plan Your Birthday",
      isSlider: true,
      categories: []
    }
  },
  {
    type: "party-packages",
    data: {
      packages: [
        {
          name: "The Value Package",
          image: "https://partyworld.ae/wp-content/uploads/2025/03/children-celebrating-birthday-party-scaled-1.jpg",
          link: "the-value-package-2"
        },
        {
          name: "The Premium Package",
          image: "https://partyworld.ae/wp-content/uploads/2025/03/group-happy-kids-with-colorful-candies-having-fun-birthday-party-isolated-white-scaled-1.jpg",
          link: "the-premium-package"
        },
        {
          name: "The Deluxe Package",
          image: "https://partyworld.ae/wp-content/uploads/2025/03/madness-birthday-party-scaled-1.jpg",
          link: "the-deluxe-package"
        }
      ]
    }
  },
  {
    type: "store-locations",
    data: {
      stores: [
        {
          name: "AL BARSHA",
          address: "Iridium building, Umm Suqeim Road, Barsha, Dubai",
          color: "from-[#B7117A]",
          buttonColor: "#B7117A",
          mapSrc: "https://www.google.com/maps/embed?pb=!1m18..."
        },
        {
          name: "MOTORCITY",
          address: "Foxhill 9 building, Ground floor, Motor City, Dubai",
          color: "from-[#F18074]",
          buttonColor: "#F18074",
          mapSrc: "https://www.google.com/maps/embed?pb=!1m18..."
        }
      ]
    }
  },
  {
    type: "contact-info",
    data: {
      phones: ["600572789"],
      whatsapp: ["0503735574", "0565577610"],
      buttonText: "Contact Us",
      buttonLink: "/contact"
    }
  }
]

  });

  console.log("✅ Homepage layout seeded.");
  process.exit();
};

run();
