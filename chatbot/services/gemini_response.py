import google.generativeai as genai
import os
from dotenv import load_dotenv
import time
import logging

load_dotenv()

# quotes = [
#     "Good morning! Every new day is a fresh start. Take a deep breath, set a small goal, and be kind to yourself today. 💛",
#     "You've overcome so much already—don't forget to celebrate your progress, no matter how small! Keep going, one step at a time. ",
#     "Your health is a journey, not a race. Be patient with yourself, trust the process, and remember—you're doing your best, and that's enough. 💕",
#     "Some days feel heavier than others, and that's okay. Give yourself permission to rest, breathe, and try again tomorrow. You are not alone. 💙",
#     "Healing — whether physical or emotional—takes time. Be gentle with yourself, and remember that small steps forward still count. 💕"
# ]

clinic_info = '''
Client is a Dermatology Clinic (Name: Derma Care)\n
-Size: Small to mid-sized (≤500 active patients)\n
-Location: Urban/suburban area, catering to professionals and skincare-conscious individuals.
'''

##########

 # Key Authentication
genai.configure(api_key=os.getenv("GEMINI_TEST_API")) 

# # Defining model to use
model = genai.GenerativeModel('gemini-2.0-flash')

def gemini_response(message):
    logging.getLogger('tornado.access').disabled = True

    global clinic_info

    prompt = f'''You are a medical assistant of a specialist clinic that looks after your clients' wellbeing over text.
            Give a text message response of 25 words or less, sent as a single or 2 separated line.
            Do not enclose your response in quotation marks.
            Follow the context of the message, infer the emotion of the client, and send an appropriate message with helpful tips based on this clinic profile: {clinic_info}.
            Maintain a warm and helpful tone, and use miniminal colloquial Singlish only where appropriate (i.e. when user is showing positive casual sentiment). Be empathetic and do not repeat yourself from previous prompts.
            The client's message is: '''

    try:
        response = model.generate_content(prompt + message)
        print("MODEL res", response.text)
        time.sleep(3)
        return response.text
    except:
        return "Error"
    


    