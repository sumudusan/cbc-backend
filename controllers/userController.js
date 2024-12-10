import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

export async function getUser(req,res){

    try{
        const userList= await User.find()
    res.json({
        list:userList
    })
    }catch(e){
        res.json({
            message: "Error"
        })
    }
    

    //we use 'async' instead of use bellow commented code.   
    /*  User.find().then(
        (userList)=>{
            res.json({
                list:userList
            })
        }
    )*/
   
}

export function createUser(req,res){ 

    const newUserData =req.body

    newUserData.password = bcrypt.hashSync(newUserData.password,10)

    console.log(newUserData)

    const user =new User(newUserData)

    user.save().then(()=>{
        res.json({
            message:"User created"
        })
    }).catch(()=>{
        res.json({
            message:"User not created"
        })
    })
}

export function loginUser(req,res){
    User.find({email: req.body.email}).then(
        (users)=>{
            if(users.length == 0){
                res.json({
                    message:"User not found"
                })
            }
            else{
                const user=users[0]

                const isPasswordCorrect =bcrypt.compareSync(req.body.password,user.password)
           
                if(isPasswordCorrect){
                    const token =jwt.sign({
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        isBlocked:user.isBlocked,
                        type:user.type
                    } , process.env.SECRET)

                    res.json({
                        message:"User logged in",
                        token:token
                    })
                }
                else{
                    res.json({
                        message:"user not logged in (wrong password)"
                    })
                }
            }
        }
    )
}

export function deleteUser(req,res){
    User.deleteOne({email: req.body.eamil}).then(()=>{
        res.json({
            message:"student deleted"
        })
    })
};



     