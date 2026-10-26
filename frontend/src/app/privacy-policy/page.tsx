import React from 'react';
import { Lock } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Privacy Policy | Galaxy Heritage World',
  description:
    'How Galaxy Heritage World collects, uses and protects personal information, including service providers, website security and cookies.',
};

const MAIL = 'info@galaxyheritageworld.com';

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHero
        tone="orange"
        icon={Lock}
        eyebrow="Data Protection"
        title={
          <>
            Privacy <span className="text-ink/70">Policy</span>
          </>
        }
      />

      <div className="container-narrow section">
        <div className="card prose-legal p-6 sm:p-12">
          <section>
            <p>
              This Privacy Policy applies to all the services rendered by &ldquo;GHW&rdquo; and all its branches and affiliates (All of them will collectively be referred to as GHW in the policy mentioned below). This policy statement refers to the procedure adopted by GHW in handling all forms of information and fulfills all the requirements of the Privacy Act. For further enquires pertaining to this subject, GHW requests to contact our Privacy at the following e-mail us at <a href={`mailto:${MAIL}`}>{MAIL}</a>
            </p>
          </section>

          <section>
            <h2>Collection Of Personally Identifiable Information</h2>
            <p>
              Complying with the provisions under the Privacy Act, GHW gathers all personalized information for the sole industrial or business purpose. The information collected will not be used in any other means. The procedure adopted in gathering such information is done is a very structured manner which is completely fair and lawful. GHW ensures to meet the expectations of each one of customers. We ensure that all information about our customers will be first authenticated by them and used after their permission. We agree that we gather personal information in many divisions of our business. This policy document mainly highlights the information exchange that takes place between GHW and its customers. This document does not mention the use of the contractor and the employee information. Please note that under the Privacy Act, it generally exempts the coverage of employee records.
            </p>
          </section>

          <section>
            <h2>Services</h2>
            <p>
              GHW uses the services of many other providers to improve the standards and the quality rendered to our customers. We always aim to work on our operation efficiency and reach higher standards compared to the others. Hence, certain third parties that help us generate proper services will gain a certain access to customer information and will use it on GHW&rsquo;s behalf. We try our best to make sure that all the service providers strictly follow all the privacy guidelines and not use this information for any unauthorized purposes.
            </p>
          </section>

          <section>
            <h2>Website Users</h2>
            <p>
              Data security is an issue that we at GHW take up very seriously. We maintain high standards and treat the information disclosed on our website with extreme secure measures. The website offers an SSL encryption, the industry standard security measures adopted while making transactions over the Internet. We use cookies to help us determine which service and support information is appropriate to your computer and to facilitate your use of our instant transactions area. This technology does not mean that additional information about you will be collected by default. The only ability that we have is to figure out the type of computer that you are using, but beyond that with cookies we can&rsquo;t do anything else. We endeavor to always make sure you have a better experience while using our website. Kindly note that will agreeing or accepting the cookies that you are no way giving us any access to your personal information. We assure you that you do not have to be concerned about the cookies option and be rest assured that cookies have been designed for a better user interface with the website. GHW respects the privacy of its customers and ensures privacy of their personal information. For more information regarding these concerns, e-mail us at <a href={`mailto:${MAIL}`}>{MAIL}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
