/*global $*/

function do_fetch(oe) {

    "use strict";

    oe.connection.rpc('/web/dataset/search_read', {
        'model': 'res.partner',
        'fields': ['name', 'city']
    }).then(function (data) {
        var str = "<ul>";
        var o;
        for (o in data.records) {
            str += "<li>" + data.records[o].name + " - " + data.records[o].city + "</li>";
        }
        str += "</ul>";
        $('#fetch').html(str);
    }).fail(function (error) {
        $('#fetch').html("<b>" + error.message + "</b>" + "\n\n<pre>" + error.data.debug + "</pre>");
        $('#fetch').addClass("Error");
    });
}
