const { SlashCommandBuilder } = require('@discordjs/builders');

// create slash command that clears all messages that come from a specific user
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearall')
        .setDescription('Clears all messages in the channel'),
    async execute(interaction) {
        // check if the user is an admin or moderator
        if(!interaction.member.roles.cache.some(role => role.name === 'Owner' || role.name === 'Moderator' || role.name === 'Admin'))
        {
            // get the number of messages in the channel
            let run = true;
            let i = 0;
            while(run) {
                // get all messages in the entire history of the channel
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                // check how many messages are in the channel
                if(messages.size > 0) {
                    // delete all messages in the channel
                    i = messages.size + i;
                    await interaction.channel.bulkDelete(messages);
                } else {
                    run = false;
                }
            }
            // reply with the number of messages deleted
            interaction.reply(`Meowwww! I deleted ${i} messages!`);
        } else {
            await interaction.reply('You do not have permission to use this command');
        }
    }
}