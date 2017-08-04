function loadFeed() {
  let numPlaces = Math.min(places.length, 30);

  for (let i = numPlaces - 1; i >= 0; i--) {
    // unless the current user already has the place in their list
    // display last 30 places to have been added

    var include =
      user.places.findIndex(p => {
        return p._placeId == places[i]._id;
      }) > -1
        ? false
        : true;

    if (include) {
      let content =
        "<div class='box panel panel-default'>" +
        "<div class='panel-heading photo' id='panel-heading" +
        places[i]._id +
        "'>" +
        "<div class='black-hover'></div>" +
        "</div>" +
        "<div class='panel-body'>" +
        "<h3>" +
        places[i].name +
        "</h3>" +
        "<p>" +
        places[i].address +
        "</p>" +
        "</div>" +
        "</div>";

      $(".grid").append(content);
      $("#panel-heading" + places[i]._id).css(
        "background-image",
        "url(" + places[i].photo + ")"
      );
    }
  }
}

loadFeed();
