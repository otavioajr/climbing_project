'use client';

// Usar configurações de renderização dinâmica
import './config';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCode } from 'react-qrcode';
import { generatePixCode } from '@/utils/generatePix';

interface Inscricao {
  numeroInscricao: string;
  nomeAluno: string;
  nomeResponsavel: string;
  status: string;
}

// Componente principal que usa useSearchParams
function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  const numeroInscricao = searchParams?.get('id') || '';
  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [loading, setLoading] = useState(true);

  // Informações PIX (você deve substituir com as suas)
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || 'email@exemplo.com';
  const pixName = process.env.NEXT_PUBLIC_PIX_NAME || 'Nome do Recebedor';
  const pixCity = process.env.NEXT_PUBLIC_PIX_CITY || 'São Paulo';
  const pixValue = 300; // Valor da inscrição em reais
  const preGeneratedPixCode = process.env.NEXT_PUBLIC_PIX_CODE || ''; // Código PIX pré-gerado
  
  // Gerar código PIX copia e cola válido
  const pixCode = inscricao ? generatePixCode({
    pixKey: pixKey,
    merchantName: pixName,
    merchantCity: pixCity,
    amount: pixValue,
    txid: inscricao.numeroInscricao,
    preGeneratedCode: preGeneratedPixCode
  }) : '';

  const fetchInscricao = useCallback(async () => {
    if (!numeroInscricao) {
      setLoading(false);
      return;
    }
    
    try {
      // Tenta primeiro a API real, se falhar tenta a API mock
      let response = await fetch(`/api/inscricoes?id=${numeroInscricao}`);
      
      if (!response.ok && response.status === 500) {
        // Se falhou, tenta a API mock
        response = await fetch(`/api/inscricoes/mock?id=${numeroInscricao}`);
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setInscricao(data);
      }
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
    } finally {
      setLoading(false);
    }
  }, [numeroInscricao]);

  useEffect(() => {
    if (numeroInscricao) {
      fetchInscricao();
    }
  }, [numeroInscricao, fetchInscricao]);

  const copiarPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!inscricao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Inscrição não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inscrição realizada
            </h1>
            <p className="text-gray-600">
              Guarde o número da sua inscrição e realize o pagamento
            </p>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Após realizar o pagamento, aguarde a confirmação.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Número de Inscrição</p>
              <p className="text-3xl font-bold text-indigo-600">{inscricao.numeroInscricao}</p>
              <p className="text-lg text-gray-700 mt-4">{inscricao.nomeAluno}</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Pagamento via PIX
            </h2>

            <div className="grid md:grid-cols-2 gap-8 sm:grid-cols-1 grid-cols-1">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">QR Code PIX</h3>
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <QRCode value={pixCode} size={200} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Escaneie o código com seu app de pagamento
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">PIX Copia e Cola</h3>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-900 whitespace-pre-wrap overflow-auto max-h-64 break-words break-all">
                  {pixCode}
                </div>
                <button
                  onClick={copiarPixCode}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  Copiar Código PIX
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Valor da Inscrição: R$ {pixValue.toFixed(2).replace('.', ',')}
              </p>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Após realizar o pagamento, aguarde a confirmação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de fallback para quando o Suspense está carregando
function ConfirmacaoLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Carregando dados da inscrição...</p>
    </div>
  );
}

// Exportar o componente principal envolvido em Suspense
export default function Confirmacao() {
  return (
    <Suspense fallback={<ConfirmacaoLoading />}>
      <ConfirmacaoContent />
    </Suspense>
  );
} 