const path = require("path");
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Item = require("../models/item");
const Wardrobe = require("../models/wardrobe");
const db = process.env.MONGODB_URI;

const storage = new GridFsStorage({
    url: db,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            // encryption
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(req.body.image);
                const fileInfo = {
                    filename: filename,
                    //name of Collection
                    bucketName: "Images",
                };
                resolve(fileInfo);
            });
        });
    },
});

// let storage = new GridFsStorage({
//     url: db,
//     file: (req, file) => {
//         return {
//             bucketName: "images",
//         }
//     }
// })

const upload = multer({storage: storage});

 exports.uploadImage = async(req,res) => {
    // console.log("IN UPLOADE IMAGE:", req.body.image)
    // console.log("REQ FILE IS: ", req.file)
    // console.log("REQ FILES IS: ", req.files)
    // console.log(upload.single(req.body.image));
    var image = await upload.single(req.body.image);
    console.log(image);
    // console.log("IN IMAGE CONTROLLER UPLOAD IMAGE REQ BODY IMAGE IS: ", req.body.image);
    res.status(200).send("Image Uploaded");
    // console.log("AFTER UPLOAD IN IMAGE CONTROLLER");
    // res.status(400).send("Image uploaded");
}

// exports.uploadImage = (req,res,next) => {
//     gfs = new mongoose.mongo.GridFSBucket(connection.db, {
//         bucketName: "images"
//     });
//     console.log("IN UPLOAD!",req.test);
//     console.log("\n\nIN IMAGE CONTROLLER DATA IS:\n", req.data);
 
// }