var Express = require("express");
var bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Coneccion a MongoDB
var MongoClient = require("mongodb").MongoClient; //llamada a la dependencia de mongodbA
var CONNECTION_STRING =
  "mongodb+srv://Hamilton:1999_diablillo@web3php.kkz7r7q.mongodb.net/?retryWrites=true&w=majority";
var DATABASE = "tiendita";
var database;

var privateKey = fs.readFileSync("server.key");
var certificate = fs.readFileSync("server.cer");

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  )
  .listen(3000, "0.0.0.0", () => {
    console.log("listening...");
    MongoClient.connect(
      CONNECTION_STRING,
      { useNewUrlParser: true },
      (error, client) => {
        if (error) throw error;
        database = client.db(DATABASE);
        console.log("MongoDB connection successfull");
      }
    );
  });
/*

app.listen(3000, ()=>{
    
    MongoClient.connect(
        CONNECTION_STRING, 
        {useNewUrlParser:true}, 
        (error,client) => {
            if (error) throw error;
            database = client.db(DATABASE);
            console.log('MongoDB connection successfull');
        }
    );
});
*/

app.get("/", (request, response) => {
  response.send("BIENVENIDO A LA APP DE PRUEBA");
});

//GET-ALL
app.get("/compra", (request, response) => {
  database
    .collection("store")
    .find({})
    .toArray((error, result) => {
      if (error) {
        console.log(error);
      }
      response.send(result);
    });
});

//GET-ALL BY ID
app.get("/compra/:id", (request, response) => {
  database
    .collection("store")
    .find({ Id: request.params.id })
    .toArray((error, result) => {
      if (error) {
        console.log(error);
      }
      response.send(result);
    });
});

//INSERT
app.post("/compra", (request, response) => {
  database.collection("store").count({}, function (error, numOfDocs) {
    if (error) {
      console.log(error);
    }
    database.collection("store").insertOne({
      Name: request.body["Name"],
      Id: request.body["Id"],
      Category: request.body["Category"],
      Description: request.body["Description"],
      Price: request.body["Price"],
      Quantity: request.body["Quantity"],
      ElaborationDate: request.body["ElaborationDate"],
      ExpirationDate: request.body["ExpirationDate"],
    });
    response.send("Added successfull");
  });
});

//UPDATE
app.put("/compra", (request, response) => {
  database.collection("store").updateOne(
    //Filter
    {
      Id: request.body["Id"],
    },
    //Update
    {
      $set: {
        Name: request.body["Name"],
        Category: request.body["Category"],
        Description: request.body["Description"],
        Price: request.body["Price"],
        Quantity: request.body["Quantity"],
        ElaborationDate: request.body["ElaborationDate"],
        ExpirationDate: request.body["ExpirationDate"],
      },
    }
  );
  response.send("Updated successfully");
});

//DELETE
app.delete("/compra/:id", (request, response) => {
  database.collection("store").deleteOne({
    Id: request.params.id,
  });
  response.send("Deleted successfully");
});
