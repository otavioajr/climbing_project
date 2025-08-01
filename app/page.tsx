'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const escolas = [
  'Colégio 24 de maio',
  'Colégio Anglo Leonardo da Vinci',
  'Colégio Dominus Vivendi',
  'Colégio Elvira Brandão',
  'Colégio Emilie de Villeneuve',
  'Colégio Magister',
  'Colégio Magno/Mágico de Oz',
  'Colégio Nova Geração',
  'Escola Castanheiras',
  'Escola da Vila',
  'Escola Viva',
  'Espaço Ekoa',
  'Recreação João & Maria',
  'St. Nicholas School',
  'Outra',
];

const tamanhosCamiseta = ['PP', 'P', 'M', 'G', 'GG', '3G', '4G', '5G'];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    telefone: '',
    nomeAluno: '',
    dataNascimento: '',
    escola: '',
    escolaOutra: '',
    tamanhoCamiseta: '',
    nomeCamiseta: '',
    autorizacaoImagem: false,
  });
  const [loading, setLoading] = useState(false);
  const [useMockApi, setUseMockApi] = useState(false);
  const [vagasInfo, setVagasInfo] = useState({
    totalInscricoes: 0,
    vagasDisponiveis: 50,
    limite: 50,
    vagasEsgotadas: false,
  });
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showEscolaOutra, setShowEscolaOutra] = useState(false);

  // Buscar informações sobre vagas disponíveis
  const buscarInfoVagas = async () => {
    try {
      const response = await fetch('/api/inscricoes?vagas=true');
      if (response.ok) {
        const data = await response.json();
        setVagasInfo(data);
      }
    } catch (error) {
      console.error('Erro ao buscar informações de vagas:', error);
    } finally {
      setLoadingVagas(false);
    }
  };

  useEffect(() => {
    buscarInfoVagas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Mostrar/ocultar campo de escola personalizada
    if (name === 'escola') {
      if (value === 'Outra') {
        setShowEscolaOutra(true);
      } else {
        setShowEscolaOutra(false);
        setFormData(prev => ({ ...prev, escolaOutra: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação customizada para o checkbox de autorização
    if (!formData.autorizacaoImagem) {
      alert('⚠️ Por favor, marque a caixa de autorização de uso de imagem para prosseguir com a inscrição.');
      return;
    }
    
    // Verificar se ainda há vagas disponíveis
    if (vagasInfo.vagasEsgotadas) {
      alert('❌ Não há mais vagas disponíveis. O limite de 50 inscrições foi atingido.');
      return;
    }
    
    setLoading(true);

    try {
      // Use mock API se estiver em modo de teste
      const apiUrl = useMockApi ? '/api/inscricoes/mock' : '/api/inscricoes';
      
      // Preparar dados para envio, usando escolaOutra se escola for "Outra"
      const dadosParaEnvio = {
        ...formData,
        escola: formData.escola === 'Outra' ? formData.escolaOutra : formData.escola
      };
      
      // Remover os campos que não devem ser enviados para a API
      const { escolaOutra, autorizacaoImagem, ...dadosFinais } = dadosParaEnvio;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosFinais),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/confirmacao?id=${data.numeroInscricao}`);
      } else {
        alert(data.error || 'Erro ao realizar inscrição');
      }
    } catch {
      alert('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Aviso de modo de teste */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg shadow-md">
            <p className="text-sm text-yellow-800">
              <strong>Modo de Desenvolvimento:</strong> Se o MongoDB não estiver configurado, 
              <button
                onClick={() => setUseMockApi(!useMockApi)}
                className="ml-2 underline font-semibold"
              >
                {useMockApi ? 'desativar' : 'ativar'} modo de teste
              </button>
              {useMockApi && <span className="ml-2">(Dados serão perdidos ao recarregar)</span>}
            </p>
          </div>
        )}
        
        <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="shadow-xl rounded-3xl p-8 backdrop-blur-sm">
          {/* Logo no topo */}
          <div className="flex justify-center">
            <div className="w-70 h-70 flex items-center justify-center">
              <img 
                src="/images/logo-principal.png" 
                alt="Climbing Adventure 2023" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-custom-pink mb-8 text-center uppercase font-title">
            Festival de Escalada Escolar
          </h1>

          {/* Informações sobre vagas disponíveis */}
          <div className="mb-6 p-4 rounded-2xl bg-white/80 backdrop-blur-sm">
            {loadingVagas ? (
              <div className="text-center text-gray-600">
                <span>Carregando informações de vagas...</span>
              </div>
            ) : (
              <div className="text-center">
                {vagasInfo.vagasEsgotadas ? (
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-bold">
                    <span className="text-2xl">❌</span>
                    <span className="text-lg">VAGAS ESGOTADAS</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-green-600 font-bold">
                    <span className="text-2xl">✅</span>
                    <span className="text-lg">
                      {vagasInfo.vagasDisponiveis} {vagasInfo.vagasDisponiveis === 1 ? 'VAGA DISPONÍVEL' : 'VAGAS DISPONÍVEIS'}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">
                  {vagasInfo.totalInscricoes} de {vagasInfo.limite} inscrições realizadas
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" lang="pt-BR">
            <div>
              <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-900 uppercase">
                Nome completo responsável
              </label>
              <input
                type="text"
                name="nomeResponsavel"
                id="nomeResponsavel"
                required
                value={formData.nomeResponsavel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-900 uppercase">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="nomeAluno" className="block text-sm font-medium text-gray-900 uppercase">
                Nome completo aluno
              </label>
              <input
                type="text"
                name="nomeAluno"
                id="nomeAluno"
                required
                value={formData.nomeAluno}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-900 uppercase">
                Data de nascimento
              </label>
              <input
                type="date"
                name="dataNascimento"
                id="dataNascimento"
                required
                value={formData.dataNascimento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="escola" className="block text-sm font-medium text-gray-900 uppercase">
                Escola
              </label>
              <select
                name="escola"
                id="escola"
                required
                value={formData.escola}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="" className="text-gray-900">Selecione uma escola</option>
                {escolas.map((escola) => (
                  <option key={escola} value={escola} className="text-gray-900">
                    {escola}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo para escola personalizada */}
            {showEscolaOutra && (
              <div>
                <label htmlFor="escolaOutra" className="block text-sm font-medium text-gray-900 uppercase">
                  Digite o nome da escola
                </label>
                <input
                  type="text"
                  name="escolaOutra"
                  id="escolaOutra"
                  required={formData.escola === 'Outra'}
                  value={formData.escolaOutra}
                  onChange={handleChange}
                  placeholder="Nome da escola..."
                  className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <label htmlFor="tamanhoCamiseta" className="block text-sm font-medium text-gray-900 uppercase">
                  Tamanho camiseta
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowSizeChart(true)}
                  className="text-gray-900 hover:text-gray-700 focus:outline-none"
                  title="Ver tabela de medidas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <span className="text-xs text-gray-900">Clique no "?" para ver medidas</span>
              </div>
              <select
                name="tamanhoCamiseta"
                id="tamanhoCamiseta"
                required
                value={formData.tamanhoCamiseta}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="" className="text-gray-900">Selecione um tamanho</option>
                {tamanhosCamiseta.map((tamanho) => (
                  <option key={tamanho} value={tamanho} className="text-gray-900">
                    {tamanho}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nomeCamiseta" className="block text-sm font-medium text-gray-900 uppercase">
                Nome/Apelido camiseta
              </label>
              <input
                type="text"
                name="nomeCamiseta"
                id="nomeCamiseta"
                required
                value={formData.nomeCamiseta}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-custom-yellow sm:text-sm p-3 bg-custom-yellow text-gray-900"
              />
            </div>

            {/* Checkbox de autorização de uso de imagem */}
            <div className="pt-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="autorizacaoImagem"
                  id="autorizacaoImagem"
                  checked={formData.autorizacaoImagem}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-custom-orange focus:ring-custom-yellow border-gray-300 rounded flex-shrink-0"
                />
                <label htmlFor="autorizacaoImagem" className="text-xs text-gray-800 leading-relaxed">
                  <span className="font-medium">Autorizo o uso da minha imagem e/ou da imagem do(a) menor sob minha responsabilidade para fins de divulgação neste site, redes sociais e materiais promocionais.</span>
                  <br />
                  <br />
                  <span className="text-gray-700">
                    Ao marcar esta opção, declaro estar ciente e de acordo com o uso das imagens conforme descrito na Política de Privacidade e nos Termos de Uso do site.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <div className="flex-grow flex justify-center">
                <button
                  type="submit"
                  disabled={loading || !formData.autorizacaoImagem || vagasInfo.vagasEsgotadas}
                  className="w-2/3 flex justify-center py-3 px-6 border-2 border-custom-orange rounded-full shadow-lg text-base font-bold text-gray-900 bg-custom-orange hover:bg-custom-orange focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase"
                >
                  {loading ? 'Processando...' : vagasInfo.vagasEsgotadas ? 'Vagas Esgotadas' : 'Continuar'}
                </button>
              </div>
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src="/images/logo-empresa.png" 
                  alt="Logo Empresa" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Popup da tabela de medidas */}
            {showSizeChart && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
                <div style={{backgroundColor: 'rgba(82, 230, 31, 0.6)'}} className="p-6 rounded-lg shadow-2xl max-w-lg mx-auto border border-custom-yellow backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 uppercase">Tabela de Medidas - Camiseta Unissex</h3>
                    <button 
                      type="button" 
                      onClick={() => setShowSizeChart(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-center">
                    <img 
                      src="/images/tabela-medidas.jpg" 
                      alt="Tabela de medidas de camiseta unissex"
                      className="max-w-full h-auto"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(false)}
                      className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
