# TITAN — Sistema de Gestão de Viagens (Linhagem SPARK)

## Descrição

O TITAN é um sistema de gestão de viagens fluviais desenvolvido para otimizar o controle de embarques de passageiros e transporte de cargas em embarcações regionais. O software resolve o problema da gestão manual e desorganizada de viagens, oferecendo uma interface intuitiva que permite o cadastro rápido, emissão de bilhetes e geração de manifestos de carga de forma eficiente e profissional.

Com foco em operações locais, o TITAN elimina a necessidade de papelada física, reduz erros de cálculo e proporciona controle total sobre a receita de passagens e frete, tudo em um ambiente seguro e privado que funciona offline.

## Stack

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com variáveis CSS e design responsivo
- **JavaScript (ES6+)** - Lógica de negócios e interatividade
- **LocalStorage API** - Persistência de dados local (Local-First)

### Backend
- **N/A** - Arquitetura Local-First sem dependência de servidor

### Banco de Dados
- **LocalStorage** - Armazenamento no navegador do cliente
- **JSON** - Formato de serialização de dados

### Bibliotecas e Ferramentas
- **Vanilla JavaScript** - Sem frameworks externos para máxima performance
- **DOM Manipulation API** - Interação direta com a interface
- **Print API** - Emissão de bilhetes e manifestos

## Funcionalidades

- **Cadastro Inteligente**
  - Entrada de texto livre com interpretação automática (smart input)
  - Formulário estruturado para cadastro manual
  - Detecção automática de passageiro ou carga
  - Três cenários de cadastro: somente passageiro, somente carga, ambos juntos

- **Gestão de Passageiros**
  - Lista de passageiros com idade, perfil (Adulto/Criança) e destino
  - Cálculo automático de preços por perfil
  - Métricas em tempo real (total embarcados, adultos, crianças, receita)

- **Gestão de Cargas**
  - Manifesto de cargas com descrição, peso, valor e responsável
  - Cálculo automático de frete por peso ou valor manual
  - Métricas em tempo real (peso total, volumes, receita de frete)

- **Emissão de Bilhetes**
  - Bilhete Conjunto (passageiro + carga vinculados)
  - Bilhete Apenas Passagem
  - Guia de Carga (manifesto logístico)
  - Impressão otimizada com CSS @media print

- **Configurações**
  - Preços configuráveis (Adulto, Criança, KG de carga)
  - Persistência de configurações entre sessões

- **Histórico**
  - Armazenamento de viagens completas
  - Recuperação de dados anteriores
  - Exportação de histórico

## Como Rodar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma instalação de dependências necessária

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mauriciospark/titan.git
   cd titan
   ```

2. **Abra o projeto**
   - Basta abrir o arquivo `index.html` em qualquer navegador moderno
   - Ou use um servidor local para desenvolvimento:
     ```bash
     # Usando Python
     python -m http.server 8000
     
     # Usando Node.js (http-server)
     npx http-server
     ```

3. **Inicie o uso**
   - O sistema está pronto para uso imediato
   - Todos os dados são salvos automaticamente no navegador
   - Configure os preços na seção "Configurações do Barco"

### Desenvolvimento

Para desenvolvimento local com hot-reload:

```bash
# Instale Live Server (VS Code)
code --install-extension ritwickdey.liveserver

# Ou use qualquer servidor de arquivos estático
npx live-server
```

## Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

**Mauricio Spark**  
© 2026 - Linhagem SPARK
