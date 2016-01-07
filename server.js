/**
 * Created by kevin gosse on 07/01/2016.
 */

var express = require('express');
var faker = require('faker');

var app = express();

app.get('/random-user', function(req, res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.listen(3000, ()=>console.log('App listening on localhost:3000'));
