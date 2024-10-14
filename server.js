const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authMiddleware = require('./src/auth/authMiddleware');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();  // Carregar variáveis de ambiente do .env

// Cria um stream de gravação em um arquivo de log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const login = require('./src/routes/authRoutes');

const belaVistaRoutes = require('./src/routes/belaVistaRouters');
const maristaRoutes = require('./src/routes/maristaRouters');
const buenoRoutes = require('./src/routes/buenoRouters');
const novoHorizonteRoutes = require('./src/routes/novoHorizonteRouters');
const campinasRoutes = require('./src/routes/campinasRouters');
const aeroportoRoutes = require('./src/routes/aeroportoRouters');

const app = express();
const PORT = process.env.PORT || 5500;  // Usar a porta configurada no .env ou 5500 por padrão

// Configuração do CORS
app.use(cors());  // Permitir todas as origens para testes

// Middleware para análise do corpo da requisição
app.use(express.json());  // Para analisar JSON
app.use(express.urlencoded({ extended: true }));  // Para analisar URL-encoded

// Configuração do logging com morgan
//app.use(morgan('dev')); // Usando o formato 'dev' para logs no console
// esse metodo gera um arquivo log
app.use(morgan('combined', { stream: accessLogStream }));  // Usando o formato 'combined' para logs detalhados

// Configuração da sessão
app.use(session({
    secret: process.env.SECRET,  // Valor padrão para SECRET
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Habilitar secure em produção
        httpOnly: true,  // Segurança adicional
        maxAge: 24 * 60 * 60 * 1000  // 24 horas
    }
}));

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define o motor de visualização para "ejs", que será usado para renderizar as páginas.
app.set("view engine", "ejs");

// Define o caminho das views para o diretório "pages" dentro do projeto.
// O path.join é utilizado para unir o caminho do diretório atual (__dirname) com a pasta "pages".
app.set("views", path.join(__dirname, "src/views/pages"));

// Configura os arquivos estáticos (HTML, CSS, imagens, etc.) para serem servidos a partir do diretório "src/views".
// O express.static é usado para disponibilizar arquivos estáticos no caminho especificado.
app.use(express.static(path.join(__dirname, 'src/views/public')));

app.get('/', (req, res) => {
    res.status(200).render('index');
})


// Rota para verificar o status da API
app.get('/status', (req, res) => {
    res.json({
        status: "OK",
        message: "A API está online e funcionando.",
        version: "1.0.1",  // Versão da API ou do aplicativo
        uptime: process.uptime()  // Tempo de atividade do servidor (opcional)
    });
});

// Rota para Termos de Serviço
app.get('/terms', (req, res) => {
    return res.json({
        message: "Termos de Serviço",
        terms: [
            {
                title: "Aceitação dos Termos",
                description: "Ao acessar ou usar nossa API, você concorda em estar vinculado por estes Termos de Serviço e por quaisquer políticas ou diretrizes adicionais que possamos publicar."
            },
            {
                title: "Uso da API",
                description: "Você concorda em usar a API apenas para fins legais e de acordo com todas as leis e regulamentações aplicáveis. É proibido usar a API de maneira que possa causar danos ou interrupções à API ou aos servidores."
            },
            {
                title: "Restrições de Uso",
                description: "Você não deve usar nossa API para realizar atividades fraudulentas, enviar spam ou violar direitos de propriedade intelectual. É proibido tentar acessar dados que não são destinados a você."
            },
            {
                title: "Propriedade Intelectual",
                description: "Todos os direitos de propriedade intelectual relacionados à nossa API e seu conteúdo permanecem conosco e nossos licenciadores. Nenhuma licença ou direito é concedido a você fora do expresso permitido por estes Termos."
            },
            {
                title: "Limitação de Responsabilidade",
                description: "Não somos responsáveis por quaisquer danos indiretos, especiais, acidentais ou consequenciais que possam surgir em conexão com o uso ou incapacidade de uso da API. A responsabilidade total é limitada ao máximo permitido pela lei."
            },
            {
                title: "Alterações aos Termos",
                description: "Podemos modificar estes Termos de Serviço a qualquer momento. O uso contínuo da API após a publicação de alterações constitui a aceitação das modificações. Recomendamos revisar os termos periodicamente."
            }
        ],
        contact: {
            email: "programadorihuryferreira@gmail.com",
            description: "Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco através do email fornecido."
        }
    });
});

// Rota de login
app.use('/login', login);

// Usar as rotas com autenticação
app.use('/belavista', authMiddleware, belaVistaRoutes);
app.use('/marista', authMiddleware, maristaRoutes);
app.use('/bueno', authMiddleware, buenoRoutes);
app.use('/novohorizonte', authMiddleware, novoHorizonteRoutes);
app.use('/campinas', authMiddleware, campinasRoutes);
app.use('/aeroporto', authMiddleware, aeroportoRoutes);

// Middleware para tratamento de erro 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'src/views/pages/erros', '404.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).sendFile(path.join(__dirname, 'src/views/pages/erros', '500.html'));
});

// Criar o servidor HTTP
const server = http.createServer(app);

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor HTTP está ativo na porta ${PORT}.\n`);
    console.log(`- Acesse o status da API em: http://localhost:${PORT}/status`);
    console.log(`- Consulte os termos de uso da API em: http://localhost:${PORT}/terms`);
    console.log(`- Visualize a documentação da API em: http://localhost:${PORT}/api-docs`);
    
    const currentYear = new Date().getFullYear();
    console.log(`\nTodos os direitos autorais reservados a Ihury Ferreira © ${currentYear}.`);
});
