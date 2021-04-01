## MongoDB Setup

To build development MongoDB server, you need to install `docker-compose` ( If you have `Docker Desktop`, it is pre-installed.)

Then, you can build development DB as 

`docker-compose up --build -V -d`

MongoDB listens port `:27018`

You can check collections via ready-to-use interface that listens `:8081`


## Run Server

`npm run dev`

Server listens on `:3000`