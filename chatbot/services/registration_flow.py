from utils.states import *
from services.api_helper import *
from utils.API_PATHS import *

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
)

async def registration_start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Start the conversation, display any stored data and ask user for input."""
    print("in reg start")

    reply_text = '''
    Let's get started! \nWould you like to use your Singpass (for SG Citizens), or register manually?
    '''
    options = [
        [
            InlineKeyboardButton("Singpass (Not Developed)", callback_data="singpass"),
            InlineKeyboardButton("Manual", callback_data="manual")
        ]
    ]
    await update.message.reply_text(
        reply_text,
        reply_markup=InlineKeyboardMarkup(options))
    return REG_REDIRECT


async def registration_redirect_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle button clicks for registration options."""
    query = update.callback_query
    await query.answer()  # Acknowledge button press

    print("query received", query.data)  

    if query.data == "manual":
        await query.message.reply_text("You've chosen: Manual Registration.\n\nFirst of all, please enter your full name:")
        return REG_NAME 

    elif query.data == "singpass":
        await query.message.reply_text("You've chosen: Register with Singpass. \n\nPlease click the button below to proceed to Singpass registration:", 
                                       reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Register with Singpass", callback_data="none")]]))
        return REG_SINGPASS
    
#################### TEMP: SINGPASS HANDLING #####################

async def registration_singpass_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    await query.message.reply_text("[DEV]: Sorry! We're not able to demonstrate this feature as it requires us to be a legally-recognised business entity to use Singpass. \n\nHowever, as this is a prototype, please feel free to explore our manual registration flow!",
                                   reply_markup=InlineKeyboardMarkup(
                                       [[InlineKeyboardButton("Click to try our Manual Registration flow!", callback_data="manual")]]
                                       ))
    return REG_REDIRECT


############## MANUAL REGISTRATION HANDLER FUNCTIONS ################

async def registration_name_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    '''Registration handling after user enters full name.'''

    print("in manual start")

    context.user_data["name"] = update.message.text.title()
    print("user's new name", context.user_data["name"])

    await update.message.reply_text("Great! Please enter your email address:")
    return REG_EMAIL

async def registration_email_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    '''Registration handling after user inputs their email address, including valid email address validation.'''
    user_res = update.message.text

    if "@" not in user_res or "." not in user_res[user_res.index("@") + 1:]:
        await update.message.reply_text("Oops! Seems like you didn't put in a valid email address format - let's try that again!\n\nPlease enter your email address:")
        return REG_EMAIL
    
    context.user_data["email"] = user_res

    await update.message.reply_text("Noted! Lastly, please enter your mobile phone number: (without the +65)")
    return REG_PHONE

async def registration_phonenumber_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    '''Registration handling after user inputs their phone number, including valid phone number validation.'''
    user_res = update.message.text

    if len(user_res) < 8:
        await update.message.reply_text("Your phone number might be missing some digits, please re-enter:")
        return REG_PHONE
    if len(user_res) > 8:
        await update.message.reply_text("You may have accidentally clicked some numbers, or included the +65. Please try again, and remember to not include the +65:")
        return REG_PHONE
    if "6" == user_res[0]:
        await update.message.reply_text("Oh, seems like you entered a home number - we only accept valid Singapore mobile numbers! \n\nPlease re-enter your mobile phone number:")
        return REG_PHONE

    context.user_data["phone_number"] = user_res
    await update.message.reply_text("All right! Lastly: do you have any prior injuries/medical history/chronic conditions that the doctor should know about?\n\nPlease be detailed, and be honest! We promise to keep your information private and confidential - only your assigned doctor will be reading this.")
    return REG_REMARKS


async def registration_remarks_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["remarks"] = update.message.text

    # Confirming details -- to be added to last step of registration process
    options = [
        [
            InlineKeyboardButton("Go back and edit", callback_data="edit"),
            InlineKeyboardButton("Done", callback_data="done")
        ]
    ]
    user_name = context.user_data["name"]
    user_email = context.user_data["email"]
    user_phone = context.user_data["phone_number"]
    user_remarks = context.user_data["remarks"]
    # user_data = 
    
    await update.message.reply_text(
        f"You've entered \n\nName: {user_name} \nEmail: {user_email} \nMobile No.: {user_phone}\n\nYour remarks: {user_remarks}\n\nIs this correct?",
        reply_markup=InlineKeyboardMarkup(options))
    return REG_CONFIRM

async def registration_confirmation_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    if query.data == "done":
        data = {
            "full_name": context.user_data["name"],
            "mobile_no": context.user_data["phone_number"],
            "email": context.user_data["email"],
            "doctor_assigned": "1",
            "other_remarks": context.user_data["remarks"],
            "telegram_username": query.from_user["username"]
        }
        try:
            await query.message.reply_text("Please wait while we register your details...")
            res = await create_to_api(data, POST_CREATE_PATIENT_URL)
            if res:
                await query.message.reply_text("Registration was successful - details have been shared with the doctor assigned to your appointment!")
                return ConversationHandler.END
        except:
            print("Error in creating patient")
        
        await query.message.reply_text("Hmm... something went wrong when trying to register you. Please click to retry:",
                                           reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Re-confirm", callback_data="done")]]))
        return REG_CONFIRM
    
    options = [
        [
            InlineKeyboardButton("Name", callback_data="name"),
            InlineKeyboardButton("Email", callback_data="email"),
            InlineKeyboardButton("Phone number", callback_data="number"),
            InlineKeyboardButton("My remarks", callback_data="remarks"),
        ]
    ]
    await query.message.reply_text(
        "Which step would you like to restart from? \n(Note: all details after that point have to be re-entered.)",
        reply_markup=InlineKeyboardMarkup(options)
        # check if this would be better as a ReplyKeyboardMarkup
        )
    return REG_EDIT
    

async def registration_edit_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Handle edit button clicks and redirect to the appropriate state."""
    query = update.callback_query
    await query.answer()
    print("user editing", query.data)  

    match query.data:
        case "name":
            await query.message.reply_text("Please enter your new name:")
            return REG_NAME
        case "email":
            await query.message.reply_text("Please enter your new email:")
            return REG_EMAIL
        case "number":
            await query.message.reply_text("Please enter your new phone number:")
            return REG_PHONE
        case "remarks":
            await query.message.reply_text("Please re-enter your remarks:")
            return REG_REMARKS

    await query.message.reply_text("Input is invalid, please select and try again")
    return REG_CONFIRM  # Stay on the confirmation page if the input is invalid
