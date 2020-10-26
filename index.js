const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3000;
const thingLib = require('@dfriedenberger/thing-lib');

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

app.get('/api/filesCount', (request, response) => {
    
    let files = fs.readdirSync("uploads/");

    var data = {
        dids  : 0,
        dads  : 0,
        files : 0
    };

    for (index = 0, len = files.length; index < len; ++index) {
        var filename = files[index];

        if(filename == ".gitignore") continue;
        if(filename.startsWith("did_")) data.dids++;
        else if(filename.startsWith("dad_")) data.dads++;
        else data.files++;
    }

    response.json(data);
})


app.get('/api/dids', (request, response) => {
    
    var diddata = [];
    let files = fs.readdirSync("uploads/");
    for (index = 0, len = files.length; index < len; ++index) {
        var filename = files[index];
        if(!filename.startsWith("did_")) continue;
        let data = fs.readFileSync('uploads/'+filename,'ascii');
        let parsed = thingLib.parseMessage(data);
        diddata.push({
            filename: filename,
            did:  JSON.parse(parsed.document)
        });

    }
    response.json(diddata);

});


app.get('/api/dads', (request, response) => {
    
    var diddata = [];
    let files = fs.readdirSync("uploads/");
    for (index = 0, len = files.length; index < len; ++index) {
        var filename = files[index];
        if(!filename.startsWith("dad_")) continue;
        let data = fs.readFileSync('uploads/'+filename,'ascii');
        let parsed = thingLib.parseMessage(data);
        diddata.push({
            filename: filename,
            did:  JSON.parse(parsed.document)
        });

    }
    response.json(diddata);

});

app.get('/api/files', (request, response) => {
    
    var diddata = [];
    let files = fs.readdirSync("uploads/");
    for (index = 0, len = files.length; index < len; ++index) {
        var filename = files[index];
        if(filename == ".gitignore") continue;
        if(filename.startsWith("did_")) continue;
        if(filename.startsWith("dad_")) continue;
        let stat = fs.statSync('uploads/'+filename);
        diddata.push({
            filename: filename,
            stat:  stat
        });

    }
    response.json(diddata);

});

app.get('/api/getJsonFile/:id', (request, response) => {
    
    var filename = request.params.id;

    let data = fs.readFileSync('uploads/'+filename,'ascii');
    let parsed = thingLib.parseMessage(data);

 
    response.json({
        document:  JSON.parse(parsed.document),
        signature : parsed.signature
 });

});


app.get('/files/:id', (request, response) => {
    
    var id = request.params.id;
    //console.log("id = "+id);

    let data = fs.readFileSync('uploads/'+id);
    response.send(data);
})


app.get('/show/:id', (request, response) => {
    
    var id = request.params.id;
    console.log("id = "+id);

    var ext = id.split('.').pop().toLowerCase();
    if(ext == "jpg" || ext == "png")
    {
        response.send('<img src="/files/'+id+'">');
        return;
    }
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