'use strict';

const fs = require('fs');
var mongo = require('mongodb').MongoClient;
var Binary = require('mongodb').Binary;

module.exports = function ({config}) {
  const IMAGES_COLLECTION_NAME = 'images';
  const ROOT_UPLOADS_DIR = './dist/uploads';
  if (!fs.existsSync(ROOT_UPLOADS_DIR)) {
    fs.mkdirSync(ROOT_UPLOADS_DIR);
  }

  mongo.connect(config.imagesDb, (connectErr, db) => {
    if (connectErr) {
      return console.log(connectErr.message);
    }
    return db.collection(IMAGES_COLLECTION_NAME).find((findErr, imgs) => {
      if (findErr) {
        return console.log(findErr.message);
      }
      return imgs.forEach(img => {
        const userUploadsDirExists = fs.existsSync(img.directory);
        if (!userUploadsDirExists) {
          fs.mkdirSync(img.directory);
        }
        fs.writeFileSync(img.location, img.bin.buffer);
      });
    });
  });

  function createFile(req, res) {
    const user = req.user;
    const userUploadsDirName = `${ROOT_UPLOADS_DIR}/${user._id}`;
    const userUploadsDirExists = fs.existsSync(userUploadsDirName);
    if (!userUploadsDirExists) {
      fs.mkdirSync(userUploadsDirName);
    }

    let newFileName = fs.readdirSync(userUploadsDirName).length + '';
    const fileExtension = getFileTypeExtension(req.files.file.mimetype);
    if (!fileExtension) {
      return res.status(400).json({ message: 'Incorrect file type' });
    }

    let imageSaveLocation = `${userUploadsDirName}/${newFileName}${fileExtension}`;
    while (fs.existsSync(imageSaveLocation)) {
      newFileName = newFileName + randomChar();
      imageSaveLocation = `${userUploadsDirName}/${newFileName}${fileExtension}`;
    }

    return req.files.file.mv(imageSaveLocation, function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send('error');
      }
      mongo.connect(config.imagesDb, (connectErr, db) => {
        if (connectErr) {
          console.log(connectErr.message);
        }
        const file = fs.readFileSync(imageSaveLocation);
        const imageDocument = {
          bin: Binary(file),
          location: imageSaveLocation,
          directory: userUploadsDirName
        };
        return db.collection(IMAGES_COLLECTION_NAME).insert(imageDocument, (insertErr) => {
          if (insertErr) {
            console.log(insertErr.message);
          }
        });
      });
      return res.status(200).send({ imageUrl: `/uploads/${user._id}/${newFileName}${fileExtension}` });
    });
  }

  function getFileTypeExtension(mimetype) {
    let fileExtension = '';
    if (mimetype.indexOf('jpeg') >= 0) {
      fileExtension = '.jpg';
    } else if (mimetype.indexOf('png') >= 0) {
      fileExtension = '.png';
    }
    return fileExtension;
  }

  function randomChar() {
    return 'z';
  }

  return {
    createFile
  };
};
