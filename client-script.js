function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    var name = g_form.getValue('u_name');
    g_form.showFieldMsg('u_name', 'Buscando Pokemon', 'info');
    g_form.clearMessages();

    var ga = new GlideAjax('global.ApiPokemon');
    ga.addParam('sysparm_name', 'getPokemon');
    ga.addParam('sysparm_pokemon', name);

    ga.getXMLAnswer(pegarPokemon);

    function pegarPokemon(response) {
        g_form.hideFieldMsg('u_name',true);
        var res = JSON.parse(response);
        console.log(res);
        console.log(res.data.stats);
        console.log(res.data.sprites);

        if (res.success) {
            var data = res.data;

            //type
            g_form.setValue('u_type', data.types[0].type.name);
            //img
            var img = data.sprites.other['official-artwork'].front_default;
            var link = "<p><img src=' "+ img +"' alt='' width='500' height='500' data-library='false'></p>"
            g_form.setValue('u_pokemon_image', link);

            g_form.setValue('u_number', data.id);

            
        
            //stats
            var stats = data.stats;
            var hp = 0;
            var attack = 0;
            var defense = 0;
            var speed = 0;

            for (var i = 0; i < stats.length; i++) {

                var statName = stats[i].stat.name;
                var value = stats[i].base_stat;

                if (statName == 'hp') hp = value;
                if (statName == 'attack') attack = value;
                if (statName == 'defense') defense = value;
                if (statName == 'speed') speed = value;
            }
            //preencher campos
            g_form.setValue('u_hp', hp);
            g_form.setValue('u_atack', attack);
            g_form.setValue('u_defense', defense);
            g_form.setValue('u_speed', speed);
        

        } else {
            g_form.addErrorMessage('Erro ao consultar API');
        }
    }
}
