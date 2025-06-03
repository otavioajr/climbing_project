const QRCodePix = require('pix-qrcode-generator');

interface PixConfig {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid?: string; // ID da transação (opcional)
}

export function generatePixCode(config: PixConfig): string {
  const qrCodePix = new QRCodePix({
    pixKey: config.pixKey,
    description: 'Inscricao Evento',
    merchantName: config.merchantName,
    merchantCity: config.merchantCity,
    value: config.amount,
    txid: config.txid || `INS${Date.now()}`,
  });

  return qrCodePix.getPayload();
} 