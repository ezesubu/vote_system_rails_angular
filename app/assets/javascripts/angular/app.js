var app = angular.module('app', ['templates', 'ngResource', 'oitozero.ngSweetAlert', 'blockUI']);

app.config([
    '$httpProvider', function($httpProvider) {
        return $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);

app.factory("Nominate", function($resource) {
    return $resource("nominates/:id", { id: '@id' }, {
        get_by_category:   { method: 'GET', isArray: true, responseType: 'json' },
        index:   { method: 'GET', isArray: true, responseType: 'json' },
        update:  { method: 'PUT', responseType: 'json' },

    });
})


app.factory("Vote", function($resource) {
    return $resource("votes/:id", { id: '@id' }, {
        index:   { method: 'GET', isArray: true, responseType: 'json' },
        update:  { method: 'PUT', responseType: 'json' },
    });
})


app.factory("User", function($resource) {
    return $resource("users/:id", { id: '@id' }, {
        index:   { method: 'GET', isArray: true, responseType: 'json' },
        update:  { method: 'PUT', responseType: 'json' },
        find_by_identificacion:  { method: 'GET', responseType: 'json' }
    });
})