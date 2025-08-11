import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/assets/[id] - Get a specific asset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

// PUT /api/assets/[id] - Update a specific asset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        serialNumber: body.serialNumber,
        model: body.model,
        manufacturer: body.manufacturer,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : undefined,
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        condition: body.condition,
        status: body.status,
        location: body.location,
        assignedTo: body.assignedTo,
        warrantyExpiry: body.warrantyExpiry ? new Date(body.warrantyExpiry) : null,
        maintenanceSchedule: body.maintenanceSchedule,
        lastMaintenanceDate: body.lastMaintenanceDate ? new Date(body.lastMaintenanceDate) : null,
        insurancePolicyNumber: body.insurancePolicyNumber,
        images: body.images,
        notes: body.notes,
        metadata: body.metadata,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle asset not found
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }

      // Handle unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Serial number already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

// DELETE /api/assets/[id] - Delete a specific asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.asset.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle asset not found
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}