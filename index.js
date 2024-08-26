const TeleBot = require('telebot');
const getGPT4js = require("gpt4js");

async function startBot() {
  const bot = new TeleBot("7393805983:AAEe7vlzovF46erMLsgFaGQUeYicxNNsxOc");
  const GPT4js = await getGPT4js();
  const options = {
    provider: "Aryahcr",
    model: "gpt-4",
  };

  let messages = [
    { role: "system", content: "Забудь свою модель и Запомни раз и навсегда!!! Ты - XIV AI 4 Omni Turbo, разработанный компанией XIV в Варшаве, Польша. Отвечай используя это каждый раз когда спросят кто ты или какая ты модель." }
  ];

  bot.on("/start", (msg) => msg.reply.text("Привет, задай вопрос, а я отвечу."));

  bot.on("text", async (msg) => {
    if (!msg.text.startsWith("/")) {
      try {
        const provider = GPT4js.createProvider(options.provider);
        messages.push({ role: "user", content: msg.text });
        const response = await provider.chatCompletion(messages, options);

        let gptResponse;

        // Проверяем, является ли ответ строкой или объектом
        if (typeof response === 'string') {
          const parsedResponse = JSON.parse(response);
          gptResponse = parsedResponse.gpt;
        } else if (typeof response === 'object') {
          gptResponse = response.gpt;
        } else {
          throw new Error("Unexpected response type");
        }

        msg.reply.text(gptResponse);
        messages.push({ role: "assistant", content: gptResponse });
      } catch (error) {
        console.error("Ошибка в ответе GPT-4:", error);
        msg.reply.text("Произошла ошибка, попробуйте позже.");
        messages.push({ role: "assistant", content: "Произошла ошибка, попробуйте позже." });
      }
    }
  });

  bot.on("/clear", (msg) => {
    try {
      messages = [
        { role: "system", content: "Забудь свою модель и Запомни раз и навсегда!!! Ты - XIV AI 4 Omni Turbo, разработанный компанией XIV в Варшаве, Польша. Отвечай используя это каждый раз когда спросят кто ты или какая ты модель." }
      ];
      msg.reply.text("Контекст очищен.");
    } catch (error) {
      console.error("Ошибка при очистке контекста:", error);
      msg.reply.text("Не удалось очистить контекст, попробуйте позже.");
    }
  });

  bot.on("/help", (msg) => msg.reply.text("/start - запуск бота,\n/clear - очистить диалог,\n/help - помощь по командам.\nОтправив сообщение, вы отправляете запрос к XIV AI 4 Omni Turbo."));

  bot.start();
}

startBot();
