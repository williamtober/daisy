require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions]
})

// get list of comments
const commands = [];
client.commands = new Collection();

// get all array of all command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// loop through the command files and add them to the commands collection
for( const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// register the commands with discord once the client is ready
client.on('ready', async () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    for( const guild_id of guild_ids)
    {
        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id),
                { body: commands }
            );
            console.log('Successfully registered application commands.');
        } catch (error) {
            console.error(error);
        }
    }
});

// handle command interactions
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

// handle rejection of promises or uncaught exceptions
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.error('unhandledRejection', error);
});

// handle uncaught exceptions
process.on('uncaughtException', error => {
    console.error('uncaughtException', error);
});

// starts the bot
client.login(process.env.TOKEN);