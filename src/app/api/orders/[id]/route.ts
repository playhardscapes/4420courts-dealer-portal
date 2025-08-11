import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        dealer: true,
        items: {
          include: {
            product: true
          }
        },
        invoices: true,
        payments: true,
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update a specific order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status,
        subtotal: body.subtotal,
        taxAmount: body.taxAmount,
        shippingAmount: body.shippingAmount,
        discountAmount: body.discountAmount,
        totalAmount: body.totalAmount,
        billingAddress: body.billingAddress,
        shippingAddress: body.shippingAddress,
        shippingMethod: body.shippingMethod,
        trackingNumber: body.trackingNumber,
        shippedAt: body.shippedAt ? new Date(body.shippedAt) : null,
        deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : null,
        paymentStatus: body.paymentStatus,
        paidAt: body.paidAt ? new Date(body.paidAt) : null,
        notes: body.notes,
        metadata: body.metadata,
      },
      include: {
        customer: true,
        dealer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    
    // Handle order not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete a specific order (soft delete by setting status to CANCELLED)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Instead of hard delete, we'll cancel the order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED'
      }
    });

    return NextResponse.json({ 
      message: 'Order cancelled successfully',
      order 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    
    // Handle order not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}