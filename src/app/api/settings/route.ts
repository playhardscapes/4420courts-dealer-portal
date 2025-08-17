import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a hardcoded dealer ID
    // In production, this would come from authentication
    const dealerId = 'test-dealer-id';

    const dealer = await prisma.dealer.findUnique({
      where: { id: dealerId },
      include: {
        user: true,
        territories: true
      }
    });

    if (!dealer) {
      return NextResponse.json(
        { success: false, error: 'Dealer not found' },
        { status: 404 }
      );
    }

    // Transform database data to settings format
    const settings = {
      profile: {
        companyName: dealer.companyName,
        dealerCode: dealer.dealerCode,
        firstName: dealer.user.firstName || '',
        lastName: dealer.user.lastName || '',
        email: dealer.user.email,
        phone: dealer.user.phone || ''
      },
      business: {
        businessAddress: dealer.businessAddress as any,
        licenseNumber: dealer.licenseNumber || '',
        commissionRate: Number(dealer.commissionRate)
      },
      territory: {
        states: dealer.territories.map(t => t.name),
        regions: dealer.territories.flatMap(t => 
          Array.isArray(t.boundaries) ? t.boundaries : []
        ),
        exclusiveZip: []
      },
      notifications: {
        orderAlerts: true,
        commissionUpdates: true,
        customerMessages: true,
        systemUpdates: false
      },
      preferences: {
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'English'
      }
    };

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching dealer settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // For now, we'll use a hardcoded dealer ID
    // In production, this would come from authentication
    const dealerId = 'test-dealer-id';

    // Update dealer and user information
    const updatedDealer = await prisma.$transaction(async (tx) => {
      // Update dealer record
      const dealer = await tx.dealer.update({
        where: { id: dealerId },
        data: {
          companyName: body.profile?.companyName,
          businessAddress: body.business?.businessAddress,
          licenseNumber: body.business?.licenseNumber,
          commissionRate: body.business?.commissionRate,
          // Update user information
          user: {
            update: {
              firstName: body.profile?.firstName,
              lastName: body.profile?.lastName,
              email: body.profile?.email,
              phone: body.profile?.phone
            }
          }
        },
        include: {
          user: true,
          territories: true
        }
      });

      return dealer;
    });

    // Transform back to settings format
    const settings = {
      profile: {
        companyName: updatedDealer.companyName,
        dealerCode: updatedDealer.dealerCode,
        firstName: updatedDealer.user.firstName || '',
        lastName: updatedDealer.user.lastName || '',
        email: updatedDealer.user.email,
        phone: updatedDealer.user.phone || ''
      },
      business: {
        businessAddress: updatedDealer.businessAddress as any,
        licenseNumber: updatedDealer.licenseNumber || '',
        commissionRate: Number(updatedDealer.commissionRate)
      },
      territory: {
        states: updatedDealer.territories.map(t => t.name),
        regions: updatedDealer.territories.flatMap(t => 
          Array.isArray(t.boundaries) ? t.boundaries : []
        ),
        exclusiveZip: []
      },
      notifications: body.notifications || {
        orderAlerts: true,
        commissionUpdates: true,
        customerMessages: true,
        systemUpdates: false
      },
      preferences: body.preferences || {
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'English'
      }
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating dealer settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}