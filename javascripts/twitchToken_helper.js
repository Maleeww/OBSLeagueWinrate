var api = require('./api.js') //js?
var fetch = require('node-fetch')
fs = require('fs');
require('dotenv').config();

// MongoDB connections
const { MongoClient, ServerApiVersion } = require('mongodb');
const { response } = require('express');
const uri = "mongodb+srv://malew:" + api.getMongoPw() + "@cluster0.y5vc0.mongodb.net/?retryWrites=true&w=majority";

var tokens = []

getTokensMongoDB().then(() =>{

    sendAnnouncement('maleeww','test')

}
)
//.then(() => refreshToken('maleeww'))



async function getTokensMongoDB() {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    console.log("Cargando tokens")

    await client.connect(err => {
        if (err) throw err
    });

    const db = await client.db('OBSLeagueWinrate')
    let tokensMongoDB = await db.collection("tokens_twitch").find().toArray()
    //console.log(colasMongoDB)
    // perform actions on the collection object
    client.close();

    for(t in tokensMongoDB){
        let aux = tokensMongoDB[t];
        tokens.push(aux);
        // Creamos un objeto de token por cada uno en la coleccion
    }
    console.log(tokens)
    return 0;

}

function getAppToken(){
    return tokens.find(x => x.channel == 'maleeww').token
}






async function registerToken(channel, token, refresh ){
    if(!token || !refresh) {
        console.log("No hay token o refresh: "+token+refresh)
        return 1;
    };
    let id = await getId(channel)
    if(!id) return 1;
    console.log(id);


    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    await client.connect(err => {
        if (err) throw err
    });

    const db = await client.db('OBSLeagueWinrate')
    

    // Si ya existe el canal registrado, solo añade el token nuevo y el refresh
    let tokenFind = tokens.find(x => x.channel == channel)
    if(tokenFind){
        tokenFind.token = token;
        tokenFind.refreshToken = refresh;

        console.log("Actualizado "+channel+' con ID '+id)

        let result = await db.collection("tokens_twitch").updateOne(
            { "_id": tokenFind._id}, // Filter
            {$set: {"token": token, "refreshToken":refresh}} // Update
            , function (error, response) {
            if(error) {
                console.log('Error occurred while inserting: '+error);
               // return
               status = 2; 
            } else {
               console.log('Updated record');
               status = 1;
              // return 
            }
        })
        console.log(result)
        //console.log(colasMongoDB)
        // perform actions on the collection object
        client.close()


        return 0;
    }



    
    // Si no lo encuentra en el array, crea un objecto nuevo con los datos y hace push
    let newToken ={
        channel: channel, channelId: id, token: token, refreshToken: refresh
    }
    tokens.push(newToken);
    console.log("Registrado "+channel+' con ID '+id+' refreshToken: '+refresh)



    let result = await db.collection("tokens_twitch").insertOne(newToken, function (error, response) {
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

    return 0;



}

function getId(channel){

    // Hace fetch con token, si no funciona el token hace refresh y vuelve a llamar a getId

    // Si funciona, obtiene la informacion del usuario. Solo nos interesa el id así que lo devolvemos

    console.log('getId: '+channel)
    let url ='https://api.twitch.tv/helix/users'
    return fetch(url+'?login='+channel, {
        method: 'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Authorization': 'Bearer '+getAppToken(),'Client-Id': process.env.TWITCH_CLIENT_ID,'Content-Type':'application/json'}),
        //body: JSON.stringify({"message":msg,"color":"purple"})
    }).then(response => {if(response.status != '200'){
                            console.log('getId failed: '+response.status);
                            response.json().then(json =>console.log(json));
                            refreshToken('maleeww').then(getId(channel))}
                        else return response.json().then(json =>{return json.data[0].id}); })
    .catch((error) => console.log('Error: '+error))

}

function makePoll(){

    let resp = tryToken()
    if(resp.status == 401) //??
    newToken()
}
async function sendAnnouncement(channel, msg){

    let broadcaster_id = await getId(channel)
    let moderator_id = broadcaster_id
    console.log("Sending '"+msg+"' to channel '"+channel+"'")
  let url = "https://api.twitch.tv/helix/chat/announcements"
  return fetch(url+'?broadcaster_id='+broadcaster_id+'&moderator_id='+moderator_id, {
      method: 'post',                    
      redirect : 'follow',
      mode: 'cors' ,
      headers : new Headers({'Authorization': 'Bearer '+getAppToken(),'Client-Id': process.env.TWITCH_CLIENT_ID,'Content-Type':'application/json'}),
      body: JSON.stringify({"message":msg,"color":"purple"})
  }).then(response => console.log(response))
  .catch((error) => console.log(error))
  
  }


  function newToken(){
    let newToken;

    let resp = fetch() //get new token from refresh
    //https://dev.twitch.tv/docs/authentication/refresh-tokens

    fs.writeFile('lastToken.txt', newToken, function (err) {
        if (err) return console.log(err);
        console.log(newToken+' > lastToken.txt');
      });
}

async function refreshToken(channelName){
    console.log("Tokens: ")
    console.log(tokens)
    console.log("Find: "+tokens.find(x => x.channel == channelName))
    let refresh = tokens.find(x => x.channel == channelName).refreshToken;
    console.log("Trying to refresh token, channel: "+channelName+', refreshToken: '+refresh)
// Remember to URL encode your refresh token.
    let refreshURIEnc = encodeURIComponent(refresh)
    let client_id = process.env.TWITCH_CLIENT_ID
    let client_secret = process.env.TWITCH_CLIENT_SECRET
    let url = "https://id.twitch.tv/oauth2/token"
    let result = await fetch(url    + '?client_id=' + client_id
    + '&client_secret=' + client_secret
    + '&refresh_token=' + refreshURIEnc
    + '&grant_type=refresh_token', {
        method: 'post',                    
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'application/x-www-form-urlencoded'}),
    //    body: JSON.stringify({'grant_type':'refresh_token','refresh_token':refreshURIEnc,'client_id':client_id,'client_secret':client_secret})
    })
    .then(response =>{
        if(response.status != '200'){ console.log(response.status); response.json().then(response =>{return console.log(response)})
    } else return response.json().then(response =>
        {
           console.log('Refreshed, new token: '+response.access_token+', refresh token: '+response.refresh_token)
           return response;
       } );})
    
    .catch((error) => console.log(error))

    // Debemos actualizar el token nuevo en MongoDB también, por lo que lo volvemos a registrar
    await registerToken(channelName, result.access_token, result.refresh_token)
    return result;
}

async function getTokenFromCode(channel, code){

// Remember to URL encode your refresh token.
    let client_id = process.env.TWITCH_CLIENT_ID
    let client_secret = process.env.TWITCH_CLIENT_SECRET
    let redirect = 'https://localhost:3000';
    console.log(client_id)
    console.log(client_secret)
    console.log("Trying to get token, channel: "+channel+', code: '+code)
    let url = "https://id.twitch.tv/oauth2/token"
    return fetch(url
    + '?client_id=' + client_id
    + '&client_secret=' + client_secret
    + '&code=' + code
    + '&grant_type=authorization_code'
    + '&redirect_uri=' + redirect, {
        method: 'post',                    
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'application/x-www-form-urlencoded'}),
        //body: JSON.stringify({'client_id':client_id,'client_secret':client_secret,'code':code,'grant_type':'authorization_code','redirect_uri':'https://localhost:3000'})
    })
    .then((response) => {    if(response.status == '200') return response.json();
else {console.log('400'); response.json().then((json) => console.log(json))}})
    .then(response =>{


        console.log(response)
        console.log('Obtained with code: '+code+', token: '+response.access_token+', refresh token: '+response.refresh_token)
        return response;
    
} )
    .catch((error) => console.log(error))

}
exports.sendAnnouncement = sendAnnouncement
exports.registerToken = registerToken