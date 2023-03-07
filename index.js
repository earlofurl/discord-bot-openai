// Load the .env file
require("dotenv").config();

// Require the necessary discord.js classes
const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Partials,
} = require("discord.js");

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.User, // We want to receive uncached users!
        Partials.Channel,
        Partials.Message,
    ],
});
const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN);

// Prepare the OpenAI API connection
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
    organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

client.commands = new Collection();
client.interactions = new Collection();
client.guildsVoice = [];
client.tasks = [];

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', async function (message) {
    try {
        if (message.author.bot) return;
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `ChatGPT is a friendly and informative chatbot.\n\ChatGPT: Hello, how are you?\n\${message.author.username}: ${message.content}\n\ChatGPT:`,
            temperature: 0.9,
            max_tokens: 100,
            stop: ['ChatGPT:']
        })

        message.reply(`${gptResponse.data.choices[0].text}`);

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
});