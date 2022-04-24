//Dotenv config
require('dotenv').config();

//Client config
const { Client, Intents, Message, Emoji } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

//Dotenv imports
const 
        token = process.env.TOKEN,
        botID = process.env.BOTID,
        textChannelCommands = process.env.COMMANDS,
        voiceChannelPunizione = process.env.PUNIZIONE;

//Utils
let active = false, bambini = [];
const nomi = new Map([
    ['adam', '764083440466657280'],
    ['sartor', '428651109712789524'],
    ['adrian', '637936108835176459'],
    ['cesare', '574658197818966026'],
    ['taco', '464401982749278210'],
    ['martin', '496326160808935424'],
    ['raf', '778554701343752213'],
    ['mariya', '765241379965239336'],
    ['aros', '594582883742777345'],
    ['viel', '520618885347672067'],
    ['paolo', '148820380650307585'],
    ['giovanni giorgio', '896374527620182036'],
  ]),
  cmd = "'";

//Help Message
const helpMessage = `

    **HELP**

    :question:\t**COMMANDS**

    \`/help\`           - Lista comandi
    \`/getnomi\`        - Mostra nomi disponibili
    \`/setPunish on\`   - Attiva punizione
    \`/setPunish off\`  - Disattiva punizione
    \`/getpunish \`     - Mostra stato punizione
    \`/getbambini \`    - Ritorna lista bambini
    \`/addbambino \`    - Aggiunge un bambino per nome o ID
    \`/removebambino \` - Rimuove un bambino
    \`/flush \`         - Getta bambini nel cesso
    \`/setbambini \`    - Imposta lista bambini

    :information_source:\t**INFO**

    Bot creato da <@428651109712789524> e <@764083440466657280>
    I comandi NON sono case-sensitive  :wink:

    **v1.0.1**

    `

//Commands
client.on('messageCreate', async message => {
    if(message.channelId == textChannelCommands && message.author.id != botID){
        if(message.content.toLowerCase().match(cmd + "help")){                       //Help Message
            message.reply(helpMessage);
            
        } else if(message.content.toLowerCase().startsWith(cmd + "setpunish ")){     //Set Punish
            newState = message.content.substring(11).toLowerCase();
            if(newState == "on"){
                active = true;
                message.reply("Punizione attivata");
            } else if(newState == "off"){
                active = false;
                message.reply("Punizione disattivata");
            } else {
                message.reply("Il valore dopo '/setPunish' può essere solo 'on' o 'off'");
            }

        } else if(message.content.toLowerCase().match(cmd + "getpunish")){           //Get Punish Status 
            message.reply("Status:\t".concat((active) ? ":white_check_mark:" : ":x:"));

        } else if(message.content.toLowerCase().match(cmd + "getbambini")){          //Get Bambini by ID
            if(bambini.length == 0){
                message.reply("La lista è ancora vuota...\nRimediamo?");
            } else {
                var listaNomi = "Bambini:\n\n";

                for(var i = 0; i < bambini.length; i++){
                    await client.users.fetch(bambini[i]).then(bambino => {
                        listaNomi += "-\t" + bambino.username + "\n";
                    }).catch(err => {
                        message.reply("Qualcosa è andato storto :/\n contatta un admin !\n\n" + err.message);
                    })
                }

                message.reply(listaNomi);
            }

        } else if(message.content.toLowerCase().startsWith(cmd + "addbambino ")){    //Add Bambino
            const bambinoID = message.content.substring(12);

            if(bambini.includes(bambinoID)){
                message.reply("Il moccioso è già presente");
            } else {
                client.users.fetch(bambinoID).then(bambino => {
                    bambini.push(bambino.id);
                    message.reply( bambino.username + " aggiunto ai Bambini");
                }).catch(err => {
                    if(nomi.has(bambinoID)){
                        bambini.push(nomi.get(bambinoID));
                        message.reply(bambinoID + " aggiunto ai Bambini");
                    } else {
                        message.reply("L'ID inserito non è valido");
                    }
                })
            }
        } else if(message.content.toLowerCase().startsWith(cmd + "removebambino ")){ //Remove Bambino
            const bambinoID = message.content.substring(15);

            if(bambini.includes(bambinoID)){
                bambini.forEach(function(item, index){
                    if(item == bambinoID){
                        bambini.splice(index, 1);
                    }
                });

                message.reply("Bambino rimosso");
            } else {
                message.reply("Non trovo il moccioso");
            }

        } else if(message.content.toLowerCase().match(cmd + "flush")){               //Flush Bambini
            bambini = [];
            message.reply("**Suono Sciacquone**");

        } else if(message.content.toLowerCase().match(cmd + "getnomi")){             //Get Nomi (Map)
            var text = "*Nomi*:\n ";

            for (var [key, value] of nomi.entries()) {
                text += "- " + key + ": \t\t" + value + "\n";
            }

            message.reply(text);

        }
    };
})

//Punizione
client.on('voiceStateUpdate', async (oldState, newState) => {

    if(oldState.channelId != null && newState.channelId != null){           // Spostato
        
        const channel = await client.channels.fetch(newState.channelId);

        console.log("\nid:" + newState.member.user.id + "\tmembers: " + channel.members.size)

        if( channel.name != "todoverto" && bambini.includes(newState.member.user.id) && channel.members.size > 1 && active){
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
