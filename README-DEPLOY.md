# 🧗‍♂️ Sistema de Inscrições - Festival de Escalada Escolar

Sistema completo de inscrições para eventos com pagamento via PIX, desenvolvido em Next.js 15.

## ✨ Funcionalidades

### Para Usuários
- ✅ Formulário de inscrição completo
- ✅ Seleção de escola (incluindo opção "Outra")
- ✅ Tamanhos de camiseta (PP até 5G) com tabela de medidas
- ✅ Autorização de uso de imagem obrigatória
- ✅ Geração automática de número de inscrição sequencial
- ✅ Página de confirmação com QR Code PIX
- ✅ Código PIX copia e cola

### Para Administradores
- ✅ Painel administrativo em `/admin`
- ✅ Visualização de todas as inscrições
- ✅ Estatísticas de inscrições e pagamentos
- ✅ Confirmação/desconfirmação de pagamentos
- ✅ Visualização detalhada de cada inscrição
- ✅ Exportação para Excel
- ✅ Busca e filtros

## 🚀 Deploy para Produção

### 1. Vercel (Recomendado)

1. **Conecte o repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe este repositório
   - Configure as variáveis de ambiente

2. **Configure as variáveis de ambiente na Vercel:**
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/inscricoes?retryWrites=true&w=majority
   NEXT_PUBLIC_PIX_KEY=sua-chave-pix@email.com
   NEXT_PUBLIC_PIX_NAME=Seu Nome Completo
   NEXT_PUBLIC_PIX_CITY=Sua Cidade
   ```

3. **Deploy automático:**
   - A Vercel fará o deploy automaticamente
   - Cada push na branch `main` gera um novo deploy

### 2. Outros Provedores

Para deploy em outros provedores (Netlify, Railway, etc.):

1. Configure as mesmas variáveis de ambiente
2. Execute `npm run build`
3. Faça upload da pasta `.next` gerada

## ⚙️ Configuração Local

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- Conta no MongoDB Atlas

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/otavioajr/climbing_project.git
   cd climbing_project
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edite `.env.local` com suas configurações reais.

4. **Execute em desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse:**
   - Formulário: http://localhost:3000
   - Admin: http://localhost:3000/admin

## 🗄️ Banco de Dados

### MongoDB Atlas (Recomendado)

1. Crie uma conta em [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Configure um usuário de banco
4. Obtenha a string de conexão
5. Configure no `.env.local` ou nas variáveis de ambiente do provedor

### Estrutura do Banco

```javascript
// Collection: inscricoes
{
  numeroInscricao: String, // "0001", "0002", etc.
  nomeResponsavel: String,
  telefone: String,
  nomeAluno: String,
  dataNascimento: Date,
  escola: String,
  tamanhoCamiseta: String, // "PP", "P", "M", "G", "GG", "3G", "4G", "5G"
  nomeCamiseta: String,
  status: String, // "pendente" | "pago"
  criadoEm: Date
}
```

## 💳 Configuração PIX

Configure suas informações PIX nas variáveis de ambiente:

- `NEXT_PUBLIC_PIX_KEY`: Sua chave PIX (email, CPF, etc.)
- `NEXT_PUBLIC_PIX_NAME`: Nome do recebedor
- `NEXT_PUBLIC_PIX_CITY`: Cidade do recebedor

**Importante:** 
- Não use acentos no nome e cidade
- Teste o PIX em ambiente de desenvolvimento antes de publicar

## 🛡️ Segurança

### Para Produção:
- ✅ Proteja a rota `/admin` com autenticação
- ✅ Configure HTTPS
- ✅ Use variáveis de ambiente para dados sensíveis
- ✅ Faça backup regular do banco de dados

### Sugestão de Proteção Admin:
```javascript
// app/admin/middleware.ts (exemplo)
const adminPassword = process.env.ADMIN_PASSWORD;
// Implemente autenticação básica ou OAuth
```

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 🎨 Customização

### Cores do Tema:
```css
--color-green: #52E61F;
--color-yellow: #F6DE10;
--color-pink: #E857E6;
--color-orange: #FC8304;
```

### Fontes:
- Títulos: Sailors (fonte local)
- Corpo: Montserrat (Google Fonts)

## 📝 Regras de Negócio

- ✅ Números de inscrição sequenciais (0001, 0002, etc.)
- ✅ Não permite aluno duplicado na mesma escola
- ✅ Status inicial: "pendente"
- ✅ Valor fixo: R$ 300,00 (configurável)
- ✅ Autorização de imagem obrigatória

## 📱 Páginas

- `/` - Formulário de inscrição
- `/confirmacao?id={numero}` - Confirmação com PIX
- `/admin` - Painel administrativo

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique as variáveis de ambiente
2. Confirme a conexão com MongoDB
3. Teste em ambiente local primeiro
4. Verifique os logs do provedor de hosting

---

Desenvolvido com ❤️ para o Festival de Escalada Escolar
