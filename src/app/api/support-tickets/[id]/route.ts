import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: (await params).id },
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Support ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    const ticket = await prisma.supportTicket.update({
      where: { id: (await params).id },
      data: {
        ...body,
        resolvedAt: body.status === 'RESOLVED' ? new Date() : undefined,
        updatedAt: new Date()
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.supportTicket.delete({
      where: { id: (await params).id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete support ticket' },
      { status: 500 }
    );
  }
}