var express = require('express');

app.get('/routers/menuitems.js', (req, res) => {
    if (req.body.textContent === sakesurimi){
        let menuItemJSON = JSON.stringify({
            "id": "Sashimi_1",
            "name": "Sake sashimi",
            "imageurl": "/images/sashimi-salmon.jpg"
        })
        res.send(menuItemJSON)
    }
})
