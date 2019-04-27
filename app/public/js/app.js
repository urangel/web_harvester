$(document).ready(function() {
    $(document).on("click", ".article", function (e) {
        e.preventDefault();

        $("#savedNoteTitle").text("");
        $("#savedNoteText").text("");

        $(".notes").attr("id", $(this).attr("id"));
        $(".notes").show();
        
    });

    $("#noteButton").on("click", function(e){   
        e.preventDefault();

        $.ajax({
            method: "GET",
            url: "/readNote/" + $(".notes").attr("id")
        })
        .then(function(res){
            $("#savedNoteTitle").text(res.note.title);
            $("#savedNoteText").text(res.note.body);

        });
    });



    $("#saveButton").on("click", function(e){
        e.preventDefault();

        let noteObj = {
            title: $("#noteTitle").val(), 
            body: $("#noteText").val()
        }

        $.ajax({
            method: "POST",
            url: "/saveNote/" + $(".notes").attr("id"),
            data: noteObj
        })
        .then(function(err, res){
            if(err) throw err;
            console.log(res);
        });
    });
});
