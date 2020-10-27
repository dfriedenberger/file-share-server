


function explode(str, maxLength) {
    var buff = "";
    var numOfLines = Math.floor(str.length/maxLength);
    for(var i = 0; i<numOfLines+1; i++) {
        buff += str.substr(i*maxLength, maxLength); if(i !== numOfLines) { buff += "\n"; }
    }
    return buff;
}


$( document ).ready(function() {


    var jsonFile = window.location.hash.substr(1);

    if(jsonFile.startsWith("did_"))
    {
        $("#title").text("Keys");
    }
   
    $("#raw").attr("href","/show/"+jsonFile);

    $.getJSON( "/api/getJsonFile/"+jsonFile, function( data ) {

           
        $("#message").text(JSON.stringify(data.document,null,2));
    


        var html = $("#message").html();

        if(data.document.payload)
        {
            for(let i = 0;i < data.document.payload.length;i++)
            {
                let payload = data.document.payload[i];
                html = html.replace('"'+payload.file,'"<a href="/show/'+payload.file+'">'+payload.file+'</a>');
            }
        }
        console.log("data.document.prior",data.document.prior);

        if(data.document.prior)
        {
            //for(let i = 0;i < data.document.prior.length;i++)
            {
                let prior = data.document.prior;
                var link = "/show.html#"+prior.id.replace(/did:dad:/, 'dad_')+".json";
                html = html.replace(prior.id,'<a class="prior" href="'+link+'">'+prior.id+'</a>');
            }
        }
        $("#message").html(html);

        $(".prior").click(function(ev) {
            ev.preventDefault();
            var href = $(this).attr("href");
            window.location = href;
            location.reload();
        });

        //Show Signature
        $("#signature").text(data.signature);



    });


   

});

