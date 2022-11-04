# OBSLeagueWinrate

### A web app for streamers. Keep your win/lose ratio in your stream overlay automatically updated every time a game ends.

#


## Usage

~~For now only locally available. Open index.html file with OBS Browser Source. To modify the default Summoner Name simply add yours as a query parameter (name parameter).~~

Current version is developed for nodejs and express.

You can also use the local html one by going to the older branch.
Simply use it like this

> file:///C:/OBSLeagueWinrate/src/index.html?name=My Summoner Name
 
Modify the path according to your folder structure, this example is made assuming it's been cloned on the root of the C: drive.


## API Key

You need a Riot Api key to be able to receive the game's data. You should get your own on the [Riot Developer Portal](https://developer.riotgames.com/).
In order for the code to use your Api Key, modify the [src/api.js](https://github.com/Maleeww/OBSLeagueWinrate/blob/main/src/api.js) file and replace 'YourApiKey' with the key provided by Riot.

## In Progress

> ~~Custom region~~

> ~~Backend responsible for api calls to avoid providing the api key to the client via the front end.~~

> ~~Hosting for the project~~

> Setup capable of modifying configuration

> Better interfaces / More options for interface


## Support me!

Consider supporting the project by donating to my ko-fi :)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T3F4SWY)
