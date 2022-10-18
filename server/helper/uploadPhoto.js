const multer = require('multer');
const path = require('path');
const { v1: uuidv1 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs');

const photoSequenceModel = require('../models/photoSequenceModel');

const validator = require('./validationHelper');

const checkPhotoSequence = (photoSequence, cb) => {
    if (photoSequence) {
        photoSequence.sequence++;
        let newSequence = photoSequence.sequence;

        photoSequence
            .save()
            .then(() => {
                cb(null, newSequence);
            })
            .catch((err) => {
                cb('Something went wrong', null);
            });
    } else {
        new photoSequenceModel()
            .save()
            .then(() => {
                cb(null, 0);
            })
            .catch((err) => {
                cb('Something went wrong', null);
            });
    }
};

const resizePhoto = (originalPath, resizedFilePath, cb) => {
    sharp(originalPath)
        .resize(500, 500)
        .jpeg({ quality: 90 })
        .toFile(resizedFilePath)
        .then(() => {
            try {
                fs.unlinkSync(originalPath);
                cb(true);
            } catch (err) {
                cb(true);
            }
        })
        .catch((err) => {
            cb(false);
        });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./photos'));
    },
    filename: function (req, file, cb) {
        photoSequenceModel.findOne({}, (err, photoSequence) => {
            if (err) {
                cb('Something went wrong', null);
            } else {
                checkPhotoSequence(photoSequence, (err, newSequence) => {
                    if (err) {
                        cb('Something went wrong', null);
                    } else {
                        let imgPath = uuidv1() + '-' + newSequence.toString(16) + path.extname(file.originalname);
                        cb(null, imgPath);
                    }
                });
            }
        });
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50 mb
    fileFilter: (req, file, cb) => {
        validator.validatePhoto(file, (result) => {
            if (result) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        });
    },
}).single('photo');

const uploadPhoto = (req, res, cb) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.message === 'File too large') {
                cb('Photo size cannot be more than 50 mb');
            } else {
                cb(err.message);
            }
        } else if (err) {
            cb(err);
        } else {
            if (!req.file) {
                cb('A valid Product Photo is required');
            } else {
                let resizedFileName = req.file.filename.substring(1);
                let resizedFilePath = path.resolve('./photos') + '/' + resizedFileName;

                resizePhoto(req.file.path, resizedFilePath, (result) => {
                    if (result) {
                        cb(null, resizedFileName);
                    } else {
                        cb('Photo was not uploaded to the server');
                    }
                });
            }
        }
    });
};

module.exports = uploadPhoto;
