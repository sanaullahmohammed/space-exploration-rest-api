const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('This is the home page')
})
 
app.listen(8080, ()=>{
    console.log("Server running on http://localhost:8080/")
})