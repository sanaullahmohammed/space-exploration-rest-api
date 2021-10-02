// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

app.get("/astronauts", (req, res, next) => {
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

app.get("/planets", (req, res, next) => {
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

app.get("/explorations", (req, res, next) => {
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

app.get("/api/astronauts/:id", (req, res, next) => {
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

app.get("/api/planets/:id", (req, res, next) => {
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

app.post("/api/astronauts/", (req, res, next) => {
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
    console.log("Successful API post call")
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

app.post("/api/planets/", (req, res, next) => {
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