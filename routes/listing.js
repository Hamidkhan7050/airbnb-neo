const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const passport = require("passport");
const {isLoggedIn,isOwner}=require("../middleware.js");

const listingController=require("../controllers/listings.js")

// adding multer
const multer=require('multer');
const {storage}=require("../CloudConfig.js");
const upload=multer({storage});



// index route
router.get("/", wrapAsync(listingController.index))


// new listing route

router.get("/new",isLoggedIn,listingController.newForm)


// router.post("/",upload.single('listingImage'),(listingController.addNewListing))

router.post(
  "/",
  upload.single("listingImage"),
  wrapAsync(listingController.addNewListing)
);

// test karne ke liye new route bana raha hu

// router.post("/",upload.single('listingImage'),(req,res)=>{
//     res.send(req.file);
//     // console.log("hello")
// });

// show route

router.get("/:id",wrapAsync(listingController.showListing))


// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))

// update route

router.put("/:id",upload.single("listingImage"),isLoggedIn,isOwner,wrapAsync(listingController.updateListing))

// DELETE  route

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports=router;