// initialize place and address in global scope
var place = null;
var address = "";

function startMap() {
  // set center to Paris for now
  var paris = { lat: 48.8588589, lng: 2.3475569 };

  // Map initialization
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: paris,
    scrollwheel: false
  });

  // var card = document.getElementById('pac-card');
  var input = document.getElementById("pac-input");
  // var types = document.getElementById("type-selector");
  // var strictBounds = document.getElementById("strict-bounds-selector");

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);

  // Set types to Establishments only
  autocomplete.setTypes(["establishment"]);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener("place_changed", function() {
    marker.setVisible(false);
    place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      // window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          ""
      ].join(" ");
    }

    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    infowindowContent.children["add-place-btn"].textContent = "Show details";
    $(infowindowContent).show();
    infowindow.open(map, marker);
  });
}

//At first hide details
$("#details").hide();
$(".details-pic").hide();
startMap();

// On click move to bottom section and show details
$(document).ready(() => {
  $("#add-place-btn").click(e => {
    // Display name and address
    $("#details-name").html(place.name);
    $("#details-address").html(address);

    // Display pictures
    if (place.photos) {
      // add first photo url to hidden field
      $("#photo").val(
        place.photos[0].getUrl({ maxWidth: 1200, maxHeight: 1200 })
      );
      const numPics = Math.min(3, place.photos.length);
      for (let i = 0; i < numPics; i++) {
        $("#details-pic-" + (i + 1)).attr(
          "src",
          place.photos[i].getUrl({ maxWidth: 1200, maxHeight: 1200 })
        );
        $("#details-pic-" + (i + 1)).show();
      }
    }

    // Populate hidden fields
    $("#googlePlaceId").val(place.id);
    $("#address").val(address);
    $("#name").val(place.name);
    $("#lat").val(place.geometry.location.lat());
    $("#lng").val(place.geometry.location.lng());

    // Show
    $("#details").show();
  });
});
