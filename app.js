const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./model/product");
const User = require("./model/user");
const Shop = require("./model/shop");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://govindkushwaha6263:pp_project6263@cluster0.qs87gim.mongodb.net/pp_project",
    { useNewUrlParser: true, useunifiedTopology: true }
  )
  .then(() => {
    console.log("Connected with MongoDB Database");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});

// ********************************************************** USER ********************************************************************

// Create User
app.use("/api/v2/user/create-user", async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    res.status(500).json({
      success: false,
      message: "user already exist",
    });
  }
  const users = await User.create(req.body);
  res.status(201).json({
    success: true,
    users,
  });
});

// User Login
app.use("/api/v2/user/user-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({
      success: false,
      message: "Enter Correct Details",
    });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(500).json({
      success: false,
      message: "user not found",
    });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(500).json({
      success: false,
      message: "Please Provide a Correct Information",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  }
});

// Load User by ID
app.use("/api/v2/user/load-user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).jsin({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Updata User info
app.use("/api/v2/user/update-user-info/:id", async (req, res) => {
  const { name, email, address, phoneNumber } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  } else {
    user.name = name;
    user.email = email;
    user.address = address;
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User Updated Sucessfully",
      user,
    });
  }
});

// delete User
app.use("/api/v2/user/delete-user/:id", async (req, res) => {
  const user = User.finById(req.params.id);
  if (!user) {
    res.status(500).json({
      success: false,
      message: "User is not available with this id",
    });
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });
});

// **************************************************************** SHOP ****************************************************************
// Create Shop
app.use("/api/v2/shop/create-shop", async (req, res) => {
  const { email } = req.body;
  const sellerEamil = await Shop.findOne({ email });
  if (sellerEamil) {
    res.status(500).json({
      success: false,
      message: "This email is Already exist",
    });
  }
  const shop = await Shop.create(req.body);
  res.status(201).json({
    success: true,
    shop,
  });
});

//Shop Login
app.use("/api/v2/shop/shop-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({
      success: false,
      message: "Please Provide all feilds",
    });
  }
  const shop = await Shop.findOne({ email }).select("+password");
  if (!shop) {
    res.status(500).json({
      success: false,
      message: "shop Dose't Exist",
    });
  }
  const isPasswordValid = await shop.comparePassword(password);
  if (!isPasswordValid) {
    res.status(500).json({
      success: false,
      message: "Please Provide the correct details",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Shop Logged Successfully",
      shop,
    });
  }
});

// get Shop Info
app.use("/api/v2/shop/shop-info/:id", async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    res.status(500).json({
      success: false,
      message: "Shop not find with this Id",
    });
  }

  const shopInfo = {
    name: shop.name,
    email: shop.email,
    discription: shop.discription,
    address: shop.address,
    phoneNumber: shop.phoneNumber,
    role: shop.role,
    zipCode: shop.zipCode,
    availableBalance: shop.availableBalance,
    createAt: shop.createdAt,
    transections: shop.transections,
  };
  console.log(shopInfo);
  res.status(201).json({
    success: true,
    shopInfo,
  });
});

// Update Shop/seller info
app.use("/api/v2/shop/update-shop-info/:id", async (req, res) => {
  const { name, discription, address, phoneNumber, zipCode } = req.body;
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    res.status(500).json({
      success: false,
      message: "Shop not find with this Id",
    });
  } else {
    shop.name = name;
    shop.discription = discription;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(201).json({
      success: true,
      message: "Shop Info Updated Successfully",
      shop,
    });
  }
});

// get all sellers / shops for -- admin
app.use("/api/v2/shop/admin-all-shop", async (req, res) => {
  const shops = await Shop.find().sort({ createdAt: -1 });

  if (shops) {
    res.status(200).json({
      success: true,
      shops,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Shops not found",
    });
  }
});

// Delete seller / shop
app.use("/api/v2/shop/delete-shop/:id", async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (shop) {
    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Shop deleted Successfully",
    });
  } else {
    res.status(500),
      json({
        success: false,
        message: "Shop not found wioth this Id",
      });
  }
});

//************************************************************** PRODUCT ****************************************************************
// Add new Product or Create Product
app.post("/api/v2/product/create-product", async (req, res) => {
  const shopId = req.body.shopId;
  const shop = await Shop.findById(shopId);
  if (!shop) {
    res.status(500).json({
      success: false,
      message: "Shop Id isInvalid",
    });
  }
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

//Get all Products for -- admin
app.get("/api/v2/all-products-admin", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  if (products) {
    res.status(200).json({
      success: true,
      products,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Products not found",
    });
  }
});

//Get all Products of Shop
app.get("/api/v2/all-products-shop/:id", async (req, res) => {
  const products = await Product.find({ shopId: req.params.id });
  if (products) {
    res.status(200).json({
      success: true,
      products,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Products not found",
    });
  }
});

// Delete Product
app.delete("/api/v2/product/deleteProduct/:id", async (req, res) => {
  // id = Product id
  const productId = await Product.findById(req.params.id);

  if (!productId) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await Product.findByIdAndDelete(productId);
  res.status(200).json({
    success: true,
    message: "Product is Deleted Successfully",
  });
});

// Update Products
app.put("/api/v2/product/updateProduct/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (product) {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: true,
      runValidator: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
});
