GET_ALL_DOCTORS_URL="/doctors/getall/"
GET_DOCTOR_BY_ID_URL="/doctors/get/" # concatenate doctor id
POST_CREATE_DOCTOR_URL="/doctors/create/" 

GET_ALL_PATIENTS_URL="/patients/getall/"
GET_PATIENT_BY_ID_URL="/patients/get/" # concatenate patient id
POST_CREATE_PATIENT_URL="/patients/create/"
GET_PATIENT_FIND_BY_TELEGRAM_URL="/patients/findby/" # concatenate tele username as string, no @

POST_CREATE_APPOINTMENT_URL="/appointments/create/"
GET_ALL_APPOINTMENTS_URL="/appointments/all/"
GET_APPOINTMENT_BY_ID_URL="/appointments/" # concatenate appt id
GET_APPOINTMENT_BY_PATIENT_ID_URL="/appointments/patient/"
GET_APPOINTMENT_BY_DOCTOR_ID_URL="/appointments/doctor/"
PUT_UPDATE_APPOINTMENT_URL="/appointments/" # concatenate appt_id, api_helper.py adds /update/ after

POST_CREATE_CONVERSATION_URL="/conversations/"
GET_ALL_CONVERSATIONS_URL="/conversations/getall/"
GET_CONVERSATION_MSG_BY_ID_URL="/conversations/" # concatenate msg_id
DELETE_CONVERSATION_MSG_BY_ID_URL="/conversations/" # concatenate msg_id
GET_CONVERSATIONS_BY_PATIENT_URL="/conversations/patient/" # concatenate patient id

POST_CREATE_SURVEY_RESPONSE_URL="/survey_responses/"
GET_ALL_SURVEY_RESPONSES_URL="/survey_responses/getall/"
GET_SURVEY_RESPONSE_BY_ID_URL="/survey_responses/" # concatenate survey id
DELETE_SURVEY_RESPONSE_BY_ID_URL="/survey_responses/" # concatenate survey id
GET_SURVEY_RESPONSES_BY_PATIENT_ID_URL="/survey_responses/patient/" # concatenate patient id

