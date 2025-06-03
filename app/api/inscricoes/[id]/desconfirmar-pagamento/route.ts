import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const inscricao = await Inscricao.findByIdAndUpdate(
      params.id,
      { status: 'pendente' },
      { new: true }
    );

    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inscricao,
    });
  } catch (error) {
    console.error('Erro ao desconfirmar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao desconfirmar pagamento' },
      { status: 500 }
    );
  }
} 