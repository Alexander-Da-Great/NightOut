$(document).ready( function() {
  document.getElementById("plan-button").addEventListener("click", openPlanNight);
  /* document.getElementById("prefs-button").addEventListener("click", openPrefs);*/
  document.getElementById("help-button").addEventListener("click", openHelp);
  document.getElementsByClassName("close")[0].addEventListener("click", closePopup);
  document.getElementsByClassName("close")[1].addEventListener("click", closePopup);


  /* add same event listener for all dollar buttons */
  var dollars = document.getElementsByClassName("dollar");
  for (var i = 0; i < dollars.length; i++) {
      dollars[i].addEventListener('click', setDollarPref);
  }

  /* same thing for drinks */
  var drinks = document.getElementsByClassName("drink-pic");
  for (var i = 0; i < drinks.length; i++) {
      drinks[i].addEventListener('click', setDrinkPref);
  }
});
  
function openPrefs() {
  $("#prefs-pane").css("visibility", "visible");
  $("#prefs-pane").css("height", "200px");
}
function openHelp() {
  $("#help-window").css("display", "block");
}
function closePopup() {
  $("#help-window").css("display", "none");
  $("#plan-window").css("display", "none");
}
function openPlanNight() {
  $("#plan-window").css("display", "block");
}


function setDollarPref() {
  /* set them all back to grey, then change to red */
  $("#cheap").css("border", "3px solid grey");
  $("#moderate").css("border", "3px solid grey");
  $("#expensive").css("border", "3px solid grey");

  id_string = "#" + this.id
  $(id_string).css("border", "3px solid red");
}

function setDrinkPref() {
  /* set them all back to grey, then change to red */
  $("#beer").css("border", "3px solid grey");
  $("#wine").css("border", "3px solid grey");
  $("#shots").css("border", "3px solid grey");

  id_string = "#" + this.id
  $(id_string).css("border", "3px solid red");
}
