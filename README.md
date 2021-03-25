To build development MongoDB server, you need to install `docker-compose` ( If you have `Docker Desktop`, it is pre-installed.)

Then, you can build development DB as 

`docker-compose up --build -V -d`

MongoDB listens port `:27017`

You can check collections via read-to-use interface that listens `:8081`