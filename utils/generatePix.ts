interface PixConfig {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string; // ID da transação (opcional)
  preGeneratedCode?: string; // Código PIX pré-gerado
}

// Implementação de PIX Copia e Cola
export function generatePixCode(config: PixConfig): string {
  // Se tiver um código PIX pré-gerado, use-o
  if (config.preGeneratedCode) {
    return config.preGeneratedCode;
  }
  
  // Caso contrário, use a versão simplificada como fallback
  return `PIX para: ${config.merchantName}
Chave PIX: ${config.pixKey}
Valor: R$ ${config.amount.toFixed(2)}
Identificador: ${config.txid || `INS${Date.now()}`}
Cidade: ${config.merchantCity}`;
} 