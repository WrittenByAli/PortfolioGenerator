const express = require("express");
const app = express();
app.set ("view engine", "ejs");
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

const multer = require('multer');
const path = require('path');
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Initialize upload
const upload = multer({ storage: storage });

const port = 8080;
app.listen(port, ()=>{
    console.log ("Server with port 8080 is started");
});

app.get("/", (req, res)=>{
    console.log ("Request Sent");
    res.render("form.ejs");
});

app.post("/generate", upload.single("portfolioImage"), (req, res) => {
    const data = req.body;
    data.imagePath = req.file ? '/uploads/' + req.file.filename : null;
    data.theme = req.body.theme || 'classic';
    data.projects = [];
    if (Array.isArray(req.body.projectTitles)) {
      for (let i = 0; i < req.body.projectTitles.length; i++) {
        data.projects.push({
          title: req.body.projectTitles[i],
          description: req.body.projectDescriptions[i],
          link: req.body.projectLinks[i]
        });
      }
    }
    res.render("portfolio.ejs", { data });
});