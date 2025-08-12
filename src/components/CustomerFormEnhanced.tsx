'use client';

import { useState } from 'react';
import { CustomerEnhanced } from '../data/customers-new';

interface CustomerFormProps {
  customer?: CustomerEnhanced;
  onSave: (customer: CustomerEnhanced) => void;
  onCancel: () => void;
}

export default function CustomerFormEnhanced({ customer, onSave, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerEnhanced>>(
    customer || {
      organizationType: 'INDIVIDUAL',
      primaryContact: {},
      billingAddress: { street: '', city: '', state: '', zipCode: '' },
      customerGroup: 'LEVEL_3_RESURFACING',
      customerStatus: 'LEAD'
    }
  );

  const [separateBilling, setSeparateBilling] = useState(!!customer?.billingContact);
  const [separateProject, setSeparateProject] = useState(!!customer?.projectAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as CustomerEnhanced);
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {customer ? 'Edit Customer' : 'New Customer'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
          <select 
            value={formData.organizationType || 'INDIVIDUAL'}
            onChange={(e) => setFormData({...formData, organizationType: e.target.value as any})}
            className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="MUNICIPALITY">Municipality</option>
            <option value="HOA">HOA</option>
            <option value="SCHOOL">School</option>
            <option value="CHURCH">Church</option>
            <option value="BUSINESS">Business</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Company Name (if not individual) */}
        {formData.organizationType !== 'INDIVIDUAL' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
            <input 
              type="text"
              value={formData.companyName || ''}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="e.g., Botetourt County Parks & Recreation"
            />
          </div>
        )}

        {/* Primary Contact */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-900 mb-4">Primary Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text"
                value={formData.primaryContact?.firstName || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  primaryContact: {...formData.primaryContact, firstName: e.target.value}
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text"
                value={formData.primaryContact?.lastName || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  primaryContact: {...formData.primaryContact, lastName: e.target.value}
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text"
                value={formData.primaryContact?.title || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  primaryContact: {...formData.primaryContact, title: e.target.value}
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                placeholder="e.g., Parks & Recreation Director"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                value={formData.primaryContact?.email || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  primaryContact: {...formData.primaryContact, email: e.target.value}
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="tel"
                value={formData.primaryContact?.phone || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  primaryContact: {...formData.primaryContact, phone: e.target.value}
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Separate Billing Contact Toggle */}
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="separateBilling"
            checked={separateBilling}
            onChange={(e) => setSeparateBilling(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="separateBilling" className="text-sm font-medium text-gray-700">
            Different person handles billing/invoices
          </label>
        </div>

        {/* Billing Contact (if separate) */}
        {separateBilling && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Billing Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text"
                  value={formData.billingContact?.firstName || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingContact: {...formData.billingContact, firstName: e.target.value}
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text"
                  value={formData.billingContact?.lastName || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingContact: {...formData.billingContact, lastName: e.target.value}
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text"
                  value={formData.billingContact?.title || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingContact: {...formData.billingContact, title: e.target.value}
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  placeholder="e.g., Accounts Payable Clerk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  value={formData.billingContact?.email || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingContact: {...formData.billingContact, email: e.target.value}
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-900 mb-4">Billing Address (where to send invoices)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                type="text"
                value={formData.billingAddress?.street || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  billingAddress: {
                    street: e.target.value,
                    city: formData.billingAddress?.city || '',
                    state: formData.billingAddress?.state || '',
                    zipCode: formData.billingAddress?.zipCode || '',
                    country: formData.billingAddress?.country || 'US'
                  }
                })}
                className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text"
                  value={formData.billingAddress?.city || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingAddress: {
                      street: formData.billingAddress?.street || '',
                      city: e.target.value,
                      state: formData.billingAddress?.state || '',
                      zipCode: formData.billingAddress?.zipCode || '',
                      country: formData.billingAddress?.country || 'US'
                    }
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input 
                  type="text"
                  value={formData.billingAddress?.state || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingAddress: {
                      street: formData.billingAddress?.street || '',
                      city: formData.billingAddress?.city || '',
                      state: e.target.value,
                      zipCode: formData.billingAddress?.zipCode || '',
                      country: formData.billingAddress?.country || 'US'
                    }
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input 
                  type="text"
                  value={formData.billingAddress?.zipCode || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    billingAddress: {
                      street: formData.billingAddress?.street || '',
                      city: formData.billingAddress?.city || '',
                      state: formData.billingAddress?.state || '',
                      zipCode: e.target.value,
                      country: formData.billingAddress?.country || 'US'
                    }
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Separate Project Location Toggle */}
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="separateProject"
            checked={separateProject}
            onChange={(e) => setSeparateProject(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="separateProject" className="text-sm font-medium text-gray-700">
            Court/project is at a different location
          </label>
        </div>

        {/* Project Address (if separate) */}
        {separateProject && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Project Location (where the court work will be done)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  type="text"
                  value={formData.projectAddress?.street || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectAddress: {
                      street: e.target.value,
                      city: formData.projectAddress?.city || '',
                      state: formData.projectAddress?.state || '',
                      zipCode: formData.projectAddress?.zipCode || '',
                      country: formData.projectAddress?.country || 'US'
                    }
                  })}
                  className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  placeholder="e.g., 150 Scruggs Road - Tennis Complex"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text"
                    value={formData.projectAddress?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectAddress: {
                        street: formData.projectAddress?.street || '',
                        city: e.target.value,
                        state: formData.projectAddress?.state || '',
                        zipCode: formData.projectAddress?.zipCode || '',
                        country: formData.projectAddress?.country || 'US'
                      }
                    })}
                    className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    type="text"
                    value={formData.projectAddress?.state || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectAddress: {
                        street: formData.projectAddress?.street || '',
                        city: formData.projectAddress?.city || '',
                        state: e.target.value,
                        zipCode: formData.projectAddress?.zipCode || '',
                        country: formData.projectAddress?.country || 'US'
                      }
                    })}
                    className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input 
                    type="text"
                    value={formData.projectAddress?.zipCode || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      projectAddress: {
                        street: formData.projectAddress?.street || '',
                        city: formData.projectAddress?.city || '',
                        state: formData.projectAddress?.state || '',
                        zipCode: e.target.value,
                        country: formData.projectAddress?.country || 'US'
                      }
                    })}
                    className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea 
            value={formData.notes || ''}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="e.g., Contact Mike Wilson for site access. Invoice must reference Purchase Order."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {customer ? 'Update Customer' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}