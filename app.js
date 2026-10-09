// Semana 05 — Objetos, validação, Fetch API e estados da interface.

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Carlos", valor: 80, status: "pendente" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "Dani", valor: -10, status: "pago" },
];

// Valida, filtra e totaliza os pedidos com métodos de array.
const pedidosValidos = pedidos.filter((pedido) => pedido.cliente.trim() && Number.isFinite(pedido.valor) && pedido.valor > 0);
const pedidosPagos = pedidosValidos.filter((pedido) => pedido.status === "pago");
const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
pedidosPagos.forEach((pedido) => console.log(`${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`));
console.log("Total faturado:", totalFaturado.toFixed(2));

const cepForm = document.querySelector("#formulario-cep");
const cepInput = document.querySelector("#cep");
const cepButton = document.querySelector("#botao-cep");
const cepStatus = document.querySelector("#status");
const cepResult = document.querySelector("#resultado");
const historyList = document.querySelector("#historico");
const cepHistory = [];

function setCepStatus(message) {
  cepStatus.textContent = message;
}

function renderCep(data) {
  // Dados externos entram com textContent, evitando interpretação de HTML.
  cepResult.replaceChildren();
  const fields = [
    ["Rua", data.logradouro],
    ["Bairro", data.bairro],
    ["Cidade", data.localidade],
    ["UF", data.uf],
  ];
  fields.forEach(([label, value]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value || "Não informado";
    cepResult.append(term, description);
  });
}

function renderHistory() {
  historyList.replaceChildren();
  cepHistory.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.cep} — ${item.cidade}/${item.uf}`;
    historyList.append(listItem);
  });
}

async function buscarCep(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Falha HTTP na consulta do CEP.");
  const data = await response.json();
  if (data.erro) throw new Error("CEP não encontrado.");
  return data;
}

cepForm.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const cep = cepInput.value.trim().replace(/\D/g, "");
  if (!/^\d{8}$/.test(cep)) {
    setCepStatus("Digite exatamente 8 números.");
    return;
  }

  cepButton.disabled = true;
  setCepStatus("Buscando...");
  cepResult.replaceChildren();
  try {
    const data = await buscarCep(cep);
    renderCep(data);
    cepHistory.unshift({ cep, cidade: data.localidade, uf: data.uf });
    renderHistory();
    setCepStatus("");
  } catch (erro) {
    setCepStatus(erro.name === "TimeoutError" ? "A consulta demorou demais." : erro.message || "Falha na conexão.");
  } finally {
    cepButton.disabled = false;
  }
});

const pokemonForm = document.querySelector("#formulario-pokemon");
const pokemonInput = document.querySelector("#pokemon");
const pokemonButton = document.querySelector("#botao-pokemon");
const pokemonStatus = document.querySelector("#status-pokemon");
const pokemonResult = document.querySelector("#resultado-pokemon");

function renderPokemon(data) {
  pokemonResult.replaceChildren();
  const title = document.createElement("h3");
  const image = document.createElement("img");
  const types = document.createElement("p");
  title.textContent = data.name;
  image.src = data.sprites.front_default;
  image.alt = `Imagem de ${data.name}`;
  types.textContent = `Tipos: ${data.types.map((item) => item.type.name).join(", ")}`;
  pokemonResult.append(title, image, types);
}

pokemonForm.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const name = pokemonInput.value.trim().toLowerCase();
  if (!name) return;

  pokemonButton.disabled = true;
  pokemonStatus.textContent = "Buscando...";
  pokemonResult.replaceChildren();
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(response.status === 404 ? "Pokémon não encontrado." : "Falha HTTP na consulta.");
    renderPokemon(await response.json());
    pokemonStatus.textContent = "";
  } catch (erro) {
    pokemonStatus.textContent = erro.name === "TimeoutError" ? "A consulta demorou demais." : erro.message || "Falha na conexão.";
  } finally {
    pokemonButton.disabled = false;
  }
});

// Promise.all inicia consultas independentes em paralelo, reduzindo o tempo total.
