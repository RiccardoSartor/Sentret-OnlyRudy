//Dotenv config
require('dotenv').config();

//Client config
const { Client, Intents, Message, Emoji } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

//Dotenv imports
const 
        token = process.env.TOKEN,
        bambino = process.env.IDBAMBINO, 
        textChannelGenerale = process.env.GENERALE,
        textChannelCommands = process.env.COMMANDS,
        voiceChannelPunizione = process.env.PUNIZIONE;

//Counter
let active = false;

//Help Message
const helpMessage = `

    **Commands**
    \`/punizione on\` - Attiva punizione
    \`/punizione off\` - Disattiva punizione
    `

//Commands
client.on('messageCreate', async message => {
    if(message.channelId == textChannelCommands){
        if(message.content.match("/help")){
            message.reply(helpMessage);
        } else if(message.content.startsWith("/setPunish ")){
            
            newState = message.content.substring(11);
            if(newState == "on"){
                active = true;
                message.reply("Punizione attivata");
            } else if(newState == "off"){
                active = false;
                message.reply("Punizione disattivata");
            } else {
                message.reply("Il valore dopo '/setPunish' può essere solo true o false");
            }
        } else if(message.content.match("/getPunish")){
            
            message.reply("Status:\t".concat((active) ? ":white_check_mark:" : ":x:"));

        }
    };
})

//Punizione
client.on('voiceStateUpdate', async (oldState, newState) => {

    if(oldState.channelId != null && newState.channelId != null){           // Spostato
        
        const channel = await client.channels.fetch(newState.channelId);

        console.log("\nid:" + newState.member.user.id + "\tmembers: " + channel.members.size)

        if(newState.member.user.id == bambino && channel.members.size > 1 && active){
            newState.member.voice.setChannel(await client.channels.fetch(voiceChannelPunizione));
        }

    } else if(oldState.channelId == null && newState.channelId != null){    // Joinato
        
    } else if(oldState.channelId != null && newState.channelId == null){    // Uscito
        
    }else {                                                                 // Confundito
        
    }

});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);
