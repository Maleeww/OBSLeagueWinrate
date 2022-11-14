var fetch = require('node-fetch')
var api = require('./api.js') //js?

// MongoDB connections
const { MongoClient, ServerApiVersion } = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://malew:" + api.getMongoPw() + "@cluster0.y5vc0.mongodb.net/?retryWrites=true&w=majority";
var colas;

getColasMongoDB()

async function getColasMongoDB() {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    console.log("Cargando colas")

    await client.connect(err => {
        if (err) throw err
    });

    const db = await client.db('OBSLeagueWinrate')
    let colasMongoDB = await db.collection("idColas").find().toArray()
    //console.log(colasMongoDB)
    // perform actions on the collection object
    client.close();

    for(c in colasMongoDB){
        let aux = colasMongoDB[c]['idCola'];
        dictCola[aux] = [];
        // Creamos una cola por cada ID registrado
        //console.log(aux)
    }

    //Ver las colas exi9stentes
    //for(d in dictCola)
    //console.log(d);
}

// DEPRECATED
var dictId = new Object();
dictId["NSX"] = "Nissaxter";
dictId["GRK"] = "Grekkø";
dictId["GRK2"] = "EntryFrager";


var dictCola = new Object();
/* dictCola["NSX"] = [];
dictCola["GRK"] = []
dictCola["GRK2"] = []
dictCola["TST"] = [] */
// 1 = sumar 1 victoria
// -1 = sumar 1 derrota
// 77 = reset a 0


/*
Ejemplo código:
while(!isQueueEmpty("Nissaxter")) //si no está vacía
{
    consume("Nissaxter") //cuando esté vacía dejará de ejecutarse el bucle
}

*/

function queueSize(id) {
    console.log(id)
    return Object.entries(dictCola[id]).length;

}

function consume(id) {
    let action = dictCola[id].shift()
    return action;
}

function win(id) {
    //let user = dictId[id]
    dictCola[id].push(+1);
}

function lose(id) {
    //let user = dictId[id]
    //console.log(user)
    dictCola[id].push(-1);
    return 0;
}

function reset(id) {
    //let user = dictId[id]
    dictCola[id].push(77); //machaca la cola
}

async function registrarID(id) {
    let status
    console.log(id);
    if(existeId(id)){ return 0}

    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    await client.connect(err => {
        if (err) throw err
    });

    const db = await client.db('OBSLeagueWinrate')
    
    //Si no existe se intenta añadir

    let result = await db.collection("idColas").insertOne({idCola: id+''}, function (error, response) {
        if(error) {
            console.log('Error occurred while inserting: '+error);
           // return
           status = 2; 
        } else {
           console.log('Inserted record');
           status = 1;
           dictCola[id] = [];
          // return 
        }
    })
    console.log(result)
    //console.log(colasMongoDB)
    // perform actions on the collection object
    client.close()
    return status;
}

function existeId(id){
    for(d in dictCola){
        if(id==d) return 1;
    }
    return 0;

}

exports.queueSize = queueSize;

exports.consume = consume;
exports.win = win;
exports.lose = lose;
exports.reset = reset;
exports.registrarID = registrarID;

