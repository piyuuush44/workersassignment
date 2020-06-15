Technologies used-> Nodejs for backend , Rabbitmq for queueing, mongo db as db storage, elastic search for logging storage

Step 1->

Please cd into directory/server/bin/local
sudo bash start.sh -> to run the backend server that will spin up mongodb, rabbitmq, elastic search, nodejs container
after all these container are running successfully
---------------------------------------------------------------------------------------------------------------
Step 2->

cd into directory/server/worker/bin -> from a new terminal
and run sudo bash start.sh -> it will run worker project that listein to rabbit queue and send email and update the status
in elastic search and mongodb.
--------------------------------------------------------------------------------------------------------------
Step 3->

to run the frontend part -> cd directory/client
and run npm start 
and open localhost:4200 in the browser and add tasks there to send email.
