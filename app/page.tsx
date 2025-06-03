'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const escolas = [
  'Colégio Emilie',
  'Colégio 24 de maio',
  'Colégio Anglo Leonardo da Vinci',
  'Colégio Dominus',
  'Colégio Elvira Brandão',
  'Colégio Magister',
  'Colégio Magno',
  'Colégio Nova Geração',
  'Colégio Viva',
  'Ekoa',
  'Escola Castanheiras',
  'Escola da Vila',
  'Recreação João & Maria',
  'St. Nicholas School',
];

const baterias = [
  { horario: '8h às 9h15', vagas: 17 },
  { horario: '9h30 às 10h45', vagas: 17 },
  { horario: '11h às 12h15', vagas: 16 },
];

const tamanhosCamiseta = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Aviso de modo de teste */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
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
        
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Formulário de Inscrição
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-700">
                Nome completo do responsável
              </label>
              <input
                type="text"
                name="nomeResponsavel"
                id="nomeResponsavel"
                required
                value={formData.nomeResponsavel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="nomeAluno" className="block text-sm font-medium text-gray-700">
                Nome completo do aluno(a)
              </label>
              <input
                type="text"
                name="nomeAluno"
                id="nomeAluno"
                required
                value={formData.nomeAluno}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
                Data de nascimento
              </label>
              <input
                type="date"
                name="dataNascimento"
                id="dataNascimento"
                required
                value={formData.dataNascimento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="escola" className="block text-sm font-medium text-gray-700">
                Escola
              </label>
              <select
                name="escola"
                id="escola"
                required
                value={formData.escola}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
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
              <label htmlFor="bateria" className="block text-sm font-medium text-gray-700">
                Bateria
              </label>
              <select
                name="bateria"
                id="bateria"
                required
                value={formData.bateria}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              >
                <option value="" className="text-gray-900">Selecione um horário</option>
                {baterias.map((bateria) => (
                  <option key={bateria.horario} value={bateria.horario} className="text-gray-900">
                    {bateria.horario} (máx. {bateria.vagas} vagas)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tamanhoCamiseta" className="block text-sm font-medium text-gray-700">
                Tamanho da camiseta
              </label>
              <select
                name="tamanhoCamiseta"
                id="tamanhoCamiseta"
                required
                value={formData.tamanhoCamiseta}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
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
              <label htmlFor="nomeCamiseta" className="block text-sm font-medium text-gray-700">
                Nome/Apelido na camiseta
              </label>
              <input
                type="text"
                name="nomeCamiseta"
                id="nomeCamiseta"
                required
                value={formData.nomeCamiseta}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border text-gray-900"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processando...' : 'Realizar Inscrição'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
