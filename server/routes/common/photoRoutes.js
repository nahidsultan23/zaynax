const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/fetch-photo/:name', (req, res) => {
    let photoName = req.params.name;

    let photoLocation = path.resolve('./photos/' + photoName);

    try {
        if (fs.existsSync(photoLocation)) {
            res.sendFile(photoLocation);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

module.exports = router;
