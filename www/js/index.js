var db;

function onDeviceReady(){
    // Open native DB via plugin
    db = window.sqlitePlugin.openDatabase({name: "test.db"});
}


function loadFromFile(){
    var dbName = $('#db-name').val();
    var format = $('#format').val();
    var type = $('#type').val();

    var filename = format+"/"+dbName+"_"+type+"."+format;

    $('#result').val("Loading "+filename+"...");
    $.get(filename, function(contents){
        $('#result').val(contents);
        alert("Loaded '"+filename+"'");
    }, "text");
}

function doImportSql(){
    cordova.plugins.sqlitePorter.importSqlToDb(db, $('#result').val(), function(){
        alert("Imported SQL to DB");
    }, onError);
}

function doExportSql(){
    cordova.plugins.sqlitePorter.exportDbToSql(db, function(sql){
        $('#result').val(sql);
        alert("Exported SQL from DB");
    }, $('#export-type').val() === "data");
}

function doImportJson(){
    cordova.plugins.sqlitePorter.importJsonToDb(db, $('#result').val(), function(){
        alert("Imported JSON to DB");
    }, onError);
}

function doExportJson(){
    cordova.plugins.sqlitePorter.exportDbToJson(db, function(json){
        $('#result').val(JSON.stringify(json));
        alert("Exported JSON from DB");
    }, $('#export-type').val() === "data");
}

function doWipe(){
    cordova.plugins.sqlitePorter.wipeDb(db, function(){
        alert("Wiped DB");
    }, onError);
}

function onError(error){
    var msg = "An error occurred: message="+error.message;
    if(error.code){
        msg += "; code="+error.code;
    }
    console.dir(error);
    alert(msg);
}

$(document).on('deviceready', onDeviceReady);