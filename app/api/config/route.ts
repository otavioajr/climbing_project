import { NextRequest, NextResponse } from 'next/server';
import { getConfig, setConfig } from '@/utils/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chave = searchParams.get('chave');

    if (chave) {
      const valor = await getConfig(chave);
      return NextResponse.json({ [chave]: { valor } });
    }

    // Retornar todas as configurações principais
    const limiteVagas = await getConfig('limite_vagas', 50);
    
    return NextResponse.json({
      limite_vagas: { valor: limiteVagas }
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { chave, valor, descricao } = body;

    if (!chave || valor === undefined) {
      return NextResponse.json(
        { error: 'Chave e valor são obrigatórios' },
        { status: 400 }
      );
    }

    // Validações específicas
    if (chave === 'limite_vagas') {
      if (typeof valor !== 'number' || valor < 1) {
        return NextResponse.json(
          { error: 'Limite de vagas deve ser um número maior que 0' },
          { status: 400 }
        );
      }
    }

    const config = await setConfig(chave, valor, descricao);
    
    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar configuração' },
      { status: 500 }
    );
  }
}
