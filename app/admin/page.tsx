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
  bateria: string;
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

  // Contar inscrições por bateria
  const contarPorBateria = (bateria: string) => {
    return inscricoes.filter(i => i.bateria === bateria).length;
  };

  // Mapeamento de horários para nomes de baterias
  const mapearBateriaNome = (horario: string): string => {
    switch (horario) {
      case '8h às 9h':
        return 'Bateria 1: 8h às 9h';
      case '9h30 às 10h30':
        return 'Bateria 2: 9h30 às 10h30';
      case '11h às 12h':
        return 'Bateria 3: 11h às 12h';
      // Manter compatibilidade com registros antigos
      case '8h às 9h15':
        return 'Bateria 1: 8h às 9h';
      case '9h30 às 10h45':
        return 'Bateria 2: 9h30 às 10h30';
      case '11h às 12h15':
        return 'Bateria 3: 11h às 12h';
      default:
        return horario;
    }
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
      'Bateria': mapearBateriaNome(inscricao.bateria),
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
      { wch: 15 }, // Bateria
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto px-2 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLupaClick}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Buscar inscrição"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
              </svg>
            </button>
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar aluno, responsável ou número..."
                className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-72 text-gray-900"
              />
            )}
            <button
              onClick={exportarParaExcel}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar para Excel
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Inscrições</h3>
            <p className="text-2xl font-bold text-gray-900">{inscricoes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Bateria 1: 8h às 9h</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('8h às 9h') + contarPorBateria('8h às 9h15')}/17</p>
            <p className="text-xs text-gray-500 mt-1">Números 0001-0017</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Bateria 2: 9h30 às 10h30</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('9h30 às 10h30') + contarPorBateria('9h30 às 10h45')}/17</p>
            <p className="text-xs text-gray-500 mt-1">Números 0018-0035</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Bateria 3: 11h às 12h</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('11h às 12h') + contarPorBateria('11h às 12h15')}/16</p>
            <p className="text-xs text-gray-500 mt-1">Números 0036-0050</p>
          </div>
        </div>

        {/* Tabela de inscrições */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bateria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscricoesFiltradas.map((inscricao) => (
                  <tr key={inscricao._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inscricao.numeroInscricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inscricao.nomeAluno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inscricao.nomeResponsavel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mapearBateriaNome(inscricao.bateria)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inscricao.status === 'pago' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inscricao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inscricao.criadoEm)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-nowrap gap-3 items-center">
                        <button
                          onClick={() => verDetalhes(inscricao)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Detalhes
                        </button>
                        {inscricao.status === 'pendente' && (
                          <button
                            onClick={() => confirmarPagamento(inscricao._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirmar Pagamento
                          </button>
                        )}
                        {inscricao.status === 'pago' && (
                          <button
                            onClick={() => desconfirmarPagamento(inscricao._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Desconfirmar Pagamento
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Detalhes da Inscrição
              </h3>
              <div className="mt-2 space-y-3">
                <p className="text-sm text-gray-500">
                  <strong>Número:</strong> {selectedInscricao.numeroInscricao}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Aluno:</strong> {selectedInscricao.nomeAluno}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Responsável:</strong> {selectedInscricao.nomeResponsavel}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Telefone:</strong> {selectedInscricao.telefone}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Data de Nascimento:</strong> {formatDate(selectedInscricao.dataNascimento)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Escola:</strong> {selectedInscricao.escola}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Bateria:</strong> {mapearBateriaNome(selectedInscricao.bateria)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tamanho da Camiseta:</strong> {selectedInscricao.tamanhoCamiseta}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Nome na Camiseta:</strong> {selectedInscricao.nomeCamiseta}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {selectedInscricao.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Data de Inscrição:</strong> {formatDate(selectedInscricao.criadoEm)}
                </p>
              </div>
              <div className="items-center px-4 py-3 space-y-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Confirmar Exclusão
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja descadastrar o aluno <strong>{selectedInscricao.nomeAluno}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="items-center px-4 py-3 flex gap-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md flex-1 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={deletarInscricao}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md flex-1 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
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