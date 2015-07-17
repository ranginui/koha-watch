var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function getstatus() {
  // Construct URL
  var url = "http://jenkins.koha-community.org/job/Koha_Master_D7/api/json";

  // Send request to OpenWeatherMap
  xhrRequest(url, 'GET', 
    function(responseText) {
      // responseText contains a JSON object jenkins
      var json = JSON.parse(responseText);

      var colour = json.color;
      if (colour === 'blue') {
        colour = 'Pass';
      } 
      console.log("Colour is " + colour);

      // Conditions
      var name = 'Master';      
      console.log("Name is " + name);
      
      // Assemble dictionary using our keys
      var dictionary = {
        "KEY_COLOUR": colour,
        "KEY_NAME": name,
      };

      // Send to Pebble
      Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log("Jenkins info sent to Pebble successfully!");
        },
        function(e) {
          console.log("Error sending weather info to Pebble!");
        }
      );
    }      
  );
}



// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
  function(e) {
    console.log("PebbleKit JS ready!");

    // Get the initial status
    getstatus();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log("AppMessage received!");
    getstatus();
  }                     
);

