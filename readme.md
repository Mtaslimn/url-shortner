# this is url shortner backend project .

# first come to the directory of this project -- cd url-shortner 

# then run the npm command -- npm start

# when everything is working perfectly then go to postman.

# create 3 request 

# (1st) POST http://localhost:8001/url to enter a url 

# in it select raw and then json and in the body enter the url in {"url": "your url"} this format . y'll get the unique id 

# (2nd) GET http://localhost:8001/"your generated unique id" and then click Send . select preview to see it .

# (3rd) GET http://localhost:8001/url/analytics/"your generated unique id" and then click Send. See the Analytics, like how many time url is clicked and when it is clicked.

# check database : open cmd enter command -- mongosh

# enter command -- show dbs -- to get all database and the select the choosen database by cmd -- use 'database name'

# enter this command to check all the data -- db.urls.find({})