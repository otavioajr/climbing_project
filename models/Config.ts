import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
  chave: {
    type: String,
    required: true,
    unique: true,
  },
  valor: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  descricao: {
    type: String,
    default: '',
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  atualizadoEm: {
    type: Date,
    default: Date.now,
  },
});

// Garantir que o modelo seja recriado sem cache
if (mongoose.models.Config) {
  delete mongoose.models.Config;
}

export default mongoose.model('Config', ConfigSchema);
