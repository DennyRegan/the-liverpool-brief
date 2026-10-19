# Sunday Brief website signup — Sender

**Status after the October 2026 editorial reset:** signup is hidden until the three Sender values below are configured in Vercel. While unconfigured, Home shows no invitation, the footer omits the link, `/newsletter` and `/newsletter/privacy` return 404 and are left out of the sitemap. Adding valid values and redeploying restores all of them; no code change is needed. Some page copy below and on `/newsletter` predates the reset and still mentions match coverage.

Denny selected Sender on 13 October 2026. This replaces the prepared, unlaunched Brevo connection. Home's compact invitation and the footer lead to `/newsletter`; `/newsletter/privacy` names Sender. The six main navigation links, current article/match/Brief selection, and site identity stay unchanged. The first weekly edition is separate work.

## Architecture

Sender's native embedded form collects the email, required unticked consent and CAPTCHA directly. Its built-in double opt-in sends a confirmation email and keeps the contact non-subscribed until the link is clicked. The website stores no subscriber addresses, calls no private API, and needs no API access token or new dependency.

`lib/newsletter-config.ts` validates three **public** values. The account ID is the value in `sender('PUBLIC_ID')` in the provider's integration snippet; it is not a secret API token. The form ID is the placement's `data-sender-form-id`, and the hosted fallback URL must be `https://stats.sender.net/forms/<same-id>/view`. Incomplete, unsafe, foreign or mismatched configuration keeps signup closed. The old `BREVO_NEWSLETTER_FORM_URL` is not accepted.

`SenderSignupForm` is a small client component using Sender's documented public script with `explicit=true`. It queues the public account ID, waits for `onSenderFormsLoaded`, renders only the selected form, and destroys the form and removes its listeners when leaving the page. Returning to signup reuses the SDK and recreates the form. It never triggers a popup or claims subscription success itself. The provider's own form handles submission and confirmation. A plain hosted-form link always offers a fallback if scripts are unavailable.

The SDK is loaded on signup, not by Home or the root layout. It is not an application-wide tracking integration and no custom tracking events are sent. SDK resources remain cached during browser navigation; form cleanup does not unload an already downloaded vendor script. Actual cookies/technical processing must be checked on the real form. The privacy notice discloses Sender processing and Google reCAPTCHA where enabled.

Sender documents a JavaScript embed rather than Brevo's iframe. A public documentation example's hosted form returned HTTP 403 with `X-Frame-Options: SAMEORIGIN` in a terminal request; that does not establish the real form's policy, but it gives no basis for promising iframe support. This implementation uses the documented native embed instead.

## Account handoff

Account access was confirmed on 16 October 2026: Sender displayed **Denny Regan / The Liverpool Brief**. Registration and email verification were shown as completed in onboarding. Do not create another account. The account-login address is separate from the domain address used to send newsletters.

Use the free plan. Do not select a paid subscription, create an API access token, import unrelated contacts or send campaigns. Complete any email verification/account review honestly using `https://theliverpoolbrief.com` as the existing publication. Sender may require a real correspondence address; enter it in the account only, never the repository.

## Form setup after account access

1. **Forms > Create a new form**. Name **Liverpool Brief — Sunday signup**. Choose **Embedded form**, then a simple Default/Basic layout.
2. Under **Settings > Fields**, keep required **Email**, labelled **Email address**. Remove Name, phone and other personal-detail fields. Under **Groups > Add subscribers to these groups**, create/select **Liverpool Brief — Sunday**. Do not enable interest-group selection for this single newsletter.
3. Under **Settings > Options**, enable **Confirmation checkbox**. Keep it initially unticked. Use: **I want to receive The Sunday Brief by email from The Liverpool Brief. I can unsubscribe at any time.** Add the newsletter privacy link `https://theliverpoolbrief.com/newsletter/privacy` visibly in the form text; retain a record of the wording in the confirmation email too. Set checkbox validation to **Please confirm that you want to receive The Sunday Brief.** Enable **Use Google reCaptcha**.
4. Under Design, use cream `#f8f6f1`, ink `#242522`, red `#ad2330`; no images, oversized masthead or promotional copy. Title **The Sunday Brief**. Description **The best of The Liverpool Brief, in one weekly email. Normally on Sundays.** Button **Sign up free**. Keep fields readable at 16px and the form fluid on narrow screens. Free-plan Sender branding remains.
5. Edit **Success view** to **Check your inbox. Click the confirmation link to join The Sunday Brief.** This is a request received message, not a claim that the address is already active.
6. **Save and continue > Publishing settings > Double opt-in settings**: enable it. Edit the confirmation subject **Confirm your subscription to The Sunday Brief**, From name **The Liverpool Brief**, and a verified receiving address on `theliverpoolbrief.com`. Keep the provider's required confirmation URL token `{$double-optin-link}`. Include the consent wording. Do not send a weekly campaign or add a second welcome automation.
7. Prepare the form settings and record **Your form URL**, its **Form ID**, and the public ID from the JavaScript snippet. Do not copy an API token. The hosted form can be prepared for review; site publication and newsletter sends require Denny's approval. Signup testing needs a recipient he specifies. Do not send anything to unrelated existing contacts.

## Domain sender and authentication

Use a working domain mailbox or forwarding alias for replies and verification, for example `newsletter@theliverpoolbrief.com` if Denny provisions it. Its existence is **UNVERIFIED**; do not assume Sender creates a receiving mailbox.

In **Account settings > Domains > Add domain**, add `theliverpoolbrief.com`, then verify ownership using that working domain address. Sender generates/displays SPF, DKIM and DMARC setup. Retrieve the domain's current DNS first, then use the actual account's values. Merge Sender's include into an existing SPF record rather than adding a second one. Preserve existing mail-routing records and a stronger DMARC policy. Do not downgrade it to a generic provider example. Finish by checking Ownership confirmed and all three Authentication indicators in Sender. Record the exact required DNS changes for review before applying them.

Subscriber-processing terms/DPA must be checked during account setup; Sender says a DPA is available on request. If the account terms do not supply it, Denny needs to obtain it before public signup. Do not contact support on his behalf without his instruction. No separate email-tracking or sales automation is needed for launch; check campaign measurement settings and keep the public notice consistent before sending the first edition.

### Receiving address preparation — 16 October 2026

Denny confirmed that only Gmail existed when receiving-address preparation began. The Vercel account API, explicitly scoped to team **denny-regan**, confirmed that Vercel manages `theliverpoolbrief.com` with `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. The initial five DNS records were read: two system ALIAS website records and three system CAA records, with no MX, SPF, DKIM or DMARC records. The initially unscoped request returned access denied; the correctly scoped request succeeded. The later mail-record additions are recorded below.

The simplest proposed receiving setup is **ImprovMX Free**, forwarding only `newsletter@theliverpoolbrief.com` to Denny's verified intended Gmail inbox. Sender remains the newsletter sending service. ImprovMX's official pricing, checked 16 October, includes one domain, 25 aliases and 500 forwards/day for $0, with no free outbound SMTP. A separate paid mailbox is not needed for receiving verification messages and newsletter replies. Ordinary replies composed in Gmail would still use Gmail unless a separate authenticated sending setup is configured; do not claim a free forwarding account supplies outbound domain email.

The real free registration page `https://app.improvmx.com/signup` was opened. It asks for Email and a new Password, and states that continuing accepts its terms and privacy policy. Denny had to enter the new credential and complete that registration personally. At the initial handoff, no details had been submitted, no account created, and no forwarding destination transmitted by the agent. Use the Gmail inbox Denny actually verifies during setup; do not silently substitute an earlier address or alter the site's published contact address.

**Registration follow-up, 16 October:** Denny subsequently completed registration personally and reported verifying the email on his phone. The shared browser displayed **Confirmation Email Sent** for the existing Liverpool Brief Gmail account. Visiting the app origin led to its sign-in page, rather than a signed-in dashboard. One secure email/password sign-in attempt returned the website error **Invalid email/password credentials provided.** No credential values were accessed. Account access and the verification outcome have not been independently confirmed; manual sign-in handoff was offered for the existing account. No second account, domain, alias, mail route or DNS record was created.

After registration, add domain `theliverpoolbrief.com`, create alias **newsletter**, and verify its intended destination inside ImprovMX. Avoid a catch-all alias for this single newsletter. The provider's official DNS guide gives the following proposed records; re-read the zone and account instructions immediately before applying them:

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | @ | `mx1.improvmx.com` | 10 |
| MX | @ | `mx2.improvmx.com` | 20 |
| TXT | @ | `v=spf1 include:spf.improvmx.com ~all` | — |

This table was reviewed before the application recorded below. Add only the required mail records after account/alias readiness; preserve Vercel's website ALIAS and CAA records. When Sender generates its actual authentication instructions, combine its SPF authorization into the same SPF record rather than adding another. Never guess Sender's account-specific verification or DKIM values. Confirm the intended destination, then use Sender's domain verification email to check actual receipt and ownership. No newsletter or test campaign send is authorised by this preparation.

**Receiving mail DNS completed, 16 October:** Denny supplied a phone screenshot of the signed-in ImprovMX account showing `theliverpoolbrief.com` and a saved `*` catch-all forwarding rule. That rule covers `newsletter@theliverpoolbrief.com`; the explicit newsletter-only alias is not yet confirmed. The destination is truncated in the screenshot, so its complete address and actual inbox delivery remain unverified. The ImprovMX status was **Setup** at the time of the screenshot.

The Vercel connector did not expose an individual-record creation action. Rather than replace the zone, the existing Vercel account was securely signed into in the shared browser. Its **Add DNS Preset > ImprovMX** dialog showed exactly the two MX records and SPF value in the table above, with TTL **3600** for all three. The preset was applied. A fresh account API read confirmed exactly eight records: the three additions and the original five. All five originals retained their IDs, record types, values, TTL 60 and system ownership.

| Added record | Vercel record ID |
| --- | --- |
| MX `mx1.improvmx.com.`, priority 10 | `rec_f5b893089102b16e897fa0db` |
| MX `mx2.improvmx.com.`, priority 20 | `rec_9c205a129b4a81e36c5e9257` |
| TXT `v=spf1 include:spf.improvmx.com ~all` | `rec_7a1e55aac69b67bae579631a` |

Google Public DNS's HTTPS resolver then returned status 0 with both exact MX answers and the SPF answer. These mail records are publicly visible, not merely saved in the dashboard. An earlier lookup through the web-reader tool failed to open the JSON endpoint; the successful independent HTTPS query was made from the local runtime. No delivery test or newsletter was sent. The website's original DNS records were preserved; there was no nameserver change, purchase, site deployment, API-key creation or alteration of registrant/billing details.

Remaining: refresh ImprovMX to confirm it recognises the records, confirm the full forwarding destination, then complete Sender's domain verification and account-specific DKIM/SPF/DMARC setup. Use the necessary domain verification email as a receipt check; a newsletter/test campaign still requires approval. ImprovMX's SPF entry alone does not authenticate Sender. If newsletter replies will use this forwarding route, ensure the privacy notice also describes ImprovMX's limited role in forwarding replies before launch. Sender remains on its existing **Unauthorized** login error in the shared browser; its account review outcome and authentication setup are still unverified.

**High confidence — retrieved official references, checked 16 October:**

- https://vercel.com/kb/guide/set-up-email-with-your-vercel-domain — Vercel provides DNS, not mailboxes; forwarding is supported through a separate provider.
- https://improvmx.com/pricing/ — free limits and paid outbound SMTP distinction.
- https://improvmx.com/guides/vercel/ and https://improvmx.com/guides/generic-dns-configuration/ — Vercel integration and actual MX/SPF values.
- https://improvmx.com/guides/mx-spf-records/ — where to check account DNS instructions.

## Website configuration and release

The blank `.env.example` names the three public settings: `SENDER_PUBLIC_ACCOUNT_ID`, `SENDER_NEWSLETTER_FORM_ID`, `SENDER_NEWSLETTER_FORM_URL`. For local development place the actual values in ignored `.env.local`. Next.js loads it automatically; standalone scripts need explicit environment loading.

In the existing Vercel project's **Settings > Environment Variables**, add those public values to the environments being reviewed/released. No API key is required. Configure them before building/redeploying: static pages' footer links are captured at build time, while Home and `/newsletter` evaluate them at request time. Changing/removing values requires a new deployment to refresh all static footers.

Without valid complete configuration, the homepage invitation remains visible with **Signup opens soon** and an **About the newsletter** link. The footer also links to the newsletter page; `/newsletter` honestly says signup is not open and collects nothing. Valid configuration changes the homepage action to **Sign up free** and enables the prepared native form. Never activate the paused draft or claim subscription success while provider approval and confirmation are unavailable.

On 16 October Denny explicitly requested that the newsletter be made visible on the homepage, authorising this website release. Sender then allowed account access again but showed **Information required** and an account pause. Its additional-information review was completed accurately (no imported list, existing self-test contact only, future explicit consent and double opt-in, weekly editorial links, 0–2,500 messages/month). Submission returned the account to **Account is under review**. Public collection remains blocked, so the approved homepage visibility release uses the honest closed state. The three public activation settings remain unset in Vercel. No newsletter send is authorised by this release.

## Verification

Run `npm test`, `npm run lint`, `npm run build`, then `node scripts/verify-newsletter.mjs` and `node scripts/verify-homepage.mjs`. SDK lifecycle tests use a fake browser and never load Sender or submit data. The HTTP verifier checks the closed and example-configured placement/fallback/privacy pages using local production servers, never fetching the example form or sending an address. These tests cannot establish actual provider rendering, subscriber storage or delivery.

Before approved launch, inspect the real native form at 320/390/768/1280px. Check overflow, keyboard focus, input labels, unticked mandatory consent, CAPTCHA, privacy link, fallback and success/error views. Navigate away and back to signup to check that the form returns and never appears on another page. Native form styling is configured in Sender; the site wrapper does not rewrite its HTML.

After approved testing with an address Denny specifies: submit it, confirm non-subscribed status before clicking, inspect inbox/spam and From/reply identity, click the verification link and confirm Active status in the correct group with a consent record. Repeating signup must not create duplicates. Test invalid input and missing consent without unwanted contacts. Use the later approved soft-test campaign to verify unsubscribe and exclusion from subsequent sends. The soft-test group will contain only Denny and his dad after both exact addresses and consent are confirmed.

## Current status — 16 October 2026

**High confidence — observed in the signed-in Sender account:**

- Created **Liverpool Brief — Sunday**, group ID `e5EmPx`. It contained no subscribers. The pre-existing test group was left untouched.
- Created and saved the embedded draft **Liverpool Brief — Sunday signup**, form ID `bo2xnY`.
- Reopened the saved editor and verified the title **The Sunday Brief**, the Sunday introduction, email-only collection, unticked consent text and the **Sign up free** button. The privacy link points to `https://theliverpoolbrief.com/newsletter/privacy`; that route will be published with the site changes.
- Enabled Google reCAPTCHA and the confirmation checkbox. Cream background and red button were configured. The real public form, narrow-screen layout and CAPTCHA behaviour still need testing; the editor preview is not an end-to-end signup test.
- Publishing settings displayed the public identifiers below. No API access token was created.

| Public setting | Account value |
| --- | --- |
| `SENDER_PUBLIC_ACCOUNT_ID` | `7d131c7ef01408` |
| `SENDER_NEWSLETTER_FORM_ID` | `bo2xnY` |
| `SENDER_NEWSLETTER_FORM_URL` | `https://stats.sender.net/forms/bo2xnY/view` |

These are public embed identifiers, not secrets. They are also staged in ignored `.env.sender-draft`, which Next.js does not load automatically. They have **not** been activated in `.env.local` or Vercel. Keep signup closed until the form's confirmation flow is enabled and checked.

**Observed blockers:** Sender states **Account is under review**, with its own estimate of an update within one hour. The double opt-in control is disabled with **Double opt-in is only available on verified accounts.** This is account approval, separate from the completed login email verification. No approval outcome is assumed.

Sender's Domains screen initially showed **Connect your first domain**. Adding `theliverpoolbrief.com` requires a receiving address at that domain, to which Sender will send a verification request. No Sender verification email has been sent, and no account-specific Sender authentication records have been generated or applied. Receiving mail DNS for ImprovMX has now been configured as recorded above; actual inbox receipt and Sender domain ownership still need verification.

The session then returned to login with **Error occurred: Unauthorized. Please log in or contact support.** Automated sign-in was not retried. The last confirmed saved draft did not yet have the custom success message or double opt-in email. Later email-label/validation edits were visible in the editor, but their persistence after this session error is **UNVERIFIED**; recheck them rather than assuming they were saved.

After Sender approves the account and access resumes: finish the success view and mobile styling; enable double opt-in; set its subject/body and verified domain sender; retrieve the actual DNS instructions; then test the real form and consent lifecycle with a specified, approved test address. Denny authorised publishing the closed website invitation on 16 October; newsletter sends still require his approval. Do not use the draft form URL as a live signup destination yet.

The website release is prepared on `feature/newsletter-signup`, rebased onto current main on 16 October. All 247 tests, lint, build/TypeScript and both local HTTP verifiers passed again on 16 October. The release keeps Sender configuration inactive and shows the closed invitation. No subscriber was submitted and no email was sent. Delivery, sender authentication and unsubscribe remain **UNVERIFIED**. The first weekly edition is deferred separate work; the missing September template is not claimed as recovered.

## Retrieved references

Checked 13 October 2026. These describe provider capabilities, not completed configuration of Denny's account.

- **High confidence — Sender official:** https://www.sender.net/help/lead-capture/creating-signup-forms/ — current form setup and publishing.
- **High confidence — Sender official:** https://www.sender.net/help/lead-capture/connecting-forms-to-lists/ — group selection, non-subscribed/active lifecycle and deduplication.
- **High confidence — Sender official:** https://www.sender.net/help/lead-capture/gdpr-consent-checkboxes/ — required unticked checkbox and consent recording.
- **High confidence — Sender official:** https://www.sender.net/help/lead-capture/double-opt-in-for-forms/ — confirmation template, required token and activation.
- **High confidence — Sender official:** https://api.sender.net/javascript-sdk/explicit-form-rendering/ — SDK queue, explicit mode, readiness event, render and cleanup.
- **High confidence — Sender official:** https://www.sender.net/help/deliverability-compliance/spf-dkim-dmarc-setup/ — authentication and preserving a single SPF record.
- **High confidence — Sender official:** https://www.sender.net/privacy-policy/ and https://www.sender.net/gdpr-compliance/ — processing, consent logs, technical data and DPA availability.
- **High confidence — Sender official:** https://www.sender.net/pricing/free-plan/ — 2,500 subscribers, 15,000 emails/month, no daily cap and required branding.
- **High confidence — ICO:** https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/ and https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/respect-peoples-preferences/ — email consent and withdrawal.
