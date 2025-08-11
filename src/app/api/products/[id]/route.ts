import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Get a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            order: {
              select: {
                orderNumber: true,
                customer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    companyName: true
                  }
                }
              }
            }
          }
        },
        inventoryMoves: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a specific product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description,
        category: body.category,
        type: body.type,
        retailPrice: body.retailPrice,
        dealerPrice: body.dealerPrice,
        wholesalePrice: body.wholesalePrice,
        cost: body.cost,
        stockQuantity: body.stockQuantity,
        lowStockAlert: body.lowStockAlert,
        trackInventory: body.trackInventory,
        allowBackorders: body.allowBackorders,
        weight: body.weight,
        dimensions: body.dimensions,
        images: body.images,
        status: body.status,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle product not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a specific product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Handle product not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle foreign key constraint (product is referenced in orders)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete product that has been ordered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}