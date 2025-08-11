import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CustomerGroup } from '@prisma/client';

// GET /api/customers - List all customers with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group') as CustomerGroup | null;
    const status = searchParams.get('status'); // LEAD, ACTIVE, etc.
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (group && group !== 'ALL') {
      where.customerGroup = group;
    }
    
    // Filter by user status (LEAD vs ACTIVE customers)
    if (status) {
      where.user = {
        status: status
      };
    } else {
      // Default: only show ACTIVE customers (not leads)
      where.user = {
        status: 'ACTIVE'
      };
    }
    
    if (search) {
      // Combine search with existing user filter
      const userFilter = where.user || {};
      where.OR = [
        { user: { ...userFilter, firstName: { contains: search, mode: 'insensitive' } } },
        { user: { ...userFilter, lastName: { contains: search, mode: 'insensitive' } } },
        { user: { ...userFilter, email: { contains: search, mode: 'insensitive' } } },
        { user: { ...userFilter, phone: { contains: search, mode: 'insensitive' } } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
      // Remove the direct user filter since it's now in OR conditions
      delete where.user;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // First create or find the user
    let user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          role: 'CUSTOMER',
          status: 'ACTIVE',
          password: body.password || '' // Will need proper auth later
        }
      });
    }

    // Then create the customer record
    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        companyName: body.companyName,
        customerGroup: body.customerGroup || 'RETAIL',
        billingAddress: body.billingAddress || null,
        shippingAddress: body.shippingAddress || null,
        taxId: body.taxId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}