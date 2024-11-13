import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import * as config from '../config.js';
import User from "../models/user.js";
import { authenticate } from "./auth.js";

const signJwt = promisify(jwt.sign);

const router = express.Router();

router.post("/", function(req, res, next) {
  const plainTextPassword = req.body.password;

  bcrypt.hash(plainTextPassword, config.bcryptCostFactor).then(hash => {
    req.body.password = hash;
    const newUser = new User(req.body);

    return newUser.save().then(savedUser => {
      res.send(savedUser);
    });
  }).catch(err => {
    next(err);
  });
});

router.get("/", authenticate, function (req, res, next) {
  User.find().sort('name').exec().then(users => {
    res.send(users);
  }).catch(err => {
    next(err);
  });
});

router.put("/:id", loadUserByRequestId, async function(req, res, next) {
  const user = req.user;
  user.name = req.body.name;
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    next(err);
  }
});

async function loadUserByRequestId(req, res, next) {
  const user = await User.findById(req.params.id);
  if (user === null) {
    return res.sendStatus(404);
  }

  req.user = user;
  next();
}

router.post("/login", function (req, res, next) {
  User.findOne({ name: req.body.name })
    .exec()
    .then(user => {
      if (!user) return res.sendStatus(401); // Unauthorized
      return bcrypt.compare(req.body.password, user.password).then(valid => {
        if (!valid) return res.sendStatus(401); // Unauthorized
        // Login is valid...
        const exp = Math.floor((Date.now() / 1000) + 60 * 60 * 24);
        return signJwt({ sub: user._id, exp: exp }, config.secret).then(token => {
          res.send({ message: `Welcome ${user.name}!`, token });
        });
      });
    })
    .catch(next);
});

export default router;
