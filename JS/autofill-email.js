/*
* Requires a #name text-input field to draw from,
* and a #email text-input field to write to.
*/

$(function() {
  $("#name").on("change", function() {
    $("#email").val(($(this).val().substr(0, $(this).val().indexOf(" ")) + $(this).val().substr($(this).val().indexOf(" ")+1, 1) + "@uas.com").toLowerCase());
    $("#email").css({
      "transition": "background-color 0.5s",
      "background-color": "#f9ff60"
    });
    setTimeout(function(){$("#email").css({"background-color":"#fff"});}, 400);
  });
});


/* THE LONG WAY
$(function() {
  $("#name").on("change", function(){

    let name = $(this).val();

    let spIndex = name.indexOf(" ");

    let email = name.substr(0, spIndex) + name.substr(spIndex+1, 1) + "@uas.com";

    $("#email").val(email.toLowerCase());

    $("#email").css({
      "transition": "background-color 0.5s",
      "background-color": "#f9ff60"
    });

    setTimeout(function(){$("#email").css({"background-color":"#fff"});}, 400);

  });

});

*/