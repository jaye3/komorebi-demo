import google.generativeai as genai
import os
from dotenv import load_dotenv
import time
import logging
import re
import ast
from sqlalchemy.orm import Session

load_dotenv()

##########
# from api.crud.patient_conversation import get_conversations_by_patient

# TO-DO: setup connection to DB for get_conversations_by_patient()

# Test data while DB is being setup
def get_conversations_by_patient(patient_id: int):
    return [
        "Hey komo I'm feeling worried... I feel like my acne's been getting worse..",
        "Yea its just been crazy flareups, and some of them r like hard pimples so it hurts too,..",
        "I've tried ice... but it feels temporary",
        "mm yea I have my steroid cream, but I feel like it's not been super helpful and i'm skeptical abt steroid coz i don't like them",
        "mm ok i'll try, thanks"
        ]

###########

 # Model setup
genai.configure(api_key=os.getenv("GEMINI_TEST_API")) 
model = genai.GenerativeModel('gemini-2.0-flash')

###########

# Helper Functions
def parse_response(res_text):
    match = re.search(r"\[.*\]", res_text, re.DOTALL)
    # print("MATCH", match)

    if match:
        parsed_list = ast.literal_eval(match.group(0))  
        return parsed_list
    
    raise ValueError(f"Regex failed to parse expected data from: {res_text}")

###########

# Functions
def get_patient_risk_alert(patient_id: int):
    """Retrieves patient risk alert 3-point bullet summary for insight gathering based on patient's chatbot conversations."""
    
    logging.getLogger('tornado.access').disabled = True
    logging.getLogger('absl').setLevel(logging.ERROR)    
    
    global model

    convo_array = get_conversations_by_patient(patient_id)

    prompt = f'''
            Based on these messages from the patient: {convo_array}, 
            generate a Patient Risk Alert 3-bullet summary (assessed by appointment no-show rate, patient conversation sentiments, and potential consequences based on such behaviour) for their doctor's reference.
            Keep each bullet to maximum of 20 words. 
            Return this as a python array of strings of strictly length 3, with each bullet being its own string in the array. Remove any markdown syntax and newline characters.
            Example format:
            ["string1", "string2", "string3"]
            '''

    try:
        response = model.generate_content(prompt)
        # print("MODEL insights res", response.text)
        time.sleep(3)
        res = parse_response(response)
        return res
    except:
        raise ValueError("Gemini response is empty or missing.")
    
def get_suggested_actions(patient_id: int):
    """Retrieves 3-point bullet summary of Suggested Actions based on patient's chatbot conversations."""

    logging.getLogger('tornado.access').disabled = True
    logging.getLogger('absl').setLevel(logging.ERROR)    
    
    global model

    convo_array = get_conversations_by_patient(patient_id)

    prompt = f'''
            Based on these messages from the patient: {convo_array}, 
            generate a Suggested Actions 3-point bullet summary for next steps to improve the patient's behaviour for their doctor's reference.
            Keep each bullet to maximum of 20 words. 
            Return this as a python array of strings of strictly length 3, with each bullet being its own string in the array. Remove any markdown syntax and newline characters.
            Example format:
            ["string1", "string2", "string3"]
            '''
        
    try:
        response = model.generate_content(prompt)
        # print("MODEL insights res", response.text)
        time.sleep(3)
        res = parse_response(response)
        return res
    except:
        raise ValueError("Gemini response is empty or missing.")

def get_patient_reported_outcomes(patient_id: int):
    """Retrieves 3-point bullet summary of Patient Reported Outcomes based on potential consequences inferred from patient's behaviour through their chatbot conversations."""

    logging.getLogger('tornado.access').disabled = True
    logging.getLogger('absl').setLevel(logging.ERROR)

    global model

    convo_array = get_conversations_by_patient(patient_id)

    prompt = f'''
            Based on these messages from the patient: {convo_array}, 
            generate a Patient Reported Outcomes 3-point bulleted summary (assessing pain score from a scale of 1-10 with 10 being most painful, quality of life improvement, and any reported (strictly medical) medication side effects) based on the conversations for their doctor's reference.            
            Keep each bullet to maximum of 20 words.
            Return this as a python array of strings of strictly length 3, with each bullet being its own string in the array. Remove any markdown syntax and newline characters.
            Example format:
            ["string1", "string2", "string3"]
            '''

    try:
        response = model.generate_content(prompt)
        # print("MODEL insights res", response.text)
        time.sleep(3)
        res = parse_response(response)
        return res
    except:
        raise ValueError("Gemini response is empty or missing.")

if __name__ == "__main__":
    res = [
        get_patient_risk_alert(1),
        get_suggested_actions(1),
        get_patient_reported_outcomes(1)
    ]
    for item in res:
        match = re.search(r"\[.*\]", item, re.DOTALL)
        # print("MATCH", match)

        if match:
            parsed_list = ast.literal_eval(match.group(0))  
            print("OUT", parsed_list)

    