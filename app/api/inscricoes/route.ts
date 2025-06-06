import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';

// Função para gerar número de inscrição sequencial baseado na bateria escolhida
async function gerarNumeroInscricaoSequencial(bateria: string) {
  // Definir faixas de números para cada bateria
  let faixaInicial = 1; // Valor padrão
  let faixaFinal = 17;  // Valor padrão
  
  if (bateria === '8h às 9h' || bateria === '8h às 9h15') { // Bateria 1
    faixaInicial = 1;
    faixaFinal = 17;
  } else if (bateria === '9h30 às 10h30' || bateria === '9h30 às 10h45') { // Bateria 2
    faixaInicial = 18;
    faixaFinal = 35;
  } else if (bateria === '11h às 12h' || bateria === '11h às 12h15') { // Bateria 3
    faixaInicial = 36;
    faixaFinal = 50;
  } else {
    // Caso bateria não identificada, usar valores padrão (1-17)
    console.warn(`Bateria não reconhecida: ${bateria}, usando faixa padrão`);
  }

  // Buscar inscrições existentes na mesma bateria
  const inscricoesNaBateria = await Inscricao.find({ bateria }).sort({ numeroInscricao: 1 });
  
  // Encontrar o primeiro número disponível na faixa
  let numeroDisponivel = faixaInicial;
  
  // Verificar números já utilizados na bateria
  const numerosUtilizados = inscricoesNaBateria.map(i => parseInt(i.numeroInscricao));
  
  // Encontrar o primeiro número não utilizado na faixa
  for (let i = faixaInicial; i <= faixaFinal; i++) {
    if (!numerosUtilizados.includes(i)) {
      numeroDisponivel = i;
      break;
    }
  }
  
  // Se não encontrou número disponível (improvável, já que verificamos vagas antes)
  if (numeroDisponivel > faixaFinal) {
    throw new Error(`Não há mais números disponíveis para a bateria ${bateria}`);
  }
  
  // Retorna com padding de zeros à esquerda
  return numeroDisponivel.toString().padStart(4, '0');
}

// Função para verificar vagas disponíveis na bateria
async function verificarVagasBateria(bateria: string) {
  // Compatibilidade com horários antigos
  let horarioAntigo = '';
  let horarioNovo = '';
  
  if (bateria === '8h às 9h') {
    horarioAntigo = '8h às 9h15';
    horarioNovo = bateria;
  } else if (bateria === '9h30 às 10h30') {
    horarioAntigo = '9h30 às 10h45';
    horarioNovo = bateria;
  } else if (bateria === '11h às 12h') {
    horarioAntigo = '11h às 12h15';
    horarioNovo = bateria;
  } else if (bateria === '8h às 9h15' || bateria === '9h30 às 10h45' || bateria === '11h às 12h15') {
    // Se for um horário antigo, considerar ambos
    horarioAntigo = bateria;
    horarioNovo = bateria.replace('9h15', '9h').replace('10h45', '10h30').replace('12h15', '12h');
  }
  
  // Contar considerando ambos os formatos de horário (novo e antigo)
  const count = await Inscricao.countDocuments({ 
    $or: [
      { bateria: horarioNovo },
      { bateria: horarioAntigo }
    ].filter(item => item.bateria) // Remover itens vazios
  });
  
  // O limite de vagas é 16 para a bateria 3 e 17 para as demais
  const limiteVagas = (bateria === '11h às 12h' || bateria === '11h às 12h15') ? 16 : 17;
  return count < limiteVagas;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      nomeResponsavel,
      telefone,
      nomeAluno,
      dataNascimento,
      escola,
      bateria,
      tamanhoCamiseta,
      nomeCamiseta,
    } = body;

    // Validar campos obrigatórios
    if (!nomeResponsavel || !telefone || !nomeAluno || !dataNascimento || 
        !escola || !bateria || !tamanhoCamiseta || !nomeCamiseta) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se há vagas disponíveis na bateria
    const temVagas = await verificarVagasBateria(bateria);
    if (!temVagas) {
      return NextResponse.json(
        { error: 'Não há mais vagas disponíveis nesta bateria' },
        { status: 400 }
      );
    }

    // Validação: não permitir o mesmo aluno na mesma escola
    const alunoJaInscrito = await Inscricao.findOne({ nomeAluno, escola });
    if (alunoJaInscrito) {
      return NextResponse.json(
        { error: 'Este aluno já está inscrito nesta escola.' },
        { status: 400 }
      );
    }

    // Gerar número de inscrição dentro da faixa da bateria
    let numeroInscricao;
    try {
      numeroInscricao = await gerarNumeroInscricaoSequencial(bateria);
    } catch (error) {
      return NextResponse.json(
        { error: 'Não foi possível gerar um número para esta bateria' },
        { status: 400 }
      );
    }

    // Criar nova inscrição
    const novaInscricao = new Inscricao({
      numeroInscricao,
      nomeResponsavel,
      telefone,
      nomeAluno,
      dataNascimento: new Date(dataNascimento + 'T00:00:00'),
      escola,
      bateria,
      tamanhoCamiseta,
      nomeCamiseta,
    });

    await novaInscricao.save();

    return NextResponse.json({
      success: true,
      numeroInscricao,
    });
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar inscrição' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const numeroInscricao = searchParams.get('id');

    if (numeroInscricao) {
      const inscricao = await Inscricao.findOne({ numeroInscricao });
      if (!inscricao) {
        return NextResponse.json(
          { error: 'Inscrição não encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(inscricao);
    }

    // Retornar todas as inscrições (para admin)
    const inscricoes = await Inscricao.find({}).sort({ criadoEm: -1 });
    return NextResponse.json(inscricoes);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar inscrições' },
      { status: 500 }
    );
  }
} 