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
// js/ticket.js

/**
 * Tipo de emissão atual do bilhete
 * @type {string}
 * @default 'junto'
 */
let tipoEmissaoAtual = 'junto'; // Padrão

// ==================== FUNÇÕES DE EMISSÃO ====================
/**
 * Emite bilhete conjunto (passageiro + carga)
 */
function emitirBilheteConjunto() {
    if (viagemAtual.historicoItens.length === 0) {
        alert("Nenhum passageiro cadastrado para emitir bilhete.");
        return;
    }
    const ultimoItem = viagemAtual.historicoItens[viagemAtual.historicoItens.length - 1];
    const previewArea = document.getElementById("preview-passagem");
    previewArea.innerText = gerarLayoutBilheteConjunto(ultimoItem, configuracoes);
    window.print();
}

/**
 * Emite bilhete apenas de passageiro (sem carga)
 */
function emitirBilhetePassageiro() {
    if (viagemAtual.historicoItens.length === 0) {
        alert("Nenhum passageiro cadastrado para emitir bilhete.");
        return;
    }
    const ultimoItem = viagemAtual.historicoItens[viagemAtual.historicoItens.length - 1];
    const previewArea = document.getElementById("preview-passagem");
    previewArea.innerText = gerarLayoutBilhetePassageiro(ultimoItem, configuracoes);
    window.print();
}

/**
 * Emite guia de carga (manifesto)
 */
function emitirGuiaCarga() {
    if (viagemAtual.cargas.length === 0) {
        alert("Nenhuma carga cadastrada para emitir guia.");
        return;
    }
    const previewArea = document.getElementById("preview-passagem");
    previewArea.innerText = gerarLayoutGuiaCarga(viagemAtual.cargas, configuracoes);
    window.print();
}

/**
 * Configura o modo de emissão do bilhete (mantido para compatibilidade)
 * @param {string} tipo - Tipo de emissão ('junto' ou 'separado')
 */
function configurarEmissao(tipo) {
    tipoEmissaoAtual = tipo;
    atualizarPreviewTicket();
    window.print();
}

/**
 * Atualiza o preview do bilhete com o último item processado
 */
function atualizarPreviewTicket() {
    const previewArea = document.getElementById("preview-passagem");
    if (viagemAtual.historicoItens.length > 0) {
        const ultimoItem = viagemAtual.historicoItens[viagemAtual.historicoItens.length - 1];
        previewArea.innerText = gerarLayoutTicket(ultimoItem, configuracoes, tipoEmissaoAtual);
    } else {
        previewArea.innerText = "";
    }
}

// ==================== FUNÇÕES DE CÁLCULO ====================
/**
 * Calcula os preços de um item (passagem + carga)
 * @param {Object} item - Objeto com os dados do passageiro/carga
 * @param {string} item.perfil - Perfil do passageiro (Adulto/Criança)
 * @param {number} item.cargaPeso - Peso da carga em kg
 * @param {Object} configs - Configurações de preços
 * @param {number} configs.precoAdulto - Preço da passagem adulto
 * @param {number} configs.precoCrianca - Preço da passagem criança
 * @param {number} configs.precoKg - Preço por kg de carga
 * @returns {Object} Objeto com os preços calculados
 * @returns {number} returns.precoBase - Preço da passagem
 * @returns {number} returns.precoCarga - Preço da carga
 * @returns {number} returns.total - Preço total
 */
function calcularPreçoItem(item, configs) {
    const precoBase = item.perfil === "Adulto" ? configs.precoAdulto : configs.precoCrianca;
    const precoCarga = item.cargaPeso * configs.precoKg;
    return { precoBase, precoCarga, total: precoBase + precoCarga };
}

// ==================== FUNÇÕES DE LAYOUT ====================
/**
 * Gera o layout do bilhete de embarque conjunto (passageiro + carga)
 * @param {Object} item - Objeto com os dados do passageiro/carga
 * @param {Object} configs - Configurações de preços
 * @returns {string} String formatada com o layout do bilhete
 */
function gerarLayoutBilheteConjunto(item, configs) {
    const valores = calcularPreçoItem(item, configs);
    const valorCarga = item.cargaValor || valores.precoCarga;
    
    return `
=======================================
       BILHETE DE EMBARQUE CONJUNTO    
=======================================
PASSAGEIRO: ${item.nome.toUpperCase()} (${item.perfil})
DESTINO: ${item.destino.toUpperCase()}
---------------------------------------
CARGA DESPACHADA: ${item.cargaDesc}
PESO: ${item.cargaPeso}kg
---------------------------------------
VALOR PASSAGEM: R$ ${valores.precoBase.toFixed(2)}
VALOR CARGA:    R$ ${valorCarga.toFixed(2)}
TOTAL A PAGAR:  R$ ${(valores.precoBase + valorCarga).toFixed(2)}
=======================================
          SISTEMA TITAN LOCAL          
`;
}

/**
 * Gera o layout do bilhete apenas de passageiro
 * @param {Object} item - Objeto com os dados do passageiro
 * @param {Object} configs - Configurações de preços
 * @returns {string} String formatada com o layout do bilhete
 */
function gerarLayoutBilhetePassageiro(item, configs) {
    const valores = calcularPreçoItem(item, configs);
    
    return `
=======================================
         BILHETE DE PASSAGEIRO         
=======================================
PASSAGEIRO: ${item.nome.toUpperCase()} (${item.perfil})
DESTINO: ${item.destino.toUpperCase()}
---------------------------------------
VALOR TOTAL: R$ ${valores.precoBase.toFixed(2)}
=======================================
          SISTEMA TITAN LOCAL          
`;
}

/**
 * Gera o layout da guia de carga (manifesto)
 * @param {Array} cargas - Array de objetos com os dados das cargas
 * @param {Object} configs - Configurações de preços
 * @returns {string} String formatada com o layout da guia
 */
function gerarLayoutGuiaCarga(cargas, configs) {
    const pesoTotal = cargas.reduce((acc, c) => acc + c.peso, 0);
    const receitaFrete = cargas.reduce((acc, c) => {
        const valor = c.cargaValor || (c.peso * configs.precoKg);
        return acc + valor;
    }, 0);
    
    let guia = `
=======================================
          MANIFESTO DE CARGA           
=======================================
TOTAL VOLUMES: ${cargas.length}
PESO TOTAL: ${pesoTotal}kg
RECEITA FRETE: R$ ${receitaFrete.toFixed(2)}
---------------------------------------
`;
    
    cargas.forEach((c, i) => {
        const valorCarga = c.cargaValor || (c.peso * configs.precoKg);
        guia += `${i + 1}. RESPONSÁVEL: ${c.dono.toUpperCase()}
   DESTINO: ${c.destino.toUpperCase()}
   DESCRIÇÃO: ${c.desc}
   PESO: ${c.peso}kg
   VALOR: R$ ${valorCarga.toFixed(2)}
`;
    });
    
    guia += `=======================================
          SISTEMA TITAN LOCAL          
`;
    
    return guia;
}

/**
 * Gera o layout do bilhete de embarque (legado)
 * @param {Object} item - Objeto com os dados do passageiro/carga
 * @param {Object} configs - Configurações de preços
 * @param {string} modo - Modo de emissão ('junto' ou 'separado')
 * @returns {string} String formatada com o layout do bilhete
 */
function gerarLayoutTicket(item, configs, modo) {
    const valores = calcularPreçoItem(item, configs);
    
    if (modo === 'junto') {
        return `
====================================
        BILHETE DE EMBARQUE        
====================================
PASSAGEIRO: ${item.nome.toUpperCase()} (${item.perfil})
DESTINO: ${item.destino.toUpperCase()}
CARGA DETALHE: ${item.cargaDesc}
------------------------------------
VALOR PASSAGEM: R$ ${valores.precoBase.toFixed(2)}
VALOR CARGA:    R$ ${valores.precoCarga.toFixed(2)}
TOTAL PAGO:     R$ ${valores.total.toFixed(2)}
====================================
        SISTEMA TITAN LOCAL        
        `;
    } else {
        return `
====================================
     PASSAGEM (SÓ PASSAGEIRO)     
====================================
PASSAGEIRO: ${item.nome.toUpperCase()} (${item.perfil})
DESTINO: ${item.destino.toUpperCase()}
VALOR: R$ ${valores.precoBase.toFixed(2)}
====================================

====================================
      MANIFESTO (SÓ CARGA)      
====================================
DONO: ${item.nome.toUpperCase()}
DESC: ${item.cargaDesc}
VALOR CARGA: R$ ${valores.precoCarga.toFixed(2)}
====================================
        `;
    }
}