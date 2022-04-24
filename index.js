require('dotenv').config();
const { Client, Intents } = require('discord.js');
const token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if(newState.channelID === null) //left
      console.log('user left channel', oldState.channelID);
  else if(oldState.channelID === null) // joined
      console.log('user joined channel', newState.channelID);
  else // moved
      console.log('user moved channels', oldState.channelID, newState.channelID);
});



// Login to Discord with your client's token
client.login(token);
