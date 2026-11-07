# Optional Sunday Brief popup — draft, 7 November 2026

The popup is **off by default**. This change does not publish a Sender form, change
Sender settings, set hosting environment variables, merge code or authorise a release.
The popup's current publication status, ID and behaviour settings are **UNVERIFIED**.

## Exact implementation

- `lib/newsletter-popup.ts` validates a separate opt-in and popup form ID, requiring
  the existing embedded newsletter configuration. It rejects the embedded form's ID
  and Sender's special `all` selector. Only that one popup can be requested.
- `app/components/SenderNewsletterPopup.tsx`, mounted conditionally by
  `app/layout.tsx`, follows the current pathname. It requests the popup on Home and
  within `/articles`, `/archive`, `/looking-back` and `/regan-on-football` only.
  Signup, newsletter privacy, About, Calls and unrelated paths are excluded.
  These are section boundaries, not checks that an individual article exists.
- It reuses `mountSenderForm` and the **same** SDK/account queue as embedded signup.
  `universal.js?explicit=true` stays in place. Sender's documented
  `senderForms.render(popupId, ...)` applies the popup's own display conditions;
  this is not a forced-open command. There is no `render('all')`, second script,
  homemade overlay, timer, dismissal cookie or subscriber database.
- On each pathname change, the old popup instance is destroyed and its readiness
  listener removed before the next page's instance is requested. This also removes
  an open popup when leaving an eligible page. Sender remains responsible for
  recognising prior dismissal/subscription and enforcing its cooldown.
- `SenderSignupForm.tsx`, its placement element, fallback link and `/newsletter`
  page are unchanged. Script failure leaves the existing fallback available.
- `vercel.json` disables automatic Git deployments for
  **`draft/sunday-brief-popup` only**, including this branch's first push. Other
  branches retain Vercel's default behaviour. Do not deploy this branch manually.

## Sender settings to review before any activation

These are **proposed settings**, not observations of the account. No Sender account
changes have been made for this PR. Keep any draft unpublished pending approval.

1. **Forms → the intended popup → Publishing settings:** confirm its type is
   **POPUP**, its account matches the existing embedded form, and record its actual
   form ID. Check whether its status is **DRAFT** or **Active**. The congratulatory
   email does not establish either status. Do not reuse embedded form ID `bo2xnY`.
2. **Settings → Groups:** select the existing **Liverpool Brief — Sunday** group.
   Keep email-only collection, the existing consent wording/privacy link and the
   embedded form's confirmation approach. Check the popup's own double opt-in and
   success view; those settings are not inherited merely by sharing an account.
3. **Behaviour → When to show popup?:** propose **After 30 seconds on page** only.
   Turn off scroll, exit-intent and element-click triggers for this initial trial.
   Do not assume multiple triggers require all conditions to be met.
4. **Behaviour → Frequency:** turn **Always show off**; propose a **7-day** cooldown
   for visitors who have not subscribed. Confirm how dismissal and successful
   signup behave in the actual popup. Existing subscribers can only be suppressed
   where Sender recognises them; another device or cleared cookies may look new.
5. **Behaviour → Visibility:** restrict to the agreed editorial URLs on
   `https://theliverpoolbrief.com`; exclude `/newsletter` and `/newsletter/privacy`
   in Sender too. Propose desktop-only initially (**Hide on mobile devices** and
   **Hide on tablet devices**) until the narrow-screen experience is reviewed.
   Review every relevant device toggle. The code's allowed sections are an
   additional ceiling: Sender may narrow them further, never widen them.
6. **Behaviour → Schedule:** check the intended start/end dates or Instant setting.
   Check that other published popups do not overlap. Confirm the close button is
   obvious, keyboard dismissal/focus work and copy offers the free weekly email
   without an obstructive full-screen design. Review actual SDK cookies/processing
   and keep the existing privacy notice accurate for the approved integration.

## Configuration and release, only after explicit approval

Keep the three existing embedded settings unchanged. The two additional values are:

```dotenv
SENDER_NEWSLETTER_POPUP_ENABLED=false
SENDER_NEWSLETTER_POPUP_FORM_ID=
```

The ID is the public popup ID from Sender, not an API key. Blank/invalid values or
anything other than the literal `true` keep the popup off. A valid ID alone does
not enable it. Never add an API token.

After Denny approves the settings **and** a release/testing plan, set the real ID
and `SENDER_NEWSLETTER_POPUP_ENABLED=true` in the agreed hosting environment and
build/deploy through the approved release path. Publish in Sender only if approved
and required. Enabling in Sender alone is insufficient while this site's gate is
off. Environment changes need a new build/deployment; the shared layout persists
across browser navigation and this is not an instant dashboard switch.

To turn it off after an approved launch, unpublish the popup in Sender, or set the
website gate to `false` and rebuild/deploy. Keep embedded signup published.

## Verification

Run `npm test`, `npm run lint` and `npm run build`. The added Node tests use a fake
Sender SDK: they check the default-off gate, malformed/same/all IDs, missing
embedded configuration, allowed/excluded routes, SDK readiness, navigation before
readiness, independent cleanup, script/account deduplication and script failure.
They make no requests to Sender and submit no email addresses.

Those tests establish website integration behaviour, **not** actual Sender popup
visibility, delay/cooldown enforcement, subscriber suppression, keyboard behaviour
or successful signup. These remain **UNVERIFIED** until approved browser testing:

1. Use an agreed test-only URL restriction in Sender and an approved test
   environment. Load an eligible page directly, wait for the configured delay,
   dismiss, then navigate to another editorial page and reload: the popup should
   stay dismissed throughout the cooldown.
2. Navigate editorial page → `/newsletter` → editorial page using site links,
   and repeat with a slow/blocked SDK. No popup should appear on signup or its
   privacy notice. The embedded form and its direct link must still work.
3. With Denny's approved test address, check consent, confirmation and the correct
   group; test a recognised subscribed visitor and a fresh visitor separately.
   Do not submit an address or send a campaign without approval.
4. Check desktop, mobile/tablet exclusions, visible close control, keyboard focus,
   Escape/dismissal, and no repeated prompt after dismissal or successful signup.

## Retrieved sources

Retrieved 7 November 2026. These describe provider behaviour, not current account settings.

- **High confidence — Sender official SDK:**
  https://api.sender.net/javascript-sdk/explicit-form-rendering/
  documents explicit mode, the readiness event, targeted rendering, destruction and
  popup display conditions.
- **High confidence — Sender official form guide:**
  https://www.sender.net/help/lead-capture/form-triggers-and-behavior/
  documents popup triggers, frequency, visibility/devices, schedule and publication.
- **High confidence — Sender official popup setup:**
  https://www.sender.net/help/lead-capture/create-popup-form//
  also describes timer, frequency, schedule and page/device controls.
- **High confidence — Vercel official Git configuration:**
  https://vercel.com/docs/project-configuration/git-configuration
  documents per-branch `git.deploymentEnabled`; unspecified branches default to true.
