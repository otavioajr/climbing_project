import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import { getConfig, inicializarConfiguracoesPadrao } from '@/utils/config';

// Função para gerar número de inscrição sequencial simples
async function gerarNumeroInscricaoSequencial() {
  // Buscar todas as inscrições e encontrar o maior número
  const inscricoes = await Inscricao.find({}, { numeroInscricao: 1 });
  
  let maiorNumero = 0;
  for (const inscricao of inscricoes) {
    const numero = parseInt(inscricao.numeroInscricao);
    if (numero > maiorNumero) {
      maiorNumero = numero;
    }
  }
  
  const proximoNumero = maiorNumero + 1;
  
  // Retorna apenas o número sem zeros à esquerda
  return proximoNumero.toString();
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await inicializarConfiguracoesPadrao();

    const body = await request.json();
    const {
      nomeResponsavel,
      telefone,
      nomeAluno,
      dataNascimento,
      escola,
      tamanhoCamiseta,
      nomeCamiseta,
    } = body;

    // Validar campos obrigatórios
    if (!nomeResponsavel || !telefone || !nomeAluno || !dataNascimento || 
        !escola || !tamanhoCamiseta || !nomeCamiseta) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação: verificar limite de inscrições
    const limiteVagas = await getConfig('limite_vagas', 50);
    const totalInscricoes = await Inscricao.countDocuments();
    if (totalInscricoes >= limiteVagas) {
      return NextResponse.json(
        { error: `Não há mais vagas disponíveis. O limite de ${limiteVagas} inscrições foi atingido.` },
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

    // Gerar número de inscrição sequencial
    let numeroInscricao;
    try {
      numeroInscricao = await gerarNumeroInscricaoSequencial();
    } catch (error) {
      return NextResponse.json(
        { error: 'Não foi possível gerar um número de inscrição' },
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
    const checkVagas = searchParams.get('vagas');

    // Verificar status das vagas
    if (checkVagas === 'true') {
      const totalInscricoes = await Inscricao.countDocuments();
      const vagasDisponiveis = Math.max(0, 50 - totalInscricoes);
      
      return NextResponse.json({
        totalInscricoes,
        vagasDisponiveis,
        limite: 50,
        vagasEsgotadas: vagasDisponiveis === 0
      });
    }

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