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
  
  // Estados para configurações
  const [showConfig, setShowConfig] = useState(false);
  const [limiteVagas, setLimiteVagas] = useState(50);
  const [loadingConfig, setLoadingConfig] = useState(false);
  
  // Estados para informações de vagas
  const [vagasInfo, setVagasInfo] = useState<{
    totalInscricoes: number;
    vagasDisponiveis: number;
    limite: number;
    lotado: boolean;
  } | null>(null);

  useEffect(() => {
    fetchInscricoes();
    fetchConfiguracoes();
    fetchVagasInfo();
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

  // Buscar informações de vagas
  const fetchVagasInfo = async () => {
    try {
      const response = await fetch('/api/vagas');
      if (response.ok) {
        const data = await response.json();
        setVagasInfo({
          totalInscricoes: data.totalInscricoes,
          vagasDisponiveis: data.vagasDisponiveis,
          limite: data.limiteVagas,
          lotado: data.lotado,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar informações de vagas:', error);
    }
  };

  // Buscar configurações atuais
  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (response.ok) {
        setLimiteVagas(data.limite_vagas?.valor || 50);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  // Salvar configuração de limite de vagas
  const salvarLimiteVagas = async () => {
    if (limiteVagas < 1) {
      alert('O limite de vagas deve ser maior que 0');
      return;
    }

    setLoadingConfig(true);
    try {
      console.log('Salvando limite de vagas:', limiteVagas);
      
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chave: 'limite_vagas',
          valor: limiteVagas,
          descricao: 'Número máximo de inscrições permitidas no sistema'
        }),
      });

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (response.ok) {
        alert(`Limite de vagas atualizado com sucesso para ${limiteVagas}!`);
        setShowConfig(false);
        // Atualizar a lista de inscrições para refletir as mudanças
        fetchInscricoes();
        // Atualizar informações de vagas
        fetchVagasInfo();
      } else {
        alert(`Erro ao atualizar limite de vagas: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração');
    } finally {
      setLoadingConfig(false);
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
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfig(true);
              }}
              type="button"
              className="bg-custom-pink hover:bg-custom-pink text-white font-bold py-2 px-4 rounded-full border-2 border-custom-pink flex items-center uppercase"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-custom-yellow backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Total de Inscrições</h3>
            <p className="text-2xl font-bold text-gray-900">{vagasInfo?.totalInscricoes || inscricoes.length}</p>
          </div>
          <div className="bg-custom-orange backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 uppercase">Pagamentos Confirmados</h3>
            <p className="text-2xl font-bold text-gray-900">{inscricoes.filter(i => i.status === 'pago').length}</p>
          </div>
          <div className="bg-custom-pink backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-white uppercase">Vagas Disponíveis</h3>
            <p className="text-2xl font-bold text-white">{vagasInfo?.vagasDisponiveis ?? Math.max(0, (vagasInfo?.limite || 50) - inscricoes.length)}</p>
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

      {/* Modal de Configurações */}
      {showConfig && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="relative top-20 mx-auto p-5 border-2 border-custom-yellow w-96 shadow-2xl rounded-2xl backdrop-blur-sm">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-bold text-pink-600 mb-4 uppercase text-center">
                Configurações do Sistema
              </h3>
              <div className="bg-yellow-300 rounded-xl p-4">
                <div className="mt-2 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <strong>Limite de Vagas:</strong>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={limiteVagas}
                      onChange={(e) => {
                        const valor = parseInt(e.target.value);
                        if (!isNaN(valor) && valor > 0) {
                          setLimiteVagas(valor);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-lg text-center font-semibold"
                      placeholder="Ex: 50"
                    />
                    <p className="text-xs text-gray-700 mt-1">
                      Número máximo de inscrições permitidas no sistema
                    </p>
                  </div>
                </div>
              </div>
              <div className="items-center px-4 py-3 space-y-2 mt-4">
                <button
                  onClick={() => {
                    setShowConfig(false);
                    fetchConfiguracoes(); // Restaura valor original se cancelar
                  }}
                  className="px-4 py-2 bg-yellow-300 text-gray-900 text-base font-bold rounded-full w-full shadow-sm hover:bg-yellow-400 focus:outline-none border-2 border-yellow-400 uppercase"
                  disabled={loadingConfig}
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    salvarLimiteVagas();
                  }}
                  disabled={loadingConfig}
                  className="px-4 py-2 bg-pink-600 text-white text-base font-bold rounded-full w-full shadow-sm hover:bg-pink-700 focus:outline-none border-2 border-pink-700 uppercase disabled:opacity-50"
                >
                  {loadingConfig ? 'Salvando...' : 'Salvar Configuração'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 