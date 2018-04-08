
module.exports = {

    // Promisifying POST request
    post(url, params) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Usual XHR settings
            var req = new XMLHttpRequest();
            req.open("POST", url);
            if(sessionStorage.token_type && sessionStorage.access_token) {
                var bearer = sessionStorage.token_type == "bearer" ?"Bearer": sessionStorage.token_type;
                req.setRequestHeader("Authorization", bearer + " " + sessionStorage.access_token);            
            }
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.setRequestHeader("Accept", "application/json");

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response data
                    resolve(JSON.parse(req.response));
                }
                else {
                    // Otherwise reject with the status text
                    // which will be a meaningful error
                    var errorObj = (req.response);
                    reject(Error(errorObj.desc));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send(JSON.stringify(params));
        });
    },

    // Promisifying GET request
    get(url) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Usual XHR settings
            var req = new XMLHttpRequest();
            req.open("GET", url);
            if(sessionStorage.token_type && sessionStorage.access_token) {
                var bearer = sessionStorage.token_type == "bearer" ?"Bearer": sessionStorage.token_type;
                req.setRequestHeader("Authorization", bearer + " " + sessionStorage.access_token);            
            }
            req.setRequestHeader("Accept", "application/json");
            req.responseType = "json";

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response data
                    resolve(JSON.parse(req.response));
                }
                else {
                    // Otherwise reject with the status text
                    // which will be a meaningful error
                    //var errorObj = (req);
                    reject(Error("API Fails"));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    },

	
};