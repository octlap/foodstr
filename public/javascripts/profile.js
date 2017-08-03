function startMap() {
  // set center to Paris for now
  var paris = { lat: 48.8588589, lng: 2.3475569 };

  // Initialize map
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: paris
  });

  //Loop through places and create markers
  // const placeMarkers = [];
  places.forEach(p => {
    var position = {
      lat: p.location.coordinates[1],
      lng: p.location.coordinates[0]
    };

    var marker = new google.maps.Marker({
      position,
      map: map,
      title: p.name,
      icon: "/images/map-icon.png"
    });
  });
}

startMap();
