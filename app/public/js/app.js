$(document).ready(function() {
    $(document).on("click", ".article", function (e) {
        $("#savedNoteTitle").text("");
        $("#savedNoteText").text("");
        $("#hideButton").hide();
        $("#deleteButton").hide();
        $("#noteButton").show();
        $("#saveButton").show();


        $(".notes").attr("id", $(this).attr("id"));
        $(".notes").show();
        
    });

    $("#scrapeButton").on("click", function(e){   
        e.preventDefault();

        $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function(res){
            location.reload();
        });
    });

    $("#hideButton").on("click", function(e){   
        e.preventDefault();

        $("#hideButton").hide();
        $("#noteButton").show();
        $("#savedNoteTitle").text("");
        $("#savedNoteText").text("");
        
    });

    $("#deleteButton").on("click", function(e){   
        e.preventDefault();

        $.ajax({
            method: "DELETE",
            url: "/deleteNote/" + $("#deleteButton").attr("_id")
        })
        .then(function(res){
            console.log("deleted");
            $("#hideButton").hide();
            $("#deleteButton").hide();
            $("#saveButton").show();
            $("#noteButton").show();
            $("#savedNoteTitle").text("");
            $("#savedNoteText").text("");
        });
    });

    $("#noteButton").on("click", function(e){   
        e.preventDefault();

        $("#noteButton").hide();
        $("#hideButton").show();

        $.ajax({
            method: "GET",
            url: "/readNote/" + $(".notes").attr("id")
        })
        .then(function(res){
            if(res.note){
                $("#savedNoteTitle").text(res.note.title);
                $("#savedNoteText").text(res.note.body);
                $("#deleteButton").show().attr("_id", res.note._id);

            }
            else {
                $("#savedNoteTitle").text("No notes");
                $("#savedNoteText").text("Leave a title and note above then hit save to keep a note on this article");
            }
            
        });
    });



    $("#saveButton").on("click", function(e){
        e.preventDefault();

        
        let noteObj = {
            title: $("#noteTitle").val(), 
            body: $("#noteText").val()
        }

        $("#noteTitle").val("");
        $("#noteText").val("");
        $("#noteButton").show();
        $("#saveButton").hide();

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
