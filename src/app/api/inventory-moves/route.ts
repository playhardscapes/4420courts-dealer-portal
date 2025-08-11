import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { InventoryMoveType } from '@prisma/client';

// GET /api/inventory-moves - List all inventory moves with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type') as InventoryMoveType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (productId) {
      where.productId = productId;
    }
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const [moves, total] = await Promise.all([
      prisma.inventoryMove.findMany({
        where,
        include: {
          product: {
            select: {
              name: true,
              sku: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inventoryMove.count({ where })
    ]);

    return NextResponse.json({
      moves,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory moves:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory moves' },
      { status: 500 }
    );
  }
}

// POST /api/inventory-moves - Create a new inventory move
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use a transaction to ensure stock quantity is updated atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create the inventory move
      const move = await tx.inventoryMove.create({
        data: {
          productId: body.productId,
          type: body.type,
          quantity: body.quantity,
          reference: body.reference,
          notes: body.notes,
          performedBy: body.performedBy,
        },
        include: {
          product: true
        }
      });

      // Update product stock quantity if tracking inventory
      const product = await tx.product.findUnique({
        where: { id: body.productId }
      });

      if (product && product.trackInventory) {
        const newStockQuantity = Math.max(0, product.stockQuantity + body.quantity);
        
        await tx.product.update({
          where: { id: body.productId },
          data: {
            stockQuantity: newStockQuantity
          }
        });
      }

      return move;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory move:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory move' },
      { status: 500 }
    );
  }
}