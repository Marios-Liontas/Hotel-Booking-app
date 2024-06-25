import { check, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

// api/auth/login
router.post(
    "/login",
    [
    // Express validator that checks if user inputs are correct
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
        min: 6,
    }),
    ],
    async (req: Request, res: Response) => {
    
    //Express validator to get ahold of errors if there are any and sent back a 400 status
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    // Getting email and password from the request body
    const { email, password } = req.body;

        
    /* Search database for email, if a matching email exists 
       go ahead and chech if the passwords match, if not then sent a 400 status.
       In case of error sent 500 status */
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        //Create token for user when he signs in that expires in 1 day
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

        res.status(200).json({userId: user._id})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Endpoind to validate a user token and respond with user id
router.get("/validate-token", verifyToken, (req:Request, res:Response) => {
    res.status(200).send({userId: req.userId})
});

// Logout functionality which returns an empty token that expires the moment it is created
router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});

export default router