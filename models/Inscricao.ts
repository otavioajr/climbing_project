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
    enum: [
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
    ],
  },
  bateria: {
    type: String,
    required: true,
    enum: [
      '8h às 9h15',
      '9h30 às 10h45',
      '11h às 12h15',
    ],
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

export default mongoose.models.Inscricao || mongoose.model('Inscricao', InscricaoSchema); 