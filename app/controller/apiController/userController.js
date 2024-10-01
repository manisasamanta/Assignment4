const sendEmail = require("../../helper/mailer");
const User = require("../../model/user");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')




class userController{

signup = async (req, res) => {
    try{
        const { email, password,bio } = req.body;
        
        // Validate input
        if (!email || !password) {
          return res.status(400).json({
              status: false,
              message: "Email and password are required."
          });
      }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Email already in use. Please use a different email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ 
            email, 
            password: hashedPassword,
            bio 
        });
        if (req.file) {
          user.profilePicture = req.file.path;
      }
        await user.save();
      
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const verificationUrl = `http://localhost:4600/verify/${token}`;

        await sendEmail(
            email, 
            'Account Verification', 
            `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a></p>`
        );
      
        res.status(200).json({
            status: true,
            data:user,
            message: "Signup successful, please check your email for verification."
          })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }

//user email verify with token
verify_token = async (req, res) => {
    try{
        const { token } = req.params;
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'Invalid verification link.'
            });
        }
      
        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                status: false,
                message: 'Email is already verified.'
            });
        }

        // Mark the user as verified
        user.isVerified = true;
        await user.save();

        res.status(201).json({
            status: true,
            message: "Email verified successfully. You can now log in."
          })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }


  //user login
  login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
      
        if (!user || !user.isVerified || !await bcrypt.compare(password, user.password)) {
          return res.status(400).send('Invalid email or password');
        }
      
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            status: true,
            token:token
          })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }



  // Retrieve profile
  profile = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
              status: false,
              message: 'User not found',
              data: null
            });
          }

        res.status(201).json({
            status: true,
            data:user
          })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }

//update profile
update_profile = async (req, res) => {
  try{
    const id = req.params.id;
    const newImage = req.file.path;
  
 //Remove the previous image file if a new image was uploaded
 const df=await User.findById(id)

 fs.unlinkSync(df.profilePicture)

 const updatedUser = await User.findByIdAndUpdate(
  id,
  {
      bio: req.body.bio,
      profilePicture: newImage,
  },  
  { new: true }
);

  res.status(201).json({
    status: true,
    data:updatedUser,
    message:'Profile updated'
  })
  }catch(error){
    res.status(500).json({
      status:false,
      message:error.message
    });
  }
}




}

module.exports = new userController()