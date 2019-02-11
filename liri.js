//set up programs with the require methods
require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);


//create a variable for the request text
var request = process.argv[2];
// input is the specifics that follows the request... song name, band name, movie name, etc.
var input = process.argv;
// create an empty array to be pushed into
var inputArray = [];


//all items after index 2 in the process.argv array need pushed into the inputArray
for (var i = 3; i < input.length; i++) {
    inputArray.push(input[i]);
};

//make a function to make a random command to the terminal
function randomCommand() {
    var commandArray = ["spotify-this-song", "concert-this", "movie-this"];
    var x = Math.floor(Math.random() * Math.floor(3));
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        var dataArr = data.split(",");
        request = dataArr[0];
        input = dataArr[1];
        inputArray = input.split(" ");
        console.log(inputArray);
        if (request === commandArray[0]) {
            spotifyThis();
        } else if (request === commandArray[1]) {
            concertThis();
        } else if (request === commandArray[2]) {
            movieThis();
        }
    });
};

//store SPOTIFY API into a function
function spotifyThis() {
    var spotifyOptions = {
        type: 'track',
        query: inputArray,
        limit: 1
    };
    console.log("\n-------------------------------------");
    console.log("Searching for information on your song.");
    console.log("-------------------------------------\n");
    spotify
        .search(spotifyOptions)
        .then(function (response) {
            //assign a base variable to simplify the response
            var song = response.tracks.items[0];
            //assign variable to different parts of the response
            var artistName = song.artists[0].name;
            var songTitle = song.name;
            var link = song.preview_url;
            var album = song.album.name;
            //when a song doesn't have a preview make that clear to the user with a console log No Preview Available
            if (link === null) {
                link = "No Preview Available";
            }
            var songData = [
                "\n\nArtist Name: " + artistName,
                "Song Title: " + songTitle,
                "Album: " + album,
                "Preview: " + link
            ].join("\n\n");
            //cleanly layout the console.log for the user
            console.log(songData);
            fs.appendFile("log.txt", songData, function (err) {
                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        })
        //watch for error and if error throw an error message
        .catch(function (err) {
            console.log(err);
        });
};



//store Bands-in-Town API in a function 
function concertThis() {
    //notify the program is searching for info
    console.log("\n------------------------------------------------");
    console.log("Looking for concerts performed by this band.");
    console.log("------------------------------------------------\n");
    //make sure to join the array so the URL can be read
    axios.get("https://rest.bandsintown.com/artists/" + inputArray.join('') + "/events?app_id=codingbootcamp&date=upcoming").then(
        function (response) {
            //assign data location to a variable
            var eventData = response.data;
            //organize response data into variables
            for (i = 0; i < 3; i++) {
                var venueCity = eventData[i].venue.city;
                if (eventData[i].venue.region === !null) {
                    var venueRegion = eventData[i].venue.region;
                } else {
                    var venueRegion = eventData[i].venue.country;
                }
                var venueName = eventData[i].venue.name;
                var space = "\n\n\n";
                //format the time to MM/DD/YYYY
                var eventDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
                var concertData = [
                    "\n\nBand Name: " + inputArray.join(" "),
                    "Venue: " + venueName,
                    "Location: " + venueCity + ", " + venueRegion,
                    "Date of Event: " + eventDate + space + "\n"
                ].join("\n\n");
                // write to the terminal a"n organzied list of concert information
                console.log(concertData);
                fs.appendFile("log.txt", concertData, function (err) {
                    // If an error was experienced we will log it.
                    if (err) {
                        console.log(err);
                    }
                    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                    else {
                        console.log("Content Added!");
                    }
                });
            };
        }
        //watch for and throw error if it happens
    ).catch(function (err) {
        console.log(err);
    });
};


//store OMDB API into 
function movieThis() {
    var url = "http://www.omdbapi.com/?t=" + inputArray.join('&') + "&y=&plot=short&apikey=trilogy";
    //if the user did provide a movie name
    console.log("\n------------------------------------");
    console.log("Looking for info on that movie..." +
        "\n-------------------------\n");
    axios.get(url).then(
        function (response) {
            //store response data into var movie
            var movie = response.data;
            //write reponse data into a var moviedata neatly organized to be displayed in the terminal
            var movieData = [
                "\n\nTitle: " + movie.Title,
                "Release Year: " + movie.Year,
                "IMDB Rating: " + movie.imdbRating,
                "Rotten Tomatoes Rating: " + movie.Ratings[1].Value,
                "Country: " + movie.Country,
                "Language: " + movie.Language,
                "Plot: " + movie.Plot,
                "Actors: " + movie.Actors + "\n"
            ].join("\n\n");
            console.log(movieData);
            fs.appendFile("log.txt", movieData, function (err) {
                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        }
    ).catch(function (err) {
        console.log(err);
    });
}


/**Spotify API */
//if the request from the user starts with this string run the spotify API to retrieve info about that song
if (request === "spotify-this-song") {
    //check to make sure that inputArray is not empty
    if (inputArray.length < 1) {
        //if it is empty insert The Sign into the array
        //console.log to the user that they did not choose a song and you will choose one for them
        console.log("\n-------------------------------------");
        console.log("Looks like you did not choose a song\n" +
            "\nI'll choose one for you\n" +
            "\nHow about The Sign?\n" +
            "\nEver heard that one?.... Me either.");
        inputArray = ["The", "Sign"];
        //run the spotify api
        spotifyThis();
    } else {
        //if the inputarray is not empty then use its contents to run the spotify api
        spotifyThis();
    };


    /**Bands In Town API */
    //watch for concert-this command in the processargv[2] location of the command line
} else if (request === "concert-this") {
    //make sure the input array isn't empty
    if (inputArray.length < 1) {
        //talk to the user letting them know you are choosing a band for them
        console.log("\n-------------------------");
        console.log("You didn't choose a band!\n" +
            "\nI'll Choose a Band For You!\n" +
            "How about.... John Mayer" +
            "\n-------------------------\n");
        //assign John Mayer to the band name
        inputArray = ["John", "Mayer"];
        concertThis();
    } else {
        concertThis();
    };


    /**OMDB API */
} else if (request === "movie-this") {
    //check the array is not empty
    if (inputArray.length < 1) {
        //if it is fill it with Mr. Nobody
        inputArray = ["Mr.", "Nobody"];
        //talk to user to explain they did not pick a movie and tell them the movie you're choosing for them
        console.log("\n------------------------------");
        console.log("You forgot to choose a movie\n" +
            "\nWe will pick for you....\n" +
            "\nHow about... Mr. Nobody" +
            "\n-------------------------\n");
        movieThis();
    } else {
        movieThis();
    }


} else if (request === "do-what-it-says") {
    randomCommand();
}
else {
    //if the user types their search incorrectly remind them of the syntax to ask the program the specific question
    console.log("\nI'm sorry, you entered the command incorrectly please remember: \n" +
        "\n---------------------------------------------------------------------------" +
        "\nIf looking for a song, enter 'spotify-this-song' before the song title." +
        "\n-----------------------------------------------------------------------------------" +
        "\nIf looking for concert locations for your favorite band then enter 'concert-this' before your band name." +
        "\n-----------------------------------------------------------------------------------" +
        "\nIf looking for info on your favorite movie enter 'movie-this' before the name of the movie." +
        "\n-----------------------------------------------------------------------------------" +
        "\nIf you want it that way..... enter 'do-what-it-says' and press enter.");
};
















