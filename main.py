import logging
from telegram import Update, ForceReply
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
import g4f
from g4f.client import Client

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

client = Client()

# History to store the last 3 requests and responses
history = []

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Welcome! Send me your queries and I will respond!')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Send me a message and I will reply with the answer!')

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_message = update.message.text
    if not user_message:
        await update.message.reply_text("Please enter a query!")
        return

    # Add user message to history
    history.append((user_message, ""))

    # Prepare messages for the model
    messages = [{"role": "user", "content": msg[0]} for msg in history]
    messages.append({"role": "user", "content": user_message})

    # Get response from the model
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        provider=g4f.Provider.Chatgpt4o
    )

    reply = response.choices[0].message.content
    # Add the model's reply to history
    history[-1] = (user_message, reply)

    # Send the reply back to the user
    await update.message.reply_text(f"XIV AI 4 Omni Turbo 300K: {reply}")

async def clear_history(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    global history
    history.clear()
    await update.message.reply_text("History cleared!")

def main() -> None:
    application = ApplicationBuilder().token('7393805983:AAEe7vlzovF46erMLsgFaGQUeYicxNNsxOc').build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    application.add_handler(CommandHandler("clear", clear_history))

    application.run_polling()

if __name__ == '__main__':
    main()