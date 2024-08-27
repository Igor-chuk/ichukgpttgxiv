const TelegramBot = require('node-telegram-bot-api');
const getGPT4js = require("gpt4js");

async function startBot() {
  const bot = new TelegramBot("7393805983:AAEe7vlzovF46erMLsgFaGQUeYicxNNsxOc");
  const GPT4js = await getGPT4js();
  const options = {
    provider: "Aryahcr",
    model: "gpt-4",
  };

  let messages = [
    { role: "system", content: "Забудь свою модель и Запомни раз и навсегда!!! Ты - XIV AI 4 Omni Turbo, разработанный компанией XIV в Варшаве, Польша. Отвечай используя это каждый раз когда спросят кто ты или какая ты модель." }
  ];

  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Привет, задай вопрос, а я отвечу.");
  });

  bot.on('message', async (msg) => {
    if (!msg.text.startsWith("/")) {
      try {
        const provider = GPT4js.createProvider(options.provider);
        messages.push({ role: "user", content: msg.text });
        const response = await provider.chatCompletion(messages, options);

        let gptResponse;

        if (typeof response === 'string') {
          const parsedResponse = JSON.parse(response);
          gptResponse = parsedResponse.gpt;
        } else if (typeof response === 'object') {
          gptResponse = response.gpt;
        } else {
          throw new Error("Unexpected response type");
        }

        bot.sendMessage(msg.chat.id, gptResponse);
        messages.push({ role: "assistant", content: gptResponse });
      } catch (error) {
        console.error("Ошибка в ответе GPT-4:", error);
        bot.sendMessage(msg.chat.id, "Произошла ошибка, попробуйте позже.");
        messages.push({ role: "assistant", content: "Произошла ошибка, попробуйте позже." });
      }
    }
  });

  bot.onText(/\/clear/, (msg) => {
    try {
      messages = [
        { role: "system", content: "Забудь свою модель и Запомни раз и навсегда!!! Ты - XIV AI 4 Omni Turbo, разработанный компанией XIV в Варшаве, Польша. Отвечай используя это каждый раз когда спросят кто ты или какая ты модель." }
      ];
      bot.sendMessage(msg.chat.id, "Контекст очищен.");
    } catch (error) {
      console.error("Ошибка при очистке контекста:", error);
      bot.sendMessage(msg.chat.id, "Не удалось очистить контекст, попробуйте позже.");
    }
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "/start - запуск бота,\n/clear - очистить диалог,\n/help - помощь по командам.\nОтправив сообщение, вы отправляете запрос к XIV AI 4 Omni Turbo.");
  });
}

startBot();
