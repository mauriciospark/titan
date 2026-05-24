/*
  ============================================================================
  PROPRIETÁRIO: Mauricio Spark
  MARCA:        Spark Mauricio
  PROJETO:      TITAN
  VERSÃO:       v1.0.0
  LINHAGEM:     SPARK
  ============================================================================
  Documento de Planejamento de Escopo
  COPYRIGHT: © 2026 / Mauricio Spark. Todos os direitos reservados.
  ============================================================================
*/
// js/script.js

/**
 * Objeto que armazena os dados da viagem atual
 * @type {Object}
 * @property {Array} passageiros - Lista de passageiros da viagem
 * @property {Array} cargas - Lista de cargas da viagem
 * @property {Array} historicoItens - Histórico de todos os itens processados
 */
let viagemAtual = {
    passageiros: [],
    cargas: [],
    historicoItens: []
};

/**
 * Objeto que armazena as configurações do sistema
 * @type {Object}
 * @property {number} precoAdulto - Preço da passagem para adultos
 * @property {number} precoCrianca - Preço da passagem para crianças
 * @property {number} precoKg - Preço por quilo de carga
 */
let configuracoes = {
    precoAdulto: 150,
    precoCrianca: 75,
    precoKg: 2
};

/**
 * Valida e sanitiza entrada de texto
 * @param {string} input - Texto a ser validado
 * @param {number} maxLength - Comprimento máximo permitido
 * @returns {string} Texto sanitizado
 */
function sanitizarTexto(input, maxLength = 100) {
    if (!input) return "";
    return input.toString().trim().slice(0, maxLength).replace(/[<>"'&]/g, "");
}

/**
 * Valida número positivo
 * @param {string|number} valor - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number|null} Número validado ou null se inválido
 */
function validarNumero(valor, min = 0, max = Infinity) {
    const num = parseFloat(valor);
    if (isNaN(num) || num < min || num > max) return null;
    return num;
}

// ==================== CACHE DE ELEMENTOS DOM ====================
/**
 * Cache de elementos DOM para melhorar performance
 */
const domElements = {
    smartInput: null,
    feedbackPanel: null,
    feedbackPassengerText: null,
    feedbackCargoText: null,
    statPassageiros: null,
    statAdultos: null,
    statCriancas: null,
    statReceitaPassagens: null,
    statCarga: null,
    statVolumes: null,
    statReceitaFrete: null,
    listaPassageiros: null,
    listaCargas: null,
    previewPassagem: null,
    historicoViagens: null,
    btnProcessar: null
};

/**
 * Inicializa o cache de elementos DOM
 */
function inicializarCacheDOM() {
    domElements.smartInput = document.getElementById("smart-input");
    domElements.feedbackPanel = document.getElementById("feedback-panel");
    domElements.feedbackPassengerText = document.getElementById("feedback-passenger-text");
    domElements.feedbackCargoText = document.getElementById("feedback-cargo-text");
    domElements.statPassageiros = document.getElementById("stat-passageiros");
    domElements.statAdultos = document.getElementById("stat-adultos");
    domElements.statCriancas = document.getElementById("stat-criancas");
    domElements.statReceitaPassagens = document.getElementById("stat-receita-passagens");
    domElements.statCarga = document.getElementById("stat-carga");
    domElements.statVolumes = document.getElementById("stat-volumes");
    domElements.statReceitaFrete = document.getElementById("stat-receita-frete");
    domElements.listaPassageiros = document.getElementById("lista-passageiros");
    domElements.listaCargas = document.getElementById("lista-cargas");
    domElements.previewPassagem = document.getElementById("preview-passagem");
    domElements.historicoViagens = document.getElementById("historico-viagens");
    domElements.btnProcessar = document.getElementById("btn-processar");
}

// ==================== INICIALIZAÇÃO ====================
/**
 * Inicializa o sistema quando o DOM estiver carregado
 * Carrega configurações e histórico, e configura event listeners
 */
document.addEventListener("DOMContentLoaded", () => {
    inicializarCacheDOM();
    carregarConfiguracoes();
    carregarHistoricoGlobal();
    
    // Event listener para input em tempo real (feedback visual)
    domElements.smartInput.addEventListener("input", (e) => {
        const inputStr = e.target.value;
        if (inputStr.trim()) {
            const resultado = interpretarLinhaTexto(inputStr);
            if (resultado) {
                mostrarFeedbackPanel(resultado);
            } else {
                ocultarFeedbackPanel();
            }
        } else {
            ocultarFeedbackPanel();
        }
    });
    
    domElements.btnProcessar.addEventListener("click", () => {
        const inputStr = domElements.smartInput.value;
        if (!inputStr) return;

        // Estado de carregamento
        domElements.btnProcessar.disabled = true;
        domElements.btnProcessar.textContent = "Processando...";

        // Detectar tipo de entrada e usar parser apropriado
        const lowerInput = inputStr.toLowerCase();
        let resultado = null;
        
        if (lowerInput.includes('carga:') && (lowerInput.includes('responsável:') || lowerInput.includes('responsavel:'))) {
            // Entrada de mercadoria apenas
            resultado = interpretarMercadoria(inputStr);
            if (resultado) {
                cadastrarMercadoria(resultado.descricao, resultado.peso, 0, resultado.responsavel, resultado.destino);
            }
        } else if (lowerInput.includes('carga:')) {
            // Entrada combinada (passageiro + carga)
            resultado = interpretarLinhaTexto(inputStr);
            if (resultado) {
                adicionarAoSistema(resultado);
            }
        } else {
            // Entrada de passageiro apenas
            resultado = interpretarPassageiro(inputStr);
            if (resultado) {
                cadastrarPassageiro(resultado.nome, resultado.idade, resultado.destino);
            }
        }

        if (resultado) {
            domElements.smartInput.value = ""; // limpa campo
            ocultarFeedbackPanel();
        }

        // Restaurar estado
        domElements.btnProcessar.disabled = false;
        domElements.btnProcessar.textContent = "Processar e Cadastrar";
    });

    document.getElementById("btn-fechar-viagem").addEventListener("click", finalizarEArmazenarViagem);
    
    // Event listeners para o formulário estruturado
    document.getElementById("btn-toggle-form").addEventListener("click", toggleFormulario);
    document.getElementById("btn-close-form").addEventListener("click", fecharFormulario);
    document.getElementById("btn-limpar-form").addEventListener("click", limparFormulario);
    document.getElementById("btn-confirmar-form").addEventListener("click", confirmarFormulario);
    
    // Atalho de teclado F2 para abrir formulário
    // Enter no input inteligente para processar
    document.addEventListener("keydown", (e) => {
        if (e.key === "F2") {
            e.preventDefault();
            toggleFormulario();
        }
        if (e.key === "Escape") {
            fecharFormulario();
        }
        if (e.key === "Enter" && document.activeElement.id === "smart-input") {
            e.preventDefault();
            document.getElementById("btn-processar").click();
        }
    });
    
    // Atalhos de teclado no formulário estruturado
    document.getElementById("structured-form").addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            confirmarFormulario();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            fecharFormulario();
        }
    });
});

/**
 * Cadastra apenas um passageiro (sem carga)
 * @param {string} nome - Nome do passageiro
 * @param {number} idade - Idade do passageiro
 * @param {string} destino - Destino da viagem
 */
function cadastrarPassageiro(nome, idade, destino) {
    const perfil = idade < 12 ? "Criança" : "Adulto";
    
    const passageiro = {
        nome,
        idade,
        perfil,
        destino
    };
    
    viagemAtual.passageiros.push(passageiro);
    viagemAtual.historicoItens.push({
        nome,
        idade,
        perfil,
        destino,
        cargaDesc: "Nenhuma",
        cargaPeso: 0,
        cargaValor: 0
    });
    
    atualizarInterfaceDOM();
    
    // Mostra preview no Módulo de Passageiros
    domElements.previewPassagem.innerText = gerarLayoutBilhetePassageiro({
        nome,
        idade,
        perfil,
        destino
    }, configuracoes);
}

/**
 * Cadastra apenas uma mercadoria/carga (sem passageiro)
 * @param {string} descricao - Descrição da carga
 * @param {number} peso - Peso da carga em kg
 * @param {number} valor - Valor da carga (opcional)
 * @param {string} responsavel - Nome do responsável
 * @param {string} destino - Destino da carga
 */
function cadastrarMercadoria(descricao, peso, valor, responsavel, destino) {
    const valorFinal = valor || (peso * configuracoes.precoKg);
    
    const carga = {
        desc: descricao,
        peso,
        dono: responsavel,
        destino,
        cargaValor: valorFinal
    };
    
    viagemAtual.cargas.push(carga);
    
    atualizarInterfaceDOM();
}

// ==================== FUNÇÕES DO FORMULÁRIO ESTRUTURADO ====================
/**
 * Alterna a visibilidade do formulário estruturado
 */
function toggleFormulario() {
    const form = document.getElementById("structured-form");
    const isHidden = form.style.display === "none";
    
    if (isHidden) {
        form.style.display = "block";
        document.getElementById("form-nome").focus();
    } else {
        form.style.display = "none";
    }
}

/**
 * Fecha o formulário estruturado
 */
function fecharFormulario() {
    const form = document.getElementById("structured-form");
    form.style.display = "none";
    limparFormulario();
}

/**
 * Pré-preenche o formulário estruturado com dados do input de texto
 */
function preencherFormularioDoInput() {
    const inputStr = domElements.smartInput.value;
    if (!inputStr.trim()) return;
    
    const resultado = interpretarLinhaTexto(inputStr);
    if (resultado) {
        document.getElementById("form-nome").value = resultado.nome;
        document.getElementById("form-idade").value = resultado.idade;
        document.getElementById("form-destino").value = resultado.destino;
        
        if (resultado.cargaPeso > 0) {
            document.getElementById("form-carga-desc").value = resultado.cargaDesc;
            document.getElementById("form-carga-peso").value = resultado.cargaPeso + "kg";
        }
    }
}

/**
 * Limpa todos os campos do formulário estruturado
 */
function limparFormulario() {
    document.getElementById("form-nome").value = "";
    document.getElementById("form-idade").value = "";
    document.getElementById("form-destino").value = "";
    document.getElementById("form-carga-desc").value = "";
    document.getElementById("form-carga-peso").value = "";
    document.getElementById("form-carga-valor").value = "";
    document.getElementById("form-carga-resp").value = "";
    document.getElementById("form-carga-dest").value = "";
}

/**
 * Confirma e salva os dados do formulário estruturado
 * Processa três cenários independentes:
 * 1. Somente Passageiro: salva apenas na Lista de Passageiros
 * 2. Somente Carga: salva apenas no Manifesto de Cargas
 * 3. Os Dois Juntos: salva passageiro e carga vinculados
 */
function confirmarFormulario() {
    const btnConfirmar = document.getElementById("btn-confirmar-form");
    
    // Coletar dados do passageiro
    const nome = sanitizarTexto(document.getElementById("form-nome").value.trim(), 100);
    const idadeTexto = sanitizarTexto(document.getElementById("form-idade").value.trim(), 10);
    const destinoPassageiro = sanitizarTexto(document.getElementById("form-destino").value.trim(), 50);
    
    // Coletar dados da carga
    const descricao = sanitizarTexto(document.getElementById("form-carga-desc").value.trim(), 200);
    const pesoTexto = sanitizarTexto(document.getElementById("form-carga-peso").value.trim(), 20);
    const valorTexto = sanitizarTexto(document.getElementById("form-carga-valor").value.trim(), 20);
    const responsavel = sanitizarTexto(document.getElementById("form-carga-resp").value.trim(), 100);
    const destinoCarga = sanitizarTexto(document.getElementById("form-carga-dest").value.trim(), 50);
    
    // Determinar quais campos estão preenchidos
    const temPassageiro = nome && nome.length >= 2;
    const temCarga = descricao && descricao.length >= 2;
    
    // Validar: pelo menos um bloco deve estar preenchido
    if (!temPassageiro && !temCarga) {
        alert("Por favor, preencha os dados do passageiro ou da mercadoria.");
        return;
    }
    
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = "Salvando...";
    
    // Cenário 1: Somente Passageiro
    if (temPassageiro && !temCarga) {
        const idadeMatch = idadeTexto.match(/\d+/);
        const idade = idadeMatch ? parseInt(idadeMatch[0]) : 18;
        
        if (idade < 0 || idade > 120) {
            alert("Idade inválida. Deve estar entre 0 e 120 anos.");
            document.getElementById("form-idade").focus();
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "Confirmar e Salvar";
            return;
        }
        
        const destino = destinoPassageiro || "Não Informado";
        cadastrarPassageiro(nome, idade, destino);
    }
    // Cenário 2: Somente Carga
    else if (!temPassageiro && temCarga) {
        if (!responsavel) {
            alert("Por favor, preencha o nome do responsável.");
            document.getElementById("form-carga-resp").focus();
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "Confirmar e Salvar";
            return;
        }
        
        let peso = 0;
        if (pesoTexto) {
            const pesoMatch = pesoTexto.match(/(\d+(?:\.\d+)?)/);
            if (pesoMatch) {
                peso = parseFloat(pesoMatch[1]);
                if (peso < 0 || peso > 10000) {
                    alert("Peso inválido. Deve estar entre 0 e 10000 kg.");
                    document.getElementById("form-carga-peso").focus();
                    btnConfirmar.disabled = false;
                    btnConfirmar.textContent = "Confirmar e Salvar";
                    return;
                }
            }
        }
        
        let valor = 0;
        if (valorTexto) {
            valor = parseFloat(valorTexto) || 0;
            if (valor < 0 || valor > 100000) {
                alert("Valor inválido. Deve estar entre 0 e R$ 100.000,00.");
                document.getElementById("form-carga-valor").focus();
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = "Confirmar e Salvar";
                return;
            }
        }
        
        const destino = destinoCarga || "Não Informado";
        cadastrarMercadoria(descricao, peso, valor, responsavel, destino);
    }
    // Cenário 3: Os Dois Juntos
    else if (temPassageiro && temCarga) {
        // Validar passageiro
        const idadeMatch = idadeTexto.match(/\d+/);
        const idade = idadeMatch ? parseInt(idadeMatch[0]) : 18;
        
        if (idade < 0 || idade > 120) {
            alert("Idade inválida. Deve estar entre 0 e 120 anos.");
            document.getElementById("form-idade").focus();
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "Confirmar e Salvar";
            return;
        }
        
        // Validar carga
        if (!responsavel) {
            alert("Por favor, preencha o nome do responsável.");
            document.getElementById("form-carga-resp").focus();
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "Confirmar e Salvar";
            return;
        }
        
        let peso = 0;
        if (pesoTexto) {
            const pesoMatch = pesoTexto.match(/(\d+(?:\.\d+)?)/);
            if (pesoMatch) {
                peso = parseFloat(pesoMatch[1]);
                if (peso < 0 || peso > 10000) {
                    alert("Peso inválido. Deve estar entre 0 e 10000 kg.");
                    document.getElementById("form-carga-peso").focus();
                    btnConfirmar.disabled = false;
                    btnConfirmar.textContent = "Confirmar e Salvar";
                    return;
                }
            }
        }
        
        let valor = 0;
        if (valorTexto) {
            valor = parseFloat(valorTexto) || 0;
            if (valor < 0 || valor > 100000) {
                alert("Valor inválido. Deve estar entre 0 e R$ 100.000,00.");
                document.getElementById("form-carga-valor").focus();
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = "Confirmar e Salvar";
                return;
            }
        }
        
        // Salvar passageiro
        const destinoP = destinoPassageiro || "Não Informado";
        cadastrarPassageiro(nome, idade, destinoP);
        
        // Salvar carga vinculada ao passageiro
        const destinoC = destinoCarga || destinoP;
        const resp = responsavel || nome;
        cadastrarMercadoria(descricao, peso, valor, resp, destinoC);
    }
    
    limparFormulario();
    fecharFormulario();
    domElements.smartInput.value = "";
    
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = "Confirmar e Salvar";
}

// ==================== FUNÇÕES PRINCIPAIS ====================
/**
 * Mostra o painel de feedback com os dados interpretados
 * @param {Object} item - Objeto com os dados interpretados
 */
function mostrarFeedbackPanel(item) {
    domElements.feedbackPanel.style.display = "block";
    domElements.feedbackPassengerText.textContent = `Passageiro: ${item.nome} (${item.idade} anos) | Destino: ${item.destino}`;
    
    if (item.cargaPeso > 0) {
        domElements.feedbackCargoText.textContent = `Mercadoria: ${item.cargaDesc} (${item.cargaPeso}kg) | Destino: ${item.destino}`;
    } else {
        domElements.feedbackCargoText.textContent = "Mercadoria: Nenhuma";
    }
}

/**
 * Oculta o painel de feedback
 */
function ocultarFeedbackPanel() {
    domElements.feedbackPanel.style.display = "none";
}

/**
 * Adiciona um item processado ao sistema de viagem
 * @param {Object} item - Objeto com os dados do passageiro/carga
 * @param {string} item.nome - Nome do passageiro
 * @param {string} item.perfil - Perfil (Adulto/Criança)
 * @param {string} item.destino - Destino da viagem
 * @param {string} item.cargaDesc - Descrição da carga
 * @param {number} item.cargaPeso - Peso da carga em kg
 * @param {number} item.cargaValor - Valor manual da carga (opcional)
 */
function adicionarAoSistema(item) {
    viagemAtual.passageiros.push({ nome: item.nome, perfil: item.perfil, destino: item.destino, idade: item.idade });
    if (item.cargaPeso > 0) {
        viagemAtual.cargas.push({ desc: item.cargaDesc, peso: item.cargaPeso, dono: item.nome, destino: item.destino, cargaValor: item.cargaValor });
    }
    viagemAtual.historicoItens.push(item);

    atualizarInterfaceDOM();
    
    // Mostra preview no Módulo de Passageiros
    domElements.previewPassagem.innerText = gerarLayoutTicket(item, configuracoes, tipoEmissaoAtual);
}

/**
 * Atualiza todos os elementos da interface com os dados atuais
 * Atualiza totais, tabelas de passageiros e cargas, e métricas financeiras
 */
function atualizarInterfaceDOM() {
    // 1. Atualiza Métricas de Passageiros
    domElements.statPassageiros.innerText = viagemAtual.passageiros.length;
    domElements.statAdultos.innerText = viagemAtual.historicoItens.filter(i => i.perfil === "Adulto").length;
    domElements.statCriancas.innerText = viagemAtual.historicoItens.filter(i => i.perfil === "Criança").length;
    
    // Calcula receita de passagens
    const receitaPassagens = viagemAtual.historicoItens.reduce((acc, item) => {
        const precoBase = item.perfil === "Adulto" ? configuracoes.precoAdulto : configuracoes.precoCrianca;
        return acc + precoBase;
    }, 0);
    domElements.statReceitaPassagens.innerText = `R$ ${receitaPassagens.toFixed(2)}`;
    
    // 2. Atualiza Métricas de Cargas
    const pesoTotal = viagemAtual.cargas.reduce((acc, c) => acc + (c.disabled ? 0 : c.peso), 0);
    domElements.statCarga.innerText = `${pesoTotal} kg`;
    domElements.statVolumes.innerText = viagemAtual.cargas.length;
    
    // Calcula receita de frete (usando valor manual se disponível, senão calcula pelo peso)
    const receitaFrete = viagemAtual.cargas.reduce((acc, c) => {
        if (c.disabled) return acc;
        return acc + (c.cargaValor || (c.peso * configuracoes.precoKg));
    }, 0);
    domElements.statReceitaFrete.innerText = `R$ ${receitaFrete.toFixed(2)}`;

    // 3. Atualiza Tabela de Passageiros
    domElements.listaPassageiros.innerHTML = viagemAtual.passageiros.map((p, index) => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.idade || '-'} (${p.perfil})</td>
            <td>${p.destino}</td>
            <td>
                <button onclick="removerPassageiro(${index})" class="btn-small btn-danger">Remover</button>
            </td>
        </tr>
    `).join('');

    // 4. Atualiza Tabela de Cargas
    domElements.listaCargas.innerHTML = viagemAtual.cargas.map((c, index) => {
        const valorCarga = c.cargaValor || (c.peso * configuracoes.precoKg);
        return `
        <tr>
            <td>${c.desc}</td>
            <td>${c.peso}kg</td>
            <td>R$ ${valorCarga.toFixed(2)}</td>
            <td>${c.dono}</td>
            <td>${c.destino}</td>
            <td>
                <button onclick="removerCarga(${index})" class="btn-small btn-danger">Remover</button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * Remove um passageiro da lista
 * @param {number} index - Índice do passageiro a ser removido
 */
function removerPassageiro(index) {
    const passageiro = viagemAtual.passageiros[index];
    viagemAtual.passageiros.splice(index, 1);
    
    // Remove também do histórico se houver correspondência
    const historicoIndex = viagemAtual.historicoItens.findIndex(i => i.nome === passageiro.nome);
    if (historicoIndex !== -1) {
        viagemAtual.historicoItens.splice(historicoIndex, 1);
    }
    
    atualizarInterfaceDOM();
}

/**
 * Remove uma carga da lista
 * @param {number} index - Índice da carga a ser removida
 */
function removerCarga(index) {
    viagemAtual.cargas.splice(index, 1);
    atualizarInterfaceDOM();
}

/**
 * Imprime a guia de carga
 */
function imprimirGuiaCarga() {
    if (viagemAtual.cargas.length === 0) {
        alert("Não há cargas cadastradas para imprimir.");
        return;
    }
    
    const pesoTotal = viagemAtual.cargas.reduce((acc, c) => acc + c.peso, 0);
    const receitaFrete = viagemAtual.cargas.reduce((acc, c) => acc + c.peso * configuracoes.precoKg, 0);
    
    let guia = `
====================================
        GUIA DE CARGA        
====================================
TOTAL VOLUMES: ${viagemAtual.cargas.length}
PESO TOTAL: ${pesoTotal} kg
RECEITA FRETE: R$ ${receitaFrete.toFixed(2)}
------------------------------------
`;
    
    viagemAtual.cargas.forEach((c, i) => {
        guia += `${i + 1}. ${c.desc} (${c.peso}kg) - Dono: ${c.dono} - Destino: ${c.destino}\n`;
    });
    
    guia += `====================================
        SISTEMA TITAN LOCAL        
        `;
    
    alert(guia);
}

// ==================== MÓDULO CONFIGURAÇÃO ====================
/**
 * Salva as configurações de preços no localStorage
 */
function salvarConfiguracoes() {
    const btnSalvar = document.querySelector('#modulo-configuracoes button');
    const precoAdulto = validarNumero(document.getElementById("conf-preco-adulto").value, 0, 10000);
    const precoCrianca = validarNumero(document.getElementById("conf-preco-crianca").value, 0, 10000);
    const precoKg = validarNumero(document.getElementById("conf-preco-kg").value, 0, 1000);
    
    if (precoAdulto === null) {
        alert("Preço de adulto inválido. Deve ser entre R$ 0,00 e R$ 10.000,00.");
        return;
    }
    
    if (precoCrianca === null) {
        alert("Preço de criança inválido. Deve ser entre R$ 0,00 e R$ 10.000,00.");
        return;
    }
    
    if (precoKg === null) {
        alert("Preço por KG inválido. Deve ser entre R$ 0,00 e R$ 1.000,00.");
        return;
    }
    
    // Estado de carregamento
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";
    
    configuracoes.precoAdulto = precoAdulto;
    configuracoes.precoCrianca = precoCrianca;
    configuracoes.precoKg = precoKg;
    localStorage.setItem("titan_configs", JSON.stringify(configuracoes));
    
    // Restaurar estado
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Salvar Regras";
    alert("Configurações salvas com sucesso!");
}

/**
 * Carrega as configurações de preços do localStorage
 */
function carregarConfiguracoes() {
    const salvas = localStorage.getItem("titan_configs");
    if (salvas) {
        configuracoes = JSON.parse(salvas);
        document.getElementById("conf-preco-adulto").value = configuracoes.precoAdulto;
        document.getElementById("conf-preco-crianca").value = configuracoes.precoCrianca;
        document.getElementById("conf-preco-kg").value = configuracoes.precoKg;
    }
}

// ==================== MÓDULO ARMAZENAMENTO ====================
/**
 * Finaliza a viagem atual e armazena os dados no localStorage
 * Reseta o sistema para uma nova viagem
 */
function finalizarEArmazenarViagem() {
    if (viagemAtual.historicoItens.length === 0) {
        alert("Nenhum dado na viagem atual para ser salvo.");
        return;
    }

    let historicoGlobal = JSON.parse(localStorage.getItem("titan_historico_viagens") || "[]");
    
    const dadosSalvar = {
        id: "VIAGEM_" + Date.now(),
        data: new Date().toLocaleString("pt-BR"),
        dados: viagemAtual
    };

    historicoGlobal.push(dadosSalvar);
    localStorage.setItem("titan_historico_viagens", JSON.stringify(historicoGlobal));

    // Reset Sistema
    viagemAtual = { passageiros: [], cargas: [], historicoItens: [] };
    atualizarInterfaceDOM();
    document.getElementById("preview-passagem").innerText = "";
    
    alert("Viagem encerrada com sucesso e dados armazenados localmente!");
    carregarHistoricoGlobal();
}

/**
 * Carrega e exibe o histórico de viagens salvas
 */
function carregarHistoricoGlobal() {
    const historicoGlobal = JSON.parse(localStorage.getItem("titan_historico_viagens") || "[]");
    
    domElements.historicoViagens.innerHTML = historicoGlobal.length === 0 
        ? '<p style="color: var(--text-muted);">Nenhuma viagem salva ainda.</p>'
        : historicoGlobal.map(v => `
        <div style="background:#0f172a; padding:10px; margin-top:10px; border-radius:4px; font-size:0.85rem;">
            <strong>ID: ${v.id}</strong> - ${v.data}<br>
            Passageiros: ${v.dados.passageiros.length} | Cargas cadastradas: ${v.dados.cargas.length}
        </div>
    `).join('');
}