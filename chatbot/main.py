import os
from dotenv import load_dotenv
from datetime import datetime
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    CallbackQueryHandler,
    CommandHandler, 
    ContextTypes, 
    ConversationHandler,
    MessageHandler, 
    filters, 
)
from telegram.constants import ParseMode
from services.api_helper import create_to_api
import time
##########
load_dotenv()
BOT_USERNAME = os.getenv("BOT_HANDLE")
##########
from app import app
from services.gemini_response import gemini_response
from services.registration_flow import *
from services.book_appointment_flow import *
from services.survey_flow import *
from utils.states import *
##########

# Start command handling
async def start_command(update: Update, type: ContextTypes.DEFAULT_TYPE):
    print(f"Komo started by user {update.message.from_user.first_name}")
    # to check and disable duplicate sending of /start
    # if type.user_data.get("start_komo", False):
    #     return
    
    type.user_data["start_komo"] = True
    await update.message.reply_text(
        "Hello! I'm Komo, your personal health assistant. Nice to meet you!"
        )
    
    # Auto-trigger choose action command when starting bot
    time.sleep(1)
    await choose_action(update, type)
    
# Help command handling
async def help_command(update: Update, type: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "I can help you manage your appointments or registration!\n\nYou can also talk to me by starting your message with \"Hey Komo\", and you can tell me about how you're feeling or if you're feeling any discomfort - I'll do my best to help you out!"
        )
    
# User chooses action via Keyboard Buttons
async def choose_action(update: Update, type: ContextTypes.DEFAULT_TYPE):
    buttons = [["Register"], ["Book Appointment"], ["Manage"]]

    await update.message.reply_text(
        "How can I help you today?\n"
        "Please choose one of the options below, or type \"Hey Komo\" if you just want to chat with me!",
        reply_markup=ReplyKeyboardMarkup(
            buttons, resize_keyboard=True, one_time_keyboard=True, input_field_placeholder="How can I help you?"
        ),
    )

########################################################

# Handle scheduled task reply
async def scheduler_reply_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()  
    
    if query.data == "reminder_task_done":
        print("SCHEDULER: reminder task done")
        await query.edit_message_text(f"Glad to know you've already put on your cream!\n\nA small step a day goes a long, long way ☺️")
    
#########################################################

# Cancel action
async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user = update.message.from_user
    print(f"CANCEL: User {user.first_name} requested cancel.")

    if context.user_data.get("in_active_flow", False):
        # Inside conversation
        context.user_data["in_active_flow"] = False  # Or clear() if you want
        print("CANCEL: Cancelling inside conversation.")
        await update.message.reply_text(
            "Your action has been cancelled. You can /choose another action or say 'Hey Komo' to chat!",
            reply_markup=ReplyKeyboardRemove()
        )
        return ConversationHandler.END

    # Outside conversation
    print("Cancel outside conversation.")
    if context.user_data.get("in_active_flow", None) == False:
        print("CANCEL: Removing in_active_flow...")
        context.user_data.pop("in_active_flow", None)
        return
    
    if context.user_data.get("free_chat", False):
        print("FREE CHAT: Cancelling free chat")
        context.user_data.pop("free_chat", None)

    await update.message.reply_text(
        "There's nothing to cancel. You can /choose another action or say 'Hey Komo' to chat!"
    )
    return ConversationHandler.END


#########################################################

# Bot func
async def handle_free_chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.message.from_user.first_name
    # Retrieve patient's id
    user_tele = update.message.from_user["username"]
    if not user_tele:
        await update.message.reply_text("Please set up a Telegram username to use our services!")
        return 
    
    user_info = await get_from_api(
        {}, GET_PATIENT_FIND_BY_TELEGRAM_URL + user_tele
        )

    user_text: str = update.message.text.lower()
    print(f"MAIN CHAT: User {user_name} sent {user_text}")

    # Check if user is starting a free chat
    if ("hey komo" in user_text) or ("hi komo" in user_text):
        print(f"FREE CHAT: Free chat started for {user_name}....")
        context.user_data["free_chat"] = True
        await update.message.reply_text("<i>(You are now starting a free chat with Komo! \n\nFeel free to share about any worries you have. When you're ready to end the conversation, just say <b>'thanks komo'</b>!)</i>",
                                        parse_mode=ParseMode.HTML)
    
    # Checking if free chat is active
    if context.user_data.get("free_chat", False):
        # Save message to patient_conversation table
        if user_info != None:
            message_date: datetime = update.message.date
            if user_info != None:
                data = {
                    "patient_id": user_info["id"],
                    "date_time": message_date.isoformat(),
                    "raw_message": user_text
                }
                try:
                    await create_to_api(data, POST_CREATE_CONVERSATION_URL)
                except:
                    print("FREE CHAT: Error occurred when saving message to database")
        else:
            await update.message.reply_text(
                "<i>(Your account has not yet been registered with us! For the best experience, please register your details first. \n\nYou can do this by typing 'Register')</i>",
                parse_mode=ParseMode.HTML
            )
            return
        
        # Ending free chat
        if ("thanks komo" in user_text) or ("thank you komo" in user_text):
            print(f"FREE CHAT: end free chat for {user_name}")
            context.user_data["free_chat"] = False
            await update.message.reply_text("Thanks for sharing with me, and take care as always :)")
            return
        
        else:
            print("FREE CHAT: getting response...")
            # Continue free chat
            response = await gemini_response(user_text, user_info["id"])
            await update.message.reply_text(response)
            return
    
    await update.message.reply_text(
        "Sorry, I didn't understand that... \nIf you'd like to chat with me about how you're feeling, just say \"Hey Komo\" \n\nOr if you need help with registration/appointment management, feel free to use the buttons below!"
        )

############

# Error handling
async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"ERROR: Update {update} caused error {context.error}")

#### Running 
if __name__ == "__main__":
    print("MAIN: Starting bot....")

    STATE_KEYWORDS = ["Register", "Book Appointment", "start_post_survey.*"]

    ####################
    # Registration Handling
    reg_handler = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("(?i)^Register$"), registration_start_handler)],
        states={
            REG_REDIRECT: [CallbackQueryHandler(registration_redirect_handler)],
            REG_SINGPASS: [CallbackQueryHandler(registration_singpass_handler)],
            REG_NAME: [MessageHandler(filters.TEXT, registration_name_handler)],
            REG_EMAIL: [MessageHandler(filters.TEXT, registration_email_handler)],
            REG_PHONE: [MessageHandler(filters.TEXT, registration_phonenumber_handler)],
            REG_REMARKS: [MessageHandler(filters.TEXT, registration_remarks_handler)],
            REG_CONFIRM: [CallbackQueryHandler(registration_confirmation_handler)],
            REG_EDIT: [CallbackQueryHandler(registration_edit_handler)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    # Booking Conversation Handler
    booking_handler = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("(?i)^Book Appointment$"), booking_start_handler)],
        states={
            BOOKING_DATE_TIME: [CallbackQueryHandler(booking_options_handler)],
            BOOKING_REMARKS: [MessageHandler(filters.TEXT, booking_remarks_handler)], 
            BOOKING_CONFIRM: [CallbackQueryHandler(booking_confirm_handler)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    # Management Conversation Handler
    async def manage_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("Sorry! This feature isn't implemented yet. \n\nYou can click on /choose to explore our other actions, or say 'Hey Komo' to chat with me!")
        return

    # Survey
    survey_handler = ConversationHandler(
        # entry_points=[CallbackQueryHandler(post_survey_start_handler, pattern='^start_post_survey.*$')],
        entry_points=[CallbackQueryHandler(post_survey_start_handler, pattern='^start_post_survey.*$')],
        states={
            POST_SURVEY_DOC: [CallbackQueryHandler(post_survey_doc_handler)],
            POST_SURVEY_SYMPTOMS: [CallbackQueryHandler(post_survey_symptoms_handler)],
            POST_SURVEY_SYMPTOMS_REMARKS: [MessageHandler(filters.TEXT, post_survey_symptoms_remarks_handler)],
            POST_SURVEY_MED: [CallbackQueryHandler(post_survey_med_handler)],
            POST_SURVEY_REMINDER: [CallbackQueryHandler(post_survey_reminder_handler)],
            POST_SURVEY_FOLLOWUP: [CallbackQueryHandler(post_survey_followup_handler)],
            POST_SURVEY_RATING: [CallbackQueryHandler(post_survey_rating_handler)],
            POST_SURVEY_FEEDBACK: [MessageHandler(filters.TEXT, post_survey_feedback_handler)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )    

    # Add Handlers 
        # Scheduler handlers -- disabled temp
    # app.add_handler(survey_handler)
    # app.add_handler(CallbackQueryHandler(scheduler_reply_handler))

        # Action handlers
    app.add_handler(reg_handler)
    app.add_handler(booking_handler)
    app.add_handler(MessageHandler(filters.Regex("(?i)^Manage$"), manage_handler))

        # Setting commands
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('choose', choose_action))
    app.add_handler(CommandHandler('cancel', cancel))
    # app.add_handler(manage_handler)

    ########

    state_handlers = "(" + "|".join(STATE_KEYWORDS) + ")"
    print("MAIN: state handlers", state_handlers)
    # Other Message handling
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND & ~filters.Regex(state_handlers), handle_free_chat))

    # Error handling
    app.add_error_handler(error)

    #########################

    # Debug catcher
    async def debug_all_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if update.message:
            print(f"[DEBUG] Message received: {update.message.text!r}")
        elif update.callback_query:
            print(f"[DEBUG] Callback query received: {update.callback_query.data!r}")

    app.add_handler(MessageHandler(filters.ALL, debug_all_messages), group=99)

    ########################

    # Ping for updates on msgs (checks every n seconds)
    print("MAIN: Polling bot...")
    app.run_polling(poll_interval=3)



