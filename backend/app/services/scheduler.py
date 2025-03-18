from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio
import os
from dotenv import load_dotenv
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from chatbot.app import app
load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("ADMIN_CHAT_ID")

# Create and configure the scheduler
scheduler = AsyncIOScheduler()

def start_scheduler():
    # Add scheduled jobs here
    # scheduler.add_job(
    #     medication_reminder,
    #     trigger='cron',
    #     minute='26',
    #     second='01' # Change this for prototyping!
    # )
    # scheduler.add_job(
    #     start_post_appt_survey_msg,
    #     trigger='cron',
    #     # day='fri',
    #     # hour='20',
    #     minute='25',
    #     second='01'
    # )
    
    # scheduler.start()
    # print("SCHEDULED: Scheduler started!")
    print("SCHEDULED: Scheduler not deployed for live bot")

##############

# Scheduled reminder for medication -- hardcoded for prototype
async def medication_reminder():
    print("SCHEDULED: Sending medication reminder")
    reminder = "🧴 Hey Moon, time for your prescribed steroid cream! \nRemember to apply a thin layer to the affected areas after moisturizing ☀️"

    await app.bot.send_message(chat_id=CHAT_ID, 
                           text=reminder,
                           reply_markup=InlineKeyboardMarkup([[
                               InlineKeyboardButton("Done!", callback_data=f"reminder_task_done")
                               ]]))

# Scheduled survey for post-treatment evaluation
async def start_post_appt_survey_msg():
    print("SCHEDULED: Sending post appt survey")
    text = "👋 Hey Moon, just checking in! How have you been feeling since to your last visit?"

    msg = await app.bot.send_message(chat_id=CHAT_ID, 
                           text=text,
                           reply_markup=InlineKeyboardMarkup([
                               [InlineKeyboardButton("Better", callback_data="start_post_survey|better")],
                               [InlineKeyboardButton("About the same", callback_data="start_post_survey|same")],
                               [InlineKeyboardButton("Worse...", callback_data="start_post_survey|worse")]
                               ]))
    
    