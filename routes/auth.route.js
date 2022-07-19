const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.mdw.js');
const fs = require('fs');
const { login, register, refresh } = require("../controllers/auth.ctrl");
// const loginSchema = JSON.parse(await readFile(new URL('../schemas/login.json', import.meta.url)));
// const registerSchema = JSON.parse(await readFile(new URL('../schemas/register.json', import.meta.url)));
// const rfSchema = JSON.parse(await readFile(new URL('../schemas/rf.json', import.meta.url)));

const loginSchema = require('../schemas/login.json');
const registerSchema = require('../schemas/register.json');
const rfSchema = require('../schemas/rf.json');



router.post("/login",  validate(loginSchema), login);
router.post("/register", validate(registerSchema),register);

router.post('/refresh', validate(rfSchema), refresh);

module.exports = router;