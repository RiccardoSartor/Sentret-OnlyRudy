require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({
  intents: ['GUILDS', 
            'GUILD_MEMBERS', 
            'GUILD_BANS', 
            'GUILD_INVITES',
            'GUILD_MESSAGES',
            'GUILD_VOICE_STATES'
          ]
});
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.includes('ping')) {
    msg.reply('pong');
  }
});

bot.on('message', msg => {
  if (msg.content.includes('pong')) {
    msg.reply('ping');
  }
});