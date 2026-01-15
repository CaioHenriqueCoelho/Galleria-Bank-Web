# Galleria Bank - Frontend Web (`galleria-bank-web`)

Este é o repositório do frontend web da Galleria Bank, desenvolvido com **Angular** e utilizando a biblioteca de componentes **PrimeNG** para a interface do usuário.

## 🚀 Tecnologias Utilizadas

O projeto é baseado na seguinte pilha tecnológica, conforme o `package.json`:

| Categoria | Tecnologia | Versão |
| :--- | :--- | :--- |
| **Framework** | Angular | `^21.0.0` |
| **Interface** | PrimeNG | `^21.0.2` |
| **Layout** | PrimeFlex | `^4.0.0` |
| **Gerenciador** | npm | `10.8.2` |
| **Outros** | jwt-decode, rxjs, tslib | Diversas |

## ⚙️ Pré-requisitos

Para configurar e executar este projeto localmente, você precisa ter instalado:

1.  **Node.js e npm:** É recomendável usar uma versão compatível com o Angular 21.
2.  **Angular CLI:** A interface de linha de comando do Angular.

Para instalar o Angular CLI globalmente, execute:

```bash
npm install -g @angular/cli
```

## 💻 Instalação e Configuração

Siga os passos abaixo para preparar o ambiente de desenvolvimento.

### Passo 1: Clonar o Repositório

(Assumindo que você está no diretório onde deseja clonar o projeto)

```bash
git clone git@github.com:CaioHenriqueCoelho/Galleria-Bank-Web.git galleria-bank-web
cd galleria-bank-web
```

### Passo 2: Instalar as Dependências

No diretório raiz do projeto (`galleria-bank-web`), instale todas as dependências listadas no `package.json`:

```bash
npm install
```

### Passo 3: Configuração do Backend

Este frontend se comunica com o backend (serviço Java/Spring) que você configurou anteriormente.

*   **Certifique-se de que o backend esteja em execução** (o serviço deve estar acessível, por padrão, em `http://localhost:8888`).
*   Se o backend estiver em um endereço diferente, você precisará **ajustar a configuração de proxy ou o arquivo de ambiente** do Angular para apontar para o endereço correto.

## 🏃 Como Rodar a Aplicação

### Servidor de Desenvolvimento

Execute o comando abaixo para iniciar o servidor de desenvolvimento. A aplicação será recarregada automaticamente se você alterar qualquer arquivo fonte.

```bash
npm start
# ou
ng serve
```

A aplicação estará acessível em `http://localhost:4200/` (porta padrão do Angular).

### Executar Testes

Para executar os testes unitários (configurados com `ng test`):

```bash
npm test
# ou
ng test
```

## 📦 Build para Produção

Para construir o projeto para deploy em produção, execute:

```bash
npm run build
# ou
ng build
```

Os arquivos de build estáticos otimizados serão armazenados no diretório `dist/`.

## 🛠️ Outros Comandos Úteis

| Comando | Descrição |
| :--- | :--- |
| `npm run watch` | Constrói e observa os arquivos, re-construindo automaticamente em caso de alterações para desenvolvimento contínuo. |
| `ng` | Executa a interface de linha de comando do Angular para tarefas como gerar componentes, serviços, módulos, etc. |
