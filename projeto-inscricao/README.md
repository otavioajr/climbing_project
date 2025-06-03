# Sistema de Inscrições

Sistema de formulário de inscrições para eventos com gerenciamento administrativo e integração com pagamento PIX.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Tailwind CSS** - Estilização
- **React QRCode** - Geração de QR Code para PIX

## 📋 Funcionalidades

### Para Usuários
- Formulário de inscrição completo
- Seleção de escola, bateria e tamanho de camiseta
- Geração automática de número de inscrição
- Página de confirmação com QR Code PIX
- Código PIX copia e cola

### Para Administradores
- Painel administrativo em `/admin`
- Visualização de todas as inscrições
- Estatísticas por bateria
- Confirmação de pagamento
- Visualização detalhada de cada inscrição

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
MONGODB_URI=sua-string-de-conexao-mongodb
NEXT_PUBLIC_PIX_KEY=sua-chave-pix
NEXT_PUBLIC_PIX_NAME=nome-do-recebedor
```

### 3. Configurar MongoDB

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure um usuário de banco de dados
4. Obtenha a string de conexão e adicione ao `.env.local`

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Páginas

- **/** - Formulário de inscrição
- **/confirmacao** - Página de confirmação com PIX
- **/admin** - Painel administrativo

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente na Vercel:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_PIX_KEY`
   - `NEXT_PUBLIC_PIX_NAME`
4. Deploy!

## 📝 Regras de Negócio

- Máximo de 17 inscrições para as baterias de 8h e 9h30
- Máximo de 16 inscrições para a bateria de 11h
- Número de inscrição gerado automaticamente
- Status inicial: "pendente", muda para "pago" após confirmação

## 🔒 Segurança

- A página `/admin` deve ser protegida em produção
- Considere adicionar autenticação para o painel administrativo
- Valide sempre os dados no servidor

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
