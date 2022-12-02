const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

var api_helper = require('../javascripts/api_helper.js');

const CUSTOM_ID_BOTON_STOP = 'boton_resultado_stop'
const CUSTOM_ID_BOTON_CANCELAR = 'boton_resultado_cancelar'

const CUSTOM_ID_BOTON_CONFIRMAR = 'boton_confirmar'
const CUSTOM_ID_BOTON_NO_CONFIRMAR = 'boton_no_confirmar'

var botones;
var func;
var inter;
var author;
var resultado;
var resAz;
var resRo;
var embedGlobal;
var autoOn = false;
var cancelled = false;
var tiempoCerrarPrediccion = 20;
var summoner = "TW May"

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function crearEmbedPrediccion(user, titulo, resAzul, resRojo) {
    return new EmbedBuilder()
        .setColor("#9900FF")
        .setTitle('AutoPredicción iniciada por ' + user.username)
        .setURL('https://www.twitch.tv/nissaxter')
        .setAuthor({ name: user.username, iconURL: user.avatarURL() })
        .setDescription("Estado: Inicializando")
        .addFields(
            { name: 'Título', value: titulo, inline: true },
            { name: '🟦', value: resAzul, inline: true },
            { name: '🟥', value: resRojo, inline: true },
        )
        .setTimestamp()
}

async function crearBotones(resAzul, resRojo) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_CANCELAR)
                .setEmoji('⚠')
                .setLabel(" - CANCELAR PREDICCIÓN - ⚠")
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_STOP)
                .setEmoji('🛑')
                .setLabel("STOP AutoPrediccion")
                .setStyle(ButtonStyle.Danger),
        );
}


async function crearBotonesConfirmar() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_CONFIRMAR)
                .setEmoji('✅')
                .setLabel("Confirmar")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_NO_CONFIRMAR)
                .setEmoji('❌')
                .setLabel("Volver")
                .setStyle(ButtonStyle.Danger),
        );
}

function ganaAzul() {
    resultado = resAz
    console.log("Gana azul")
}

function ganaRojo() {
    resultado = resRo
    console.log("Gana rojo")

}

function stop() {
    resultado = "STOP"
    console.log("Stopped")
    // TODO: Función que para el listener
    autoOn = false;
    cancelled = true;
    return true;
}

function cancelarPrediccion() {
    resultado = "CANCELADA"
    console.log("Cancelar")
    cancelled = true;

}

async function pedirConfirmacion(funcion, client, interaction) {
    let botonesConfirmar = await crearBotonesConfirmar();
    author = interaction.user;
    interaction.update({ components: [botonesConfirmar] })
    func = funcion;

}
async function startEventListener(client, interaction) {
    client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isButton()) return;
        //console.log(interaction);
        switch (interaction.customId) {
            case CUSTOM_ID_BOTON_STOP:
                // La única forma de matar este "hijo" es hacer return al confirmar la función stop()
                // por lo que hacemos return true y aquí comprobamos que sea true.
                if (pedirConfirmacion(stop, client, interaction)) return;
                break;
            case CUSTOM_ID_BOTON_CANCELAR:
                pedirConfirmacion(cancelarPrediccion, client, interaction)
                break;
            case CUSTOM_ID_BOTON_CONFIRMAR:
                //Comprobamos que sea el mismo autor que ha elegido la interaccion anterior
                if (interaction.user == author) {
                    //En func() tenemos guardada la última función seleccionada de los botones
                    func()
                    interaction.update({ content: `Resultado confirmado por ${author}: ${resultado}`, components: [] })
                }
                break;

            case CUSTOM_ID_BOTON_NO_CONFIRMAR:
                interaction.update({ components: [botones] })
                // Ya que esto lo pasamos por globales, tenemos que anularlas al cancelar la interacción
                func = null;
                author = null;
                break;
        }
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoprediccionwin')
        .addStringOption(option => option.setName('nombre_invocador').setDescription('Nombre de invocador de la cuenta').setRequired(false))
    .setDescription('Empezar auto predicciones de victoria'),
    async execute(interaction, client) {
        startEventListener(client, interaction)
        inter = interaction;

        var titulo = "¿Se gana?"
        var resAzul = "Sí"
        var resRojo = "No"

        resAz = resAzul
        resRo = resRojo


        empezarAutoPrediccion(titulo, resAzul, resRojo, interaction, client)

    },
};

async function empezarAutoPrediccion(titulo, resRojo, resAzul, interaction, client) {
    autoOn = true;
    let index = -1;
    let reply;
    while (autoOn) {
        index++;
        // Tenemos los valores pasados, vamos a crear el Embed que muestra la información y los botones correspondientes
        // En este caso solo debemos crear el botón de cancelar, por lo que no necesitamos pasar los resultados
        const embedPrediccion = await crearEmbedPrediccion(interaction.user, titulo, resAzul, resRojo)
        embedGlobal = embedPrediccion;

        // TODO: Creamos los botones igualmente por si el auto no funciona? 
        const botonesResultado = await crearBotones(resAzul, resRojo)

        // Guardamos los botonesResultado en una variable global para poder volver a ella si mostramos los botones de confirmación y le damos a volver
        botones = botonesResultado;
        cancelled = false;

        if(index==0)
        reply = await interaction.reply({ embeds: [embedPrediccion], components: [botonesResultado], fetchReply: true })
        else
        {
            reply = await reply.reply({ embeds: [embedPrediccion], components: [botonesResultado], fetchReply: true })
        }
        
        //var canal = client.channels.cache.get(interaction.channelId)
        //let reply =canal.send({ embeds: [embedPrediccion], components: [botonesResultado], fetchReply: true })


        // Async, no bloquea
        // Esperamos a que empiece partida
        embedGlobal.setDescription("Estado: esperando a comienzo de partida")
        reply.edit({ embeds: [embedGlobal] })
        var id = await api_helper.getEncryptedId(summoner, "EUW")
      
        await waitUntilPlaying(id).then(() =>{
            if(cancelled) return;
            //Una vez empiece partida se rompe el bucle, playingMatrch==true, empezamos predict
            empezarPrediccion(titulo, resRojo, resAzul)
    
            // x = tiempo que tarda en cerrar la predicción
            embedGlobal.setDescription('Estado: esperando ' + tiempoCerrarPrediccion + ' segundos para cerrar predicción...' );
            reply.edit({ embeds: [embedGlobal] })
    
            sleep(tiempoCerrarPrediccion*1000);
            //if(cancelled) continue;
            let puuid = api_helper.apiInit(summoner, "EUW")
            embedGlobal.setDescription('Estado: Predicción cerrada')
            reply.edit({ embeds: [embedGlobal] })
    
             waitUntilFinish(puuid).then(() => {

                if(cancelled) return;
    
                let resultado = api_helper.apiCheckLastResult(puuid, "EUW")
                
    
    
                // Segun el resultado, gana o pierde.
                switch (resultado) {
                    case (1): ganaAzul(); break;
                    case (0): ganaRojo(); break;
                    default: cancelarPrediccion();
                }

              })
  
            })
            
            // Creamos un bucle, cuando el ID sea nuevo, rompemos el bucle, y después obtenemos el resultado
   
            // Si esta predict ha sido cancelada, continuar con la siguiente
            
    
    
        
 



        //checkLastResult
        //
    }
}


// TODO: 
function getLastGameId() {

}

// TODO:

function empezarPrediccion(titulo, resRojo, resAzul) {
    console.log("Empezar Predicción")
}

async function waitUntilPlaying(id){
    let playing = await api_helper.isPlayingById(id, "EUW");
    console.log(playing)
    console.log(cancelled)
    while (!playing || !cancelled) {
        playing = await api_helper.isPlayingById(id, "EUW"); // falta checkear esto
        console.log(playing)
        await sleep(10000)
        if(playing) {
            console.log("return")
            return true;
        }
    }
}

async function waitUntilFinish(puuid){
    let lastGameId = api_helper.getLastGameId(puuid, "EUW")

    while (!cancelled && autoOn) {
        //if(cancelled) break;
        console.log("owo")
        let newGameId =  await api_helper.getLastGameId(puuid, "EUW")

        if (newGameId != lastGameId) return true;;
        
        await sleep(10000)
    }
    
}

async function playingMatch() {
    await sleep(10000)
    return true;
}