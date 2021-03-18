const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const Candidate = require('./models/candidate');

const results = [];
const app = express();

//connection to the database
mongoose.connect('mongodb://localhost:27017/csvData', {
        useNewUrlParser: true, 
        useCreateIndex:true,
        useUnifiedTopology: true,
        useFindAndModify:false
    });

const db = mongoose.connection; //bind mongoose.connection to db

db.on('error', console.error.bind(console,'Connection Error:'));
db.once('open', ()=>{
    console.log('Database Connected!');
});

//create the file storage engine using multer
const fileStorageEngine = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './csv' )
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage:fileStorageEngine
});


const path = './csv/data.csv'


app.post('/upload', upload.single('candidates'),  async (req, res)=>{
    // console.log(req.file);
    res.send("CSV file successfull");
try {
    //check if the file exists before saving to DB
    if (fs.existsSync(path)){
      //file exists
      console.log('File exists');
      fs.createReadStream('./csv/data.csv')
      .pipe(csv({}))
      .on('data', (data)=>results.push(data))
      .on('end',async()=>{
          console.log(results);
        for(let person of results){
            //generate a random password for each candidate
            const password = passwordId => Math.floor(Math.random() * 999999) + 10000;
            //pass along side the data form Excel the password for each candidate
            const newCandidate = new Candidate({...person, password:`LOC${password()}`});
            //save the candidate to the database
            await newCandidate.save();

      }});
    }else{
        console.log("File does not exist");
    }
  } catch(err) {
    console.error(err)
  }
})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000, ()=>{
    console.log("App started on port 3000");
})