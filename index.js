const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3000;

//CORS
app.use(cors());


app.use(express.static(__dirname + '/public'));


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});


app.listen(port, () => console.log(`Listening on port ${port}...`));


app.get('/files/:id', (request, response) => {
    
    var id = request.params.id;
    console.log("id = "+id);

    let data = fs.readFileSync('uploads/'+id);
    response.send(data);
})


app.get('/show/:id', (request, response) => {
    
    var id = request.params.id;
    console.log("id = "+id);

    let data = fs.readFileSync('uploads/'+id);
    response.send("<pre>"+data+"</pre>");
})

app.get('/uploads/', (request, response) => {
    
    let files = fs.readdirSync("uploads/");

    var result ="";
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<a href="/show/${files[index]}" width="300" style="margin-right: 20px;">${files[index]}</a><br>`;
    }
    response.send(result);
    
})

app.post('/upload', (req, res) => {


    let upload = multer({ storage: storage }).array('files', 10);

    upload(req, res, function(err) {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select files');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        res.send("OK");
    });
});