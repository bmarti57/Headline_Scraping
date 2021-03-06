// Grabs the article json
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("articles").append("<h3 data-toggle='modal' data-target='#myModal' data-id=" + data[i].id + "'>" + data[i].title + "<br />" + data[i].link + "</h3>");
    }
});

// Click p tag
$(document).on("click", "h3", function() {
    $("#myModal").modal('show');
    $("#notes").empty();

    var thisId = $(this).attr("data-id");
// ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + this.Id
    })
    .done(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        
        // If there is a note in the article
        if(data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .done(function(data) {
        console.log(data);
        $("#notes").empty();
      });
      $("#myModal").modal('hide');
  });
