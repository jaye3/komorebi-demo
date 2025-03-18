import google.generativeai as genai
import os
from dotenv import load_dotenv
import time
import logging
from services.api_helper import get_from_api
from utils.API_PATHS import *

load_dotenv()

##########

 # Key Authentication
API_KEY = os.getenv("GEMINI_TEST_API")
genai.configure(api_key=API_KEY) 

# # Defining model to use
model = genai.GenerativeModel('gemini-2.0-flash')

async def gemini_response(message, patient_id):
    logging.getLogger('tornado.access').disabled = True
    context = await get_from_api(
        data={},
        api_path=GET_INSIGHTS_QUERY_CONTEXT_URL + message
    )
    past_conversation_data = await get_from_api(
        data={},
        api_path=GET_RECENT_CONVERSATIONS_BY_PATIENT_URL + str(patient_id)
    )

    past_conversation = [msg["raw_message"] for msg in past_conversation_data]

    prompt = f'''You are a medical assistant of a specialist clinic that looks after your clients' wellbeing over text.
            Give a text message response of 25 words or less, sent as a single or 2 separated line.
            Do not enclose your response in quotation marks. 
            Strictly only in the case of medical emergency, tell user to call 995 for ambulance; in the case of mental health or suicide risk, tell user to call 1767 for Samaritans of Singapore - you cannot call on behalf of the patient.
            Follow the context of the message, infer the emotion of the client, and send an appropriate message with helpful tips based on this relevant context information: {context}.
            Maintain a warm and helpful tone, and use miniminal colloquial Singlish only where appropriate (i.e. when user is showing positive casual sentiment). Be empathetic and do not repeat yourself from previous conversation, stated here: {past_conversation}.
            No need to greet the client with 'Hi' or 'Hey'. If the client greets you, greet them back - treat this as a start of a new conversation and ignore previous conversation messages.
            The client's message is: '''

    try:
        response = model.generate_content(prompt + message)
        print("MODEL res", response.text)
        time.sleep(2)
        return response.text
    except:
        return "Error"
    


    