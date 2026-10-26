'use client';

import React, { useState } from 'react';
import { AlertCircle, Car, CheckCircle2, FileText, MapPin, Plane, Search, Truck, Calendar } from 'lucide-react';
import { submitEnquiry } from '@/lib/api';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'date' | 'number' | 'select';
  icon?: 'pin' | 'date';
  options?: string[];
  required?: boolean;
  min?: number;
};

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  heading: string;
  button: string;
  fields: Field[];
  /** which fields map to the enquiry's destination / dates / headcount */
  destination: string;
  dates: [string, string?];
  travelers?: string;
}

const TABS: Tab[] = [
  {
    id: 'flights',
    label: 'Flights',
    icon: Plane,
    heading: 'Search Domestic & International Flights',
    button: 'Search Flights',
    destination: 'to',
    dates: ['depart', 'return'],
    travelers: 'passengers',
    fields: [
      { name: 'from', label: 'From', placeholder: 'Departure City/Airport', icon: 'pin', required: true },
      { name: 'to', label: 'To', placeholder: 'Destination City/Airport', icon: 'pin', required: true },
      { name: 'depart', label: 'Depart', type: 'date', icon: 'date', required: true },
      { name: 'return', label: 'Return', type: 'date', icon: 'date' },
      { name: 'passengers', label: 'Passengers', type: 'number', min: 1, placeholder: '1' },
      { name: 'cabin', label: 'Cabin', type: 'select', options: ['Economy', 'Premium Economy', 'Business', 'First'] },
    ],
  },
  {
    id: 'cars',
    label: 'Car Rental',
    icon: Car,
    heading: 'Rent a Car',
    button: 'Search Cars',
    destination: 'pickup',
    dates: ['pickupDate', 'dropDate'],
    fields: [
      { name: 'pickup', label: 'Pickup Location', placeholder: 'City / Airport', icon: 'pin', required: true },
      { name: 'drop', label: 'Drop Location', placeholder: 'Same as pickup', icon: 'pin' },
      { name: 'pickupDate', label: 'Pickup Date', type: 'date', icon: 'date', required: true },
      { name: 'dropDate', label: 'Drop Date', type: 'date', icon: 'date', required: true },
      { name: 'carType', label: 'Car Type', type: 'select', options: ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Tempo Traveller'] },
      { name: 'driver', label: 'Driver', type: 'select', options: ['With driver', 'Self-drive'] },
    ],
  },
  {
    id: 'transport',
    label: 'Transportation',
    icon: Truck,
    heading: 'Book Transfers & Ground Transportation',
    button: 'Search Transfers',
    destination: 'dropLocation',
    dates: ['date'],
    travelers: 'passengers',
    fields: [
      { name: 'pickupLocation', label: 'Pickup', placeholder: 'Airport, hotel or address', icon: 'pin', required: true },
      { name: 'dropLocation', label: 'Drop', placeholder: 'Airport, hotel or address', icon: 'pin', required: true },
      { name: 'date', label: 'Date', type: 'date', icon: 'date', required: true },
      { name: 'time', label: 'Pickup Time', placeholder: 'e.g. 10:30 AM' },
      { name: 'passengers', label: 'Passengers', type: 'number', min: 1, placeholder: '2' },
      { name: 'vehicle', label: 'Vehicle', type: 'select', options: ['Sedan', 'SUV', 'Tempo Traveller', 'Coach / Bus'] },
    ],
  },
  {
    id: 'visa',
    label: 'Visa Assistance',
    icon: FileText,
    heading: 'Visa Assistance',
    button: 'Request Visa Help',
    destination: 'country',
    dates: ['travelDate'],
    travelers: 'applicants',
    fields: [
      { name: 'country', label: 'Destination Country', placeholder: 'Where are you travelling?', icon: 'pin', required: true },
      { name: 'nationality', label: 'Nationality', placeholder: 'e.g. Indian', required: true },
      { name: 'travelDate', label: 'Planned Travel Date', type: 'date', icon: 'date' },
      { name: 'visaType', label: 'Visa Type', type: 'select', options: ['Tourist', 'Business', 'Transit', 'Student', 'Other'] },
      { name: 'applicants', label: 'Applicants', type: 'number', min: 1, placeholder: '1' },
    ],
  },
];

const EMPTY_CONTACT = { name: '', phone: '', email: '', city: '' };

export function TravelDeskSearch() {
  const [tabId, setTabId] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === tabId)!;
  const [values, setValues] = useState<Record<string, string>>({});
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const switchTab = (id: string) => {
    setTabId(id);
    setValues({});
    setError(null);
    setReference(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const [start, end] = tab.dates;
    if (start && end && values[start] && values[end] && values[end] < values[start]) {
      setError('The return / check-out date cannot be before the start date.');
      return;
    }

    const lines = tab.fields.filter((f) => values[f.name]).map((f) => `${f.label}: ${values[f.name]}`);
    const dateText = [values[start], end ? values[end] : undefined].filter(Boolean).join(' to ');

    try {
      setSubmitting(true);
      const res = await submitEnquiry({
        ...contact,
        destinationInterest: values[tab.destination] || null,
        travelDates: dateText || null,
        travelersCount: tab.travelers && values[tab.travelers] ? Number(values[tab.travelers]) : null,
        packageInterest: `Travel Desk - ${tab.label}`,
        message: `${tab.heading}\n${lines.join('\n')}`,
        sourcePage: '/travel-desk',
        consent: true,
      });
      setReference(res.referenceNumber || 'GHW-ENQ-SUCCESS');
      setValues({});
      setContact(EMPTY_CONTACT);
    } catch (err: any) {
      setError(err.message || 'Unable to send your request. Please call 1800-843-6114.');
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = ({ kind }: { kind?: 'pin' | 'date' }) =>
    kind === 'pin' ? (
      <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-accent-strong" />
    ) : kind === 'date' ? (
      <Calendar className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-accent-strong" />
    ) : null;

  return (
    <div className="card overflow-hidden p-0">
      <div role="tablist" aria-label="Travel services" className="flex overflow-x-auto border-b border-line px-2 sm:px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={t.id === tabId}
            onClick={() => switchTab(t.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors sm:px-5',
              t.id === tabId ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            <t.icon className={cn('size-4', t.id === tabId && 'text-accent-strong')} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-8">
        {reference ? (
          <div className="space-y-3 py-8 text-center">
            <div className="success-badge">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-ink">Request sent to the Travel Desk</h3>
            <p className="text-sm text-ink-muted">
              Reference code: <strong className="font-mono text-ink">{reference}</strong>
            </p>
            <p className="text-xs text-ink-subtle">A desk officer will contact you shortly with the best options.</p>
            <button type="button" onClick={() => setReference(null)} className={cn(buttonVariants({ variant: 'dark', size: 'sm' }), 'mt-3')}>
              Make another search
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6" role="tabpanel">
            <h3 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{tab.heading}</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tab.fields.map((f) => {
                const id = `td-${tab.id}-${f.name}`;
                return (
                  <div key={f.name}>
                    <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">
                      {f.label}
                      {f.required && <span className="text-rose-600"> *</span>}
                    </label>
                    <div className="relative">
                      <Icon kind={f.icon} />
                      {f.type === 'select' ? (
                        <select
                          id={id}
                          value={values[f.name] ?? ''}
                          onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                          className="input"
                        >
                          <option value="">Any</option>
                          {f.options!.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={id}
                          type={f.type ?? 'text'}
                          min={f.type === 'number' ? f.min : undefined}
                          required={f.required}
                          placeholder={f.placeholder}
                          value={values[f.name] ?? ''}
                          onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                          className={cn('input', f.icon && 'pl-11')}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-line pt-6">
              <p className="mb-3 text-xs font-semibold text-ink">Where should we send the options?</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <input aria-label="Full name" required placeholder="Full name *" className="input" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                <input aria-label="Phone" required type="tel" placeholder="Phone *" className="input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                <input aria-label="Email" required type="email" placeholder="Email *" className="input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                <input aria-label="Your city" required placeholder="Your city *" className="input" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
              </div>
            </div>

            {error && (
              <div className="alert-error" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-xs text-ink-subtle">
                By submitting you agree to be contacted by our Travel Desk about this request.
              </p>
              <button type="submit" disabled={submitting} className={buttonVariants({ size: 'lg' })}>
                <Search />
                <span>{submitting ? 'Sending…' : tab.button}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
