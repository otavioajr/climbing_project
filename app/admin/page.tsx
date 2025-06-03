'use client';

import { useState, useEffect } from 'react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Painel Administrativo
        </h1>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Inscrições</h3>
            <p className="text-2xl font-bold text-gray-900">{inscricoes.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">8h às 9h15</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('8h às 9h15')}/17</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">9h30 às 10h45</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('9h30 às 10h45')}/17</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">11h às 12h15</h3>
            <p className="text-2xl font-bold text-gray-900">{contarPorBateria('11h às 12h15')}/16</p>
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
                {inscricoes.map((inscricao) => (
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
                      {inscricao.bateria}
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
                      <button
                        onClick={() => verDetalhes(inscricao)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
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
                  <strong>Bateria:</strong> {selectedInscricao.bateria}
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
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 