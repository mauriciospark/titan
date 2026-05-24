# Changelog — Histórico de Versões (TITAN)

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-05-24

### Added
- Sistema de gestão de viagens fluviais TITAN
- Cadastro inteligente com entrada de texto livre (smart input)
- Formulário estruturado para cadastro manual
- Três cenários de cadastro automático:
  - Somente passageiro
  - Somente carga
  - Ambos juntos (vinculados)
- Funções separadas de cadastro:
  - `cadastrarPassageiro()` - cadastro isolado de passageiros
  - `cadastrarMercadoria()` - cadastro isolado de cargas
- Parsers independentes:
  - `interpretarPassageiro()` - interpretação de texto para passageiro
  - `interpretarMercadoria()` - interpretação de texto para carga
- Cache de elementos DOM para otimização de performance
- Validação e sanitização de inputs:
  - `sanitizarTexto()` - limpeza e limitação de texto
  - `validarNumero()` - validação de faixas numéricas
- Estados de carregamento em botões (loading states)
- Navegação por teclado:
  - F2 para abrir formulário
  - Enter para processar/confirmar
  - Escape para fechar formulário
- Campo de valor manual para encomendas
- Coluna "Valor (R$)" na tabela de cargas
- Três tipos de emissão de bilhetes:
  - Bilhete Conjunto (passageiro + carga)
  - Bilhete Apenas Passagem
  - Guia de Carga (manifesto)
- Impressão otimizada com CSS @media print
- Configurações de preços persistente
- Histórico de viagens salvas
- Métricas em tempo real:
  - Passageiros totais, adultos, crianças
  - Peso total, volumes de carga
  - Receita de passagens e frete

### Changed
- Layout em duas colunas para melhor organização
- Preview de bilhete centralizado abaixo dos cards principais
- Processamento de smart input para detectar tipo de entrada automaticamente
- Lógica de cadastro para processar três cenários independentes
- Cálculo de receita de frete para usar valor manual quando disponível

### Fixed
- Corrigido nome de propriedade: `historicoItensBrutos` → `historicoItens`
- Corrigido erro de sintaxe em função reduce
- Adicionada função ausente `atualizarPreviewTicket()`
- Atualizado seletor CSS @media print de `.area-do-bilhete` para `#preview-passagem`
- Removido alert() em funções de emissão, substituído por window.print() direto
- Corrigido cálculo de receita de frete para usar valor manual quando disponível

---

## [Unreleased]

### Planned
- Integração com impressoras térmicas
- Exportação de dados em formatos contábeis
- Modo escuro para operações noturnas
- Suporte a múltiplos idiomas
- Aplicativo móvel nativo
- Sincronização via Bluetooth
- Relatórios analíticos avançados
