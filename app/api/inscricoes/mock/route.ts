import { NextRequest, NextResponse } from 'next/server';

// Armazenamento temporário em memória (será perdido ao reiniciar)
let inscricoes: any[] = [];

function gerarNumeroInscricao() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Gerar número de inscrição
    const numeroInscricao = gerarNumeroInscricao();
    
    // Criar inscrição mock
    const novaInscricao = {
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
  } catch (error) {
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