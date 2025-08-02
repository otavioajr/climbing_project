import { NextRequest, NextResponse } from 'next/server';

// Definir o tipo para a inscrição
interface Inscricao {
  _id: string;
  numeroInscricao: string;
  nomeResponsavel: string;
  telefone: string;
  nomeAluno: string;
  dataNascimento: string;
  escola: string;
  tamanhoCamiseta: string;
  nomeCamiseta: string;
  status: 'pendente' | 'pago';
  criadoEm: string;
}

// Armazenamento temporário em memória (será perdido ao reiniciar)
const inscricoes: Inscricao[] = [];

function gerarNumeroInscricao() {
  return (inscricoes.length + 1).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Gerar número de inscrição
    const numeroInscricao = gerarNumeroInscricao();
    
    // Criar inscrição mock
    const novaInscricao: Inscricao = {
      _id: Date.now().toString(),
      numeroInscricao,
      ...body,
      status: 'pendente',
      criadoEm: new Date().toISOString(),
    };
    
    inscricoes.push(novaInscricao);
    
    return NextResponse.json({
      success: true,
      numeroInscricao,
    });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar inscrição' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const numeroInscricao = searchParams.get('id');
  
  if (numeroInscricao) {
    const inscricao = inscricoes.find(i => i.numeroInscricao === numeroInscricao);
    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json(inscricao);
  }
  
  return NextResponse.json(inscricoes);
} 