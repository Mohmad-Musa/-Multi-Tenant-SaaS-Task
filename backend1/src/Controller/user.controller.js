import { generateToken } from "../lib/utils.js"
import User from "../Modules/user.model.js"
import bcrypt from "bcryptjs";
import {check} from "express-validator"


export const signup = async (req,res) =>{
const {email,password,fullname} = req.body
    try {
if(!fullname || !password || !email){
    return res.status(400).json({message:"please fill all fields"})
}
if(password.length < 6){
    return res.status(400).json({message:"password should be 6 character or more"})
}
const user = await User.findOne({email})
if(user) return res.status(400).json({message:"Email Already exist"})

const salt =  await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)


const newUser = new User({
email,
fullname,
password:hashedPassword,

})

if (newUser) {
  generateToken(newUser._id, res);
 await newUser.save();
  res.status(201).json({
    _id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    message: "User created",
  });
} else {
  res.status(400).json({ message: "User not created" });
}

    }
    catch(error){
            console.log("Error in signup", error.message);
            res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async(req,res) =>{
const {email,password} = req.body
try{
const user = await User.findOne({email})
if(!user)
    res.status(400).json({message:"Email incorrect"})

const isPasswordCorrect = await bcrypt.compare(password,user.password) 

if (!isPasswordCorrect){ res.status(400).json({ message: "Password incorrect" });
}
generateToken (user._id,res)
res.status(200).json({
    _id:user._id,
    email:user.email,
    message:"Login Successfully",
})
}
catch(error) {
console.log("Error in login controller",error.message)
res.status(500).json({message:"Internal Server Error"})
}


}

export const logout = async(req,res) =>{
    try{
res.cookie("jwt","",{maxAge:0})
     res.status(200).json({ message: "Logged out successfully" });

    }
    catch(error){
console.log("Error in login controller", error.message);
res.status(500).json({ message: "Internal Server Error" });
    }
}


export const GetUsers = async (req, res) => {
  try {
    const getall = await User.find().select("-password")
    res.status(200).json({
      users:getall
    })
  } catch (error) {
    console.log("Error in get all users controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const GetUserById = async (req, res) => {
  const {id} = req.params
  try {
    const getUser = await User.findById(id).select("-password");
    
    if(!getUser || !id) 
      res.status(400).json({message:"id provided is incorrect"})

    res.status(200).json({
      user: getUser,
      message: "get User",
    });
  } catch (error) {
    console.log("Error in get user controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetallOrgByUser = async (req,res) =>{
try {
const {id} = req.params
const user = await User.findById(id).populate("roles.organization", "name");
 if (!user) {
   return res.status(404).json({ message: "User not found" });
 }
     const organizations = user.roles.map((r) => ({
       orgId: r.organization._id,
       orgName: r.organization.name,
       role: r.role,
     }));
    res.status(200).json({ organizations });

} catch (error) {
  console.log("Error in GetallOrgByUser controller", error.message);
  res.status(500).json({ message: "Internal Server Error" });
}

}





export const checkAuth = async(req,res) =>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

















