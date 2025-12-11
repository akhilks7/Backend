// 1. import express 
const express = require("express");
const { registercontroller, loginController, editProfileController, getallAdminUsersController, UpdateAdminProfileController, googleLoginController } = require("./controller/usercontroller");
const { addBookController, homeBookController, getallBookController, getOwnBookController, deleteUserAddedBookController, getBookHistoryController, getsSelectedBookController, getallAdminBookController, updateadminBookController, makeBookPaymentController } = require("./controller/bookController");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const multerConfig = require("./middleware/imgMulterMiddleware");
const adminjwtMiddleware = require("./middleware/adminjwtMiddleware");

const router = express.Router()

// register
router.post("/register", registercontroller) 

// login
router.post("/login", loginController)

// google login
router.post("/google-login", googleLoginController)

// home books
router.get("/home-books", homeBookController)

// -----------user---------------

// add book
router.post("/add-book",jwtMiddleware,multerConfig.array("uploadImages",3),addBookController)

// all books
router.get("/all-books",jwtMiddleware, getallBookController)

// a books
router.get("/view-books/:id",jwtMiddleware,getsSelectedBookController)

// get own books   
router.get("/own-books",jwtMiddleware, getOwnBookController)

// delete user added book
router.delete("/delete-book/:id",deleteUserAddedBookController)

// get own books history
router.get("/history-books",jwtMiddleware, getBookHistoryController)

// update User 
router.put("/update-userprofile",jwtMiddleware,multerConfig.single("profile"),editProfileController)

// make Book Payment
router.put("/make-payment",jwtMiddleware,makeBookPaymentController)

// -----------------admin-----------------

// all books
router.get("/all-adminbooks", getallAdminBookController)

// update book
router.put("/update-book/:id",updateadminBookController)

// get all users
router.get("/all-Adminusers",adminjwtMiddleware,getallAdminUsersController)

// update admin setting
router.put("/update-settings",adminjwtMiddleware,multerConfig.single("profile"),UpdateAdminProfileController)


module.exports = router