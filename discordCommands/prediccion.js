const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
var twitch = require('../twitchActions.js');

const CUSTOM_ID_BOTON_AZUL = 'boton_resultado_azul'
const CUSTOM_ID_BOTON_ROJO = 'boton_resultado_rojo'
const CUSTOM_ID_BOTON_CANCELAR = 'boton_resultado_cancelar'

const CUSTOM_ID_BOTON_CONFIRMAR = 'boton_confirmar'
const CUSTOM_ID_BOTON_NO_CONFIRMAR = 'boton_no_confirmar'

var rolesPermitidos = ['1047452799627178046','928466515001499659']
var canalesPermitidos = ['1045374650298941450']

var botones;
var func;
var inter;
var author;
var resultado;
var resAz;
var resRo;

function permitido(interaction){
    //console.log(interaction)

    let colecRoles = interaction.member._roles;
    let canal = interaction.channelId;
    if(canalesPermitidos.includes(canal))
    for(let r=0;r<colecRoles.length;r++){
        if(rolesPermitidos.includes(colecRoles[r]))
            return true;
    }  


    return false;
}



async function crearPrediccion(user, titulo, resAzul, resRojo) {
    return new EmbedBuilder()
        .setColor("#9900FF")
        .setTitle('Predicción iniciada')
        .setURL('https://www.twitch.tv/nissaxter')
        .setAuthor({ name: user.username, iconURL: user.avatarURL() })
        .setDescription(titulo)
        .addFields(
            { name: '🟦', value: resAzul, inline: true },
            { name: '🟥', value: resRojo, inline: true },
        )
        .setTimestamp()
}

async function crearBotones(resAzul, resRojo) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_AZUL)
                .setEmoji('🟦')
                .setLabel(resAzul)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_ROJO)
                .setEmoji('🟥')
                .setLabel(resRojo)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(CUSTOM_ID_BOTON_CANCELAR)
                .setEmoji('⚠')
                .setLabel(" - CANCELAR PREDICCIÓN - ⚠")
                .setStyle(ButtonStyle.Secondary),
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

function cancelarPrediccion() {
    resultado = "CANCELADA"
    console.log("Cancelar")

}

async function pedirConfirmacion(funcion, client, interaction) {
    let botonesConfirmar = await crearBotonesConfirmar();
    author = interaction.user;
    interaction.update({ components: [botonesConfirmar] })
    func = funcion;
/*     client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return;
        console.log(interaction);
        switch (interaction.customId) {
            case CUSTOM_ID_BOTON_CONFIRMAR:
                func()
                break;
            case CUSTOM_ID_BOTON_NO_CONFIRMAR:
                interaction.update({ components: [botones] })
                startEventListener(client, interaction)
                break;
        }
        //interaction.update({content:'a'})
    }); */
}
async function startEventListener(client, interaction) {
    client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isButton()) return;
        //console.log(interaction);
        switch (interaction.customId) {
            case CUSTOM_ID_BOTON_AZUL:
                pedirConfirmacion(ganaAzul, client, interaction);
                break;
            case CUSTOM_ID_BOTON_ROJO:
                pedirConfirmacion(ganaRojo, client, interaction);
                break;
            case CUSTOM_ID_BOTON_CANCELAR:
                pedirConfirmacion(cancelarPrediccion, client, interaction)
                break;
            case CUSTOM_ID_BOTON_CONFIRMAR:
                //Comprobamos que sea el mismo autor que ha elegido la interaccion anterior
                if(interaction.user == author){
                func()
                interaction.update({ content: `Resultado confirmado por ${author}: ${resultado}` , components: [] })
                }
                break;

            case CUSTOM_ID_BOTON_NO_CONFIRMAR:
                interaction.update({ components: [botones] })
                // Ya que esto lo pasamos por globales, tenemos que alunarlas al cancelar la interacción
                func = null;
                author = null;
                break;
        }
        //interaction.update({content:'a'})
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iniciarprediccion')
        .addStringOption(option => option.setName('titulo').setDescription('Título de la predicción').setRequired(true))
        .addStringOption(option => option.setName('resultado_azul').setDescription('Resultado azul de la predicción').setRequired(true))
        .addStringOption(option => option.setName('resultado_rojo').setDescription('Resultado rojo de la predicción').setRequired(true))
        .setDescription('Replies with Pong!'),
    async execute(interaction, client) {
        if(!permitido(interaction)) {
            // ephemeral = Solo se le muestra al usuario que ha hecho la interacción.
            interaction.reply({content: '`No tienes permiso para ejecutar este comando`', ephemeral:true})
            return false;
        };
        startEventListener(client, interaction)
        inter = interaction;

        const titulo = interaction.options.getString('titulo')
        const resAzul = interaction.options.getString('resultado_azul')
        const resRojo = interaction.options.getString('resultado_rojo')
        resAz = interaction.options.getString('resultado_azul')
        resRo = interaction.options.getString('resultado_rojo')

        console.log(titulo + resAzul + resRojo)

        const embedPrediccion = await crearPrediccion(interaction.user, titulo, resAzul, resRojo)

        const botonesResultado = await crearBotones(resAzul, resRojo)
        botones = botonesResultado;
        let resp = twitch.sendAnnouncement(titulo);
        console.log(await resp)
        //const botonesConfirmar = await crearBotonesConfirmar();
        let reply = await interaction.reply({ embeds: [embedPrediccion], components: [botonesResultado] })

        /*         client.on(Events.InteractionCreate, interaction2 => {
                    if (!interaction2.isButton()) return;
                    console.log(interaction2);
                    switch(interaction2.customId){
                        case CUSTOM_ID_BOTON_AZUL:
                            ganaAzul();
                            break;
                        case CUSTOM_ID_BOTON_ROJO:
                            ganaRojo();
                            break;
                        case CUSTOM_ID_BOTON_CANCELAR:
                            cancelarPrediccion()
                            break;
                    }
                    interaction2.update({content:'a'})
                }); */

        //await interaction.reply('Pong!');
    },
};



