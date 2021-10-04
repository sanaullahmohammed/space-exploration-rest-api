// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var path = require('path')
//var cors = require('cors')

//app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname+'/static'));

console.log(__dirname)
// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res) => {
    res.sendFile('templates/home.html',{root:__dirname})
});

app.get("/astronauts", (req, res) => {
    res.sendFile('templates/astronaut.html',{root:__dirname})
});

app.get("/addAstronaut", (req, res) => {
    res.sendFile('templates/astronautForm.html',{root:__dirname})
});

app.get("/planets", (req, res) => {
    res.sendFile('templates/planet.html',{root:__dirname})
});

app.get("/addPlanet", (req, res) => {
    res.sendFile('templates/planetForm.html',{root:__dirname})
});

app.get("/explorations", (req, res) => {
    res.sendFile('templates/exploration.html',{root:__dirname})
});

app.get("/TermsOfUse", (req, res) => {
    res.sendFile('templates/TermsOfUse.html',{root:__dirname})
});

app.get("/ContactUs", (req, res) => {
    res.sendFile('templates/ContactUs.html',{root:__dirname})
});
// Insert here other API endpoints

app.get("/api/astronauts", (req, res) => {
    var sql = "select * from astronauts"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/planets", (req, res) => {
    var sql = "select * from planets"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/explorations", (req, res) => {
    var sql = "select * from planetastronauts"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/*
app.get("/api/get/astronauts/:id", (req, res) => {
    var sql = "select * from astronauts where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err || typeof(row) == "undefined") {
          res.status(400).json({error:"Bad Request"})
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});
**/

/*
app.get("/api/get/planets/:id", (req, res) => {
    var sql = "select * from planets where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});
**/
app.post("/api/astronauts/", (req, res) => {
    var errors=[]
    if (!req.body.id){
        errors.push("No id specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.age){
        errors.push("No age specified");
    }
    if (!req.body.gender){
        errors.push("No gender specified");
    }
    if (!req.body.role){
        errors.push("No role specified");
    }
    if (!req.body.nationality){
        errors.push("No nationality specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        id: req.body.id,
        age: req.body.age,
        gender: req.body.gender,
        role: req.body.role,
        nationality: req.body.nationality
    }
    
    var sql ='INSERT INTO astronauts (id, age, gender, role, nationality, name) VALUES (?,?,?,?,?,?)'
    var params =[data.id, data.age, data.gender, data.role, data.nationality, data.name]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log("SQL error")
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/planets/", (req, res) => {
    var errors=[]
    if (!req.body.id){
        errors.push("No id specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.discoveredDate){
        errors.push("No discoveredDate specified");
    }
    if (!req.body.galaxy){
        errors.push("No galaxy specified");
    }
    if (req.body.habitable == null){
        errors.push("Habitability not specified");
    }
    if (req.body.hyperJump == null){
        errors.push("HyperJump not specified");
    }
    if (errors.length){
        console.log(errors.length)
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        id: req.body.id,
        discoveredDate: req.body.discoveredDate,
        galaxy: req.body.galaxy,
        habitable: req.body.habitable,
        hyperJump: req.body.hyperJump
    }
    console.log("Successful PLANET API post call")
    console.log(data)
    var sql ='INSERT INTO planets (id, name, discoveredDate, galaxy, habitable, hyperJump) VALUES (?,?,?,?,?,?)'
    var params =[data.id, data.name, data.discoveredDate, data.galaxy, data.habitable, data.hyperJump]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});