import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inscricao from '@/models/Inscricao';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const inscricao = await Inscricao.findByIdAndDelete(params.id);

    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inscrição deletada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar inscrição:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar inscrição' },
      { status: 500 }
    );
  }
} 