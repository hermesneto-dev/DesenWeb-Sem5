# Semana 05 — Objetos, APIs e Assincronismo

Abra `index.html` no navegador com acesso à internet. O projeto valida pedidos, filtra os pagos e calcula o total com `reduce`. Também contém buscador de CEP com ViaCEP e mini Pokédex com PokéAPI.

Os quatro estados são tratados: carregando, erro, vazio/não encontrado e sucesso. As respostas externas são inseridas com `createElement` e `textContent`, evitando `innerHTML` para dados de APIs. O botão é desabilitado durante a busca e as requisições possuem timeout de cinco segundos.

`Promise.all` pode ser mais rápido que vários `await` sequenciais porque inicia requisições independentes em paralelo e espera todas juntas.
