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
// js/parser.js

/**
 * Interpreta uma linha de texto e extrai informações de passageiro e carga
 * Padrão esperado: Nome, Idade, Carga: Descrição Peso, Destino: Local
 * Exemplo: Mauricio Spark, 27 anos, Carga: Peixe 40kg, Destino: Parintins
 * 
 * @param {string} texto - Texto a ser interpretado
 * @returns {Object|null} Objeto com os dados extraídos ou null em caso de erro
 * @returns {string} returns.nome - Nome do passageiro
 * @returns {number} returns.idade - Idade do passageiro
 * @returns {string} returns.perfil - Perfil (Adulto/Criança)
 * @returns {string} returns.cargaDesc - Descrição da carga
 * @returns {number} returns.cargaPeso - Peso da carga em kg
 * @returns {string} returns.destino - Destino da viagem
 */
function interpretarLinhaTexto(texto) {
    // Validação de entrada
    if (!texto || typeof texto !== 'string') {
        console.error("Entrada inválida: texto deve ser uma string não vazia");
        return null;
    }

    try {
        const partes = texto.split(',');
        
        // Extrair nome (primeira parte)
        const nome = partes[0] ? partes[0].trim() : "Desconhecido";
        
        // Identificar Idade e Perfil (Adulto/Criança)
        const idadeTexto = partes[1] ? partes[1].match(/\d+/) : null;
        const idade = idadeTexto ? parseInt(idadeTexto[0]) : 18;
        const perfil = idade < 12 ? "Criança" : "Adulto";

        // Identificar Carga e Peso
        let cargaDesc = "Nenhuma";
        let cargaPeso = 0;
        const trechoCarga = partes.find(p => p.toLowerCase().includes('carga:'));
        if (trechoCarga) {
            cargaDesc = trechoCarga.replace(/carga:/i, '').trim();
            const pesoMatch = cargaDesc.match(/(\d+)\s*kg/i);
            if (pesoMatch) {
                cargaPeso = parseFloat(pesoMatch[1]);
                // Remove o peso da descrição para ficar mais limpo
                cargaDesc = cargaDesc.replace(/(\d+)\s*kg/i, '').trim();
            }
        }

        // Identificar Destino
        let destino = "Não Informado";
        const trechoDestino = partes.find(p => p.toLowerCase().includes('destino:'));
        if (trechoDestino) {
            destino = trechoDestino.replace(/destino:/i, '').trim();
        }

        return { nome, idade, perfil, cargaDesc, cargaPeso, destino };
    } catch (error) {
        console.error("Erro ao processar texto:", error);
        return null;
    }
}

/**
 * Interpreta uma linha de texto e extrai apenas informações de passageiro
 * Padrão esperado: Nome, Idade, Destino: Local
 * Exemplo: Mauricio Spark, 27 anos, Destino: Parintins
 * 
 * @param {string} texto - Texto a ser interpretado
 * @returns {Object|null} Objeto com os dados do passageiro ou null em caso de erro
 * @returns {string} returns.nome - Nome do passageiro
 * @returns {number} returns.idade - Idade do passageiro
 * @returns {string} returns.perfil - Perfil (Adulto/Criança)
 * @returns {string} returns.destino - Destino da viagem
 */
function interpretarPassageiro(texto) {
    if (!texto || typeof texto !== 'string') {
        console.error("Entrada inválida: texto deve ser uma string não vazia");
        return null;
    }

    try {
        const partes = texto.split(',');
        
        const nome = partes[0] ? partes[0].trim() : "Desconhecido";
        
        const idadeTexto = partes[1] ? partes[1].match(/\d+/) : null;
        const idade = idadeTexto ? parseInt(idadeTexto[0]) : 18;
        const perfil = idade < 12 ? "Criança" : "Adulto";

        let destino = "Não Informado";
        const trechoDestino = partes.find(p => p.toLowerCase().includes('destino:'));
        if (trechoDestino) {
            destino = trechoDestino.replace(/destino:/i, '').trim();
        }

        return { nome, idade, perfil, destino };
    } catch (error) {
        console.error("Erro ao processar texto de passageiro:", error);
        return null;
    }
}

/**
 * Interpreta uma linha de texto e extrai apenas informações de mercadoria
 * Padrão esperado: Carga: Descrição Peso, Responsável: Nome, Destino: Local
 * Exemplo: Carga: Peixe 40kg, Responsável: João Silva, Destino: Parintins
 * 
 * @param {string} texto - Texto a ser interpretado
 * @returns {Object|null} Objeto com os dados da mercadoria ou null em caso de erro
 * @returns {string} returns.descricao - Descrição da carga
 * @returns {number} returns.peso - Peso da carga em kg
 * @returns {string} returns.responsavel - Nome do responsável
 * @returns {string} returns.destino - Destino da carga
 */
function interpretarMercadoria(texto) {
    if (!texto || typeof texto !== 'string') {
        console.error("Entrada inválida: texto deve ser uma string não vazia");
        return null;
    }

    try {
        const partes = texto.split(',');
        
        let descricao = "Não informada";
        let peso = 0;
        const trechoCarga = partes.find(p => p.toLowerCase().includes('carga:'));
        if (trechoCarga) {
            descricao = trechoCarga.replace(/carga:/i, '').trim();
            const pesoMatch = descricao.match(/(\d+)\s*kg/i);
            if (pesoMatch) {
                peso = parseFloat(pesoMatch[1]);
                descricao = descricao.replace(/(\d+)\s*kg/i, '').trim();
            }
        }

        let responsavel = "Não informado";
        const trechoResp = partes.find(p => p.toLowerCase().includes('responsável:') || p.toLowerCase().includes('responsavel:'));
        if (trechoResp) {
            responsavel = trechoResp.replace(/responsável:|responsavel:/i, '').trim();
        }

        let destino = "Não Informado";
        const trechoDestino = partes.find(p => p.toLowerCase().includes('destino:'));
        if (trechoDestino) {
            destino = trechoDestino.replace(/destino:/i, '').trim();
        }

        return { descricao, peso, responsavel, destino };
    } catch (error) {
        console.error("Erro ao processar texto de mercadoria:", error);
        return null;
    }
}