import express from "express";

import User from "../models/user.js";

const router = express.Router();

router.post("/", function(req, res, next) {
  const newUser = new User(req.body);

  newUser.save().then(savedUser => {
    res.send(savedUser);
  }).catch(err => {
    next(err);
  })
});

router.get("/", function (req, res, next) {
  User.find().sort('name').exec().then(users => {
    res.send(users);
  }).catch(err => {
    next(err);
  });
});

export default router;
