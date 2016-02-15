(function() {

    var config = {
        xml: {
            aviso: 'Hey!!!'
        }
    };
    
    var current = window.location.search.substring(1);
    
    var options = config[current];
    
    $(document).ready(function() {
        templateInit(options);
    })

    // // query string
    // function getQueryVariable(variable) {
    //     // assumes no hash
    //     var query = window.location.search.substring(1);
    //     var vars = query.split('&');
    //     for (var i = 0; i < vars.length; i++) {
    //         var pair = vars[i].split('=');
    //         if (decodeURIComponent(pair[0]) == variable) {
    //             return decodeURIComponent(pair[1]);
    //         }
    //     }
    // }
    
})();


