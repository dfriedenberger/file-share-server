
$( document ).ready(function() {



    function humanFileSize(bytes, si=true, dp=1) {
        const thresh = si ? 1000 : 1024;
      
        if (Math.abs(bytes) < thresh) {
          return bytes + ' B';
        }
      
        const units = si 
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
          : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
      
        do {
          bytes /= thresh;
          ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
      
      
        return bytes.toFixed(dp) + ' ' + units[u];
      }

    Date.prototype.human = function() {
      
        var dd = this.getDay();
        var MM = this.getMonth() +1;
        var yy = this.getFullYear();
      
        var hh = this.getHours();
        var mm = this.getMinutes();
        var ss = this.getSeconds();

        return [
            (dd>9 ? '' : '0') + dd,
            (MM>9 ? '' : '0') + MM,
            yy
        ].join('.') + " " + [
                (hh>9 ? '' : '0') + hh,
                (mm>9 ? '' : '0') + mm,
                (ss>9 ? '' : '0') + ss
               ].join(':');
    };

    

    function  setTileCounter(id,value)
    {
        var elm = $(id);
        elm.text(value);

        var counter = elm.closest('.single_counter');
        if(value > 0)
        {
                counter.addClass("active");
        }
        else
        {
                counter.removeClass("active");
        }
        
    }

    function updateView()
    {
        $.getJSON( "/api/filesCount", function( data ) {

            //console.log(data);
            setTileCounter("#did-count",data.dids);
            setTileCounter("#dad-count",data.dads);
            setTileCounter("#file-count",data.files);

        });

        window.setTimeout(updateView,1000);
    }


    $(".single_counter").click(function(ev) {
        ev.preventDefault();
        console.log($(this).attr('id'));

        switch($(this).attr('id'))
        {
            case "did":
                $.getJSON( "/api/dids", function( data ) {

                    //rebuild table
                    var ths = $("#table").find("thead");
                    var tds = $("#table").find("tbody");
                    ths.empty();
                    tds.empty();
                    var tr = $("<tr></tr>");
                    tr.append('<th scope="col">#</th>');
                    tr.append('<th scope="col">DID</th>');
                    tr.append('<th scope="col">Changed</th>');
                    tr.append('<th scope="col">Keys</th>');
                    ths.append(tr);

                    let length = data.length;
                    for(let i = 0;i < length;i++)
                    {
                        var tr1 = $("<tr></tr>");
                        tr1.append('<th scope="row">'+i+'</th>');
                        tr1.append('<td><a href="/show.html#'+data[i].filename+'">'+data[i].did.id+'</a></td>');
                        tr1.append('<td>'+data[i].did.changed+'</td>');
                        let key = "-";
                        if(data[i].did.keys)
                        {
                            if(data[i].did.keys.length == 1)
                            {
                                key = data[i].did.keys[0].substring(0,30)+"...";
                            }
                            else
                            {
                                key = data[i].did.keys.length+" Keys";
                            }
                        }
                        tr1.append('<td>'+key+'</td>');
                        tds.append(tr1);
                    }

                });
                break;
            case "dad":
                $.getJSON( "/api/dads", function( data ) {

                    //rebuild table
                    var ths = $("#table").find("thead");
                    var tds = $("#table").find("tbody");
                    ths.empty();
                    tds.empty();
                    var tr = $("<tr></tr>");
                    tr.append('<th scope="col">#</th>');
                    tr.append('<th scope="col">DAD</th>');
                    tr.append('<th scope="col">Changed</th>');
                    tr.append('<th scope="col">Files</th>');
                    ths.append(tr);

                    let length = data.length;
                    for(let i = 0;i < length;i++)
                    {
                        var tr1 = $("<tr></tr>");
                        tr1.append('<th scope="row">'+i+'</th>');
                        tr1.append('<td><a href="/show.html#'+data[i].filename+'">'+data[i].did.id+'</a></td>');
                        tr1.append('<td>'+data[i].did.changed+'</td>');
                        let file = "-";
                        if(data[i].did.payload)
                        {
                            if(data[i].did.payload.length == 1)
                            {
                                file = data[i].did.payload[0].file;
                            }
                            else
                            {
                                file = data[i].did.payload.length+" Files";
                            }
                        }
                        tr1.append('<td>'+file+'</td>');

                        tds.append(tr1);
                    }

                });
                    break;
                    case "file":
                        $.getJSON( "/api/files", function( data ) {
        
                            //rebuild table
                            var ths = $("#table").find("thead");
                            var tds = $("#table").find("tbody");
                            ths.empty();
                            tds.empty();
                            var tr = $("<tr></tr>");
                            tr.append('<th scope="col">#</th>');
                            tr.append('<th scope="col">Name</th>');
                            tr.append('<th scope="col">Changed</th>');
                            tr.append('<th scope="col">Size</th>');
                            ths.append(tr);
        
                            let length = data.length;
                            for(let i = 0;i < length;i++)
                            {
                                var tr1 = $("<tr></tr>");
                                tr1.append('<th scope="row">'+i+'</th>');
                                tr1.append('<td><a href="/show/'+data[i].filename+'">'+data[i].filename+'</a></td>');
                                tr1.append('<td>'+data[i].stat.mtime+'</td>');
                                let hsize = humanFileSize(data[i].stat.size);
                                tr1.append('<td>'+hsize+'</td>');
        
                                tds.append(tr1);
                            }
        
                        });
                        break;
               
        }
        


    });


    updateView();

   

});

