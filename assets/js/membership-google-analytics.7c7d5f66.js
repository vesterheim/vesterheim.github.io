var queryString = window.location.search.substring(1);


var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
 
    // Split into key/value pairs
    queries = queryString.split('&');
 
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    return params;
};

var parseMembershipItem = function( levelString, typeString, renewString ) {
  var params = {};
  params.level = levelString.substring(0, levelString.indexOf('(') + - 1 );
  params.cost = parseFloat(levelString.substring(levelString.indexOf('$') + 1 ).replace(/[$,]/g, ''));
  params.category = 'Membership';
  if (typeString === 'Gift') {
    params.category = 'Gift Membership';
  }
  if (renewString === 'Renew') {
    params.category = 'Renewal ' + params.category;
  }
  else {
    params.category = renewString + ' ' + params.category;
  }
  return params;
};

var parseDonation = function() {
    var amount, i, l;
    for ( i = 0, l = arguments.length; i < l; i++ ) {
      amount = parseFloat(arguments[i].replace(/[$,]/g, ''));
      if (amount > 0) {
        return amount;
      }
    }
    return false;
};

var params = parseQueryString(queryString);

if (params.id && params.revenue) {
  ga('require', 'ecommerce');
  ga('ecommerce:addTransaction', {
    'id': params.id,
    'affiliation': 'Membership',
    'revenue': parseFloat(params.revenue)
  }); 
  if (params.level) {
    var membership = parseMembershipItem(params.level, params.for, params.type);
    ga('ecommerce:addItem', {
      'id': params.id,
      'name': membership.level,
      'category': membership.category,
      'price': parseFloat(membership.cost),
      'quantity': '1'
    });     
  }

  if (params.plustwo == 'Yes') { 
    ga('ecommerce:addItem', {
      'id': params.id,
      'name': 'Plus Two',
      'category': 'Membership Add-on',
      'price': '25.00',
      'quantity': '1'
    }); 
  }

  if (params.letter == 'Yes') {
    ga('ecommerce:addItem', {
      'id': params.id,
      'name': 'Rosemaling Letter',
      'category': 'Membership Add-on',
      'price': '15.00',
      'quantity': '1'
    });       
  }
  if (params.iletter == 'Yes') {
    ga('ecommerce:addItem', {
      'id': params.id,
      'name': 'International Rosemaling Letter',
      'category': 'Membership Add-on',
      'price': '25.00',
      'quantity': '1'
    }); 
  }
  var donation = parseDonation(params.dammount, params.dchoice);
  if (donation) { 
    ga('ecommerce:addItem', {
      'id': params.id,
      'name': 'Annual Fund Donation',
      'category': 'Donation',
      'price': donation,
      'quantity': '1'
    });   
  }
  ga('ecommerce:send');
}