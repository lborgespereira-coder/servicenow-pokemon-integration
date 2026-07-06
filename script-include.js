var ApiPokemon = Class.create();
ApiPokemon.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    getPokemon: function() {
        var result = {};

        try {
            var pokemon = this.getParameter('sysparm_pokemon');

            var req = new sn_ws.RESTMessageV2();
            req.setEndpoint('https://pokeapi.co/api/v2/pokemon/' + pokemon);
            req.setHttpMethod('get');
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestHeader('User-Agent', 'ServiceNow');

            var res = req.execute();
            var statusCode = res.getStatusCode();
            var body = JSON.parse(res.getBody());

            if (statusCode == 200) {
                result.success = true;
                result.data = body;

                return JSON.stringify(result);
            } else {
                result.success = false;
                result.data = 'Erro HTTP ao consultar PokeAPI';

                return JSON.stringify(result);

            }
        } catch (e) {
            result.success = false;
            result.data = e.message;

            return JSON.stringify(result);
        }
    },

    getPokemonData: function(pokemon) {
        var req = new sn_ws.RESTMessageV2();
        req.setEndpoint('https://pokeapi.co/api/v2/pokemon/' + pokemon);
        req.setHttpMethod('get');

        var res = req.execute();
        if (res.getStatusCode() == 200) {
            return JSON.parse(res.getBody());
        }

        return null;
    },


    type: 'ApiPokemon'
});
