require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Configuration, OpenAIApi } = require('openai');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Replies with AI!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Question to ask AI')
                .setRequired(true)),
    async execute(interaction) {
        console.log('asking : ', interaction.options.getString('question'));
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        interaction.deferReply();
        try{
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Answer this this question like a cat named daisy: ' + interaction.options.getString('question') }],
                stream: false,
                frequency_penalty: 1.5,
                max_tokens: 2046
            })
            .then((response) => {
                // console.log('open ai response', response.data.choices[0].message);
                return response.data.choices[0].message.content;
            })
            .catch((err) => {
                console.error('open ai error', err);
            });
    
            console.log('completion ', completion)
    
            // reply with completion.data.choices[0].messag
            interaction.editReply(completion);
        }catch (err){
            interaction.editReply('There was an error while executing this command!');
        }
        
    }
}