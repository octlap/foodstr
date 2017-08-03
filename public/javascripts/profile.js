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
        "<div class='favorite map'>Fave</div>" +
        "</div>";
    } else {
      content +=
        "<div class='info-row'>" +
        "<button class='controls fave-map'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='controls delete-map'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='wish-list map'>Wish list</div>" +
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

    marker.addListener("click", e => {
      infowindows.forEach(i => {
        i.close();
      });
      infowindow.open(map, marker);
    });
  });
}

/// Method to load list ////////////////////////////////////////////////////////
function loadList() {
  $("#places-list").html("");

  for (let i = places.length - 1; i >= 0; i--) {
    // GENERATE CONTENT DEPENDING ON STATUS
    let content =
      "<hr>" +
      "<div class='row-places'>" +
      "<img class='place-photo' src=" +
      places[i].photo +
      ">" +
      "<div class='info-block'>";

    if (!places[i].status) {
      content +=
        "<div class='info-row'>" +
        "<button class='controls fave-list'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='controls delete-list'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='wish-list list'>Wish list</div>" +
        "</div>";
    } else {
      content +=
        "<div class='info-row'>" +
        "<button class='controls delete-list'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='favorite list'>Fave</div>" +
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
      // BACK END ROUTINE HERE
      let id = $(e.currentTarget.parentElement).next().next().next().html();
      axios
        .post("/delete", { id })
        .then(res => {
          // REMOVE FROM PAGE
          $(e.currentTarget.parentElement.parentElement.parentElement)
            .prev()
            .remove();
          $(e.currentTarget.parentElement.parentElement.parentElement).remove();
        })
        .catch(error => {
          alert("Something went wrong... :(");
          console.log(error);
        });
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
      axios
        .post("/fave", { id })
        .then(res => {
          // CHANGE ON PAGE
          $(e.currentTarget).next().next().html("Fave");
          $(e.currentTarget).next().next().attr("class", "favorite list");
          $(e.currentTarget).remove();
        })
        .catch(error => {
          alert("Something went wrong... :(");
          console.log(error);
        });
    }
  });
});

// INITIALIZE PAGE ////////////////////////////////////////////////////////////
startMap();
loadList();
