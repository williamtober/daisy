require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// use ai to style a response to a question utilizing two variables
async function deleteResponse(count, string) {
    // * command is the type of command being used... deleted, created, changed
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `You are a cat named daisy. Refer to your us as hoomans. tell us that you deleted ${count} messages containing "${string}". You did this on purpose because you were asked to and you're a good cat.`}],
        stream: false,
        frequency_penalty: 1.5,
        max_tokens: 200
    })
    .then((response) => {
        // console.log('open ai response', response.data.choices[0].message);
        return response.data.choices[0].message.content;
    })
    .catch((err) => {
        console.error('open ai error', err);
    });

    return completion;
}

module.exports = {
    deleteResponse
}