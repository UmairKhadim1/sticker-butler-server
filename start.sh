#/bin/bash
echo "Starting Mongo Db  --Evergreen "
sudo service mongod start 
echo "Starting Server --Evergreen "
nodemon --exec ts-node src/app.ts
