from utils.states import *
from services.api_helper import *
from utils.API_PATHS import *
from datetime import datetime

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ContextTypes
)
from services.api_helper import get_from_api

############ HELPER FUNCTIONS ###################

async def get_available_appointments_in_groups(group_size = 4):
    res = await get_from_api({}, GET_AVAILABLE_APPOINTMENTS_URL)

    final_list = []
    temp = []
    for appt in res:
        temp.append(appt)

        if len(temp) == group_size:
            final_list.append(temp)
            temp = []
    if temp:
        final_list.append(temp)
    
    if final_list:
        return final_list
    
    return None

###############

async def show_option(AVAILABLE_SLOTS, update: Update, context: ContextTypes.DEFAULT_TYPE):
    page = context.user_data.get("page", 0)
    print("BOOKING: user current page", page)
    total_pages = len(AVAILABLE_SLOTS)
    print("BOOKING: total pages:", total_pages)

    # Make sure page index stays within bounds
    page = max(0, min(page, total_pages - 1))
    context.user_data["page"] = page

    # Get the slots for the current page (already a list of appointments)
    current_slots = AVAILABLE_SLOTS[page]

    # Generate buttons for each appointment slot in the current page
    slot_buttons = []
    for slot in current_slots:
        datetime_str = slot['date_time']
        datetime_format = datetime.fromisoformat(datetime_str).strftime('%a, %d %b, %H:%M')
        doctor_name = slot["doctor"]["full_name"]
        slot_label = f"{datetime_format} - Dr. {doctor_name}"   
        slot_buttons.append([InlineKeyboardButton(slot_label, callback_data=f"{slot['id']}|{datetime_format}|{doctor_name}")])

    # Navigation buttons
    nav_buttons = []
    if page > 0:
        nav_buttons.append(InlineKeyboardButton("⬅️ Prev", callback_data="prev"))
    if page < total_pages - 1:
        nav_buttons.append(InlineKeyboardButton("Next ➡️", callback_data="next"))
    if nav_buttons:
        slot_buttons.append(nav_buttons)

    reply_markup = InlineKeyboardMarkup(slot_buttons)

    ######

    query = update.callback_query
    await query.answer()

    await query.edit_message_text(
        text=f"Select an appointment slot (Page {page + 1} of {total_pages}):",
        reply_markup=reply_markup
    )
    return BOOKING_DATE_TIME

#######################################################
