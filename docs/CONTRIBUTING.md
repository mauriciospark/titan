# Guia de Contribuição — TITAN (Linhagem SPARK)

## Histórico de Alterações

### [Added] - Novos Recursos
- Sistema de cadastro inteligente com entrada de texto livre
- Formulário estruturado com detecção automática de campos
- Três cenários de cadastro: passageiro-only, carga-only, ambos juntos
- Cache de elementos DOM para otimização de performance
- Validação e sanitização de inputs
- Estados de carregamento em botões
- Navegação por teclado (F2, Enter, Escape)
- Interface com abas para cadastro separado (removido posteriormente)
- Campo de valor manual para encomendas
- Funções separadas: cadastrarPassageiro() e cadastrarMercadoria()
- Parsers independentes: interpretarPassageiro() e interpretarMercadoria()

### [Changed] - Modificações em Funções Existentes
- confirmarFormulario(): Atualizado para processar três cenários independentes com base em campos preenchidos
- toggleFormulario(): Simplificado para remover lógica de abas
- atualizarInterfaceDOM(): Modificado para usar cache de elementos DOM e exibir valor manual de carga
- salvarConfiguracoes(): Adicionada validação de faixas de valores e estado de carregamento
- smart input processing: Atualizado para detectar tipo de entrada e usar parser apropriado
- Layout HTML: Removida interface de abas, ambas seções agora visíveis simultaneamente
- Tabela de cargas: Adicionada coluna "Valor (R$)"

### [Fixed] - Correções de Bugs
- Corrigido nome de propriedade: historicoItensBrutos → historicoItens
- Corrigido erro de sintaxe em função reduce
- Adicionada função ausente atualizarPreviewTicket()
- Atualizado seletor CSS @media print de .area-do-bilhete para #preview-passagem
- Removido alert() em funções de emissão, substituído por window.print() direto
- Corrigido cálculo de receita de frete para usar valor manual quando disponível

## Boas Práticas

### Código

- **JSDoc:** Todas as funções devem ter comentários JSDoc descrevendo propósito, parâmetros e retornos
- **Nomenclatura:** Use camelCase para variáveis e funções, PascalCase para classes/constructores
- **Const/Let:** Use `const` para valores que não mudam, `let` para variáveis que são reatribuídas
- **Funções Pequenas:** Mantenha funções focadas em uma única responsabilidade
- **Validação:** Sempre valide inputs antes de processar dados
- **Sanitização:** Sanitize todos os inputs de texto para prevenir XSS

### Estilo de Escrita

- **Indentação:** 4 espaços (não tabs)
- **Comentários:** Português para comentários de código, Inglês para nomes de variáveis/funções
- **Linhas em Branco:** Use linhas em branco para separar seções lógicas
- **Comprimento de Linha:** Máximo 120 caracteres quando possível
- **Strings:** Use aspas simples para strings, aspas duplas para strings com aspas simples internas

### Organização de Arquivos

```
titan/
├── index.html          # Estrutura principal
├── css/
│   └── style.css       # Estilos globais
├── javascript/
│   ├── script.js       # Lógica principal e orquestração
│   ├── parser.js       # Interpretação de texto
│   └── ticket.js       # Geração de bilhetes
├── docs/               # Documentação
└── assets/             # Imagens e recursos estáticos
```

## Regras de Organização

### Nomenclatura de Branches

- `feature/nome-do-recurso` - Novos recursos
- `fix/nome-do-bug` - Correções de bugs
- `refactor/nome-da-refatoracao` - Refatorações
- `docs/nome-da-documentacao` - Atualizações de documentação
- `hotfix/nome-do-hotfix` - Correções urgentes em produção

Exemplos:
- `feature/cadastro-inteligente`
- `fix/validacao-inputs`
- `refactor/cache-dom`

### Validações Obrigatórias Antes de Submeter

1. **Teste Manual:**
   - Teste todas as funcionalidades alteradas
   - Verifique se não há regressões em funcionalidades existentes
   - Teste em pelo menos dois navegadores diferentes

2. **Validação de Código:**
   - Execute linter se disponível
   - Verifique se não há console.log() em código de produção
   - Remova código comentado não utilizado

3. **Documentação:**
   - Atualize README.md se necessário
   - Adicione entrada em CHANGELOG.md
   - Atualize JSDoc se funções foram modificadas

4. **Compatibilidade:**
   - Verifique compatibilidade com navegadores modernos
   - Teste responsividade em diferentes tamanhos de tela
   - Verifique funcionalidade offline

### Processo de Pull Request

1. Crie branch a partir de `main`
2. Implemente alterações seguindo as boas práticas
3. Teste exaustivamente
4. Atualize documentação
5. Crie pull request com descrição clara:
   - Título: `[Tipo] Breve descrição`
   - Descrição: O que foi alterado, por que, e como testar
6. Aguarde revisão
7. Faça ajustes se solicitado
8. Merge após aprovação

## Padrões de Commit

Use mensagens de commit claras e descritivas:

```
[Added] Adiciona campo de valor manual para encomendas
[Changed] Atualiza lógica de cadastro para processar três cenários
[Fixed] Corrige cálculo de receita de frete usando valor manual
[Refactor] Otimiza cache de elementos DOM
[Docs] Atualiza documentação de arquitetura
```

## Código de Conduta

- Respeito e profissionalismo em todas as interações
- Feedback construtivo e bem-intencionado
- Colaboração aberta e inclusiva
- Foco na qualidade do código e experiência do usuário
- Reconhecimento de contribuições de outros

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Descreva o problema detalhadamente
- Inclua passos para reproduzir
- Forneça ambiente (navegador, sistema operacional)

---

**Obrigado por contribuir com o TITAN!**  
Sua participação ajuda a melhorar o sistema para todos os usuários.
