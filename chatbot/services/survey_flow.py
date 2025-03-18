from utils.states import *
from services.api_helper import *
from utils.API_PATHS import *
import time
# from chatbot.app import app

from telegram import Bot, Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
)
from telegram.constants import ParseMode


async def post_survey_start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Start the conversation, display any stored data and ask user for input."""
    query = update.callback_query
    await query.answer()

    user_name = query.from_user.first_name
    print(f"POST_SURVEY: in survey start for user {user_name}")
    context.user_data["in_active_flow"] = True

    res = query.data.split('|')[1]

    text = ""
    if res == "better":
        text = "Glad to hear you've been doing good!\n\n"
    elif res == "worse":
        await query.edit_message_text("Really sorry to hear that...\n\nIf you’re feeling worse, we can notify your doctor right away. Would you like us to do that?",
                                       reply_markup=InlineKeyboardMarkup([
                                           [InlineKeyboardButton("Yes", callback_data="yes"), InlineKeyboardButton("No", callback_data="no")]
                                       ]))
        return POST_SURVEY_DOC

    reply_text = text + "🤕 Are you experiencing any new or worsening symptoms? "
    options = [
        [
            InlineKeyboardButton("Yes", callback_data="yes"),
            InlineKeyboardButton("No", callback_data="no")
        ]
    ]
    await query.edit_message_text(
        reply_text,
        reply_markup=InlineKeyboardMarkup(options))
    return POST_SURVEY_SYMPTOMS

async def post_survey_doc_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    print("POST_SURVEY: in notify doc symptoms")

    if query.data == "yes":
        msg = await query.edit_message_text("Got it. We'll notify your doctor about your condition.\n\nPlease help us to understand more by completing a few more questions...")
    
    if query.data == "no":
        msg = await query.edit_message_text("No worries, and do take care. Please help us to understand more about how you're feeling by completing a few more questions...")

    # context.user_data["msg_to_delete"] = msg.message_id
    time.sleep(5)
    options = [
        [
            InlineKeyboardButton("Yes", callback_data="yes"),
            InlineKeyboardButton("No", callback_data="no")
        ]
    ]
    await query.edit_message_text(
        "🤕 Are you experiencing any new or worsening symptoms?",
        reply_markup=InlineKeyboardMarkup(options))
    return POST_SURVEY_SYMPTOMS

async def post_survey_symptoms_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    # if context.user_data.get("msg_to_delete", False):
    #     app.bot.delete_message(chat_id=)    

    if query.data == "yes":
        print("POST_SURVEY: new symptoms")
        await query.edit_message_text("✍️ Sorry to hear, could you tell us a little more about what's going on?")
        return POST_SURVEY_SYMPTOMS_REMARKS
    
    # if no; no new symptoms
    print("POST_SURVEY: no new symptoms")
    await query.edit_message_text("💊 Have you been able to take your prescribed medication as instructed?", 
                                  reply_markup=InlineKeyboardMarkup([
                                        [InlineKeyboardButton("Yes", callback_data="yes"), InlineKeyboardButton("No", callback_data="no")]
                                    ]))
    return POST_SURVEY_MED
    
async def post_survey_symptoms_remarks_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    response = update.message.text
    print(f"POST_SURVEY: user symptoms remarks: {response}")

    await update.message.reply_text("Thanks for sharing, we'll take note of this and inform your doctor as well.")
    time.sleep(1)
    await update.message.reply_text("💊 Have you been able to take your prescribed medication as instructed?",
                                    reply_markup=InlineKeyboardMarkup([
                                        [InlineKeyboardButton("Yes", callback_data="yes"), InlineKeyboardButton("No", callback_data="no")]
                                    ]))
    return POST_SURVEY_MED

async def post_survey_med_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    print("POST_SURVEY: in med handler")

    text = "It's ok, habit takes time to form.\nLet's help you out:\n\n"
    if query.data == "yes":
        text = "That's great, consistency is key!\n\n"

    await query.edit_message_text(f"{text}⏰ Would you like a daily reminder to take your medication?",
                                  reply_markup=InlineKeyboardMarkup([
                                        [InlineKeyboardButton("Yes", callback_data="yes"), InlineKeyboardButton("No", callback_data="no")]
                                    ]))
    return POST_SURVEY_REMINDER

async def post_survey_reminder_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    print("POST_SURVEY: in reminder handler")

    text = "No problem, you're keeping up well!\n\n"
    if query.data == "yes":
        text = "Sure thing! We've scheduled a daily reminder for you every 9pm.\n\n"

    await query.edit_message_text(f"{text}📅 Do you think you need a follow-up appointment? We can help book one!",
                                  reply_markup=InlineKeyboardMarkup([
                                        [InlineKeyboardButton("Yes", callback_data="yes"), InlineKeyboardButton("No", callback_data="no")]
                                    ]))
    return POST_SURVEY_FOLLOWUP

async def post_survey_followup_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    print("POST_SURVEY: in followup handler")

    text = "No worries, you're always welcome to Quick Book an appointment with me via /choose!\n\n"
    if query.data == "yes":
        text = "Noted! We've notified your doctor that you'd like a followup, and we will be in touch soon!.\n\n"

    await query.edit_message_text(f"{text}⭐ Speaking of the doctor, how would you rate your experience from the last appointment?\n\n<i>(1 - Terrible experience, 5 - Excellent experience)</i>",
                                  reply_markup=InlineKeyboardMarkup([
                                        [InlineKeyboardButton("1", callback_data="1"), 
                                         InlineKeyboardButton("2", callback_data="2"),
                                         InlineKeyboardButton("3", callback_data="3"),
                                         InlineKeyboardButton("4", callback_data="4"),
                                         InlineKeyboardButton("5", callback_data="5"),]
                                    ]), 
                                    parse_mode=ParseMode.HTML)
    return POST_SURVEY_RATING

async def post_survey_rating_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    print(f"POST_SURVEY: user gave rating of {query.data}")

    await query.edit_message_text("💭 Got any feedback for us? We'd love to hear your thoughts!\n\n<i>(If you have nothing to add, please type NA)</i>",
                                  parse_mode=ParseMode.HTML)

    return POST_SURVEY_FEEDBACK

async def post_survey_feedback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    feedback = update.message.text
    print(f"POST_SURVEY: user entered feedback {feedback}")

    await update.message.reply_text("✅ Thanks for sharing with us!\n\n💡 Remember, if anything feels urgent, don’t wait—reach out to your doctor or visit the clinic ASAP.")
    return ConversationHandler.END