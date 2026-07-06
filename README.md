# Integração ServiceNow ↔ PokéAPI

Formulário customizado no ServiceNow que consulta a [PokéAPI](https://pokeapi.co/) em tempo real e preenche automaticamente os campos do registro com dados do Pokémon digitado (tipo, imagem oficial, número na Pokédex e estatísticas base).

Projeto criado para praticar integração de APIs externas na plataforma ServiceNow, combinando **Client Script**, **GlideAjax** e **Script Include** com chamadas REST outbound via `RESTMessageV2`.

## Como funciona

```
Usuário digita nome  →  Client Script (onChange)  →  GlideAjax
                                                          │
                                                          ▼
                                            Script Include (ApiPokemon)
                                                          │
                                                          ▼
                                              RESTMessageV2 → PokéAPI
                                                          │
                                                          ▼
                                          JSON de resposta → preenche o formulário
```

1. O usuário digita o nome do Pokémon em um campo do formulário.
2. Um **Client Script** do tipo `onChange` dispara uma chamada assíncrona via `GlideAjax` para um **Script Include**.
3. O Script Include (`ApiPokemon`) monta uma requisição REST GET usando `sn_ws.RESTMessageV2` e consulta a PokéAPI.
4. A resposta é validada, empacotada em um objeto padronizado (`{ success, data }`) e devolvida como JSON para o cliente.
5. O Client Script recebe o retorno, faz o parsing e preenche os campos: tipo, imagem oficial, número na Pokédex e as estatísticas base (HP, ataque, defesa, velocidade).

## Arquivos

- `client-script.js` — Client Script `onChange`, responsável por disparar a busca e preencher o formulário.
- `script-include.js` — Script Include `ApiPokemon`, responsável pela chamada REST à PokéAPI.

## Tecnologias e conceitos aplicados

- **GlideAjax / AbstractAjaxProcessor** — comunicação assíncrona cliente-servidor sem reload de página.
- **RESTMessageV2** — chamadas REST outbound nativas do ServiceNow.
- **Parsing de JSON aninhado** — navegação em estruturas complexas retornadas por APIs externas (arrays de tipos, stats, sprites).
- **Tratamento de erro com try/catch** — captura de falhas de rede, parsing ou resposta inesperada.
- **Manipulação de campos via GlideForm (`g_form`)** — leitura e escrita de valores, incluindo campo HTML para exibição de imagem.

## Melhorias identificadas (próximos passos)

Documentar os pontos de melhoria é parte do processo — aqui estão os que já identifiquei revisando o próprio código:

- **Sanitização de input**: o nome do Pokémon é concatenado diretamente na URL do endpoint (`req.setEndpoint(url + pokemon)`). Usar `encodeURIComponent(pokemon)` evitaria URLs malformadas com caracteres especiais.
- **Ordem de validação**: o `JSON.parse(res.getBody())` roda antes da verificação do status HTTP. Se a API devolver um corpo inválido em caso de erro, o parse pode falhar antes do tratamento de status esperado.
- **Granularidade das mensagens de erro**: o servidor captura o erro real (`e.message`), mas o cliente sempre exibe uma mensagem genérica ("Erro ao consultar API"). Passar o detalhe do erro para o front ajudaria em debug.
- **Método não utilizado**: o Script Include tem um segundo método (`getPokemonData`) pensado para reuso interno entre scripts server-side, mas que ainda não é chamado por nenhum outro ponto do sistema.
- **Múltiplos tipos de Pokémon**: hoje só o primeiro tipo (`types[0]`) é capturado; Pokémons com dois tipos (ex: Charizard — Fogo/Voador) têm o segundo tipo ignorado.

## Autor

Projeto desenvolvido por Borges como parte de estudos práticos na plataforma ServiceNow, durante transição de carreira de Logística para Tecnologia.

