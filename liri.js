require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
// var terminalLink = require('terminal-link');

var spotify = new Spotify(keys.spotify);
//create a variable for the request text
var request = process.argv[2];
// input is the specifics that follows the request... song name, band name, movie name, etc.
var input = process.argv;
// create an empty array to be pushed into
var inputArray = [];
//all items after index 2 in the process.argv array need pushed into the inputArray
for(var i = 3; i < input.length; i++) {
    inputArray.push(input[i]);
};

var queryURL = "https://rest.bandsintown.com/artists/" + inputArray.join('') + "/events?app_id=codingbootcamp&date=upcoming"

//store the search requirements into one variable
var spotifyOptions = {
    type: 'track',
    query: inputArray,
    limit: 1
}
//if the request from the user starts with this string run the spotify API to retrieve info about that song
if (request === "spotify-this-song") {
    console.log("Searching for information on your song \n")

    spotify
        .search(spotifyOptions)
        .then(function (response) {
            //assign variable to different parts of the response
            var artistName = response.tracks.items[0].artists[0].name;
            var songTitle = response.tracks.items[0].name;
            var link = response.tracks.items[0].preview_url;
            var album = response.tracks.items[0].album.name;
            //when a song doesn't have a preview make that clear to the user
            if(link === null) {
                link = "No Preview Available";
            }
            // console.log(JSON.stringify(response.tracks.items[0].album.name, null, 2));
            //cleanly layout the console.log for the user
            console.log("Artist Name: " + artistName + "\n" +
                "\nSong Title: " + songTitle + "\n" +
                "\nAlbum: " + album + "\n" +
                "\nPreview: " + link);

        })
        .catch(function (err) {
            console.log(err);
        });
}else if (request === "concert-this") {
    //notify the program is searching for info
    console.log("Looking for concerts performed by this band..." + "\n")
    // console.log(queryURL);
    axios.get(queryURL).then(
        function (response) {
            //organize response data into variables
            var venueCity = response.data[0].venue.city;
            var venueRegion = response.data[0].venue.region;
            var venueName = response.data[0].venue.name;
            //format the time to MM/DD/YYYY
            var eventDate = moment(response.data[0].datetime).format("MM/DD/YYYY");
            // console.log(response);
            //write to the terminal an organzied list of concert information
            console.log("Venue: " + venueName + "\n" + 
            "\nLocation: " + venueCity + ", " + venueRegion + "\n" + 
            "\nDate of Event: " + eventDate);
        }
    )
}else if(request === "movie-this") {
    //write OMDB code


}else {
    //if the user types the command wrong remind them about this text to initialize a spotify search
    console.log("If looking for a song, enter 'spotify-this-song' before the song title." + 
                "\nIf looking for concert locations for your favorite band then enter 'concert-this' before your band name." + 
                "\nIf looking for info on your favorite movie enter 'movie-this' before the name of the movie." + 
                "\nIf you want it that way enter 'do-what-it-says' and press enter.");
};
















