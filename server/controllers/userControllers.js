const express = require('express');
const Teams = require('../models/TeamsSchema');
const User = require('../models/UserSchema')
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");
const uploadImage = require("../utils/uploadImage");
const logger = require('../logger/index')
const {sanitizeUser} = require('../utils/sanitizeData')
const {DeleteFiles } = require('../utils/deleteFiles')

const getProfile = asyncHandler( async(req,res,next) => {

  const data = await User.find({_id : req.params.id}).select("-password")

  if(data)
  {
    res.status(200).json({
      data : data
    })
  }
  else
  {
    res.status(404).json({
      message : "User not found !"
    })
  }
  
}
)

const setProfilePic = asyncHandler(async(req,res,next) => {
  
  console.log(req.files)     
  var urlOfImage ;
  if(req.files != undefined){
  try{
  urlOfImage  = await uploadImage(req.files[0])
  logger.info(urlOfImage)
  } catch(err){
    return res.status(500).json({
      message : "Error while uploading files and images !"
    })
  }
  }else
  {
    return res.status(404).json({
      message : "you have to set an image"
    })
  }
  const data = await User.findByIdAndUpdate({_id : req.userId} , {Image : urlOfImage } , {new : true}).select("-password")

  return res.status(200).json({
    message : "Image updated successfully !",
    data : sanitizeUser(data)
  })
  

}

)

const setBackgroundPic = asyncHandler(async(req,res,next) => {
  
  console.log(req.files)     
  var urlOfImage ;
  if(req.files != undefined){
  try{
  urlOfImage  = await uploadImage(req.files[0])
  logger.info(urlOfImage)
  } catch(err){
    return res.status(500).json({
      message : "Error while uploading files and images !"
    })
  }
  }else
  {
    return res.status(404).json({
      message : "you have to set an image"
    })
  }
  const data = await User.findByIdAndUpdate({_id : req.userId} , {BackgroundImage : urlOfImage } , {new : true}).select("-password")

  res.status(200).json({
    message : "Image updated successfully !",
    data : sanitizeUser(data)
  })
  
  DeleteFiles()

}

)

const updateProfile = asyncHandler(async (req,res,next) => {

  const {bio  , about} = req.body

  const data = await User.findOne({_id : req.params.id})

  if(data && data._id == req.userId)
  {
    data.Bio = bio 
    data.About = about
    await data.save()
    res.status(200).json({ message: 'Data updated successfully.' });
  }
  else
  {
    return res.status(403).json({ error: 'Access denied or data not found.' });
  }

  DeleteFiles()

}
)


module.exports = {getProfile , setProfilePic , setBackgroundPic , updateProfile}