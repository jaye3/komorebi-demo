cd frontend

<!-- to install packages: -->

npm install --legacy-peer-deps


<!-- If you encounter an ERESOLVE error, try -->
npm cache clean --force
npm install --legacy-peer-deps



<!-- start dev server: -->
npm run dev



<!-- 🔧 Common Issues & Troubleshooting
1️⃣ Hydration Mismatch Errors
Error:
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.

Fix:

Disable Grammarly or other browser extensions that might inject elements. -->