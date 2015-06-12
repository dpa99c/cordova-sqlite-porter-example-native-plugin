var db, text, searchTable;

function onDeviceReady(){
    // Init performance API
    Performance.init();
    
    // Open native DB via plugin
    db = window.sqlitePlugin.openDatabase({name: "test.db"});

    // First page is load
    $(":mobile-pagecontainer").pagecontainer( "change", "load.html");

    $(":mobile-pagecontainer").on( "pagecontainershow", function(){
        var activePageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
        switch (activePageId) {
            case 'content':
                $('#text').val(text);
                break;
            case 'search':
                $('form').on("submit", doSearch);
                break;
            default:
        }
    });
}

function loadFromFile(){
    var dbName = $('#db-name').val();
    var format = $('#format').val();
    var type = $('#type').val();

    var filename = format+"/"+dbName+"_"+type+"."+format;

    $('#text').val("Loading "+filename+"...");
    Performance.startMeasuring("load");
    $.get(filename, function(contents){
        var time = Performance.stopMeasuring("load");
        $(":mobile-pagecontainer").one( "pagecontainerload", function(){
            text = contents;
        });
        $(":mobile-pagecontainer").one( "pagecontainershow", function(){
            alert("Loaded '"+filename+"' in "+time+" ms");
        });
        $(":mobile-pagecontainer").pagecontainer( "change", "content.html");
    }, "text");
}

function doImportSql(){
    Performance.startMeasuring("import_sql");
    cordova.plugins.sqlitePorter.importSqlToDb(db, text, {
        successFn: function(count){
            var time = Performance.stopMeasuring("import_sql");
            $.mobile.loading("hide");
            alert("Imported "+count+" SQL statements to DB in "+time+" ms");
        },
        errorFn: onError,
        progressFn: function(current, total){
            $.mobile.loading("show", {text: "Imported "+current+"/"+total, textVisible: true});
        }
    });
}

function doExportSql(){
    Performance.startMeasuring("export_sql");
    cordova.plugins.sqlitePorter.exportDbToSql(db, {
        successFn: function(sql, count){
            var time = Performance.stopMeasuring("export_sql");
            $(":mobile-pagecontainer").one( "pagecontainerload", function(){
                text = sql;
            });
            $(":mobile-pagecontainer").one( "pagecontainershow", function(){
                alert("Exported "+count+" SQL statements to DB in "+time+" ms");
            });
            $(":mobile-pagecontainer").pagecontainer( "change", "content.html");
        },
        dataOnly: $('#export-type').val() === "data"
    });
}

function doImportJson(){
    Performance.startMeasuring("import_json");
    cordova.plugins.sqlitePorter.importJsonToDb(db, text, {
        successFn: function(count){
            var time = Performance.stopMeasuring("import_json");
            $.mobile.loading("hide");
            alert("Imported "+count+" JSON statements to DB in "+time+" ms");
        },
        errorFn: onError,
        progressFn: function(current, total){
            $.mobile.loading("show", {text: "Imported "+current+"/"+total, textVisible: true});
        }
    });
}

function doExportJson(){
    Performance.startMeasuring("export_json");
    cordova.plugins.sqlitePorter.exportDbToJson(db, {
        successFn: function(json, count){
            var time = Performance.stopMeasuring("export_json");
            $(":mobile-pagecontainer").one( "pagecontainerload", function(){
                text = JSON.stringify(json);
            });
            $(":mobile-pagecontainer").one( "pagecontainershow", function(){
                alert("Exported "+count+" JSON statements to DB in "+time+" ms");
            });
            $(":mobile-pagecontainer").pagecontainer( "change", "content.html");
        },
        dataOnly: $('#export-type').val() === "data"
    });
}

function doWipe(){
    Performance.startMeasuring("wipe");
    cordova.plugins.sqlitePorter.wipeDb(db, {
        successFn: function(count){
            var time = Performance.stopMeasuring("wipe");
            alert("Wiped "+count+" tables in "+time+" ms");
        },
        errorFn: onError
    });
}

function onError(error){
    var msg = "An error occurred: message="+error.message;
    if(error.code){
        msg += "; code="+error.code;
    }
    console.dir(error);
    alert(msg);
}

function doSearch(e){
    e.preventDefault();
    var term = $('#search-box').val();
    $('#search-results').val('');
    if(!term){
        return;
    }
    var results = "";
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Album WHERE ([Title] LIKE "%'+term+'%")', [],
            function (tx, rslt) {
                if (rslt.rows && rslt.rows.length > 0) {
                   for(var i=0; i<rslt.rows.length; i++){
                       var row = rslt.rows.item(i);
                       results += "Id="+row.AlbumId+"; Title="+row.Title+"\n";
                   }
                }else{
                    results = "[No results]";
                }
                $('#search-results').val(results);
            },
            function(tx, error){
                onError(error);
            }
        );
    });
}

$(document).on('deviceready', onDeviceReady);