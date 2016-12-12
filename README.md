# Final Project: Hike Buddy
# A site that allows you to search for hikes and find users interested in the same hikes as you!

## Find it on AWS EC2 [here!](http://ec2-54-209-14-215.compute-1.amazonaws.com:5000/#/project/home)
## [GitHub Repo:](https://github.com/nguyenvyl/nguyen-vy-webdev)
## [Personal Home Page:](http://ec2-54-209-14-215.compute-1.amazonaws.com:3000/#/home)

### Overview
Hike Buddy was created to allow users to:
+ Search for hikes in the US and Canada based
+ Save hikes in their own list of favorites
+ See other users interested in the same hikes
+ View other user's profiles and contact them via email

### Implementation
This website runs on the [MEAN stack](http://mean.io/), aka: 
+ [MongoDB](https://docs.mongodb.com/)
+ [Express](http://expressjs.com/)
+ [Angular](https://angular.io/)
+ [Node](https://nodejs.org/en/)

Other implementation features:
+ [Mongoose](http://mongoosejs.com/) to control Mongo queries and schemas. 
+ [Bootstrap](https://getbootstrap.com/) to create responsive page layouts and navigation bars. (Try resizing the window!)
+ [Font Awesome](http://fontawesome.io/) for handy, scalable vector icons
+ Angular $http and [q](https://github.com/kriskowal/q) for promises and async calls
+ [PassportJS](http://passportjs.org/) for login and logout session control, including Facebook Login
+ [Unirest](http://unirest.io/) for 3rd-party HTTP requests
+ [Multer](https://github.com/expressjs/multer) for image uploads

### Third-Party Calls
Hike Buddy relies on the [Trails API](https://market.mashape.com/trailapi/trailapi) for its information. Users are able to search the Trails API database by country, state, city, and outdoor activity type. They're also able to control the search radius of their query. 

If a user decides to save a trail to their favorites, they can view the trail's weather via [DarkSky](https://darksky.net) and the trail location via [Google Maps Embed](https://developers.google.com/maps/documentation/embed/). 


### Suggested Demo Instructions 

I've put in some test users and data so you can see the full functionality of the site.

After registering for an account, try searching with the parameters Canada + Newfoundland & Labrador.
Add one of the trails that comes up. 

Then, go to your list of favorites and view one of the trails. You'll be able to see other users who have also favorited that trail, and even view their profile!

When you view their profile, you can shoot them an email asking if they'd like to go hiking. (This will open your computer's native email client.)

Enjoy!

