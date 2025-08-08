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
  
  // Link para pagamento com cartão via WhatsApp
  const linkCartao = 'https://wa.me/5511975054245?text=Ol%C3%A1!%20Poderia%20me%20mandar%20o%20link%20para%20pagamento%20via%20cart%C3%A3o%20de%20cr%C3%A9dito%3F%20Obrigado%28a%29%21';
  
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
                  Chame no WhatsApp para pagar no crédito
                </p>
                <a
                  href={linkCartao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-custom-pink text-white font-bold rounded-full border-2 border-custom-pink hover:bg-opacity-90 transition duration-200 uppercase"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
                  </svg>
                  Chamar no WhatsApp
                </a>
                <p className="text-xs text-gray-700 mt-2">
                  Solicitar link do cartão
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