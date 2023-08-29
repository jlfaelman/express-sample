const express = require('express');
const router = express.Router();
const userModel = require('../models/userModels');
const bodyParser = require('body-parser');
const UserModel = require('../models/userModels');
const {validateUser, generatePassword, confirmPassword, generateToken} = require('../helpers/userHelper');

router.use(bodyParser.json())

/** 
 * @swagger 
 * /user/: 
 *   get: 
 *     description: Get all users 
 *     responses:  
 *       200: 
 *         description: Success  
 *       500:
 *         description: Error
 *   
 */


router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({}, { _id: 0 });
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ "Error": err })
    }

})



/**
 * @swagger
 * /user/register:
 *      post:
 *          description: Insert user information into database
 *          parameters:
 *              - in : body
 *                name: User Information
 *                required: true
 *                schema:
 *                    type: object
 *                    description: User Information
 *                    properties:
 *                          fname:
 *                              description: First Name of User
 *                              type: string
 *                          age:
 *                              description: Age of User
 *                              type: string
 *                          lname:
 *                              description: Last Name of User
 *                              type: string
 *                          email:
 *                              description: Email of User
 *                              type: string
 *                          password:
 *                              description: Hashed password of User
 *                              type: string
 *                          address:
 *                              description: Address of User   
 *                              type: object
 *                              properties:
 *                                     line1: 
 *                                          type: string
 *                                     line2:
 *                                          type: string
 *                                     city:
 *                                          type: string
 *                                     province:
 *                                          type: string
 *                                     postal:
 *                                          type: string
 *          responses:
 *                  200:
 *                      description: Success
 *                  409:
 *                      description: Record already exists
 *                  500:
 *                      description: Bad Request
 *                  
 *                      
 */ 
router.post('/register', async (req, res) => {
    try {
        let body = req.body;

        const isValid = await validateUser(body);

        if(!isValid) return res.status(409).json({"msg":"Record already exists"});

        const password = await generatePassword(body.password);

        if(!password) return res.status(400).json({"msg":"Password not valid."})
        
        // set hashed password as password in body
        body.password = password;

        const newUser = new UserModel(body);

        const response = await newUser.save();
        
        res.status(200).json({"response":response});

    } catch (err) {
        res.status(500).send({"err":err})
    }
})

/**
 * @swagger
 * /user/auth:
 *   post:
 *      description: User authentication
 *      parameters:
 *          - in : body
 *            name: User credentials
 *            required: true
 *            schema: 
 *                  type: object
 *                  description: User credentials
 *                  properties:
 *                      email:
 *                          description: User email
 *                          type: string
 *                      password:                      
 *                          description: User Password
 *                          type: string
 *      responses:
 *               200:
 *                  description: Success
 *               404:
 *                  description: User not found
 *               403:
 *                   description: Unauthorized access
 *               500:
 *                   description: Bad Request
 *              
 */
router.post('/auth', async (req,res) => {
    try { 
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.find({email:email}).limit(1);

        const isPasswordValid = await confirmPassword(password,user[0].password);

        if (!isPasswordValid) return res.status(404).json({msg:"User not found."});

        const token = generateToken(user[0]);  
       
        res.status(200).json({msg:"User Accepted.",token:token});
    }
    catch(err) {
        console.log(err)
        res.status(500).json({'err':err}) ;
    }

});

module.exports = router;