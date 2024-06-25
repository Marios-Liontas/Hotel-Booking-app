import express, { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator'

const router = express.Router();


// /api/users/register
router.post(
    "/register",
    [
    // Express validator that checks if user inputs are correct
    check("firstName", "First Name is Required").isString(),
    check("lastName", "Last Name is Required").isString(),
    check("email", "Email is Required").isEmail(),
    check("password", "Password with 6 or more characters Required").isLength({
        min: 6
    }),
    ],
    async (req: Request, res: Response) => {

    //Express validator to get ahold of errors if there are any and sent back a 400 status
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }
    try {

        /* Checking if user email passed to the body exists,
           if it does send a 400 staus, if not create and save the new user
           in database */
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(400).json({message: "User already exists"})
        }

        user = new User(req.body)
        await user.save();


        // Generating a json web token that expires after 1 day
        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );


        /* Setting it as a cookie and sending it over HTTPS 
           if the enviroment is set to production for security */
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        return res.status(200).send({ message: "User registered OK" });

    } catch (error) {
        console.log(error);
        res.status(500).send({message:  "Something went wrong"})
    }
});

export default router;