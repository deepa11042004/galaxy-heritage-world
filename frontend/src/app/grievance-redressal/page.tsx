import React from 'react';
import { Scale } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Grievance Redressal | Galaxy Heritage World',
  description:
    'Galaxy Heritage World complaints escalation matrix: three levels of grievance redressal with email contacts and response times.',
};

const LEVELS = [
  {
    level: 'First Level',
    email: 'grievance@galaxyheritageworld.com',
    before: 'Write to ',
    after:
      ' from your registered email id and report your grievance. We will respond within 3 working days. Please mention the preferred time & number to reach you.',
  },
  {
    level: 'Second Level',
    email: 'complaint@galaxyheritageworld.com',
    before: 'If the above resolution does not meet your expectations, please email from your registered email ID to Head at ',
    after:
      '. Please be assured that the matter highlighted shall receive prompt attention and you shall hear from us within the next 5 working days. We would like to bring to your notice that at this ID we accept only those emails for resolution that have already been mailed to first level and have not yet received a reply. If that is the case, we sincerely regret the delay in responding. Please note if you have reached this Level 2 directly without reaching out to our Customer Experience Management team, we would transfer your concern first to our Customer Experience Management desk to ensure faster resolution. In any case, please rest assured that we will ensure a quick resolution to your concern.',
  },
  {
    level: 'Third Level',
    email: 'legal@galaxyheritageworld.com',
    before:
      'If you are still not satisfied with the resolution after having gone through the above-mentioned levels of Grievance redressal, please email from your registered email ID to Head – Legal at ',
    after:
      '. Please be assured that the matter highlighted shall receive prompt attention and after investigating your concern, you shall hear from us within a maximum of 7 working days. We would like to bring to your notice that at this ID we accept only those emails for resolution that have already been mailed to first and second level. Please note if you have reached this Level 3 directly, we would transfer your concern first to our Customer Experience Management desk to ensure faster resolution. In any case, please rest assured that we will ensure a quick resolution to your concern.',
  },
];

export default function GrievanceRedressalPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={Scale}
        eyebrow="Escalation Matrix"
        title={
          <>
            Grievance <span className="text-ink/70">Redressal</span>
          </>
        }
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <h2>Galaxy Heritage World Complaints</h2>
            <p>Dear Customers,</p>
            <p>
              The Company is committed to serve you and we hope to never disappoint you. However, if you do have a complaint, please be assured that we will tackle it speedily and efficiently. For any complaint escalation, we request you to follow the below-mentioned sequence.
            </p>
          </section>

          {LEVELS.map((l) => (
            <section key={l.level}>
              <h2>{l.level}</h2>
              <p>
                {l.before}
                <a href={`mailto:${l.email}`}>{l.email}</a>
                {l.after}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
