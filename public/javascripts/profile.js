/// Method to load map ////////////////////////////////////////////////////////
function startMap() {
  // set center to Paris for now
  var paris = { lat: 48.8588589, lng: 2.3475569 };

  // Initialize map
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: paris,
    scrollwheel: false
  });

  //Loop through places and create markers
  // const placeMarkers = [];
  const infowindows = [];
  places.forEach(p => {
    var position = {
      lat: p.location.coordinates[1],
      lng: p.location.coordinates[0]
    };

    var content = "<h4>" + p.name + "</h4><p>" + p.address + "</p>";

    if (p.status) {
      content +=
        "<div class='info-row'>" +
        "<button class='controls delete-map'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<span class='id'>" +
        p.id +
        "</span>" +
        "<div class='favorite map'><i class='fa fa-heart-o'></i> Fave</div>" +
        "</div>";
    } else {
      content +=
        "<div class='info-row'>" +
        "<button class='controls fave-map'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='controls delete-map'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<span class='id'>" +
        p.id +
        "</span>" +
        "<div class='wish-list map'><i class='fa fa-star-o' aria-hidden='true'></i> Wish list</div>" +
        "</div>";
    }

    var infowindow = new google.maps.InfoWindow({
      content
    });
    infowindows.push(infowindow);

    var icon = p.status
      ? "/images/pointerpink-small.png"
      : "/images/pointerblue-small.png";

    var marker = new google.maps.Marker({
      position,
      map: map,
      title: p.name,
      icon
    });

    // Adds listener on map markers
    marker.addListener("click", e => {
      infowindows.forEach(i => {
        i.close();
      });
      infowindow.open(map, marker);

      // Adds listener for delete button
      $(".controls.delete-map").click(e => {
        let goAhead = confirm("Are you sure you want to delete this place?");

        if (goAhead) {
          let delId = $(e.currentTarget).next().html();
          deletePlace(delId);
        }
      });

      // if not a fave, adds listener on fave buttons
      if (!p.status) {
        $(".controls.fave-map").click(e => {
          let goAhead = confirm("Are you sure you want to fave this place?");

          if (goAhead) {
            let faveId = $(e.currentTarget).next().next().html();
            favePlace(faveId);
          }
        });
      }
    });

    // Adds listeners on buttons in map infowindows
  });
}

/// Method to load list ////////////////////////////////////////////////////////
function loadList() {
  $("#places-list").html("");

  for (let i = places.length - 1; i >= 0; i--) {
    // GENERATE CONTENT DEPENDING ON STATUS
    let content =
      "<hr id='hr" +
      places[i].id +
      "'>" +
      "<div class='row-places'  id='row" +
      places[i].id +
      "'>" +
      "<img class='place-photo' src=" +
      places[i].photo +
      ">" +
      "<div class='info-block'>";

    if (!places[i].status) {
      content +=
        "<div class='info-row' id='info-row" +
        places[i].id +
        "'>" +
        "<button class='controls fave-list'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='controls delete-list'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='wish-list list'><i class='fa fa-star-o' aria-hidden='true'></i> Wish list</div>" +
        "</div>";
    } else {
      content +=
        "<div class='info-row'>" +
        "<button class='controls delete-list'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='favorite list'><i class='fa fa-heart-o'></i> Fave</div>" +
        "</div>";
    }

    content +=
      "<h2>" +
      places[i].name +
      "</h2>" +
      "<p>" +
      places[i].address +
      "</p>" +
      "<span class='id'>" +
      places[i].id +
      "</span>" +
      "</div></div>";

    // APPEND PLACE TO LIST
    $("#places-list").append(content);
  }
}

// LISTENERS///////////////////////////////////////////////////////////////////
$(document).ready(() => {
  // DELETE ACTION///////////////
  $(".controls.delete-list").click(e => {
    // ALERT TO CHECK
    let goAhead = confirm("Are you sure you want to delete this place?");

    if (goAhead) {
      // Identify place ID and call deletePlace routine
      let id = $(e.currentTarget.parentElement).next().next().next().html();
      deletePlace(id);
    }
  });

  // FAVORITE ACTION////////////////
  $(".fave-list").click(e => {
    // ALERT TO CHECK
    let goAhead = confirm(
      "Are you sure you want to male this one of your faves?"
    );

    if (goAhead) {
      // BACK END ROUTINE HERE
      let id = $(e.currentTarget.parentElement).next().next().next().html();
      favePlace(id);
    }
  });
});

////// DELETE FROM SERVER METHOD ///////////////////////////////////////////////

function deletePlace(id) {
  axios
    .post("/delete", { id })
    .then(res => {
      // REMOVE FROM LIST: <hr> and then row
      $("#hr" + id).remove();
      $("#row" + id).remove();

      // Remove from places vector and reinitiate map
      let index = places.findIndex(p => {
        return p.id == id;
      });
      places.splice(index, 1);
      startMap();
    })
    .catch(error => {
      alert("Something went wrong... :(");
      console.log(error);
    });
}

/// FAVE ON SERVER METHOD /////////////////////////////////////////////////////

function favePlace(id) {
  axios
    .post("/fave", { id })
    .then(res => {
      // CHANGE ON PAGE
      $("#info-row" + id).children().first().remove();
      $("#info-row" + id).children().last().html("Fave");
      $("#info-row" + id).children().last().attr("class", "favorite list");

      // Change place status and restart map
      let index = places.findIndex(p => {
        return p.id == id;
      });
      places[index].status = true;
      startMap();
    })
    .catch(error => {
      alert("Something went wrong... :(");
      console.log(error);
    });
}

// INITIALIZE PAGE ////////////////////////////////////////////////////////////
startMap();
loadList();
