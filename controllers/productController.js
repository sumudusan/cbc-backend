import Product  from "../models/product.js";

function isAdmin(req) {
  return req.user && req.user.type === 'admin';
}

export function getProduct(req,res){

  Product.find().then(

    (productList)=>{
      res.status(200).json(
         productList
      ) 
    }
  ).catch(
    (err)=>{
      res.json({
        message : "Error"
      })
    }
  )
}

export function createProduct(req,res){

  console.log(req.user)

  if(req.user==null){
    res.json({
      message:"You are not logged in"
    })
    return
  }

   if(req.user.type !="admin"){
    res.json({
      message:"You are not an admin"
    })
    return
   }

  const product = new Product(req.body)

  product.save().then(()=>{
    res.json({
      message: "Product created"
    })
  }).catch((error)=>{
    res.status(403).json({
      message:error
    })
    }) 
}

export function deleteProduct(req,res){
  if(!isAdmin(req)){
    res.status(403).json(
      {
        message : "Please login as administrator to delete products"
      })
      return
  }

  const productId =req.params.productId

  Product.deleteOne({productId : productId}).then(
    ()=>{
      res.json({
        message : "Product deleted"
      })
}).catch((error)=>{
      res.status(403).json({
          message : error
        })
    })
}

export function upadateProduct(req,res){
  if(!isAdmin(req)){
    res.status(403).json({
      message: "please login as administrator to update product"
    })
    return
  }

  const productId = req.params.productId
  const newProductData =req.body

  Product.updateOne(
    {productId : productId},
    newProductData
  ).then(()=>{
    res.json({
      message: "Product Updated"
    })
  }).catch((error)=>{
    res.status(403).json({
      message :error
    })
  })
}


export function getProductByName(req,res){

  const name =req.params.name;

  Product.find({name : name}).then(
    (productList)=>{
      res.json(
         productList
      )
    }
  ).catch(()=>{ 
    res.json({
      message:"Error"
    })
  }
  )
}

export async function getProductById(req, res){

  try{
    const productId = req.params.productId

    const product = await Product.findOne({productId : productId})
  
    res.json(product)
  }catch(e){
     res.status(500).json({e})
  }
 
}