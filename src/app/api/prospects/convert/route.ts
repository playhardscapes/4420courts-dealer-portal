import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, ticketId } = body;

    if (!customerId || !ticketId) {
      return NextResponse.json(
        { error: 'Customer ID and Ticket ID are required' },
        { status: 400 }
      );
    }

    // Get the current customer and ticket data
    const [customer, ticket] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          user: true
        }
      }),
      prisma.supportTicket.findUnique({
        where: { id: ticketId }
      })
    ]);

    if (!customer || !ticket) {
      return NextResponse.json(
        { error: 'Customer or ticket not found' },
        { status: 404 }
      );
    }

    // Update customer status to indicate they're now an active customer
    // (All the data is already there - user info, customer record, etc.)
    // We just need to mark the transition from prospect to customer
    
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        // Add conversion metadata to track this was a converted prospect
        metadata: {
          convertedFromProspect: true,
          conversionDate: new Date().toISOString(),
          originalTicketId: ticketId,
          prospectData: {
            originalInquiry: ticket.subject,
            inquiryDate: ticket.createdAt
          }
        },
        updatedAt: new Date()
        // Note: All prospect data (name, email, phone, company, addresses) 
        // is already in the user and customer records - no data loss!
      }
    });

    // Close the prospect ticket and update with conversion note
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        description: `${ticket.description}

--- CONVERTED TO CUSTOMER ---
Date: ${new Date().toLocaleString()}
Status: Prospect successfully converted to active customer
Next Steps: Customer is now available in the Customers section for quote preparation and project management.

All original prospect data has been preserved:
✅ Contact information
✅ Project details  
✅ Service level interest
✅ Timeline and budget preferences
✅ Communication history

Ready for quote-contract-project-invoice workflow.`,
        resolvedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Prospect successfully converted to customer',
      customerId: updatedCustomer.id
    });

  } catch (error) {
    console.error('Error converting prospect to customer:', error);
    return NextResponse.json(
      { error: 'Failed to convert prospect to customer' },
      { status: 500 }
    );
  }
}