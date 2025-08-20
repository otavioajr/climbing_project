import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';
import { getConfig } from '@/utils/config';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Buscar limite dinâmico das configurações
    const limiteVagas = await getConfig('limite_vagas', 50);
    
    // Contar total de inscrições
    const totalInscricoes = await Inscricao.countDocuments();
    
    // Calcular vagas disponíveis
    const vagasDisponiveis = Math.max(0, limiteVagas - totalInscricoes);
    
    return NextResponse.json({
      totalInscricoes,
      vagasDisponiveis,
      limiteVagas,
      lotado: vagasDisponiveis === 0
    });
  } catch (error) {
    console.error('Erro ao buscar informações de vagas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar informações de vagas' },
      { status: 500 }
    );
  }
}
