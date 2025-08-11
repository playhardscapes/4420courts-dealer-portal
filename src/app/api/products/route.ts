import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductCategory, ProductType, ProductStatus } from '@prisma/client';

// GET /api/products - List all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const typeParam = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (categoryParam && categoryParam !== 'ALL') {
      where.category = categoryParam as ProductCategory;
    }
    if (statusParam && statusParam !== 'ALL') {
      where.status = statusParam as ProductStatus;
    }
    if (typeParam && typeParam !== 'ALL') {
      where.type = typeParam as ProductType;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
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
        stockQuantity: body.stockQuantity || 0,
        lowStockAlert: body.lowStockAlert || 10,
        trackInventory: body.trackInventory !== false,
        allowBackorders: body.allowBackorders || false,
        weight: body.weight,
        dimensions: body.dimensions || null,
        images: body.images || null,
        status: body.status || 'ACTIVE',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}