const { SlashCommandBuilder } = require('@discordjs/builders');

// create slash command that clears all messages that come from a specific user
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearfrom')
        .setDescription('Clears all messages that come from a specific user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to search for')
                .setRequired(true)),
    async execute(interaction) {
        // check if the user is an admin or moderator
        if(!interaction.member.roles.cache.some(role => role.name === 'Owner' || role.name === 'Moderator' || role.name === 'Admin')) {
            // get user to search for
            const user = interaction.options.getUser('user');

            // get all messages in the entire history of the channel
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            // get all messages from the user
            const messagesToDelete = messages.filter(message => message.author.id === user.id);
            
            // delete all messages from the user
            await interaction.channel.bulkDelete(messagesToDelete);

            // reply with the number of messages deleted
            interaction.reply(`Meowwww! I deleted ${messagesToDelete.size} messages from ${user.username}!`);
            
        } else {
            await interaction.reply('You do not have permission to use this command');
        }
        
    }
}