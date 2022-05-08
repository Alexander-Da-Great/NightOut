let map = null;
let placesDict = {};
let service = null;
const NUM_BARS = 20;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let icons = []
let infowindows = []
let images = []
let content_strings = []
let cooldown = 300
// [shots,wine,beer]
const ratings = {
  "Alley Bar": [8,2,6],
  "The Garage Bar": [6,3,8],
  "Babs' Underground": [8,3,4],
  "Ashley's - Ann Arbor": [8,2,10],
  "Brown Jug Restaurant": [9,2,6],
  "The Blind Pig": [9,1,6],
  "Regents Field": [3,8,8],
  "Bar 327 Braun Court": [7,1,5],
  "Old Town Tavern": [7,2,8],
  "Mash": [8,8,7],
  "Lo-Fi": [6,6,5],
  "Fraser's Pub": [5,4,7],
  "Nightcap": [9,7,4],
  "Heidelberg Restaurant & Bar": [5,1,5],
  "The Circ Bar": [7,3,7],
  "Chili's Grill & Bar": [2,2,3],
  "The Last Word": [8,2,6],
  "The Ravens Club": [8,6,7],
  "Haymaker Public House": [5,7,8],
  "Mani Osteria and Bar": [7,10,5],
  "Powell's Pub": [5,2,7],
  "Red Hawk Bar & Grill": [3,4,3],
  "Siris Restaurant and Cigar Bar": [6,7,8],
  "The Grotto - Watering Hole": [5,5,7],
  "Cantina Taqueria + Bar": [8,2,5],
  "Scorekeepers Sports Grill and Pub": [6,2,8]
}

function initMap() {
  // Create the map.
  const ann = { lat: 42.27764645699718, lng: -83.73891534735613 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: ann,
    zoom: 16,
    mapId: "8d193001f940fde3",
  });
  // Create the places service.
  service = new google.maps.places.PlacesService(map);

  // Perform a nearby search.
  service.nearbySearch(
    { location: ann, radius: 20000, type: "bar", name:"bar" },
    (results, status) => {
      if (status !== "OK" || !results) return;
      //console.log(results)
      addPlaces(results, map);
    }
  );
}

function addPlaces(places){
  //console.log("PLACES", places);
  //add the markers on the map
  for(let i = 0; i < places.length; i++){
    let place = places[i]
    if (!place.geometry || !place.geometry.location) {
      infowindows.push({})
      icons.push({})
      continue
    }
    const image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    }

    images.push(image)
    const icon = new google.maps.Marker({
      map,
      icon: image,
      title: place.name,
      position: place.geometry.location,
    });
    icons.push(icon)
    //console.log(place)
    price_level = place.price_level ? place.price_level : 2
    placesDict[place.name] = { location: place.geometry.location, rating: place.rating, price_level: place.price_level, place_id: place.place_id, address: place.vicinity, icon_index: icons.length -1}
    const infowindow = new google.maps.InfoWindow();
    infowindows.push(infowindow)
  }

  content_strings.length = icons.length;
  let ind=0
  //ping every 100 milliseconds
  let interval = setInterval(function(){
    addPlaceDetails(places, ind)
    ind += 1
    if(ind>=places.length){
      clearInterval(interval)
    }
  }, 100)

    createRatings();
}


function addPlaceDetails(places, index) {
    const place = places[index]
    let icon = icons[index]
    let infowindow = infowindows[index]
    
    const request = {
      placeId: place.place_id,
      openNow: true,
      fields: ["name", "formatted_address", "formatted_phone_number","website", "place_id", "geometry", "opening_hours"],
    };

    service.getDetails(request, (place2, status) => {
      //(place2)
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place2 &&
        place2.geometry &&
        place2.geometry.location){
          var content_string;
          if(place2.opening_hours != null){ // if there are hours display them
            //console.log(place2.opening_hours.isOpen)
            const image = {
              url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"  ,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
            }
            //console.log(place2.name)
            console.log(place2.name)
            console.log(getStatus(place2.opening_hours.periods))
            var status = "Closed"; 
            if(getStatus(place2.opening_hours.periods)) {
              status = "Open"
            }
            content_string = '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h1 id="firstHeading" class="firstHeading">'+ place2.name +
            '</h1>' +
            '<div id="bodyContent">' +
            '<ul>' + 
            '<li>Address: ' + place2.formatted_address + '</li>' +
            '<li>Website: <a href="' + place2.website + '">' + place2.website +'</a></li>' +
            '<li>Contact: ' + place2.formatted_phone_number + '</li>' +
            '<li>Hours: ' + place2.opening_hours.weekday_text+ '</li>' +
            '<li>Status:<div id='+ status + '> ' + status + ' </div> </li>' +
            '</ul>' +
            "</div>" +
            "</div>";
          } else{ // if there are no hours inform the user
            //icons[placesDict[place2.name].icon_index].setIcon(image)
            content_string = '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h1 id="firstHeading" class="firstHeading">'+ place2.name +
            '</h1>' +
            '<div id="bodyContent">' +
            '<ul>' + 
            '<li>Address: ' + place2.formatted_address + '</li>' +
            '<li>Website: <a href="' + place2.website + '">' + place2.website +'</a></li>' +
            '<li>Contact: ' + place2.formatted_phone_number + '</li>' +
            '<li>Hours: No Data Available</li>' +
            '</ul>' +
            "</div>" +
            "</div>";
          }
          content_strings[index] = content_string
          infowindow.setContent(content_strings[index]);
          google.maps.event.addListener(icon, "click", function () {
            for(let i = 0; i < infowindows.length; i++){
              infowindows[i].close();
            }
            infowindow.open(map, this);
          });
        }
        //api rejected us, add cooldown and request again
        else if (!place2){
          setTimeout(function(){
            addPlaceDetails(places, index)
          }, cooldown)
          cooldown += 100
        }
      });
  }
function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}
function getStatus(periods) {
  var today = new Date();
  var dateNow = [today.getDay() , checkTime(today.getHours())+''+checkTime(today.getMinutes())];
  //console.log(periods)
  var isOpen = false; 
  for(let i = 0; i < periods.length; i++){
    var temp = periods[i]
    //console.log("current day: " +temp.open.day)
    if(temp.open.day == dateNow[0]) { // is this day in periods today
      if(temp.open.time == 0000 || temp.open.time < dateNow[1]) {
        isOpen = true;
      } else{
        isOpen = false;
      }
      return isOpen;
    }
  }
  return isOpen;
}

function createRatings() {
    for(let place in placesDict){
      let obj = placesDict[place]
      if(!(place in ratings)){
        obj.shots_rating = 5
        obj.wine_rating = 5
        obj.beer_rating = 5
      }
      else{
        obj.shots_rating = ratings[place][0]
        obj.wine_rating = ratings[place][1]
        obj.beer_rating = ratings[place][2]
      }
    }
    //console.log(placesDict)
}

var app = new Vue({
  el: '#app',
  data: {
      dollar_pref: null,
      drink_pref: null,
      squad: [],
      top_names: [],
      nightOutPressed: false
  },
  methods: {
      setDollarPref: function (e) {
        this.dollar_pref = e.target.id;
      },
      setDrinkPref: function (e) {
        this.drink_pref = e.target.id;
      },
      createProfile: function () {
          this.squad.push({
            name : $("#nameInput").val() ? $("#nameInput").val() : "Profile",
            drink_pref : this.drink_pref,
            dollar_pref : this.dollar_pref
          });
          $("#prefs-pane").css("visibility", "hidden");
          $("#prefs-pane").css("height", "10px");
          this.dollar_pref = null;
          this.drink_pref = null;
          $("#nameInput").val("")
          $("#cheap").css("border", "3px solid grey");
          $("#moderate").css("border", "3px solid grey");
          $("#expensive").css("border", "3px solid grey");
          $("#beer").css("border", "3px solid grey");
          $("#wine").css("border", "3px solid grey");
          $("#shots").css("border", "3px solid grey");
      },

      deleteProfile: function (index) {
        this.squad.splice(index, 1);
      },

      deleteAllProfiles: function (){
        this.squad = []
      },

    planNightOut: function () {
        $("#plan-window").css("display", "none");

        this.nightOutPressed = true;
        let matches = []
        //average dollar preference
        let squad_dollar = 0
        //total # that prefer [shots, wine, beer]
        let squad_drink = [0,0,0]
        let prices = {"cheap": 1, "moderate": 2, "expensive": 3}
        for (let i = 0; i < this.squad.length; i++){
          let s = this.squad[i]
          squad_dollar += prices[s.dollar_pref]

          if(s.drink_pref == "shots"){
            squad_drink[0] += 1
          }
          else if(s.drink_pref == "wine"){
            squad_drink[1] += 1
          }
          else{
            squad_drink[2] += 1
          }
        }
        squad_dollar /= this.squad.length;
        squad_drink[0] /= this.squad.length;
        squad_drink[1] /= this.squad.length;
        squad_drink[2] /= this.squad.length;

        for (let place in placesDict){
          let obj = placesDict[place]
          //drink match ranges from 1-10
          let drink_match = 0
          drink_match += (obj.shots_rating * squad_drink[0])
          drink_match += (obj.wine_rating * squad_drink[1])
          drink_match += (obj.beer_rating * squad_drink[2])
          //dollar_match ranges from 2-10
          let dollar_diff = Math.abs(squad_dollar - obj.price_level)
          
          let dollar_match = 11 - ((dollar_diff * 4) + 1)
          let total_match = drink_match + dollar_match
          matches.push({name: place, score: total_match})
        }

        matches.sort(function (a, b) {
          return b.score - a.score;
        });
        
        //console.log(matches)
        let top_choiches = matches.slice(0, 3)
        this.top_names = [];
        for (let i = 0; i < top_choiches.length; i++){
          this.top_names.push(top_choiches[i].name)
        }

        //close the info windows 
        for(let i = 0; i < infowindows.length; i++){
          infowindows[i].close();
        }

        //reset the icons
        for (let i = 0; i < icons.length; i++) {
          icons[i].setIcon(images[i])
          icons[i].setLabel(null)
        }
        // change icon for the restaurant
        var labelIndex = 0;
        for (const choice of this.top_names) {
          place = placesDict[choice]
          icons[place.icon_index].setIcon(null);
          //icons[place.icon_index].setLabel(labels[labelIndex++])
          infowindows[place.icon_index].open(map, icons[place.icon_index])
        }
    }
  },
})

