import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';

export const metadata = {
  title: 'Newsletter privacy | The Liverpool Brief',
  description: 'How The Liverpool Brief uses your email address when you subscribe to The Sunday Brief.',
  alternates: { canonical: '/newsletter/privacy' },
};

export default function NewsletterPrivacyPage() {
  return <>
    <SiteHeader />
    <main id="main-content" className="reading-page">
      <h1>Newsletter privacy</h1>
      <div className="article-body">
        <p>The Sunday Brief is the email newsletter from The Liverpool Brief. Denny Regan is responsible for how your personal information is used. You can contact me at <a href="mailto:theliverpoolbrief@gmail.com">theliverpoolbrief@gmail.com</a>.</p>
        <h2>What we collect and why</h2>
        <p>We ask for your email address and your consent to receive the newsletter. Sender, our email service, records your signup and confirmation so we can show that you agreed to receive it. You must click the confirmation link in your email before becoming an active subscriber.</p>
        <p>We use this information to send the newsletter, manage your subscription and honour unsubscribe requests. Your consent is the basis for sending the newsletter. We do not sell your address or add you to other mailing lists.</p>
        <h2>Our email service</h2>
        <p>The signup form sends your information directly to Sender (UAB Sender.lt), which stores and processes it on our behalf. Its service may also process technical information such as IP addresses and email delivery, opening and click information. The website does not keep a separate subscriber database.</p>
        <p>Sender describes how it handles information and protects its service in its <a href="https://www.sender.net/privacy-policy/">privacy policy</a> and <a href="https://www.sender.net/gdpr-compliance/">data-processing information</a>. When the form uses Google reCAPTCHA for spam protection, Google also processes technical information under its <a href="https://policies.google.com/privacy">privacy policy</a>.</p>
        <h2>Unsubscribing and retention</h2>
        <p>You can unsubscribe using the link in any newsletter or email me at the address above. Unsubscribing stops future newsletters. We retain only the information needed to record your choice and avoid emailing you again, unless we need to keep additional records to meet a legal obligation.</p>
        <p>While you are subscribed, we keep your address and consent record. We review newsletter records at least annually and remove information we no longer need. Keeping a minimal record of an unsubscribe request is in our legitimate interest in respecting your preference.</p>
        <h2>Your rights</h2>
        <p>You can ask to access, correct or delete your information, withdraw consent or object to processing based on legitimate interests. Contact me using the email address above. You can also complain to the <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner’s Office</a>.</p>
        <p><Link href="/newsletter">Back to The Sunday Brief →</Link></p>
      </div>
    </main>
  </>;
}
