require('dotenv').config();
var fetch = require('node-fetch')

// nissaxter id 42351942
// halfo id 104999498

// client id? app b4n4tfewv38aaondinshkvh7fan3oz
// client secret app g1orab5vjlaf4o8vi0q2amivbkj3wk
//curl -X POST "https://id.twitch.tv/oauth2/token" -H 'Content-Type: application/x-www-form-urlencoded' -d "client_id=b4n4tfewv38aaondinshkvh7fan3oz&client_secret=g1orab5vjlaf4o8vi0q2amivbkj3wk&grant_type=client_credentials"
// https://id.twitch.tv/oauth2/authorize?client_id=b4n4tfewv38aaondinshkvh7fan3oz&
const client_id="b4n4tfewv38aaondinshkvh7fan3oz";
startPollAPI('a','b','c')

async function startPollAPI(title, choice1, choice2){
    console.log("Starting")
    fetch('https://api.twitch.tv/helix/polls', {
        method: 'post',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Authorization': 'Bearer r9nqwynbww19dd4d2ny65vtfbrg3lu','Content-Type':'application/json'}),
        body: JSON.stringify({'client_id':client_id,'broadcaster_id': 104999498, "title":title, "choices":[{
            "title":choice1
          },
          {
            "title":choice2
          }],
        'duration':1800})
    })
        .then(resultado => {return resultado.json()})
        .then(resultado => {console.log(resultado); return resultado;}).catch((error) => console.log(error))

}