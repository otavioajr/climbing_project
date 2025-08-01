'use client';

// Usar configurações de renderização dinâmica
import './config';

import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

interface Inscricao {
  _id: string;
  numeroInscricao: string;
  nomeResponsavel: string;
  telefone: string;
  nomeAluno: string;
  dataNascimento: string;
  escola: string;
  tamanhoCamiseta: string;
  nomeCamiseta: string;
  status: 'pendente' | 'pago';
  criadoEm: string;
}

export default function Admin() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const fetchInscricoes = async () => {
    try {
      const response = await fetch('/api/inscricoes');
      const data = await response.json();
      
      if (response.ok) {
        setInscricoes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagamento = async (inscricaoId: string) => {
    try {
      const response = await fetch(`/api/inscricoes/${inscricaoId}/confirmar-pagamento`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Pagamento confirmado com sucesso!');
        fetchInscricoes();
        setShowModal(false);
      } else {
        alert('Erro ao confirmar pagamento');
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      alert('Erro ao confirmar pagamento');
    }
  };

  const desconfirmarPagamento = async (inscricaoId: string) => {
    try {
      const response = await fetch(`/api/inscricoes/${inscricaoId}/desconfirmar-pagamento`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Pagamento desconfirmado com sucesso!');
        fetchInscricoes();
        setShowModal(false);
      } else {
        alert('Erro ao desconfirmar pagamento');
      }
    } catch (error) {
      console.error('Erro ao desconfirmar pagamento:', error);
      alert('Erro ao desconfirmar pagamento');
    }
  };

  const verDetalhes = (inscricao: Inscricao) => {
    setSelectedInscricao(inscricao);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para exportar para Excel
  const exportarParaExcel = () => {
    // Formatar dados para exportação
    const dadosParaExportar = inscricoes.map(inscricao => ({
      'Número': inscricao.numeroInscricao,
      'Aluno': inscricao.nomeAluno,
      'Responsável': inscricao.nomeResponsavel,
      'Telefone': inscricao.telefone,
      'Data de Nascimento': formatDate(inscricao.dataNascimento),
      'Escola': inscricao.escola,
      'Tamanho da Camiseta': inscricao.tamanhoCamiseta,
      'Nome na Camiseta': inscricao.nomeCamiseta,
      'Status': inscricao.status,
      'Data de Inscrição': formatDate(inscricao.criadoEm)
    }));

    // Criar planilha
    const workSheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    
    // Ajustar largura das colunas
    const wscols = [
      { wch: 10 }, // Número
      { wch: 25 }, // Aluno
      { wch: 25 }, // Responsável
      { wch: 15 }, // Telefone
      { wch: 15 }, // Data Nascimento
      { wch: 20 }, // Escola
      { wch: 15 }, // Tamanho Camiseta
      { wch: 20 }, // Nome Camiseta
      { wch: 10 }, // Status
      { wch: 15 }, // Data Inscrição
    ];
    workSheet['!cols'] = wscols;

    // Criar pasta de trabalho
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Inscrições');
    
    // Gerar arquivo e iniciar download
    const dataAtual = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workBook, `inscricoes_${dataAtual}.xlsx`);
  };

  // Filtrar inscrições conforme o termo de busca
  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const termo = searchTerm.toLowerCase();
    return (
      inscricao.nomeAluno.toLowerCase().includes(termo) ||
      inscricao.nomeResponsavel.toLowerCase().includes(termo) ||
      inscricao.numeroInscricao.toLowerCase().includes(termo)
    );
  });

  // Focar no input ao abrir a busca
  const handleLupaClick = () => {
    setSearchOpen((prev) => !prev);
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 100);
  };

  const deletarInscricao = async () => {
    if (!selectedInscricao) return;

    try {
      const response = await fetch(`/api/inscricoes/${selectedInscricao._id}/deletar`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Inscrição deletada com sucesso!');
        fetchInscricoes();
        setShowModal(false);
        setShowConfirmDelete(false);
      } else {
        alert('Erro ao deletar inscrição');
      }
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      alert('Erro ao deletar inscrição');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 bg-white bg-opacity-80 p-4 rounded-lg shadow-md">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto px-2 lg:px-8">
        <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 rounded-2xl backdrop-blur-sm gap-4">
          {/* Logo no canto superior esquerdo */}
          <div className="flex items-center">
            <div className="w-16 h-16 mr-4">
              <img 
                src="/images/logo-principal.png" 
                alt="Climbing Adventure 2023" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-custom-pink uppercase">
              Painel Administrativo
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleLupaClick}
              className="p-2 rounded-full hover:bg-custom-yellow focus:outline-none focus:ring-2 focus:ring-custom-yellow bg-custom-yellow"
              title="Buscar inscrição"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
              </svg>
            </button>
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="ml-2 px-3 py-2 border border-custom-yellow rounded-full focus:outline-none focus:ring-2 focus:ring-custom-yellow transition-all w-full md:w-72 text-gray-900 bg-custom-yellow bg-opacity-50"
              />
            )}
            <button
              onClick={exportarParaExcel}
              className="bg-custom-orange hover:bg-custom-orange text-gray-900 font-bold py-2 px-4 rounded-full border-2 border-custom-orange flex items-center uppercase"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-custom-yellow backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Total de Inscrições</h3>
            <p className="text-2xl font-bold text-gray-900">{inscricoes.length}</p>
          </div>
          <div className="bg-custom-yellow backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Pagamentos Confirmados</h3>
            <p className="text-2xl font-bold text-gray-900">{inscricoes.filter(i => i.status === 'pago').length}</p>
          </div>
          <div className="bg-custom-yellow backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Vagas Disponíveis</h3>
            <p className="text-2xl font-bold text-gray-900">{Math.max(0, 50 - inscricoes.length)}</p>
          </div>
          <div className="bg-custom-yellow backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Status das Vagas</h3>
            <p className={`text-lg font-bold ${inscricoes.length >= 50 ? 'text-red-600' : 'text-green-600'}`}>
              {inscricoes.length >= 50 ? 'ESGOTADAS' : 'DISPONÍVEIS'}
            </p>
          </div>
        </div>

        {/* Tabela de inscrições */}
        <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-custom-yellow">
              <thead className="bg-custom-yellow">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-custom-yellow bg-opacity-50 divide-y divide-custom-yellow">
                {inscricoesFiltradas.map((inscricao) => (
                  <tr key={inscricao._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inscricao.numeroInscricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscricao.nomeAluno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscricao.nomeResponsavel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inscricao.status === 'pago' 
                          ? 'bg-green-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {inscricao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(inscricao.criadoEm)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-nowrap gap-3 items-center">
                        <button
                          onClick={() => verDetalhes(inscricao)}
                          className="text-gray-900 bg-custom-yellow px-2 py-1 rounded-full hover:bg-custom-yellow font-medium text-xs"
                        >
                          Detalhes
                        </button>
                        {inscricao.status === 'pendente' && (
                          <button
                            onClick={() => confirmarPagamento(inscricao._id)}
                            className="text-white bg-green-500 px-2 py-1 rounded-full hover:bg-green-600 font-medium text-xs"
                          >
                            Confirmar
                          </button>
                        )}
                        {inscricao.status === 'pago' && (
                          <button
                            onClick={() => desconfirmarPagamento(inscricao._id)}
                            className="text-white bg-orange-500 px-2 py-1 rounded-full hover:bg-orange-600 font-medium text-xs"
                          >
                            Desconfirmar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de detalhes */}
      {showModal && selectedInscricao && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="relative top-20 mx-auto p-5 border-2 border-custom-yellow w-96 shadow-2xl rounded-2xl backdrop-blur-sm">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-bold text-pink-600 mb-4 uppercase text-center">
                Detalhes da Inscrição
              </h3>
              <div className="bg-yellow-300 rounded-xl p-4">
                <div className="mt-2 space-y-3">
                  <p className="text-sm text-gray-900">
                    <strong>Número:</strong> {selectedInscricao.numeroInscricao}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Aluno:</strong> {selectedInscricao.nomeAluno}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Responsável:</strong> {selectedInscricao.nomeResponsavel}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Telefone:</strong> {selectedInscricao.telefone}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Data de Nascimento:</strong> {formatDate(selectedInscricao.dataNascimento)}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Escola:</strong> {selectedInscricao.escola}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Tamanho da Camiseta:</strong> {selectedInscricao.tamanhoCamiseta}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Nome na Camiseta:</strong> {selectedInscricao.nomeCamiseta}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-1 rounded-full text-white ${selectedInscricao.status === 'pago' ? 'bg-green-500' : 'bg-orange-500'}`}>
                      {selectedInscricao.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Data de Inscrição:</strong> {formatDate(selectedInscricao.criadoEm)}
                  </p>
                </div>
              </div>
              <div className="items-center px-4 py-3 space-y-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-yellow-300 text-gray-900 text-base font-bold rounded-full w-full shadow-sm hover:bg-yellow-400 focus:outline-none border-2 border-yellow-400 uppercase"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 bg-orange-500 text-white text-base font-bold rounded-full w-full shadow-sm hover:bg-orange-600 focus:outline-none border-2 border-orange-600 uppercase"
                >
                  Descadastrar Aluno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para deletar */}
      {showConfirmDelete && selectedInscricao && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div style={{backgroundColor: 'rgba(82, 230, 31, 0.7)'}} className="relative top-20 mx-auto p-5 border-2 border-custom-orange w-96 shadow-2xl rounded-2xl backdrop-blur-sm">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-bold text-pink-600 mb-4 uppercase">
                Confirmar Exclusão
              </h3>
              <div className="mt-2 px-7 py-3 bg-yellow-300 rounded-xl">
                <p className="text-sm text-gray-900">
                  Tem certeza que deseja descadastrar o aluno <strong>{selectedInscricao.nomeAluno}</strong>?
                </p>
                <p className="text-sm text-gray-900 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="items-center px-4 py-3 flex gap-2 mt-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-yellow-300 text-gray-900 text-base font-bold rounded-full flex-1 shadow-sm hover:bg-yellow-400 focus:outline-none border-2 border-yellow-400 uppercase"
                >
                  Cancelar
                </button>
                <button
                  onClick={deletarInscricao}
                  className="px-4 py-2 bg-orange-500 text-white text-base font-bold rounded-full flex-1 shadow-sm hover:bg-orange-600 focus:outline-none border-2 border-orange-600 uppercase"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 