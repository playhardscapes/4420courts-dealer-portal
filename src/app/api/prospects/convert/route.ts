import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get the current customer data
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        user: true
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Convert from LEAD status to ACTIVE status
    await prisma.user.update({
      where: { id: customer.userId },
      data: {
        status: 'ACTIVE'
      }
    });

    // Update customer metadata to track conversion
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        metadata: {
          convertedFromProspect: true,
          conversionDate: new Date().toISOString(),
          originalStatus: 'LEAD'
        },
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Prospect successfully converted to active customer',
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Error converting prospect to customer:', error);
    return NextResponse.json(
      { error: 'Failed to convert prospect to customer' },
      { status: 500 }
    );
  }
}