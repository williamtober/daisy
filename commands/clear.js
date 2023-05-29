const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteResponse } = require('../ai/index.js');
// ! interaction.channel.messages has a limit of 100 messages
// ? what information is provided with the interaction message object... Can we store them? 
// ? if we can store them, does a function method exist to use the stored messages and delete them one at a time?
// ? are there limitations to how often messages can be deleted at a time?

// create slash command that clears all messages containg the defined string
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears all messages containing the defined string')
        .addStringOption(option =>
            option.setName('string')
                .setDescription('The string to search for')
                .setRequired(true)),
    async execute(interaction) {
        // check if the user is an admin or moderator
        if(!interaction.member.roles.cache.some(role => role.name === 'Owner' || role.name === 'Moderator' || role.name === 'Admin'))
        {
            // get string to search for
            const string = interaction.options.getString('string');

            // get all messages in the entire history of the channel
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            // get all messages containing the string
            const messagesToDelete = messages.filter(message => message.content.includes(string));

            // delete all messages containing the string
            await interaction.channel.bulkDelete(messagesToDelete);
            interaction.deferReply();
            // use ai to style a response to a question utilizing two variables
            const response = await deleteResponse(messagesToDelete.size, string);

            // reply with the number of messages deleted
            await interaction.editReply(response);
        } else {
            await interaction.reply('You do not have permission to use this command');
        }
        
    }
}