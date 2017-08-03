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
        "<div class='wish-list-controls'>" +
        "<button class='controls'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
        "<div class='favorite map'>Fave</div>" +
        "</div>";
    } else {
      content +=
        "<div class='wish-list-controls'>" +
        "<button class='controls'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='controls'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
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
function loadList() {}

startMap();
