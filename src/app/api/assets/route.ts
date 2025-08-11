import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AssetCategory, AssetCondition, AssetStatus } from '@prisma/client';

// GET /api/assets - List all assets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (categoryParam && categoryParam !== 'ALL') {
      where.category = categoryParam as AssetCategory;
    }
    if (statusParam && statusParam !== 'ALL') {
      where.status = statusParam as AssetStatus;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.asset.count({ where })
    ]);

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// POST /api/assets - Create a new asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const asset = await prisma.asset.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        serialNumber: body.serialNumber,
        model: body.model,
        manufacturer: body.manufacturer,
        purchaseDate: new Date(body.purchaseDate),
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        condition: body.condition,
        status: body.status || 'ACTIVE',
        location: body.location,
        assignedTo: body.assignedTo,
        warrantyExpiry: body.warrantyExpiry ? new Date(body.warrantyExpiry) : null,
        maintenanceSchedule: body.maintenanceSchedule,
        lastMaintenanceDate: body.lastMaintenanceDate ? new Date(body.lastMaintenanceDate) : null,
        insurancePolicyNumber: body.insurancePolicyNumber,
        images: body.images || null,
        notes: body.notes,
        metadata: body.metadata || null,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Serial number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}