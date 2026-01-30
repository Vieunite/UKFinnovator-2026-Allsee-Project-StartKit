# UKFinnovator 2026 - Allsee Renewal Automation Starter Kit

Allsee operates a cloud digital signage CMS (MySignagePortal/CDMS). Cloud licences are commonly sold as 1-year or 3-year subscriptions. Missed renewals can cause licence expiry and service disruption, triggering urgent manual intervention. The challenge is to design and prototype an end-to-end renewal and payment automation loop that reduces disruption and manual workload.

This starter kit is a Next.js project with a Device Page template as the main starting UI, and fake data stored in-repo. It includes a simple role switch via local sign-in. You can build on this starter kit or build your own prototype; this repo aims to help teams get started quickly and make demos consistent.

## Quick start

Prereqs:
- Node.js (LTS)
- npm

Install and run:
```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project structure

- `src/app/page.tsx` - Device Page template (main starting UI).
- `src/components/DataTable/` - table and card UI used by the Device Page.
- `src/data.tsx` - in-repo fake data (devices, sample entities). Add renewal/reseller data here or in a small companion file and import it.
- `src/context/OrganisationContext.tsx` - organisational hierarchy (parent organisation and child organisation).
- `src/context/AuthContext.tsx` - hardcoded users for role switching.
- `src/app/login/page.tsx` - sign-in screen showing the test accounts.

## Role switching

Use the local sign-in screen to switch between the parent organisation billing admin and a child organisation user.

Test accounts:
- Parent organisation billing admin: `allsee-tech` / `allsee123`
- Child organisation user: `allsee-bham` / `birmingham123`

To switch roles, sign out via the account menu and sign in with the other account. If you get stuck, clear the `auth_user` entry in your browser storage and reload.

## Key concepts & non-negotiable constraints

**Core challenge goal**
Design and prototype a renewal & payment automation loop that covers: Reminder → Payment (or Update Payment Method) → Automatic Entitlement Renewal → Payment Failure Recovery (dunning) → Grace Period → Suspension/Recovery

**Parent organisation vs child organisation (non-negotiable)**
- The CMS supports organisational hierarchies: a parent organisation can have many child organisations.
- Child organisations can have independent logins.
- Child organisations cannot renew or pay.
- Only the parent organisation can renew/pay for the subscription that covers the organisation tree.
- Child organisations must still see renewal risk (expiry date/status) and have meaningful actions:
  - Request renewal / notify parent organisation (or reseller, if applicable)
  - Contact billing admin (placeholder is fine)
- The prototype must reflect this permission split in UI and logic.

**Reseller billing modes (non-negotiable)**
Some resellers allow their end-users to pay directly using reseller-defined pricing; others require payment to go through the reseller. Model this as a configurable policy in fake data:
- `END_USER_CAN_PAY`: end-user self-pay allowed; pricing comes from reseller price book
- `RESELLER_ONLY`: end-user cannot pay; must request/notify reseller or parent organisation

In the starter kit fake data, include at least two reseller examples:
- Reseller A: `END_USER_CAN_PAY`
- Reseller B: `RESELLER_ONLY`

Suggested shape (place in `src/data.tsx` or your renewal data file):
```ts
export const resellerPolicies = [
  { id: 'reseller-a', name: 'Reseller A', billingMode: 'END_USER_CAN_PAY', priceBook: 'A-2026' },
  { id: 'reseller-b', name: 'Reseller B', billingMode: 'RESELLER_ONLY', priceBook: 'B-2026' },
]
```

To change reseller behaviour, edit the `billingMode` in your fake data.

## What to build / extend

### Your task
- Implement UI and flow that correctly enforces:
  1) parent organisation / child organisation permissions
  2) reseller billing-mode behaviour
- Provide a "Request renewal / Notify ..." action for child organisation users (front-end state or fake data only; no backend needed).
- Provide a way for the parent organisation billing admin to view renewal risk and handle incoming requests (a simple list with a "done" action is fine).
- Implement or simulate failure + recovery states (dunning / grace / restore to active) using front-end state and fake data.

### Suggested implementation steps
- [ ] Add renewal data: licence expiry, status, reseller policy, payment method state.
- [ ] Show renewal risk badges on the Device Page for both roles.
- [ ] Add a child organisation action to request renewal / notify parent organisation (or reseller).
- [ ] Add a parent organisation Renewal Centre view with risk list + request queue.
- [ ] Simulate dunning and grace period transitions with buttons/toggles.
- [ ] Simulate recovery back to Active after renewal.

## Mandatory demo checklist

- [ ] Child organisation login: sees "Due Soon" or "Grace", cannot pay, and can submit a renewal request / notify.
- [ ] Parent organisation login: can view renewal risk and incoming requests, and can handle requests.
- [ ] Failure path: show messaging + next steps + grace period (can be simulated).
- [ ] Recovery path: show status returning to Active after renewal (can be simulated).

## Deliverables & submission

Required deliverables:
- End-to-end user journey: parent organisation journey (renew/pay) and child organisation journey (visibility + request renewal).
- Prototype: a running Next.js prototype or clickable Figma wireframes (both acceptable).
- Renewal logic/state machine: describe states and transitions, including failure recovery (dunning) and grace period handling.
- Implementation plan: realistic MVP plan (what could be delivered in ~4-6 weeks), plus assumptions and dependencies.

Optional bonus:
- A lightweight Renewal Centre page for the parent organisation (risk list + request queue).
- Configurable rules (e.g., reminder cadence, grace period length) as a simple config object.

Submission instructions (brief):
- Provide a repository link (preferred) or a zip of your project (if coding), plus any design files if applicable.
- Include a short README: how to run + how to switch roles + key assumptions + next steps.

## Getting help

Ask questions via GitHub Issues and/or GitHub Discussions in this repository. Open an Issue for bugs or blockers, and use Discussions for general Q&A.

## FAQ

**Why can't a child organisation pay?**  
The subscription covers the entire organisation tree, so only the parent organisation can renew/pay. The child organisation still needs visibility and a request/notify action.

**Where do I change reseller mode?**  
In the fake data (for example `src/data.tsx`), edit the reseller's `billingMode` to `END_USER_CAN_PAY` or `RESELLER_ONLY`.

**Do I need a backend?**  
No. Use front-end state and fake data only.

**Can I use Figma only?**  
Yes. Clickable Figma wireframes are acceptable if they cover the required journeys and states.

**How should I simulate failure, grace, and recovery?**  
Use simple UI controls or state toggles to move between dunning, grace period, suspension, and return to Active.
