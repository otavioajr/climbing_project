# Exemplos de Configuração PIX

## Tipos de Chave PIX Aceitos:

### 1. Email
```
NEXT_PUBLIC_PIX_KEY=seuemail@exemplo.com
```

### 2. Telefone (com +55)
```
NEXT_PUBLIC_PIX_KEY=+5511999999999
```

### 3. CPF (apenas números)
```
NEXT_PUBLIC_PIX_KEY=12345678901
```

### 4. CNPJ (apenas números)
```
NEXT_PUBLIC_PIX_KEY=12345678000190
```

### 5. Chave Aleatória
```
NEXT_PUBLIC_PIX_KEY=123e4567-e89b-12d3-a456-426614174000
```

## Exemplo Completo no .env.local:

```env
# Configuração PIX Completa
NEXT_PUBLIC_PIX_KEY=climbing.eventos@gmail.com
NEXT_PUBLIC_PIX_NAME=Climbing Eventos LTDA
NEXT_PUBLIC_PIX_CITY=Sao Paulo
```

## Importante:

- **Não use acentos** no nome e cidade (use "Sao Paulo" em vez de "São Paulo")
- **Teste o código gerado** em seu app bancário antes de colocar em produção
- O valor está fixo em R$ 150,00 no código. Para mudar, edite a linha `const pixValue = 150` em `app/confirmacao/page.tsx` 