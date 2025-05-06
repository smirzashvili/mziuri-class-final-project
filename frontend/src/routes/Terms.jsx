import React, { useEffect } from 'react'
import { useLoader }  from '../context/LoaderContext'

function Terms() {

  const { useFakeLoader } = useLoader()
  
  useEffect(() => useFakeLoader(), [])

  return (
    <div className='terms'>
      <h1 className='title'>Terms And Conditions</h1>
      <div className='content'>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using MelodyMatch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
        <h3>2. Eligibility</h3>
        <p>You must be at least 18 years old to use MelodyMatch. By using our service, you represent and warrant that you are at least 18 years of age and have the right, authority, and capacity to enter into these Terms.</p>        
        <h3>3. Account Registration</h3>
        <p>To use certain features of MelodyMatch, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
        <h3>4. User Content</h3>
        <p>You retain all rights to the content you post on MelodyMatch. By posting content, you grant MelodyMatch a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative works based on, distribute, publicly display, publicly perform, and otherwise exploit that content in connection with the service.</p>
        <h3>5. Prohibited Activities</h3>
        <p>You agree not to engage in any of the following prohibited activities:</p>
        <ul>
          <li>Using the service for any illegal purpose or in violation of any laws</li>
          <li>Posting unauthorized commercial communications</li>
          <li>Collecting users' content or information without their consent</li>
          <li>Uploading viruses or other malicious code</li>
          <li>Soliciting login information or accessing an account belonging to someone else</li>
          <li>Bullying, intimidating, or harassing any user</li>
          <li>Posting content that is hate speech, threatening, or pornographic</li>
        </ul>
        <h3>6. Termination</h3>
        <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        <h3>7. Limitation of Liability</h3>
        <p>In no event shall MelodyMatch, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        <h3>8. Changes to Terms</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
        <h3>9. Contact Us</h3>
        <p>If you have any questions about these Terms, please contact us at legal@melodymatch.com.</p>
      </div>
    </div>
  )
}

export default Terms