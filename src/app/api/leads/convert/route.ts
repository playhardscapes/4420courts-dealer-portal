import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, customerId } = body;

    if (!userId || !customerId) {
      return NextResponse.json(
        { error: 'User ID and Customer ID are required' },
        { status: 400 }
      );
    }

    // Update user status from LEAD to ACTIVE
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE'
      }
    });

    // Update customer metadata to mark as converted
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        metadata: {
          convertedFromLead: true,
          conversionDate: new Date().toISOString(),
          leadData: (await prisma.customer.findUnique({ where: { id: customerId } }))?.metadata?.leadData || {},
          originalLeadStatus: 'CONVERTED'
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
      message: 'Lead successfully converted to active customer',
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Error converting lead to customer:', error);
    return NextResponse.json(
      { error: 'Failed to convert lead to customer' },
      { status: 500 }
    );
  }
}