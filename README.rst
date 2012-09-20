===================================================
Overview of js code to access OpenERP with JSON-RPC
===================================================

We use the git capabilities to illustrate 3 implementation of
a client js request to OpenERP using JSON.

All these implementation will:

#. Login to openerp using JSON-RPC
   - store a session id.
   - change HTML to write "Login successfull" along with the session id received.
#. Query OpenERP upon 'res.partner' for fields 'name' and 'city'
   - change HTML to write the result in a HTML list.

The first branch called ``fromscratch`` tries not to include any 
javascript from openerp, and implements the communication layer
with JQuery only.

The second branch ``picked-oe-lib`` tries to make a smart pick of openerp
javascript libraries, (which leads to take a whole bunch of code from openerp)
to get access to the javascript communication layer used by openerp-web
javascript client.

The third branch ``full-oe-lib`` uses the full javascript libraries from
OpenERP.


The default branch ``master`` follows the ``fromscratch`` solution. Feel free
to ask difference between branches so as to get informative differential.


Side note
---------

If you try to test this code and your openerp is not on the same domain,
these javascript solutions will be plagued by cross domain limitations.

https://developer.mozilla.org/en/http_access_control

This means that for each download of json or URL, a first exchange
with the server will asks for some policies. And client HttpRequest
will accept or not the script based on these permissions.

You can force your openerp server to set these headers thanks to
apache when used in proxy mode by adding these in your apache
configuration::

  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
  Header set Access-Control-Allow-Headers "origin, content-type, accept"

