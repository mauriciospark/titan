# Arquitetura do TITAN — Design Técnico (Linhagem SPARK)

## Design Arquitetonal

O TITAN adota uma arquitetura **Local-First** com separação clara de responsabilidades em camadas modulares. Esta abordagem foi escolhida para garantir autonomia, privacidade e performance, eliminando a dependência de servidores externos e permitindo operação offline completa.

### Padrão Arquitetural

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                │
│  (HTML5 + CSS3)                                          │
│  - Interface do Usuário                                  │
│  - Layout Responsivo                                     │
│  - Estilização com Variáveis CSS                        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE CONTROLE                      │
│  (JavaScript ES6+)                                      │
│  - Event Listeners                                      │
│  - Manipulação de DOM                                   │
│  - Validação de Inputs                                  │
│  - Cache de Elementos DOM                               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE LÓGICA                        │
│  (JavaScript Modules)                                   │
│  - script.js: Orquestração principal                    │
│  - parser.js: Interpretação de texto                   │
│  - ticket.js: Geração de bilhetes                      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE PERSISTÊNCIA                  │
│  (LocalStorage API)                                      │
│  - titan_configs: Configurações de preços              │
│  - titan_historico_viagens: Histórico completo         │
└─────────────────────────────────────────────────────────┘
```

## Justificativas Técnicas

### Arquitetura Local-First

**Escolha:** Dados armazenados exclusivamente no navegador do cliente via LocalStorage.

**Justificativa:**
- **Privacidade:** Nenhum dado é enviado para servidores externos, garantindo total controle das informações
- **Autonomia:** Sistema funciona completamente offline após carregamento inicial
- **Performance:** Elimina latência de rede, operações são instantâneas
- **Simplicidade:** Não requer infraestrutura de servidores, bancos de dados ou autenticação
- **Custo:** Zero custo de infraestrutura e manutenção

### Separação em Módulos JavaScript

**Escolha:** Divisão em três arquivos especializados (script.js, parser.js, ticket.js).

**Justificativa:**
- **Manutenibilidade:** Cada módulo tem responsabilidade única (Single Responsibility Principle)
- **Testabilidade:** Módulos podem ser testados independentemente
- **Reutilização:** Parser e gerador de bilhetes podem ser reutilizados em outros contextos
- **Organização:** Código mais legível e fácil de navegar

### Cache de Elementos DOM

**Escolha:** Objeto `domElements` centralizado que cacheia referências ao DOM.

**Justificativa:**
- **Performance:** Reduz queries repetidas ao DOM (operações caras)
- **Eficiência:** Elementos são consultados uma vez na inicialização
- **Manutenção:** Centraliza referências, facilitando atualizações

### Validação e Sanitização de Inputs

**Escolha:** Funções dedicadas `sanitizarTexto()` e `validarNumero()`.

**Justificativa:**
- **Segurança:** Previne ataques XSS removendo caracteres perigosos
- **Integridade:** Garante que dados estejam em formatos esperados
- **UX:** Validações específicas com mensagens de erro claras
- **Robustez:** Sistema mais resiliente a entradas malformadas

## Fluxo de Dados

### 1. Cadastro de Passageiro

```
Usuário preenche formulário
    ↓
confirmarFormulario() detecta campos preenchidos
    ↓
Validação: sanitizarTexto() + validarNumero()
    ↓
cadastrarPassageiro() cria objeto passageiro
    ↓
viagemAtual.passageiros.push(passageiro)
    ↓
viagemAtual.historicoItens.push(item)
    ↓
atualizarInterfaceDOM() atualiza UI
    ↓
LocalStorage (opcional ao encerrar viagem)
```

### 2. Cadastro de Carga

```
Usuário preenche formulário
    ↓
confirmarFormulario() detecta campos preenchidos
    ↓
Validação: sanitizarTexto() + validarNumero()
    ↓
cadastrarMercadoria() cria objeto carga
    ↓
viagemAtual.cargas.push(carga)
    ↓
atualizarInterfaceDOM() atualiza UI
    ↓
LocalStorage (opcional ao encerrar viagem)
```

### 3. Smart Input (Entrada Inteligente)

```
Usuário digita texto livre no input
    ↓
Event listener 'input' dispara interpretarLinhaTexto()
    ↓
Parser detecta padrão (passageiro, carga ou ambos)
    ↓
interpretarPassageiro() ou interpretarMercadoria()
    ↓
Função de cadastro apropriada é chamada
    ↓
UI atualizada com feedback visual
```

### 4. Emissão de Bilhete

```
Usuário clica em botão de emissão
    ↓
Função de emissão (emitirBilheteConjunto, etc.)
    ↓
gerarLayoutBilhete*() gera string formatada
    ↓
preview-passagem.innerText recebe layout
    ↓
window.print() dispara diálogo de impressão
    ↓
CSS @media print oculta tudo exceto preview
```

### 5. Persistência

```
Usuário clica "Encerrar e Salvar Viagem"
    ↓
finalizarEArmazenarViagem() serializa viagemAtual
    ↓
JSON.stringify() converte objeto para string
    ↓
localStorage.setItem('titan_historico_viagens', dados)
    ↓
viagemAtual é resetada para nova viagem
    ↓
carregarHistoricoGlobal() atualiza lista
```

## Estrutura de Dados

### Objeto de Viagem Atual
```javascript
viagemAtual = {
    passageiros: [
        { nome, idade, perfil, destino }
    ],
    cargas: [
        { desc, peso, dono, destino, cargaValor }
    ],
    historicoItens: [
        { nome, idade, perfil, destino, cargaDesc, cargaPeso, cargaValor }
    ]
}
```

### Configurações
```javascript
configuracoes = {
    precoAdulto: 150,
    precoCrianca: 75,
    precoKg: 2
}
```

## Privacidade dos Dados

O TITAN segue princípios de privacidade por design:

1. **Armazenamento Local:** Todos os dados permanecem no dispositivo do usuário
2. **Sem Telemetria:** Nenhum dado é coletado ou enviado externamente
3. **Sem Cookies:** Não utiliza cookies ou rastreamento
4. **Sem Servidores:** Não há backend para processar ou armazenar dados
5. **Controle Total:** Usuário tem controle completo sobre seus dados (exportar, limpar)

## Comunicação Entre Camadas

### Síncrona
Todas as operações são síncronas, garantindo:
- Previsibilidade de execução
- Ausência de race conditions
- Debugging simplificado
- Performance otimizada (sem overhead de async/await)

### Event-Driven
A comunicação é baseada em eventos:
- Event listeners em inputs e botões
- Callbacks para atualizações de UI
- Eventos de teclado para atalhos (F2, Enter, Escape)

Esta arquitetura simples e direta foi escolhida deliberadamente para manter o sistema leve, rápido e fácil de manter, alinhado com a filosofia de eficiência e autonomia da Spark Mauricio.
