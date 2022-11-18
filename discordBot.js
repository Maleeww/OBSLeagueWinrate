
require('dotenv').config();

// Discord.js versions ^13.0 require us to explicitly define client intents
// DEPRECATED el import de Intents en Discord.js 14.0
//const { Client, Intents } = require('discord.js');
//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Discord.js ^14.0 
const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, Client,Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageReactions,
    ],
});

const CUSTOM_ID_BOTON_AZUL = 'boton_resultado_azul'
const CUSTOM_ID_BOTON_ROJO = 'boton_resultado_rojo'
const CUSTOM_ID_BOTON_CANCELAR = 'boton_resultado_cancelar'

// Setup de comandos:

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'discordCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


// Suscribir a evento 'ready' del cliente
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Loguear con la clave privada
client.login(process.env.DISCORD_CLIENT_TOKEN);


// Gestiona y lanza comandos tipo SlashCommand
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Funciona igual que discord.py, mediante eventos podemos lanzar acciones
client.on('messageCreate', msg => {
    //console.log(msg)
    // You can view the msg object here with console.log(msg)
    if (msg.content === 'Hello') {
        msg.reply(`Hello ${msg.author}`);
    }
});

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

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;


    if (msg.content.startsWith('!prediccionCustom ')) {
        msg.author.username

        // Obtenemos los parámetros
        let array = msg.content.split(' ')

        const titulo = array[1];
        const resAzul = array[2];
        const resRojo = array[3];

        const embedPrediccion = await crearPrediccion(msg.author, titulo, resAzul, resRojo)

        const botonesResultado = await crearBotones(resAzul, resRojo)

        let reply = await msg.reply({ embeds: [embedPrediccion], components: [botonesResultado] })

        client.on(Events.InteractionCreate, interaction => {
            if (!interaction.isButton()) return;
            console.log(interaction);
            switch(interaction.customId){
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
            interaction.update({content:'a'})
        });

    }
});

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isButton()) return;
    console.log(interaction);
    switch(interaction.customId){
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
    interaction.update({content:'a'})
});


function ganaAzul(){
console.log("Gana azul")
}

function ganaRojo(){
console.log("Gana rojo")
}

function cancelarPrediccion(){
    console.log("Cancelar")

} 
/* async function reactionsVote(){
        const filter1 = (reaction, user) => ['🟦','🟥'].includes(reaction.emoji.name);

            //await reply.react('🟦')
        //await reply.react('🟥')

        const collector1 = reply.createReactionCollector({filter1, max: 1,});
        collector1.on('collect', r => {
            if(r.emoji.name=='🟦')
            reply.reply("yes");
            else
            if(r.emoji.name=='🟥')
            reply.reply("uwu ok")
         
                })
} */

