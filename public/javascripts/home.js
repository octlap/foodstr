// function loadFeed() {
//   /// content here
//   console.log(places);
// }

// loadFeed();

for (let i = places.length - 1; i >= 0; i--) {
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
