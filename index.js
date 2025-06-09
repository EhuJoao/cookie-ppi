import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 3000;
var listaProdutos = [];

const app = express();

app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "CH4V3D3AC3SS0",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000* 60 * 60 * 15,
        httpOnly: true,
        secure: false
    }

}));

app.use(cookieParser())

app.get("/", verificarAutenticacao, (requisicao, resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoLogin

    resposta.send(
        `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Página Inicial</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            height: 100vh;
            background-color: #f2f2f2;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding-top: 60px;
        }

        .navbar {
            width: 100%;
            background-color: #129990;
            color: white;
            padding: 0 40px;
            height: 69px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 100px;
        }

        .navbar h1 {
            font-size: 25px;
            margin: 0;
            line-height: 60px;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }
        .spanstyle{
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }

        .homepage-container {
            max-width: 700px;
            padding: 60px;
            background: #f9f9f9;
            border-radius: 16px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
        }

        h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 20px;
        }

        p {
            font-size: 18px;
            color: #555;
            margin-bottom: 30px;
        }

        a.button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #129990;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            text-decoration: none;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        a.button:hover {
            background-color: #096B68;
            color: #FFFBDE;
        }
    </style>
</head>

    <body>
        <div class="navbar">
            <div class="navbar-left">
                <h1 style="color:white">J&E</h1>
                <a href="/produtoscadastrados">Produtos cadastrados</a>
                <a href="/cadastrarproduto">Cadastrar produtos</a>
                <span class="spanstyle">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
            </div>
            <div class="navbar-right">
            

                <a href="/logout">Sair</a>
            </div>
        </div>

        <div class="homepage-container">
            <h1>Bem-Vindo ao nosso site!</h1>
            <p>Sistema dedicado exclusivamente para você realizar o cadastro de produtos da sua empresa.</p>
            <a class="button" href="/cadastrarproduto">Cadastrar Produto</a>
        </div>
    </body>

    </html>`
    );

    resposta.end();
})


app.get("/cadastrarproduto",verificarAutenticacao, (requisicao, resposta)=>{
    const ultimoLogin = requisicao.cookies.ultimoLogin
    resposta.send(`
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadastro de Produtos</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #f2f2f2;
        }

        .navbar {
            width: 100%;
            background-color: #129990;
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 100px;
        }

        .navbar h1 {
            font-size: 25px;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }

        .navbar-right {
            margin-left: auto;
        }

        .navbar-right a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }

        .main {
            margin-top: 100px;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }

        .container h2 {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        form label {
            font-size: 14px;
            color: #5e5d5d;
            margin-bottom: 5px;
            display: block;
        }

        .full-width {
            grid-column: 1 / 3;
        }

        form input,
        form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button {
            grid-column: 1 / 3;
            margin-top: 10px;
            padding: 12px;
            border: none;
            border-radius: 6px;
            background-color: #129990;
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #096B68;
            color: #FFFBDE;
        }

        @media (max-width: 700px) {
            form {
                grid-template-columns: 1fr;
            }

            .full-width {
                grid-column: 1 / 2;
            }

            button {
                grid-column: 1 / 2;
            }
        }

        textarea {
            resize: none;
            padding: 10px;
            border: 1px solid #ccc;
        }
             .spanstyle{
            color: white;
            text-decoration: none;
            font-size: 15px;
            line-height: 60px;
        }
    </style>
</head>

<body>

    <div class="navbar">
        <div class="navbar-left">
            <h1>J&E</h1>
            <a href="/">Início</a>
            <a href="/produtoscadastrados">Produtos cadastrados</a>
            <span class="spanstyle">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
        </div>
        <div class="navbar-right">
            <a href="/logout">Sair</a>
        </div>
    </div>
    <div class="main">
        <div class="container">
            <form method="POST" action="/cadastrarproduto" novalidate>
                <h2 class="full-width">Cadastro de Produtos</h2>
                <label for="fabricante">Nome do fabricante</label>
                <input type="text" id="fabricante" name="fabricante" required>

                <label for="codbarras">Código de barras</label>
                <input type="number" id="codbarras" name="codbarras" required>


                <label for="custo">Preço de custo</label>
                <input type="number" id="custo" name="custo" required>

                <label for="venda">Valor da venda</label>
                <input type="number" id="venda" name="venda" required>

                <label for="validade">Data de validade</label>
                <input type="date" id="validade" name="validade" required>

                <label for="estoque">Quantidade em estoque</label>
                <input type="number" id="estoque" name="estoque" required>

                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" name="descricao" required>

                <button type="submit">Cadastrar produto</button>
            </form>
        </div>
    </div>

    </body>
</html>`)
    resposta.end();
})

app.post("/cadastrarproduto", (requisicao, resposta) =>{
    const fabricante = requisicao.body.fabricante;
    const codbarras = requisicao.body.codbarras;
    const custo = requisicao.body.custo;
    const venda = requisicao.body.venda;
    const validade = requisicao.body.validade;
    const estoque = requisicao.body.estoque;
    const descricao = requisicao.body.descricao;

  if (fabricante && codbarras && custo && venda && validade && estoque && descricao) {
        const dataValidade = new Date(validade);
        const hoje = new Date();
        dataValidade.setHours(0, 0, 0, 0);
        hoje.setHours(0, 0, 0, 0);

        if (dataValidade < hoje) {
            return resposta.send(`<script>alert("Data de validade não pode ser anterior à atual!"); window.history.back();</script>`);
        }

        listaProdutos.push({
            fabricante,
            codbarras,
            custo,
            venda,
            validade,
            estoque,
            descricao
        });

        resposta.redirect("/produtoscadastrados");
}else{
    let conteudo = `
    <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cadastro de Produtos</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #f2f2f2;
        }

        .navbar {
            width: 100%;
            background-color: #129990;
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 100px;
        }

        .navbar h1 {
            font-size: 25px;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }

        .navbar-right {
            margin-left: auto;
        }

        .navbar-right a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }

        .main {
            margin-top: 100px;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 800px;
        }

        .container h2 {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        form label {
            font-size: 14px;
            color: #5e5d5d;
            margin-bottom: 5px;
            display: block;
        }

        .full-width {
            grid-column: 1 / 3;
        }

        form input,
        form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        button {
            grid-column: 1 / 3;
            margin-top: 10px;
            padding: 12px;
            border: none;
            border-radius: 6px;
            background-color: #129990;
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #096B68;
            color: #FFFBDE;
        }

        @media (max-width: 700px) {
            form {
                grid-template-columns: 1fr;
            }

            .full-width {
                grid-column: 1 / 2;
            }

            button {
                grid-column: 1 / 2;
            }
        }

        textarea {
            resize: none;
            padding: 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>

    <div class="navbar">
        <div class="navbar-left">
            <h1>J&E</h1>
            <a href="/">Início</a>
            <a href="/produtoscadastrados">Produtos cadastrados</a>
            <span class="spanstyle">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
        </div>
        <div class="navbar-right">
            <a href="/logout">Sair</a>
        </div>
    </div>
    <div class="main">
        <div class="container">
            <form method="POST" action="/cadastrarproduto" novalidate id="formtest">
                <h2 class="full-width">Cadastro de Produtos</h2>`;
    if(!fabricante){
        conteudo = conteudo + `
                <label for="fabricante">Nome do fabricante</label>
                <input type="text" id="fabricante" name="fabricante" required placeholder="Por favor, informe o nome do fabricante">
        `
    }
    else{
        conteudo = conteudo + `
        <label for="fabricante">Nome do fabricante</label>
        <input type="text" id="fabricante" name="fabricante" value= "${fabricante}"required>`;
    }
      if (!codbarras) {
            conteudo += `<label for="codbarras">Código de barras</label>
                         <input type="number" id="codbarras" name="codbarras" placeholder="Por favor, informe o código de barras" required>`
        } else {
            conteudo += `<label for="codbarras">Código de barras</label>
                         <input type="number" id="codbarras" name="codbarras" value="${codbarras}" required>`;
        }
        if (!custo) {
            conteudo += `<label for="custo">Preço de custo</label>
                         <input type="number" id="custo" name="custo" required placeholder="Por favor, informe preço de custo">`
        } else {
            conteudo += `<label for="custo">Preço de custo</label>
                         <input type="number" id="custo" name="custo" value="${custo}" required>`;
        }
        if (!venda) {
            conteudo += `<label for="venda">Valor da venda</label>
                         <input type="number" id="venda" name="venda" required placeholder="Por favor, informe o valor da venda">`
        } else {
            conteudo += `<label for="venda">Valor da venda</label>
                         <input type="number" id="venda" name="venda" value="${venda}" required>`;
        }

        if (!validade) {
            conteudo += `<label for="validade">Data de validade</label>
                         <input type="date" id="validade" name="validade" placeholder="Por favor, informe a validade"required>`
        }
        else {
            conteudo += `<label for="validade">Data de validade</label>
                         <input type="date" id="validade" name="validade" value="${validade}" required>`;
        }
        if (!estoque) {
            conteudo += `<label for="estoque">Quantidade em estoque</label>
                          <input type="number" id="estoque" name="estoque" placeholder="Por favor, informe a quantidade no estoque"required>`           
        } else {
            conteudo += `<label for="estoque">Quantidade em estoque</label>
                        <input type="number" id="estoque" name="estoque" value="${estoque}" required>`;             
        }

        if (!descricao) {
            conteudo += `<label for="descricao">Descrição</label>
                <input type="text" id="descricao" name="descricao" required placeholder="Por favor, a descrição do produto">`
        } else {

            
            conteudo += `<label for="descricao">Descrição</label>
                         <input type="text" id="descricao" name="descricao" value="${descricao}" required>`;
        }
        
        conteudo +=`
            <button type="submit">Cadastrar produto</button>
            </form>
        </div>
        </div>
    </body>
    </html>`
    resposta.send(conteudo);
    resposta.end();

}
});

app.get("/produtoscadastrados",verificarAutenticacao, (requisicao, resposta) =>{
        const ultimoLogin = requisicao.cookies.ultimoLogin
    let conteudo = `
    <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lista de Produtos</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 90%;
            margin: 40px auto 40px auto;
            font-family: Arial, sans-serif;
        }

        h2 {
            margin-bottom: 20px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        thead tr {
            background-color: #096B68;
            color: white;
            text-align: center;
        }

        td{
             text-align: center;
        }
        th,
        td {
            padding: 12px 15px;
    
        }

        tbody tr:nth-child(odd) {
            background-color: #f9f9f9;
        }

        tbody tr:hover {
            background-color: #d0e7ff;
            cursor: pointer;
        }

        .text-center {
            text-align: center;
            color: #666;
            font-style: italic;
        }

        .text-center:hover {
            background: rgb(224, 240, 239);
            ;
        }

        .btn-primary {
            display: inline-block;
            padding: 10px 20px;
            background-color: #129990;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
            background-color: #096B68;
        }

        .navbar {
            width: 100%;
            background-color: #129990;
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }

        .navbar-left {
            display: flex;
            align-items: center;
            gap: 100px;
        }

        .navbar h1 {
            font-size: 25px;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            font-size: 15px;
        }
            .container{
            .container {
                display: flex;
                justify-content: center;
                /* centraliza horizontalmente */
                align-items: center;
                /* centraliza verticalmente */
            }
}                
         .spanstyle{
  color: white;
  text-decoration: none;
  font-size: 15px;
  line-height: 60px;
 }  
  .spanstyle{
  color: white;
  text-decoration: none;
  font-size: 15px;
  line-height: 60px;
 }     
    </style>
</head>

<body>
    <div class="navbar">
        <div class="navbar-left">
            <h1>J&E</h1>
            <a href="/">Início</a>
            <a href="/cadastrarproduto">Cadastrar produtos</a>
            <span class="spanstyle">${ultimoLogin?"Ultimo Acesso: " + ultimoLogin:""} </span>
        </div>
        <div class="navbar-right">
            <a href="/logout">Sair</a>
        </div>
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <div class="container">
        <h2 style="text-align: center;">Lista de produtos cadastrados</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome do fabricante</th>
                    <th>Código de barras</th>
                    <th>Preço de custo</th>
                    <th>Preço de venda</th>
                    <th>Data de validade</th>
                    <th>Quantidade em estoque</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
        `;
        if(listaProdutos.length === 0){
            conteudo +=`
                <tr>
                    <td colspan="9" class="text-center">Nenhum produto cadastrado no momento.</td>
                </tr>
            `
        }else{
            for(let i=0; i<listaProdutos.length;i++){
                const partes = listaProdutos[i].validade.split("-");
             const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                conteudo +=`
                <tr>
                     <td>${listaProdutos[i].fabricante}</td>
                     <td>${listaProdutos[i].codbarras}</td>
                     <td>${listaProdutos[i].custo}</td>
                     <td>${listaProdutos[i].venda}</td>
                     <td>${dataFormatada}</td>
                     <td>${listaProdutos[i].estoque}</td>
                     <td>${listaProdutos[i].descricao}</td>
                </tr>`
            }}

        conteudo +=`
        </tbody>
        </table>
        <div class="container">
            <a href="/cadastrarproduto" class="btn-primary">Cadastrar produto</a>
        </div>
    </div>
</body>
</html>`
    resposta.send(conteudo);
    resposta.end()
})

app.get("/login", (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet">
</head>

<body>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 450px;
            text-align: center;
        }

        .container h2 {
            margin-bottom: 20px;
            color: #333;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        form label {
            text-align: left;
            font-size: 14px;
            color: #5e5d5d;
             margin-bottom: -5px;
        }

        form input,
        form select {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;

        }

        button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 6px;
            background-color: #129990;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #096B68;
        }

        .container a {
            display: block;
            margin-top: 15px;
            font-size: 14px;
            color: #096B68;
            text-decoration: none;
        }

        .container a:hover {
            text-decoration: underline;
        }
        .erro{
        color: red;
        }
    </style>
    <div class="container">
        <h2>LOGIN</h2>
        <form id="login-form" acton="/login" method="post" novalidate>
            <label for="nome">Login</label>
            <input type="text" id="nome" name="nome"  required>

            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" required>

            <button type="submit" name="submit">Login</button>
        </form>
        <a href="#">Contate o suporte caso seu login não esteja autorizado!</a>
    </div>
</body>
</html>           
        `)
      resposta.end()
})

app.post("/login", (requisicao,resposta) =>{
    const usuario = requisicao.body.nome
    const senha = requisicao.body.senha

    if(usuario == "admin" && senha == "123"){
        requisicao.session.logado = true;
        const datahr = new Date()
         resposta.cookie('ultimoacesso',datahr.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30});
        resposta.redirect("/")
    }
    else{
        let conteudo = `
        <!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet">
</head>

<body>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        body {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
        }

        .container {
            background: #f9f9f9;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            width: 450px;
            text-align: center;
        }

        .container h2 {
            margin-bottom: 20px;
            color: #333;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        form label {
            text-align: left;
            font-size: 14px;
            color: #5e5d5d;
             margin-bottom: -5px;
        }

        form input,
        form select {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;

        }

        button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 6px;
            background-color: #129990;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #096B68;
        }

        .container a {
            display: block;
            margin-top: 15px;
            font-size: 14px;
            color: #096B68;
            text-decoration: none;
        }

        .container a:hover {
            text-decoration: underline;
        }
        .erro{
            color: red;
        }
    </style>
    <div class="container">
        <h2>LOGIN</h2>
        <form id="login-form" acton="/login" method="post" novalidate>
        `;
    if(!usuario){
        conteudo +=`
            <label for="nome">Login</label>
            <input type="text" id="nome" name="nome" value= "${usuario}"  placeholder="Campo não pode ser vazio" required>

        `;
    }
    else{
        conteudo += `
        <label for="nome">Login</label>
        <input type="text" id="nome" name="nome" value="${usuario}" required>
        `;
    }
    if (!senha) {
      conteudo += `
        <label for="senha">Senha</label>
        <input type="password" id="senha" name="senha" value="${senha}" placeholder="Campo não pode ser vazio" required>
        
      `;
    } else {
      conteudo += `
        <label for="senha">Senha</label>
        <input type="password" id="senha" name="senha" value="${senha}" required>
      `;
    }

     conteudo += `
        <span class="erro">Login ou senha inválidos</span>
        <button type="submit" name="submit">Login</button>
        </form>
        <a href="#">Contate o suporte caso seu login não esteja autorizado!</a>
        </div>
        </body>

        </html>   
     `   
     resposta.send (conteudo)
    }
   resposta.end(); 
})

function verificarAutenticacao (requisicao, resposta, next){
    if(requisicao.session.logado){
        next();
    }
    else{
        resposta.redirect("/login")
    }
}

app.get("/logout", (requisicao,resposta) =>{
  requisicao.session.destroy();
  resposta.redirect("/login");
})

app.listen(port, host, ()=>{
    console.log(`Servidor rodando em http://${host}:${port}/`)
})