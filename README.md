# Our Submission for NUS HealthHack 2025 - Komorebi+

## About Komorebi+
* Targeting the hackathon theme of Value-Based Healthcare

Komorebi+ is an AI-powered patient engagement platform designed for specialized clinics, including TCM, oncology, and geriatric care. By automating referral processing and enabling personalized, chat-based patient communication (via Telegram and other platforms), we reduce clinic administrative workload by up to 40%. More than just scheduling and record-keeping, Komorebi+ enhances patient outcomes through continuous post-treatment support—bridging the gap between operational efficiency and value-based healthcare.

[Watch our pitch video and prototype demonstration here!](https://www.youtube.com/watch?v=6OCESbkUncI)

### 1. Meet Komo!
Komo is our friendly chatbot partnered to the Komorebi+ system. Through Komo, we aim to make healthcare simple and accessible, no extra app needed. Patients can register, book appointments, and freely chat about their treatment progress or any worries. Details shared seamlessly with their doctors through our platform as Komo shares the common backend. 

Powered by Gemini and Intersystems IRIS Vector Search, Komo provides personalised advice, follow-ups, and medication reminders for a smooth and holistic care experience.

*Note: for the Intersystems judging team, you may find our use of IRIS Vector Search in the following (but not limited to) these main files :*
* ```backend > services > iris_vector_search.py``` (backend IRIS service)
* ```backend > api > routes > chatbot_insights.py``` (vector search API routing)
* ```chatbot > services > gemini_response.py``` (implementation in chatbot)
*We tested this feature using a local IRIS container, using the footage to film our prototype videos.*

### 2. Komorebi+ Web Portal
[Note: this is currently still a frontend prototype and has yet to be publicly hosted.]

