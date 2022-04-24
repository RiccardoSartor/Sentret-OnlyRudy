//Dotenv config
require('dotenv').config();

//Client config
const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

//Dotenv imports
const 
        token = process.env.TOKEN,
        bambino = process.env.IDBAMBINO, 
        textChannelGenerale = process.env.GENERALE,
        textChannelCommands = process.env.COMMANDS,
        voiceChannelPunizione = process.env.PUNIZIONE;

//Counter
let counter = 0;

//Commands
client.on('messageCreate', async message => {
    if(message.channelId == textChannelCommands){
        if(message.content.startsWith("/counter ")){
            
            newCounter = message.content.substring(9);
            if(!isNaN(parseInt(newCounter))){
                counter = newCounter;
            }
        }
    };
})

//Punizione
client.on('voiceStateUpdate', async (oldState, newState) => {

    if(oldState.channelId != null && newState.channelId != null){           // Spostato
        
        const channel = await client.channels.fetch(newState.channelId);

        console.log("\nid:" + newState.member.user.id + "\tmembers: " + channel.members.size)

        if(newState.member.user.id == bambino && channel.members.size > 1 && counter > 0){
            newState.member.voice.setChannel(await client.channels.fetch(voiceChannelPunizione));
            counter--;
            console.log(counter);
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
