from utils.states import *
from services.api_helper import *
from utils.API_PATHS import *

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ContextTypes, 
    ConversationHandler,
)
from telegram.constants import ParseMode
from services.api_helper import get_from_api, update_to_api
from services.booking_helper_functions import *
###############

AVAILABLE_SLOTS = []

async def booking_start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    '''Start the booking appointment flow and pull from appointment table'''
    global AVAILABLE_SLOTS
    print("in booking start")

    user_tele = update.message.from_user.username
    user_info = await get_from_api(
        {}, GET_PATIENT_FIND_BY_TELEGRAM_URL + user_tele
        )
    if user_info:
        context.user_data["patient_id"] = user_info["id"]
        print("got patient id")
    else:
        await update.message.reply_text(
                "<i>(Your account has not yet been registered with us! For the best experience, please register your details first. \n\nYou can do this by typing 'Register')</i>",
                parse_mode=ParseMode.HTML
            )
        return ConversationHandler.END

    AVAILABLE_SLOTS = await get_available_appointments_in_groups()

    await update.message.reply_text("Welcome to our Quick Booking System! This is best used if you'd like to quickly book an appointment within the next 2 weeks.\n\n<i>For bookings further in advance, please call into our clinic at +65[number] and we'd be happy to slot you in!</i>\n\n",
                                    parse_mode=ParseMode.HTML,
                                    reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Proceed to Quick Book", callback_data="start")]]))       
    return BOOKING_DATE_TIME 

    

async def booking_options_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    '''Provide slots for user to select booking slot.'''
    query = update.callback_query
    await query.answer()

    action = query.data

    if action == "start":
        print("started booking")
        context.user_data["page"] = 0
        await show_option(AVAILABLE_SLOTS, update, context)
    
    elif action == "next":
        context.user_data["page"] += 1
        await show_option(AVAILABLE_SLOTS, update, context)
        return BOOKING_DATE_TIME

    elif action == "prev":
        context.user_data["page"] -= 1
        await show_option(AVAILABLE_SLOTS, update, context)
        return BOOKING_DATE_TIME
    
    elif "|" in action:
        await query.answer()
        appt_id, datetime_str, doctor_name = query.data.split('|')
        context.user_data["book_appt_id"] = appt_id

        options = [
            [InlineKeyboardButton("Select Other Slot", callback_data="select again")],
            [InlineKeyboardButton("Confirm Booking", callback_data=f"{datetime_str}|{doctor_name}")]
        ]
        await query.edit_message_text(f"Great! You've chosen: \n\nDate & Time: \n{datetime_str}\n<i>* With Dr. {doctor_name}</i>\n\nPlease confirm your booking, or go back to select another slot:",
                                      parse_mode=ParseMode.HTML,
                                      reply_markup=InlineKeyboardMarkup(options))
        return BOOKING_CONFIRM
    
async def booking_confirm_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "select again":
        context.user_data["page"] = 0
        await show_option(AVAILABLE_SLOTS, update, context)
        return BOOKING_DATE_TIME
    

    appt_id = context.user_data["book_appt_id"]
    datetime_str, doctor_name = query.data.split('|')
    
    # User confirmed choice of slot
    await query.message.reply_text("Please wait while we process your booking...")
    data = {
        "appointment_id": int(appt_id),
        "patient_id": context.user_data["patient_id"]
    }
    try:
        res = await update_to_api(data, PUT_BOOK_APPOINTMENT_URL + appt_id)
        if res:
            await query.message.reply_text(f"Appointment has been successfully scheduled with the clinic!\n\nYour appointment details are confirmed below:\n\nDate & Time: \n<b>{datetime_str}</b>\n<i>With Dr. {doctor_name}</i>",
                                           parse_mode=ParseMode.HTML)
            return ConversationHandler.END
    except:
        print("Error in creating booking")
    
    # If error returned when updating booking
    await query.message.reply_text("Hmm... something went wrong when trying to book your appointment. Please click to retry:",
                                        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Re-confirm", callback_data="done")]]))
    return BOOKING_CONFIRM

