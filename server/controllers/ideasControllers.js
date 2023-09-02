const Ideas = require("../models/IdeasSchema");
const uploadImage = require("../utils/uploadImage");
const logger = require("../logger/index");
const asyncHandler = require("express-async-handler");
const { DeleteFiles } = require("../utils/deleteFiles");
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

// // Define a route to delete files
// router.delete("/delete-file/:filename", async (req, res) => {
//   const filename = req.params.filename;

//   const filePath = path.join(__dirname, "../uploads", filename);

//   try {
//     // Read the contents of the folder
//     const files = await fs.readdir(folderPath);

//     // Loop through each file and delete it
//     for (const file of files) {
//       const filePath = path.join(folderPath, file);
//       await fs.unlink(filePath);
//     }

//     res.status(200).json({ message: "All files deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "An error occurred while deleting the files" });
//   }
// });

const postIdeas = asyncHandler(async (req, res, next) => {
  const { idea, description, team } = req.body;
  console.log(req.files.files);
  console.log(idea);
  if (!idea) {
    return res.status(400).json({
      message: "Please fill Brainwave",
    });
  }
  //use mac to secure data form idor

  var arrayOfUrls;
  if (req.files.files.length > 0) {
    try {
      arrayOfUrls = await uploadImage.uploadMultipleImages(req.files.files);
      logger.info(arrayOfUrls);
    } catch (err) {
      return res.status(500).json({
        message: "Error while uploading files and images !",
      });
    }
    console.log("here to delete")
    console.log(arrayOfUrls)
    var imagesArray = [];
    var filesArray = [];

    for (let i = 0; i < arrayOfUrls.length; i++) {
      if (arrayOfUrls[i].type == "files") {
        filesArray.push(arrayOfUrls[i].url);
      } else {
        imagesArray.push(arrayOfUrls[i].url);
      }
    }
    
    
  }

  const newIdea = new Ideas({
    Idea: idea,
    Description: description,
    Images: imagesArray,
    Files: filesArray,
    Team: team,
    WrittenBy: req.userId,
  });
  
  await newIdea
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Idea Added Successfully",
      });
      
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
    
    DeleteFiles();
  // try {
  //   // Read the contents of the folder
  //   const folderPath = path.join(__dirname, "../uploads");
  //   const files = await fs.readdir(folderPath);

  //   // Loop through each file and delete it
  //   for (const file of files) {
  //     const filePath = path.join(folderPath, file);
  //     await fs.unlink(filePath);
  //   }

  //   res.status(200).json({ message: "All files deleted successfully" });
  // } catch (error) {
  //   res
  //     .status(500)
  //     .json({ message: "An error occurred while deleting the files" });
  // }
});

const displayIdeas = asyncHandler((req, res, next) => {
  const teamId = req.params.id;

  Ideas.find({ Team: teamId })
    .then((result) => {
      return res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: err,
      });
    });
});

const deleteIdea = asyncHandler(async (req, res, next) => {
  const data = await Ideas.findOne({ _id: req.params.id });

  if (data && data.WrittenBy == req.userId) {
    await Ideas.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Data deleted successfully." });
  } else {
    return res.status(403).json({ error: "Access denied or data not found." });
  }
});

const updateIdea = asyncHandler(async (req, res, next) => {
  const { idea, description } = req.body;

  const data = await Ideas.findOne({ _id: req.params.id });

  if (data && data.WrittenBy == req.userId) {
    data.Idea = idea;
    data.Description = description;
    await data.save();
    return res.status(200).json({ message: "Data updated successfully." });
  } else {
    return res.status(403).json({ error: "Access denied or data not found." });
  }
});

module.exports = { displayIdeas, postIdeas, deleteIdea, updateIdea };
