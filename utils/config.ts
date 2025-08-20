import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';

// Função para buscar configuração
export async function getConfig(chave: string, valorPadrao: any = null) {
  try {
    await dbConnect();
    const config = await Config.findOne({ chave });
    return config ? config.valor : valorPadrao;
  } catch (error) {
    console.error(`Erro ao buscar configuração ${chave}:`, error);
    return valorPadrao;
  }
}

// Função para salvar configuração
export async function setConfig(chave: string, valor: any, descricao: string = '') {
  try {
    await dbConnect();
    
    const config = await Config.findOneAndUpdate(
      { chave },
      { 
        valor, 
        descricao,
        atualizadoEm: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    
    return config;
  } catch (error) {
    console.error(`Erro ao salvar configuração ${chave}:`, error);
    throw error;
  }
}

// Função para inicializar configurações padrão
export async function inicializarConfiguracoesPadrao() {
  try {
    await dbConnect();
    
    // Verificar se já existe configuração de limite de vagas
    const limiteExiste = await Config.findOne({ chave: 'limite_vagas' });
    
    if (!limiteExiste) {
      await setConfig(
        'limite_vagas', 
        50, 
        'Número máximo de inscrições permitidas no sistema'
      );
    }
  } catch (error) {
    console.error('Erro ao inicializar configurações padrão:', error);
  }
}
