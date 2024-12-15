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
    /* 
this is run when creating a new user by a registered user who logged in now also.
  * there are two type users have this site.   
  1.User -  can buy products
  2.Admin - can maintain the site. 

  1.create an user. - this is normal method.
  2.create an admin - this is a complex method. because there should be generate
  a problem if user can create a admin acc.it should not be happen.
  * so we do bellow scenario to prohibit it.

  steps -:
  1.check user type is a admin/user/default.
  2.user is a admin it is not a problem.
    user is a user/default  -
*/

if(newUserData.type == "admin"){
    if(req.user==null){
        res.json({
            message: "please login as administrator to create admin accounts"
        })
        return
    }

    if(req.user.type != "admin"){
        res.json({
            message :"please login as administrator to create admin accounts"
        })
        return
    }
} 

//now users cannot create admins.Only admins can create admins.

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

export function isAdmin(req){
    if(req.user==null){
        return false
    }

    if(req.user.type !="admin"){
        return false
    }

    return true
}

export function isCustomer(req){
    if(req.user==null){
        return false
    }

    if(req.user.type !="customer "){
        return false
    }

    return true
}

export function deleteUser(req,res){
    User.deleteOne({email: req.body.eamil}).then(()=>{
        res.json({
            message:"student deleted"
        })
    })
};



     