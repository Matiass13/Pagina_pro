const express = require("express");
const mysql = require("mysql");
const { type } = require("os");
const util = require("util");
const port = 3000;
const app = express();
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cors = require("cors") //REQUIERE INSTALAR CORS

app.use(cors({origin: "http://localhost:3001",credentials: true}));

//connexiones y merencoche
const conn = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "series"
});
conn.connect((error)=>{
    if (error){
        throw error;
    }
    console.log("Conexion establecida");
});

const qy = util.promisify(conn.query).bind(conn);

//middlewares
app.use(session({secret:'<algúntextosecreto>',cookie:{maxAge:60000 }}))
app.use(express.json());

const validacion_login= (req, res, next) =>{

}

//METODOS GET

app.get('/crear', function(req, res) { 
      req.session.contador = 0;   
      res.send(req.session.contador);
})

app.get('/incrementar', function(req, res) {   
    res.session.contador++;   
    res.send(req.session.contador);
});
app.get("/categoria", async (req, res) =>{
    try{
        const query = "SELECT * FROM categoria";
        const resp = await qy(query);
        res.send({"Estas son todas las categorias disponibles": resp});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }

});

app.get("/serie", async (req, res) =>{
    try{
        const query = "SELECT * FROM serie";
        const resp = await qy(query);
        res.send(resp);

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }

});

app.get("/serie/:id", async (req, res) =>{
    try{
        const query = "SELECT * FROM serie WHERE id= ?";
        const resp = await qy(query, req.params.id);
        res.send({"esta es la serie con esa id": resp});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }

});

app.get("/categoria/:id", async (req, res) =>{
    try{
        const query = "SELECT * FROM categoria WHERE id= ?";
        const resp = await qy(query, req.params.id);
        res.send({"Esta es la categoria con esa id": resp});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }

});

// METODOS POST

app.post("/categoria",async (req,res)=> {
    try{
        //validacion info correcta
        //info si o si: id(se genera solo), nombre
        let descripcion = req.body.descripcion;
        //se valida la existencia
        if (!req.body.nombre){
            throw new Error("Falta enviar el nombre");
        }
        //se valida si la info es correcta
        let query = "SELECT id FROM categoria WHERE nombre= ?";
        let resp = await qy(query,[req.body.nombre.toUpperCase()]);

        if (resp.length > 0 ) {
            throw new Error("Esa categoria ya existe");
        }
        //info validada se hace el query para insertar la info

        query = "INSERT INTO categoria (nombre, descripcion) VALUE (?, ?)"
        resp = await qy(query,[req.body.nombre.toUpperCase(),descripcion]);

        res.send({"La categoria fue añadida exitosamente, la id es":resp.insertId});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
})

app.post("/serie",async (req,res)=> {
    try{
        //validacion info correcta
        //info si o si: id(se genera solo), nombre, categoria id
        let descripcion = req.body.descripcion;
        //se validan las existencias
        if (!req.body.nombre){
            throw new Error("Falta enviar el nombre");
        }
        if (!req.body.categoria){
            throw new Error("Falta enviar el nombre de la categoria");
        }
        //se valida que la info sea correcta
        let query = "SELECT id FROM serie WHERE nombre= ?";
        let resp = await qy(query,[req.body.nombre.toUpperCase()]);

        if (resp.length > 0 ) {
            throw new Error("Esa serie ya existe");
        }

        query = "SELECT id FROM categoria WHERE nombre= ?";
        resp = await qy(query,[req.body.categoria.toUpperCase()]);
        if (resp.length == 0){
            throw new Error("El nombre de la categoria no coindice con ninguna");
        };

        let categoria_id = resp;
        
        //info validada se hace el query para insertar la info
        query = "INSERT INTO serie (nombre, descripcion, categoria_id) VALUE (?, ?, ?)";
        resp = await qy(query,[req.body.nombre.toUpperCase(), descripcion, categoria_id[0].id]);

        res.send({"La serie fue añadida exitosamente, la id es":resp.insertId});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
})

// METODOS PUT


app.put("/categoria/:id",async (req,res) =>{
    try{    
        let descripcion = req.body.descripcion;
        //se valida la existencia
        if (!req.body.nombre){
            throw new Error("no enviaste el nombre");
        }
        //se valida si es correcto
        let query = "SELECT * FROM categoria WHERE nombre= ? AND id <> ?";
        let resp = await qy(query,[req.body.nombre.toUpperCase(), req.params.id]);
        if (resp.length > 0 ) {
            throw new Error("El nombre de categoria ya existe");
        }
        //info validada, se actualizan los datos 
        query = "UPDATE categoria SET nombre=?, descripcion = ? WHERE id = ?";
        resp = await qy(query,[req.body.nombre.toUpperCase(), descripcion, req.params.id]);
        res.send({"respuesta":resp});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
});

app.put("/serie/:id",async (req,res) =>{
    try{    
        let descripcion = req.body.descripcion;
        //se validan las existencias
        if (!req.body.nombre){
            throw new Error("no enviaste el nombre");
        }
        if (!req.body.estado){
            throw new Error("no enviaste el estado");
            
        }
        if (!req.body.categoria){
            throw new Error("Falta enviar el nombre de la categoria");
        }

        if(typeof(req.body.estado) !== "number" ){
            throw new Error("envia un numero como valor para el estado: 1=PENDIENTE 2=VISTO 4=VIENDO");
        }
        //se validan las informaciones
        let estado = req.body.estado;
        let query = "SELECT * FROM serie WHERE nombre= ? AND id <> ?";
        let resp = await qy(query,[req.body.nombre.toUpperCase(), req.params.id]);
        if (resp.length > 0 ) {
            throw new Error("El nombre de la serie ya existe");
        }

        
        if ( estado !== 1 && estado !== 2 && estado !== 4){
            throw new Error("El estado no es valido: 1=PENDIENTE 2=VISTO 4=VIENDO");
        }
        query = "SELECT id FROM categoria WHERE nombre= ?";
        resp = await qy(query,[req.body.categoria.toUpperCase()]);
        if (resp.length == 0){
            throw new Error("El nombre de la categoria no coindice con ninguna");
        };
        let categoria_id = resp;
        
        //una vez esta todo okay, se actualiza
        query = "UPDATE serie SET nombre= ?, descripcion=?, estado=?, categoria_id=? WHERE id= ?"
        resp = await qy(query,[req.body.nombre.toUpperCase(), descripcion, estado, categoria_id[0].id, req.params.id]);
        res.send({"respuesta":resp});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
});


//METODO DELETE


app.delete("/categoria/:id", async (req, res) => {
    try{
        //se valida que no exista una serie para esa categoria, ya que no podemos dejar a una serie sin categoria
        let query = "SELECT * FROM serie WHERE categoria_id = ?";
        let resp = await qy(query, [req.params.id]);
        if (resp.length > 0 ) {
            throw new Error("Existen productos en la categoria, no se puede borrar");
        }
        query = "DELETE FROM categoria WHERE id = ?";
        resp = await qy(query, [req.params.id]);
        res.send({"respuesta":resp});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
})

app.delete("/serie/:id", async (req, res) => {
    try{
        let query = "DELETE FROM serie WHERE id = ?";
        let resp = await qy(query, [req.params.id]);
        res.send({"respuesta":resp});
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error":e.message});
    }
})


app.listen(port, () => {
    console.log("conectado al puerto " + port);
})
