'use client';

import { useState } from 'react';
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
];

const baterias = [
  { nome: 'Bateria 1', horario: '8h às 9h', vagas: 17 },
  { nome: 'Bateria 2', horario: '9h30 às 10h30', vagas: 17 },
  { nome: 'Bateria 3', horario: '11h às 12h', vagas: 16 },
];

const tamanhosCamiseta = ['4', '6', '8', '10', '12'];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeResponsavel: '',
    telefone: '',
    nomeAluno: '',
    dataNascimento: '',
    escola: '',
    bateria: '',
    tamanhoCamiseta: '',
    nomeCamiseta: '',
  });
  const [loading, setLoading] = useState(false);
  const [useMockApi, setUseMockApi] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use mock API se estiver em modo de teste
      const apiUrl = useMockApi ? '/api/inscricoes/mock' : '/api/inscricoes';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      <div className="max-w-md mx-auto">
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
        
        <div className="bg-green-500 shadow-xl rounded-3xl p-8 backdrop-blur-sm">
          {/* Logo no topo */}
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 flex items-center justify-center">
              <img 
                src="/images/logo-principal.png" 
                alt="Climbing Adventure 2023" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center uppercase">
            Festival de Escalada Escolar
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900"
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900"
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900"
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900"
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900 appearance-none"
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

            <div>
              <label htmlFor="bateria" className="block text-sm font-medium text-gray-900 uppercase">
                Bateria
              </label>
              <select
                name="bateria"
                id="bateria"
                required
                value={formData.bateria}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="" className="text-gray-900">Selecione um horário</option>
                {baterias.map((bateria) => (
                  <option key={bateria.horario} value={bateria.horario} className="text-gray-900">
                    {bateria.nome} - {bateria.horario}
                  </option>
                ))}
              </select>
            </div>

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
              </div>
              <select
                name="tamanhoCamiseta"
                id="tamanhoCamiseta"
                required
                value={formData.tamanhoCamiseta}
                onChange={handleChange}
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900 appearance-none"
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
                className="mt-1 block w-full rounded-full border-none shadow-sm focus:ring-2 focus:ring-yellow-500 sm:text-sm p-3 bg-yellow-300 text-gray-900"
              />
            </div>

            <div className="pt-6 flex items-center justify-between">
              <div className="flex-grow flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 flex justify-center py-3 px-6 border-2 border-orange-700 rounded-full shadow-lg text-base font-bold text-gray-900 bg-orange-500 hover:bg-orange-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase"
                >
                  {loading ? 'Processando...' : 'Continuar'}
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
                <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg mx-auto border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Tabela de Medidas - Camiseta Infantil</h3>
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
                      alt="Tabela de medidas de camiseta infantil"
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
