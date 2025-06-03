import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';

// Função para gerar número de inscrição único
function gerarNumeroInscricao() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Função para verificar vagas disponíveis na bateria
async function verificarVagasBateria(bateria: string) {
  const count = await Inscricao.countDocuments({ bateria });
  const limiteVagas = bateria === '11h às 12h15' ? 16 : 17;
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

    // Gerar número de inscrição único
    let numeroInscricao;
    let inscricaoExiste = true;
    
    while (inscricaoExiste) {
      numeroInscricao = gerarNumeroInscricao();
      inscricaoExiste = !!(await Inscricao.findOne({ numeroInscricao }));
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