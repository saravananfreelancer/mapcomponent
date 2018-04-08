var Reflux = require('reflux');  
var LoginActions = require('./action');


var LoginStore = Reflux.createStore({  
 listenables: LoginActions,
 data: {},

});

module.exports = LoginStore;