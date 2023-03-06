const express = require('express'); // importamos la libreria express
const app = express(); // crearmos una constante app con un objeto express para manejar las peticiones http
var mongo = require('mongodb'); // libreria para conectarnos a la bbdd
var bodyParser=require('body-parser'); // importar la libreria para tratar los datos json
var fs = require('fs');// importamos la libreria que lee nuestro fichero

app.use(express.static(__dirname + '/public/')); // hacemos referencia a la carpeta del index.html
app.use(bodyParser.json());// Parsear los datos json
app.listen('3000', function() { // Le indicamos el puerto de escucha de la aplicación
  console.log('Servidor web escuchando en el puerto 3000');
});

const urlBaseDeDatos = 'mongodb://127.0.0.1:27017/'; // url para la conexion de la bbdd

var MongoClient = mongo.MongoClient; // objeto para tratar los datos de la bbdd
var datosAplicacion; // variable vacia para insertar los datos posteriormente
const NOMBRE_FICHERO = 'harry-potter-characters.json'; // indicamos el nombre del fichero json
cargarDatosJSON(NOMBRE_FICHERO); // llamamos a la funcion carga datos JSON

app.get('/importar', async(req, res) => { // establecemos la uri o ruta de consulta
    //usamos el objeto creado anteriormente de mongo para conectarnos a la base de datos
    MongoClient.connect(urlBaseDeDatos, function (error, db) {
        if (error) {
            throw error;
        }
        //creamos la base de datos
        var dbo = db.db("harry");
        // creamos la coleccion dentro de nuestra base de datos ya creada harry
        dbo.createCollection("personajes", function (err, res2) {

        console.log("Colección creada!");
        //insertamos los datos del fichero json previamente comprobados y guardados , en nuestra base de datos
        // harry y en la coleccion personajes
        dbo.collection('personajes').insertMany(datosAplicacion);
        //db.close();
        });
        
        console.log("Base de datos Harry creada correctamente");

    });
});

app.get('/inicio', function(req, res){ // uSamos /inicio para conectarnos a la base de datos
    MongoClient.connect(urlBaseDeDatos, function (err, db) {
        if (err) throw err; // Sí hay un error lo lanzamos
        var dbo = db.db("harry");// en la variable dbo guardamos la conexión a harry
        dbo.collection("personajes").find({}).toArray(function (err, result) { // en esta función filtramos la base de datos x medio del find
            if (err) throw err;
            res.json(result); // parseamos la respuesta al formato json
            db.close(); // y cerramos la conexión
        });
    });
});

app.post('/crearPersonaje', function(req, res){ // indicamos con la uri crear personajes para hacer la petición post
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err; // Sí existe el error lo lanzamos
        var dbo = db.db("harry");// en la variable guardamos la conexión
        dbo.collection('personajes').insertOne(req.body);// insertamos lo que viene del body de la petición
        res.end("Creado el personaje "+req.body.name);// Mostramos la respuesta y la respuesta
    });
});


app.delete('/borrarPersonaje:nombre', function(req, res){// indicamos con la uri crear personajes para hacer la petición post
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;// Sí existe el error lo lanzamos



        let nombre = req.params.nombre; //asignamos a la variable nombre la petición La propiedad req.params.nombre el cual es un objeto que contiene propiedades asignadas a los "parámetros" de la ruta nombrada
// Es decir seria como filtrar a traves de la url poniendo : harry/personajes/nombre


        var dbo = db.db("harry"); // en la variable guardamos la conexión
        dbo.collection("personajes").deleteOne({name:nombre}, function(err, obj) {
            if (err) throw err;
            res.end("Eliminado el personaje "+nombre);
            db.close();
          });
    });
});

app.get('/humanos', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({ species: "human" }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});


app.get('/anioMenor1979', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({yearOfBirth:{$lt:1979}}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.get('/holly', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");

        dbo.collection("personajes").find({"wand.wood":"holly"}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.get('/estudiantesvivos', function(req, res){
    MongoClient.connect(urlBaseDeDatos, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("harry");
        dbo.collection("personajes").find({alive:true,hogwartsStudent:true}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

// la funcion se le introduce por parametro un fichero json y comprueba si contiene datos o si existe el fichero
// en caso de que no exista crea un array de datos vacio y en caso de que si exista el fichero
// parseamos los datos y los guardamos en una variable
function cargarDatosJSON(fichero) 
{
    fs.readFile(fichero, 'utf8', function(err, datos) 
    {
        if (err) 
        {
            console.log('No existe el fichero, creando nuevo conjunto de datos');
            datosAplicacion = [];
        }
        else
        {
            console.log('Datos cargados');
            datosAplicacion = JSON.parse(datos);
        }
    });
}


