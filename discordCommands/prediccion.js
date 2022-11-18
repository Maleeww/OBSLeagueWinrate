const{SlashCommandBuilder,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events} = require('discord.js');

const CUSTOM_ID_BOTON_AZUL = 'boton_resultado_azul'
const CUSTOM_ID_BOTON_ROJO = 'boton_resultado_rojo'
const CUSTOM_ID_BOTON_CANCELAR = 'boton_resultado_cancelar'

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



module.exports = {
	data: new SlashCommandBuilder()
		.setName('iniciarprediccion')
        .addStringOption(option => option.setName('titulo').setDescription('Título de la predicción').setRequired(true))
        .addStringOption(option => option.setName('resultado_azul').setDescription('Resultado azul de la predicción').setRequired(true))
        .addStringOption(option => option.setName('resultado_rojo').setDescription('Resultado rojo de la predicción').setRequired(true))
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        const titulo = interaction.options.getString('titulo')
        const resAzul = interaction.options.getString('resultado_azul')
        const resRojo = interaction.options.getString('resultado_rojo')

        console.log(titulo+resAzul+resRojo)

        const embedPrediccion = await crearPrediccion(interaction.user, titulo, resAzul, resRojo)

        const botonesResultado = await crearBotones(resAzul, resRojo)

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



