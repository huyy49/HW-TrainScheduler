// Check if the time is entered in correct format
// const isMilitaryTime = function(time){
//   return /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/.test(time)
// }
// console.log(isMilitaryTime($("#start-input").val().trim()));

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyBaTAqQiWEKte2K5Fve5BTi3IC2nz1OMQk",
  authDomain: "trainscheduler-8a528.firebaseapp.com",
  databaseURL: "https://trainscheduler-8a528.firebaseio.com",
  projectId: "trainscheduler-8a528",
  storageBucket: "trainscheduler-8a528.appspot.com",
  messagingSenderId: "676139082163"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  if(trainName.length === 0 || trainDestination.length === 0 ||trainStart.length === 0 || trainFrequency.length === 0){
    alert("Please enter the whole form!");
    return false
  }

  // train Info
  // console.log('trainStart: ' + trainStart);

  // Creates local "newtrain" object for holding train data
  var newtrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  };

  // Uploads train data to the database
  database.ref().push(newtrain);

  // Logs everything to console
  console.log('Train Name: ' + newtrain.name);
  console.log('Train Destination: ' + newtrain.destination);
  console.log('Train Start: ' + newtrain.start);
  console.log('Train Frequency: ' + newtrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var timeInput = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;
  var splitTime = timeInput.split(":");
  var hours = splitTime[0];
  var minutes = splitTime[1];
  var trainTime = moment().hours(hours).minutes(minutes);
  // alert(trainTime);
  var timeDiff = moment().diff(trainTime, "minutes");
  if (timeDiff < 0) {
    var trainAway = 0 - timeDiff;
  } else {
    var trainAway = trainFrequency - (timeDiff % parseInt(trainFrequency));
    // alert(trainAway);
  }

  // To calculate the arrival time, add the tMinutes to the currrent time
  var trainNext = moment().add(trainAway, "minutes").format("hh:mm A");

  // train Info
  // console.log(trainTime);
  // console.log(timeDiff);
  // alert(timeDiff);
  // console.log(trainFrequency);
  // console.log(trainAway);

  // Prettify the train start
  // var trainFirstMinPretty = moment.unix(trainFirstMin).format("LT");

  // To calculate the minute to now

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNext),
    $("<td>").text(trainAway),
  );

  // // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
