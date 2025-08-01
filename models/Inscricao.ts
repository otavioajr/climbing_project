import mongoose from 'mongoose';

const InscricaoSchema = new mongoose.Schema({
  numeroInscricao: {
    type: String,
    required: true,
    unique: true,
  },
  nomeResponsavel: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  nomeAluno: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true,
  },
  escola: {
    type: String,
    required: true,
  },
  tamanhoCamiseta: {
    type: String,
    required: true,
  },
  nomeCamiseta: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'pago'],
    default: 'pendente',
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

// Garantir que o modelo seja recriado sem cache
if (mongoose.models.Inscricao) {
  delete mongoose.models.Inscricao;
}

export default mongoose.model('Inscricao', InscricaoSchema); 