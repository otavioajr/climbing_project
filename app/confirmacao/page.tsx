'use client';

// Usar configurações de renderização dinâmica
import './config';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

  // Código PIX fixo fornecido
  const pixCodeFixo = '00020126580014BR.GOV.BCB.PIX0136f39933a1-6052-4885-b518-e2feb47658fd5204000053039865406300.005802BR592547.334.443 LEONARDO NEGRE6009SAO PAULO61080540900062240520BZuJUrxwl09SLW6kwykp63046EFE';
  
  // Link para pagamento com cartão
  const linkCartao = 'https://checkout.nubank.com.br/Em8L4gsG6Rkwykp';
  
  // Valor da inscrição
  const pixValue = 300;

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
    navigator.clipboard.writeText(pixCodeFixo);
    alert('Código PIX copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">Carregando...</p>
      </div>
    );
  }

  if (!inscricao) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">Inscrição não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="backdrop-blur-sm shadow-xl rounded-3xl p-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-custom-yellow rounded-full mb-4">
              <svg className="w-8 h-8 text-custom-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-custom-pink mb-2 uppercase">
              Inscrição realizada
            </h1>
            <p className="text-gray-900 font-medium">
              Guarde o número da sua inscrição para participar do sorteio no dia do festival
            </p>
            <div className="mt-4 bg-custom-yellow border border-custom-yellow rounded-lg p-4">
              <p className="text-sm text-gray-900 font-medium">
                <strong>Importante:</strong> A inscrição só é realizada mediante ao pagamento, aguarde a confirmação.
              </p>
            </div>
          </div>

          <div className="bg-custom-yellow rounded-2xl p-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-900 uppercase font-medium mb-2">Número de Inscrição</p>
              <p className="text-3xl font-bold text-indigo-600">{inscricao.numeroInscricao}</p>
              <p className="text-lg text-gray-900 font-medium mt-4">{inscricao.nomeAluno}</p>
            </div>
          </div>

          <div className="border-t border-yellow-400 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center uppercase">
              Pagamento via PIX
            </h2>

            <div className="grid md:grid-cols-2 gap-8 sm:grid-cols-1 grid-cols-1">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4 uppercase">QR Code PIX</h3>
                <div className="bg-white p-4 rounded-2xl border inline-block">
                  <img 
                    src="/images/qr-code.png" 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-900 mt-2">
                  Escaneie o código com seu app de pagamento
                </p>
              </div>

                              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 uppercase">PIX Copia e Cola</h3>
                <div className="bg-custom-yellow p-4 rounded-2xl text-sm font-mono text-gray-900 whitespace-pre-wrap overflow-auto max-h-64 break-words break-all">
                  {pixCodeFixo}
                </div>
                <button
                  onClick={copiarPixCode}
                  className="mt-4 w-full bg-custom-orange text-gray-900 font-bold py-3 px-4 rounded-full border-2 border-custom-orange hover:bg-custom-orange transition duration-200 uppercase"
                >
                  Copiar Código PIX
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-gray-900">
                Valor da Inscrição: R$ {pixValue.toFixed(2).replace('.', ',')}
              </p>
              <div className="mt-4 bg-custom-yellow border border-custom-yellow rounded-2xl p-4 inline-block">
                <p className="text-sm text-gray-900">
                  <strong>Importante:</strong> A inscrição só é realizada mediante ao pagamento, aguarde a confirmação.
                </p>
              </div>
            </div>

            {/* Seção de pagamento com cartão */}
            <div className="mt-8 text-center border-t border-yellow-400 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 uppercase">
                Pagamento com Cartão de Crédito
              </h3>
              <div className="bg-custom-pink bg-opacity-20 rounded-2xl p-4 inline-block">
                <p className="text-sm text-gray-900 mb-3">
                  Prefere pagar com cartão de crédito?
                </p>
                <a
                  href={linkCartao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-custom-pink text-white font-bold rounded-full border-2 border-custom-pink hover:bg-opacity-90 transition duration-200 uppercase"
                >
                  💳 Pagar com Cartão
                </a>
                <p className="text-xs text-gray-700 mt-2">
                  Link seguro do Nubank
                </p>
              </div>
            </div>
            
            {/* Logo da empresa */}
            <div className="flex justify-end mt-6">
              <div className="w-16 h-16">
                <img 
                  src="/images/logo-empresa.png" 
                  alt="Logo Empresa" 
                  className="w-full h-full object-contain"
                />
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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">Carregando dados da inscrição...</p>
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