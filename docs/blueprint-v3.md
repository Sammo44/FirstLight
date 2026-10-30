# After Me, For You — Redesign Blueprint (v3)

*Builds on Product Spec v2, the Structure Breakdown v1, and the emergent.sh screenshots. Drafted 29 Oct 2026.*

> **Jurisdiction assumption:** your example ("Tower Life, attached to my BT Super") points to Australia/NZ, so legal and financial prompts default to **Australia**, with NZ / UK / US variants marked. All thresholds and rules must be checked by a lawyer before launch and shown as "general information, not advice".

---

## 1. What's working, and what to change

**Keep**
- The tone: no shame, no red warnings, permission to stop. Nobody else in this space does it this well.
- "Words for the People I Love", with the "dig deeper" prompts and the photo and voice note options. Your Jade letter shows it works.
- The status system (*Untouched / In motion / Come back when ready / Enough for now*).
- One codebase that produces the web app, the PDFs and the book.

**Change**
| Problem today | Redesign |
|---|---|
| 13 sections side by side. The user has to know where things go. | **A short "Life Scan" first.** About 25 quick taps, and the wizard builds a plan that includes only what applies to them. |
| Information is typed more than once (a contact in *First 72 Hours*, again in *Key People*). Your red note asked for this to change. | **Enter it once, use it everywhere.** People, accounts, documents and bills are each saved one time and linked into every section that needs them. |
| Prompts are fixed text. | **Follow-up questions that react to what was typed.** "Tower Life via BT Super" leads to questions about the policy number, nominated beneficiary and binding nomination (see §5). |
| The AI chat ("What I Hope You Carry Forward") is generic therapy-speak. | Give the AI one job per screen: **draw out specifics** (names, moments, places), never reflect feelings back. |
| The plan only *records* things. | Add **"Strengthen your plan"**, a gentle check that finds gaps (no will, lapsed super nomination, everything in one name) and explains the options. |
| No answer to *how the plan reaches the family*. | Add **Release & Access** (§7). Without it the plan can't do its job. |
| The output is a document. | Add an **Executor Pack**: a task list built from their data (e.g. "Cancel Netflix — ~$25/mo — Visa ending 4412"). |

---

## 2. New structure: 6 chapters plus 1 ongoing space

The 13 sections become six wizard chapters. Everyone takes the same path, with different items inside.

| # | Chapter (user-facing) | Contains (old sections) |
|---|---|---|
| — | **Before Anything Else** | Onboarding, tone and faith preference, *Life Scan*, why I'm doing this |
| 1 | **The First Few Days** | First 72 hours, who to call, dependants, pets, home, medical devices, body donation |
| 2 | **My People** | Key people & roles, executor, guardians, professionals, who to tell, who *not* to involve |
| 3 | **Where Everything Is** | Documents, physical locations, keys, devices, digital accounts, access paths |
| 4 | **Money In, Money Out** | Banks, cards, super, insurance, assets, debts, *all recurring bills and subscriptions*, income |
| 5 | **My Wishes** | Medical wishes, funeral, body, ceremony, belongings & heirlooms, permissions |
| 6 | **Strengthen My Plan** | Legal and financial health check, probate-proofing, reminders, release settings |
| ♥ | **Words & Legacy** *(always available, never "finished")* | Letters to people, questions you'll have, carry-forward, stories, future-dated messages |

"Words & Legacy" stays on its own because it is emotional work that people come back to over months. The other chapters are admin that people want done.

---

## 3. The Life Scan (the core of the wizard)

Tap-only, about 3 minutes, every answer can be skipped. Each answer turns modules on or off.

**Household**
- Partner? (married / de facto / separated / none) → *if separated but not divorced: flag will and super nomination risk*
- Children? Any under 18? Any adult dependants (disability, care)? → *guardian nomination, testamentary trust prompt*
- Blended family (children from previous relationships)? → *conflict-risk prompts, family provision claim info*
- Pets? → *pet care module*
- Anyone else relies on you (elderly parent, sibling)?
- Do you live alone? → *"who will notice" and welfare-check prompts*

**Home & things**
- Own / rent / live with family? Mortgage? Investment property?
- Vehicles, boat, caravan, motorbike?
- Storage unit, PO box, safety deposit box?
- Firearms? → *licensing / lawful transfer module*
- Valuables, collections, heirlooms with a story?

**Money**
- Who handles the household admin? (*me / partner / shared*) → **if "me": switch on the Household Runbook (§4.6)**
- Superannuation / KiwiSaver / pension / 401k?
- Life insurance (inside super, through work, standalone, on a credit card)?
- Shares, managed funds, crypto, overseas accounts or property?
- Business owner, partner, director, sole trader?
- Money owed *to* you? Loans to family?
- Guarantor on anyone's loan?
- Government payments (pension, Centrelink, DVA)?

**Legal**
- Have a will? When was it last updated? Since marriage, divorce or a new child? → *triggers health check*
- Enduring Power of Attorney? Medical decision-maker / advance care directive?
- Family trust or company?

**Digital**
- Password manager? Crypto wallets? Websites/domains? Online income (YouTube, Etsy, royalties)?
- Which phone (iPhone/Android)? → *Legacy Contact instructions specific to the device*

**Faith & culture** — tradition, timing needs (e.g. burial within 24 hours), advisor contact.

The result is shown as a calm summary instead of a percentage: *"Your plan has 9 areas that apply to you. Here's a good place to start."*

---

## 4. Chapter detail: what to ask (including what most people won't think of)

Items marked ★ are the ones most people miss and that cause the most trouble afterwards.

### 4.1 The First Few Days
- Who to call first, in order, with *how* (in person, phone, text). Who must hear in person before seeing it on social media.
- ★ **Medical devices**: pacemaker or defibrillator must be removed before cremation.
- ★ **Whole-body donation** must be pre-registered and is time-critical. Organ donor register status.
- Dependants: who collects the kids today, school contacts, routines, allergies, comfort items.
- Pets: who takes them tonight, food, vet, medication, microchip transfer, funds for their care.
- Home: lock up, alarm code holder, spare keys, ★ fridge/freezer, bins, plants, mail.
- ★ **Do NOT cancel the mobile number yet.** It receives the 2FA codes the family needs to get into accounts.
- ★ **Keep the main email account open.** It is the password-reset route for everything else.
- Prepared wording: a death notice, a social media post, a text to friends. Who posts it.
- What can wait (stated plainly): banks, probate, belongings, subscriptions.

### 4.2 My People (single list of contacts, each with roles)
Each person is entered once and given roles: *executor, backup executor, guardian, medical decision-maker, EPOA, funeral lead, spokesperson, pet carer, digital executor, letter recipient, notify personally, notify by group, do not involve.*
- Professionals: lawyer, accountant, financial adviser, funeral director, GP, bank manager, insurance broker, employer HR.
- ★ **The "who wouldn't know" list**: old friends, overseas contacts, online friends, clubs. Families often miss these people.
- ★ **Who should NOT be involved** or contacted (private, never printed in the shared summary).
- Who has final say if people disagree.

### 4.3 Where Everything Is
- Documents: will (date, location, lawyer holds original?), EPOA, advance care directive, super nominations, trust deeds, property titles, insurance policies, birth, marriage and divorce certificates, passport, citizenship, tax records, vehicle papers, prenup/BFA.
- Physical map: safe (who has the combination; the code itself is not stored), filing cabinet, lawyer, bank deposit box, storage unit, ★ spare keys.
- Devices: phone, laptop, tablet, how to unlock (**who knows**, not the code itself), where the authenticator app is.
- Digital: email, social, cloud photos, password manager (★ set up its *Emergency Access* feature), Apple **Legacy Contact**, Google **Inactive Account Manager**, Facebook **legacy contact** / memorialise vs delete.
- ★ Crypto: exchange accounts, hardware wallet location, *where* the seed phrase is kept (never the phrase itself). Without this, crypto is lost for good.
- Domains, websites, online stores, YouTube/royalty income.

### 4.4 Money In, Money Out
**Accounts** (institution + type + **last 4 digits only** + sole/joint + which bills come out of it).
- ★ **The bridging-money check:** *"If your accounts were frozen tomorrow, could your partner pay the mortgage and bills for 3 months?"* Sole-name accounts are usually frozen until probate or bank release.
- Credit cards: ★ some include accidental death or travel cover. ★ Closing a card stops every bill paid from it.
- Super / KiwiSaver / pension: fund, member no., **nomination type (binding / non-binding / lapsing / non-lapsing / reversionary), date signed, expiry.**
- Insurance: life, TPD, income protection, funeral, mortgage protection, ★ group cover through work, ★ cover inside super, accident cover on credit cards, home and contents (★ cover may lapse if the home is vacant for 60–90 days; tell the insurer).
- Assets: property, vehicles, shares, managed funds, collectibles.
- Debts: mortgage, car finance, personal loans, BNPL (Afterpay etc.), tax owing, ★ guarantor obligations, ★ HECS/HELP (AU: cancelled on death).
- ★ Money owed to you, and loans to family: should they be forgiven or repaid? Write it down to avoid family disputes.
- ★ Loyalty points and frequent flyer: some can be transferred on death, most are lost. Gift cards and vouchers.
- Income streams: salary (★ final pay, leave owed, employer death benefits, ★ employee share schemes), rent, royalties, pensions, government payments (★ notify to avoid overpayment debts).

**Recurring Costs Register** (your Ongoing Costs section, rebuilt)
Add items with one tap from a list (to fill in quickly) and set an outcome for each:

| Category | Pre-filled options |
|---|---|
| Home | rent/mortgage, council rates, strata/body corp, water, power, gas, internet, home insurance, security monitoring, cleaner, gardener, pool service, pest control |
| Phone & TV | mobile plans (★ keep active), Netflix, Disney+, Stan, Binge, Kayo, Foxtel, Spotify, Apple One, YouTube Premium, Audible |
| Software & cloud | iCloud, Google One, Dropbox, Microsoft 365, Adobe, antivirus, VPN, ★ domain renewals, web hosting |
| Health & fitness | gym, health insurance, ★ medication auto-refills, physio |
| Memberships | clubs, professional bodies, Costco, roadside assist, union, alumni |
| Giving | ★ charity direct debits (these keep coming out unless someone stops them), child sponsorship, Patreon |
| Vehicles | rego, insurance, finance, tolls account, parking permits |
| Kids & pets | school fees, activities, pet insurance, pet food subscription |
| Deliveries | meal kits, wine club, magazines, Amazon Prime |
| ★ Annual renewals | those due once a year that nobody remembers |

For each item: provider · cost · frequency · **paid from which account/card** · **outcome: Cancel / Keep / Transfer to ___ / Decide later** · notes.
The total is shown as *"About $X a month will keep leaving your accounts"*. This is useful information, not a warning.

### 4.5 My Wishes
- **Medical**: place of care, resuscitation, ventilation, feeding, pain vs alertness priority, dementia wishes, who decides, non-negotiables. Link to their state's advance care directive form.
- **Funeral**: burial / cremation / natural burial / aquamation / body donation · pre-paid plan or ★ funeral bond · budget · celebrant / faith leader · venue · music · readings · speakers · photo to use · dress code · flowers vs charity · livestream · wake · ★ draft obituary · headstone wording · ★ who owns the burial plot · where the ashes go.
- ★ **Belongings & heirlooms register**: photo + story + who gets it. This is the biggest cause of family arguments, and the stories are often lost. ("Grandad's watch: bought in Lae, 1962…")
- ★ **Permissions** (very important emotionally): *"You have my permission to sell the house / remarry / not keep my things / take time off / move away."*

### 4.6 ★ The Household Runbook (new, for the person who "does all the admin")
In many couples one person runs the household admin and the other doesn't know how. This module captures it:
- Which bills arrive when, and how they're paid. Where the tax stuff goes.
- How to: reset the modem, bleed the radiator, the water main, fuse box, gas shut-off, the pool chemicals, the solar inverter.
- Car service schedule, who the mechanic/plumber/electrician is.
- Where the Christmas decorations, the warranty folder, the spare light bulbs are.
- Annual calendar: rego due, insurance renewals, smoke alarm batteries, gutter cleaning.

### 4.7 Work & Business
- Employer: HR contact, final pay, leave, group insurance, super contributions, share scheme vesting on death.
- Business: structure, partners, ★ buy-sell agreement, ★ key-person insurance, who can sign / access the bank, clients to notify, ABN/GST cancellation, where SOPs live, in-flight work.

### 4.8 Words & Legacy (your strongest section, extended)
- Letters per person (existing), plus:
- ★ **Future-dated messages**: delivered on an 18th birthday, wedding day, first child, or each year on a chosen date.
- Video and voice messages (to hear their voice is often what people value most).
- Recipes, family history, stories behind photos, "how I met your mother".
- Apologies and forgiveness, both given and asked for.
- "The questions I know you'll have": AI follow-ups draw out specifics.

---

## 5. Smart follow-ups (your red note on the First 72 Hours screenshot)

When the user types free text, the AI pulls out what it mentions and asks **one gentle follow-up at a time**, then offers to save each item where it belongs.

> **User:** *"File life insurance claims. This is through Tower Life, but attached to my BT Super."*
>
> **AMFY:** *Thank you, this one matters. Insurance held inside super is paid to the super fund first, and the fund then decides who receives it unless there's a valid **binding nomination**.*
> - *Do you know if you have a binding death benefit nomination with BT? (Yes / No / Not sure)*
> - *Roughly when was it signed? (Some lapse after 3 years.)*
> - *Who did you nominate?*
>
> **✓ Saved:** Insurance: Tower Life via BT Super · Contact added: BT Super · 🔔 Added to "Strengthen My Plan": *check nomination is binding & current*

Rules for the AI layer:
1. Draw out **facts and specifics** in practical sections and **memories and names** in Words. Never mirror feelings back.
2. One question at a time, and every question can be skipped.
3. Suggest saving, never save without asking. Every entry it creates appears where the user can edit it.
4. Never ask for passwords, PINs, full card numbers or seed phrases. If one is pasted, block it and explain why.
5. Use the tone setting (Soft / Neutral / Direct) and the faith setting.

---

## 6. "Strengthen My Plan" — health check and probate-proofing

A rules engine (deterministic, *not* the AI) checks the plan and shows **suggestions**, each with a plain explanation, an "ask a professional about" note, and the option to dismiss. Wording is always *"Something to consider"*, never *"Warning"*.

### 6.1 Health-check triggers (examples)
| If… | Suggest… |
|---|---|
| No will | Why it matters (intestacy rules decide); options: lawyer, Public Trustee (often low-cost or free in AU/NZ), online will services |
| Will predates marriage | ★ In AU/NZ, **marriage generally revokes a will** unless it was made in contemplation of that marriage |
| Will predates divorce/separation | Divorce may revoke gifts to the ex; *separation alone usually doesn't* |
| Will predates children / grandchildren | Review beneficiaries and guardians |
| Kids under 18 and no guardian named | Nominate guardian in the will |
| Super with no / non-binding / lapsed nomination | ★ **Super is not covered by your will**; the trustee decides. Consider a binding nomination; check expiry |
| Everything in one person's name | Bridging-money risk; consider joint accounts or a separate emergency fund the partner can access |
| No EPOA / medical decision-maker | These cover *loss of capacity while alive*, which a will doesn't |
| Blended family | Higher dispute risk; consider clear will, mutual wills, BFAs, letters explaining reasoning |
| Business owner, no buy-sell | Succession and key-person insurance |
| Crypto, no access plan | Lost forever without one |
| Overseas assets | May need separate probate in each country |
| Large estate / vulnerable beneficiary | Ask about **testamentary trusts** (asset protection, tax for minors) |
| Funeral not pre-funded | Funeral bond / pre-paid plan / small accessible funeral fund |

### 6.2 Ways money can reach people without waiting for probate (AU defaults, mark NZ/UK/US variants)
Shown as an explainer with "ask your lawyer/adviser" next steps. **Not** advice.
1. **Joint tenancy** (property and bank accounts): passes to the survivor automatically and isn't part of the estate. *(Not tenants in common.)*
2. **Binding super nomination / reversionary pension**: paid directly to the nominee.
3. **Life insurance with a named beneficiary** (outside super): paid directly.
4. **Small-estate bank release**: banks often release balances under their own threshold without probate. Thresholds vary by bank.
5. **Funeral costs paid directly**: most banks will pay a funeral invoice from the deceased's account before probate.
6. **Funeral bonds / pre-paid funerals**: money is set aside and released for the funeral.
7. **Family / discretionary trusts**: assets held by the trust aren't in the personal estate. Control passes per the **trust deed** (appointor / successor trustee), so ★ check the deed names a successor.
8. **Company assets**: owned by the company; shares pass via the will, but control depends on the constitution and shareholder agreement.
9. **Gifting while alive**: consider tax and pension asset-test (gifting limit) effects.
10. **Mortgage protection / offset accounts in joint names**: keeps the home safe during administration.

*NZ variants:* KiwiSaver goes to the estate (no nomination); small-estate release thresholds under the Administration Act; Public Trust. *UK:* Tell Us Once, IHT nil-rate bands, expression of wishes for pensions, trusts for life policies. *US:* POD/TOD designations, revocable living trusts, beneficiary designations override the will.

> **Compliance note:** in Australia, general information is fine, but *personal* financial advice requires an AFSL. Keep everything general, show the disclaimer on each screen, and link to "Find a lawyer / adviser". Partner referrals could become a revenue stream later.

### 6.3 Life-event reminders
Annual review prompt (gentle) plus "something changed?" triggers: marriage, separation, new child, house purchase, new job, diagnosis, death of a beneficiary or executor, moving state/country, super nomination expiry date.

---

## 7. ★ Release & Access: how the plan reaches the right people

This is the biggest gap in v2. Options to design:
- **Trusted contacts** (1–3) who can request access by uploading a death certificate.
- **Waiting period** (e.g. 7 days): the owner receives emails, texts and app alerts and can cancel (protects against misuse while alive).
- **Optional check-in**: if the owner doesn't respond to periodic check-ins for X weeks, contacts are alerted. This must be opt-in.
- **Access levels**: Emergency Summary goes to everyone in the trusted list. Executor Pack goes to the executor only. Each letter goes to its recipient only, at its scheduled time. Private notes are never released.
- **Offline fallback**: the printed book / PDF stored with the will, and a "Where to find my AMFY plan" card for the wallet or for the lawyer.
- **Incapacity mode** (separate from death): releases medical wishes and the household runbook to the EPOA holder.

---

## 8. Outputs (generated from the same data)
1. **Emergency Summary** (1 page): who to call, dependants, pets, medical devices, where the will is, what NOT to cancel.
2. **Executor Pack**: a task list built from the data, grouped by *first days / first weeks / first months*, each with contact, reference (last 4) and outcome. Includes **notification letter templates** and the AU **Death Notification Service** (one notice reaches many banks, telcos and utilities) / UK *Tell Us Once*.
3. **Full Planner PDF** and **Book edition** (premium, existing spec).
4. **Letters**: delivered per person, never bundled into the executor pack.
5. ★ **Tick-off mode for the family**: the executor can tick off tasks in the app and share them with siblings so nothing is done twice.

---

## 9. Trust, safety and data (stronger than v2)
This database would be a complete identity-theft kit, so:
- No passwords, PINs, full card or account numbers, or seed phrases (enforced: input fields check for and block them).
- Field-level encryption for sensitive data; consider client-side encryption for letters.
- Two-factor sign-in required. Audit log of who viewed what after release.
- Data stored in Australia/NZ (marketing advantage).
- Delete-my-data, export-my-data.
- Privacy Act 1988 (AU) / Privacy Act 2020 (NZ) compliance.

---

## 10. Data model (enter once, use everywhere)

```
Plan ─┬─ Person      (name, contacts, relationship, roles[], notifyMethod, privateNotes)
      ├─ Account     (institution, type, last4, ownership, paysFor[] → RecurringCost)
      ├─ Policy      (insurer, type, heldVia → Account|Super, beneficiary → Person, nominationType, expiry)
      ├─ Asset       (type, location, ownership, intendedFor → Person, story, photo)
      ├─ Debt        (lender, type, last4, guarantor?)
      ├─ RecurringCost (provider, category, amount, frequency, paidFrom → Account, outcome, transferTo → Person)
      ├─ Document    (type, date, physicalLocation, digitalLocation, holder → Person)
      ├─ Device / DigitalAccount (platform, legacyFeature, whoCanUnlock → Person, outcome)
      ├─ Wish        (category, answer, notes)
      ├─ Message     (to → Person, body, media[], deliverAt: onRelease|date|event)
      ├─ Suggestion  (ruleId, status: open|dismissed|done)  ← health check
      └─ Task        (generated from all of the above for the Executor Pack)
```
Each chapter screen is a *view* of this data. "Key People" and "First Few Days" read from the same `Person` records, which fixes the double-entry problem.

---

## 11. Suggested build order
1. **Data model + Life Scan + chapter wizard shell** (the redesign itself)
2. Money In, Money Out (incl. Recurring Costs Register): the most practical value, and a good demo.
3. Smart follow-ups (AI) in First Few Days and Money.
4. Strengthen My Plan (rules engine + explainer content, lawyer-reviewed).
5. Emergency Summary + Executor Pack outputs.
6. Release & Access.
7. Future-dated messages, video, household runbook, belongings register.
8. Book edition, gift edition, tiers.

---

## 12. Questions for you
1. **Country**: Australia, NZ, or both at launch? (It changes probate, super/KiwiSaver, and the advance care directive forms.)
2. **Release & Access**: how much should AMFY handle itself (death-certificate verification, check-ins) vs relying on printed copies?
3. **Advice line**: purely general information, or a "find a lawyer/adviser" referral partnership?
4. **Stack**: stay in emergent.sh, or move to a codebase you own (e.g. Next.js + Supabase), which makes encryption, scheduled letters and PDF/book output easier?
