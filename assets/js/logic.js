// INITIALIZE FIREBASE
var config = {
    apiKey: "AIzaSyBJqArnhfP6EerZBYiCJ7rZe-_ARxn1ovE",
    authDomain: "traintime-b183a.firebaseapp.com",
    databaseURL: "https://traintime-b183a.firebaseio.com",
    projectId: "traintime-b183a",
    storageBucket: "",
    messagingSenderId: "470902148380"
  };
  firebase.initializeApp(config);
// REFERENCE DATABASE
var database = firebase.database();
// INITIAL VALUES
var name = "";
var destination = "";
var first = "";
var frequency = "";
// -------------------------------------------
// FUNCTIONS
// -------------------------------------------
// RENDER TRAIN INTO DATABASE FIRST
function renderTrain() {
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();  
    first = $("#first-train").val().trim();
    //  UPDATE FIREBASE
    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        first: first
    });
}

// ON CHILD ADD
database.ref().on("child_added", function(childSnapshot){
    // TODO: CALCULATE NEXT ARRIVAL

    // GRAB VALUES FROM FIREBASE
    var fbName = childSnapshot.val().name;
    var fbDestination = childSnapshot.val().destination;
    var fbFrequency = childSnapshot.val().frequency;
    var fbFirst = childSnapshot.val().first;

    // CONVERSIONS
    var firstConverted = moment(fbFirst, "hh:mma").subtract(1, "years");

    console.log("firstConverted: " + firstConverted);

    var diffTime = moment().diff(moment(firstConverted), "minutes");
    var remainder = diffTime % fbFrequency;
    console.log(diffTime, frequency, remainder);
    var minutesTilTrain = fbFrequency - remainder;
    var nextTrain = diffTime > 0 ? moment().add(minutesTilTrain, "minutes").format("HH:mm"): moment(minutesTilTrain, "hh:mm");
    console.log("----------------")
    // UPDATE HTML
    $("#train-list").append("<tr>" + 
    "<td>" + childSnapshot.val().name + "</td>" + 
    "<td>" + childSnapshot.val().destination + "</td>" + 
    "<td>" + childSnapshot.val().frequency + "</td>" + 
    "<td>" + nextTrain + "</td>" + 
    "<td>" + minutesTilTrain + "</td>" + 
    "</tr>");
}, function(errorObject) {
    console.log("Errors: " + errorObject.code);
});
// -------------------------------------------
// MAIN PROCESS
// -------------------------------------------
// ADD USER INPUT INTO FIREBASE ON CLICK
$("#add-train").click(function(event){
    event.preventDefault();
    renderTrain();
    $("#train-name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#first-train").val("");
});







// WORKING CODE FOR DATABASE
// var firstConverted = moment(first, "hh:mma");
// console.log("firstConverted: " + firstConverted);
// var diffTime = moment().diff(moment(firstConverted), "minutes");
// var remainder = diffTime % frequency;
// console.log("test");
// console.log(diffTime, frequency, remainder);
// var minutesTilTrain = frequency - remainder;
// var nextTrain = moment().add(minutesTilTrain, "minutes").format("HH:mm");

// // UPDATE HTML
// $("#train-list").append("<tr>" + 
// "<td>" + childSnapshot.val().name + "</td>" + 
// "<td>" + childSnapshot.val().destination + "</td>" + 
// "<td>" + childSnapshot.val().frequency + "</td>" + 
// "<td>" + nextTrain + "</td>" + 
// "<td>" + minutesTilTrain + "</td>" + 
// "</tr>");
