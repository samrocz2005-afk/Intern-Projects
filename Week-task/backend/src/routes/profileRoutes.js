const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");

router.route("/")
  .get(getProfile)
  .put(updateProfile);

module.exports = router;