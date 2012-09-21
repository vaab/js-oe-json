/*global $, document*/


var session_id = "";
var uniq_id_counter = 0;

/*
 * GENERIC FUNCTION FOR JSON/AJAX
 */


/** Formats an AJAX response to wrap JSON.
 */
function rpc_jsonp(url, payload) {

    "use strict";

    // extracted from payload to set on the url
    var data = {
        session_id: session_id,
        id: payload.id
    };

    var ajax = {
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        cache: false,
        data: data,
        url: url
    };

    var payload_str = JSON.stringify(payload);
    var payload_url = $.param({r: payload_str});
    if (payload_url.length > 2000) {
        throw new Error("Payload is too big.");
    }
    // Direct jsonp request
    ajax.data.r = payload_str;
    return $.ajax(ajax);

}

/** Formats a standard json 2.0 call
 */
function json(url, params) {

    "use strict";

    var deferred = $.Deferred();

    uniq_id_counter += 1;
    var payload = {
        'jsonrpc': '2.0',
        'method': 'call',
        'params': params,
        'id': ("r" + uniq_id_counter)
    };

    rpc_jsonp(url, payload).then(function (data, textStatus, jqXHR) {
        if (data.error) {
            deferred.reject(data.error);
        }
        deferred.resolve(data.result, textStatus, jqXHR);
    });

    return deferred;
}


/*
 * OpenERP functions
 */

function login() {

    "use strict";

    var deferred = $.Deferred();

    json('http://openerp.example.com/web/session/authenticate', {
        'base_location': 'http://openerp.example.com',
        'db': 'mydatabase',
        'login': 'admin',
        'password': 'secret',
        'session_id': session_id
    }).done(function (data) {
        session_id = data.session_id;
        $('#login').html("Login successfull (session: " + session_id + ")");
        deferred.resolve();
    });

    return deferred;
}


function do_fetch() {

    "use strict";

    json('http://openerp.example.com/web/dataset/search_read', {
        'model': 'res.partner',
        'fields': ['name', 'city'],
        'session_id': session_id
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


$(document).ready(function () {

    "use strict";

    login().then(do_fetch);
});
