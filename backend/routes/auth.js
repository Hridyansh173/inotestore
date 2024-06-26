const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
const JWT_SECRET='Harryisagood$oy';
router.post('/', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const salt=await  bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.Password,salt);  
        const user = await User.create({
            name: req.body.name,
            Password: secPass,
            email: req.body.email
        });
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json({authtoken});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
