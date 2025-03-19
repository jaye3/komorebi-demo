# Our Submission for NUS HealthHack 2025 - Komorebi+

## About Komorebi+
* Targeting the hackathon theme of Value-Based Healthcare

Komorebi+ is an AI-powered patient engagement platform designed for specialized clinics, including TCM, oncology, and geriatric care. The name "Komorebi" (木漏れ日) is a Japanese word that describes the sunlight filtering through trees - representing our goal to bring clarity and warmth to healthcare management. By automating referral processing and enabling personalized, chat-based patient communication (via Telegram and other platforms), we reduce clinic administrative workload by up to 40%. More than just scheduling and record-keeping, Komorebi+ enhances patient outcomes through continuous post-treatment support—bridging the gap between operational efficiency and value-based healthcare.

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
Komorebi+ Web Portal serves as comprehensive solution for healthcare professionals to:
- Manage patient records and medical histories
- Schedule and track appointments
- Monitor patient engagement and progress through Komo's chat logs
- Access AI-generated summaries, sentiment analytics and insights of patient interaction for data-driven decision-making


#### Features:
- **Dashboard**: Get a quick overview of daily operaions, patient statistics and doctor availability
- **Patient Management**: View patient records, medical history, and treatment plans
- **Appointment Scheduling**: Dual calendar and list views for scheduling and managing appointments with doctors 
- **Komo Insights**: AI-generated summaries, sentiment analytics, and insights of patient interaction for data

#### Development Status
⚠️ **Note: This application is currently under development and is not yet ready for production use.**

This is a prototype version of the Komorebi Patient Management System. While the interface is functional, it is not yet connected to a backend database or authentication system. The data displayed is simulated for demonstration purposes.

#### Technology

Built with Next.js, React, and Tailwind CSS, featuring a clean, accessible interface designed for healthcare professionals.

#### Next Steps

- Integration with backend services and databases
- Implementation of user authentication and role-based access
- Expanded reporting and AI capabilities

**To run the frontend**

cd frontend

**To install packages**

npm install --legacy-peer-deps

**If you encounter an ERESOLVE error, try**

npm cache clean --force
npm install --legacy-peer-deps

**Start dev server**

npm run dev



🔧 Common Issues & Troubleshooting
1️⃣ Hydration Mismatch Errors
Error:
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.

Fix:

Disable Grammarly or other browser extensions that might inject elements.

