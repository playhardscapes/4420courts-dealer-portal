import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

// GET /api/orders - List all orders with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const paymentStatusParam = searchParams.get('paymentStatus');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (statusParam && statusParam !== 'ALL') {
      where.status = statusParam as OrderStatus;
    }
    if (paymentStatusParam && paymentStatusParam !== 'ALL') {
      where.paymentStatus = paymentStatusParam as PaymentStatus;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              companyName: true,
              email: true
            }
          },
          dealer: {
            select: {
              companyName: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        customerId: body.customerId,
        dealerId: body.dealerId,
        status: body.status || 'PENDING',
        subtotal: body.subtotal,
        taxAmount: body.taxAmount || 0,
        shippingAmount: body.shippingAmount || 0,
        discountAmount: body.discountAmount || 0,
        totalAmount: body.totalAmount,
        billingAddress: body.billingAddress,
        shippingAddress: body.shippingAddress,
        shippingMethod: body.shippingMethod,
        paymentStatus: body.paymentStatus || 'PENDING',
        notes: body.notes,
        metadata: body.metadata || null,
        items: {
          create: body.items?.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            metadata: item.metadata || null
          })) || []
        }
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Order number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}