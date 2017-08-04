function loadFeed() {
  let numPlaces = Math.min(places.length, 45);

  $(".grid").html(""); // Clear feed
  for (let i = places.length - 1; i >= places.length - 1 - numPlaces; i--) {
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
        "<div class='black-hover'>" +
        "<span class='hidden'>" +
        places[i]._id +
        "</span>" +
        "<button class='hover-btn fave'><i class='fa fa-heart-o' aria-hidden='true'></i></button>" +
        "<button class='hover-btn wish-list'><i class='fa fa-star-o' aria-hidden='true'></i></button>" +
        "</div>" +
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

  $(".hover-btn").hide(); // Hide buttons for hover

  /// SET LISTENERS
  // Listeners to display controls on hover
  $(".black-hover").mouseenter(e => {
    // console.log("hover");
    $(e.currentTarget).children().show();
  });

  $(".black-hover").mouseleave(e => {
    // console.log("hover");
    $(e.currentTarget).children().hide();
  });

  // Listeners for clicks on fave and add to wish listener
  $(".hover-btn.wish-list").click(e => {
    let id = $(e.currentTarget).prev().prev().html();
    addPlace(id, false, e);
    // Fill star and display message
  });

  $(".hover-btn.fave").click(e => {
    let id = $(e.currentTarget).prev().html();
    addPlace(id, true, e);
    // Fill heart and display message
    $(e.currentTarget).html("<i class='fa fa-heart' aria-hidden='true'>");
  });
}

loadFeed();

///BACK-END ROUTINE //////////////////////////////////////////////////////////
function addPlace(id, status, e) {
  axios
    .post("/discover", { id, status })
    .then(res => {
      // FILL icons on buttons on success
      // if status is true then it's a fave, otherwise it's wish list
      if (status) {
        $(e.currentTarget).html("<i class='fa fa-heart' aria-hidden='true'>");
      } else {
        $(e.currentTarget).html("<i class='fa fa-star' aria-hidden='true'>");
      }

      //Remove place from page
      let index = places.findIndex(p => {
        return p._id == id;
      });
      places.splice(index, 1);
      setTimeout(loadFeed, 750);
    })
    .catch(err => {
      alert("Something went wrong :(");
    });
}
