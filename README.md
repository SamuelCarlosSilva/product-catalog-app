# 🛒 API e Aplicação Web de Cadastro de Produtos (Em construção)

## 📘 Descrição do Projeto 

Este projeto tem como objetivo o desenvolvimento de uma **API RESTful** em **Node.js** com persistência de dados em **SQL Server Express**, e uma **aplicação web** integrada para gerenciar cadastros de produtos.

O sistema permite o **cadastro, consulta, atualização e exclusão** de produtos, utilizando as operações básicas do CRUD.  
Além disso, a aplicação web apresenta uma interface com duas páginas: **Home** e **Detalhes do Produto**, onde é possível visualizar, adicionar, editar e excluir itens dinamicamente.

---

## ⚙️ Funcionalidades da API

A API foi construída com o framework **Express.js** e conecta-se ao banco de dados **SQL Server Express** para gerenciar as informações de produtos.

### 📦 Estrutura de Dados

Cada produto possui os seguintes atributos:

- **Nome do produto**  
- **Código do produto**  
- **Preço**  
- **Descrição**  
- **Quantidade em estoque**  
- **Avaliação**  
- **Categoria**

---

### 🔁 Rotas e Operações CRUD

| Método | Rota | Descrição |
|--------|------|-----------|
| **POST** | `/api/produtos` | Cria um novo produto no banco de dados |
| **GET** | `/api/produtos` | Retorna todos os produtos cadastrados |
| **GET** | `/api/produtos/:codigo` | Retorna um produto específico pelo **código** |
| **GET** | `/api/produtos/categoria/:categoria` | Retorna produtos filtrados por **categoria** |
| **PUT / PATCH** | `/api/produtos/:codigo` | Atualiza informações de um produto existente |
| **DELETE** | `/api/produtos/:codigo` | Exclui um produto após confirmação |

---

## 🌐 Aplicação Web

A aplicação web foi desenvolvida para consumir a API de produtos e oferecer uma interface intuitiva ao usuário.

### 🏠 Página Inicial (Home)

- Exibe os **12 últimos produtos** cadastrados no banco de dados, mostrando **imagem e preço**.  
- Cada item possui um botão que leva à **página de detalhes do produto**.  
- Um botão permite **adicionar novos produtos**, abrindo um **modal** ou redirecionando para uma nova página de cadastro.

### 🔍 Página de Detalhes do Produto

- Exibe **todas as informações** do produto selecionado.  
- Possui botões para:
  - **Editar produto** (via modal ou página separada).  
  - **Excluir produto**, com **confirmação de exclusão**.

---

## 🧱 Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQL Server Express
- Sequelize (ORM opcional)
- Nodemon (para desenvolvimento)

### Frontend
- HTML5 / CSS3 / JavaScript
- Framework opcional: React.js ou Vanilla JS
- Axios (para requisições HTTP)

---

## 💾 Configuração do Banco de Dados

1. Instale o **SQL Server Express**.  
2. Crie um banco de dados chamado `Products`.  
3. Configure o arquivo `database.js` com suas credenciais locais:

```javascript
const config = {
  user: 'seu_usuario',
  password: 'sua_senha',
  server: 'localhost',
  database: 'db_name',
  options: {
    encrypt: false,
    database: 'nome_base_de_dados'
  }
   port: 'porta_base_de_dados'
};
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

### 2. Instalar dependências
```bash
cd api
npm install
```

### 3. Executar a API
```bash
npm start
```

A API estará disponível em:  
👉 **http://localhost:8090**

### 4. Abrir a aplicação web
Abra o arquivo `index.html` na pasta `/web` em seu navegador.

---

## 🧪 Testes das Rotas

Você pode testar as rotas utilizando ferramentas como:
- **Postman**
- **Insomnia**
- **Thunder Client** (extensão VS Code)

---

## ✨ Possíveis Melhorias Futuras

- Autenticação de usuários (JWT)
- Upload de imagens de produtos
- Paginação e busca avançada
- Integração com APIs externas de categorias
- Melhorar tratativa de erros de requisição

---

## 👨‍💻 Autor

**Samuel Carlos**  
Acadêmico de Desenvolvimento de Sistemas  

---

## 📄 Licença

Este projeto é de uso acadêmico e foi desenvolvido para fins educacionais.  
Sinta-se à vontade para utilizar como referência em estudos.
