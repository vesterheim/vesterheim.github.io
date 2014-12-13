var queryString = window.location.search.substring(1);


var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
 
    // Split into key/value pairs
    queries = queryString.split("&");
 
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    return params;
};

var params = parseQueryString(queryString);

if (params.id && params.revenue) {
  ga('require', 'ecommerce');
  ga('ecommerce:addTransaction', {
    'id': params.id,
    'affiliation': 'Development',
    'revenue': parseFloat(params.revenue)
  }); 
  ga('ecommerce:send');
}
