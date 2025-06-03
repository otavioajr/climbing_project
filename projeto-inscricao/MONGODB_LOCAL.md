# Como usar MongoDB Local

## Instalação no macOS com Homebrew

```bash
# Adicionar o tap do MongoDB
brew tap mongodb/brew

# Instalar MongoDB Community Edition
brew install mongodb-community

# Iniciar o serviço MongoDB
brew services start mongodb-community
```

## Configuração

Após instalar e iniciar o MongoDB local, atualize o arquivo `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/inscricoes
```

## Verificar se está funcionando

```bash
# Verificar se o MongoDB está rodando
brew services list | grep mongodb
```

## Parar o MongoDB quando não estiver usando

```bash
brew services stop mongodb-community
``` 