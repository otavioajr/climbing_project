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
  if (config.preGeneratedCode) {
    return config.preGeneratedCode; // Só retorna o código EMV puro!
  }
  return '';
} 