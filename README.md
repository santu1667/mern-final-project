backend :

## Start Node API Server:(backend folder)

1. Open power shell terminal and navigate to folder where backend/Shopping 24x7 code is present
   (Example :D:\Learning\mern-final-project\mern-final-project\backend\shopping24x7 )
2. Run the command npm start or npm run dev to start the API server
3. Test through Postman to check API's are working or not
4. Check the lms-shopping24x7.postman_collection to check the API requests
5. Once confirmed the API is up and running , follow the below steps to run the front end application.

backend folder consists of below things
a) node API code (shopping24x7 folder)
b) postman request collection.(lms-shopping24x7.postman_collection.json)
c) Document which had all information about the API’s created with request and response in the project .MERN Final Project - API's.docx
Base Request URL for Node Project : http://localhost:8080/api/v1/{Url}

frontend:

## Start React server:(frontend folder)

1. Open powershell terminal and navigate to frontend/shopping24x7 folder
   (Example : D:\Learning\mern-final-project\mern-final-project\frontend\shopping24x7)
2. check if node_modules folder is present or not.If not present perform step 3 else go to step 4
3. Run the command npm install --force to install the required modules. (Run npm
   install --legacy-peer-deps in case of any further issues)
4. Once the required modules installed start the react server by running the command
   npm start
5. Hit the URL http://localhost:4200/ to navigate to Application.

Front end URL: http://localhost:4200/

frontend folder has shopping24x7 folder which consists of react code

For the front end please login with below details to check the application flow.

Admin User:

user :santosh@gmail.com
pwd:testpassword

Regular User:

user:test@gmail.com
pwd:testpassword

UI Screenshots & Videos folder :

This folder had 4 internal folders as below.

1. Guest User
2. Admin,
3. User
4. New User.
   Each of above folder consists of 3 things
   a) images folder
   b) video file to show the application flow for each of the above scenario
   c) docx file that explains the flow

Mongo DB Collection folder
has the json and csv files for the exported collection data from database lms-shopping-cart
Had data for below 3 collections
users
products
orders
