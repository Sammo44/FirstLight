# FirstLight

*However dark the night without you, be their first light.*

FirstLight is a family continuity planner for Australia and New Zealand. It helps someone write down the things only they know (the bills, the accounts, how the house works, who to call, and what they want) so the people they love can step in, whether they're in hospital tonight or gone for good.

This repository holds a working, single-file prototype plus the design work behind it.

## What's here

| Path | What it is |
|---|---|
| `app/firstlight.html` | The whole prototype: one HTML file with its own CSS and JavaScript. This is the file published as the Claude artifact. |
| `index.html` | The same app with a standard page head (doctype, charset and the mobile viewport), for GitHub Pages. Built by `build-index.ps1`. Don't edit it by hand. |
| `build-index.ps1` | Rebuilds `index.html` from `app/firstlight.html`. Run it after changing the app. |
| `docs/design-review.html` | The UX and CX review that led to the current design. |
| `docs/blueprint-v3.md` | The earlier product blueprint (from when it was called After Me, For You). |
| `design/canvas/` | Source for the naming, logo, tagline and palette exploration boards. |
| `tests/` | Automated system and feature tests, and a runner. |

## Running it

Open `index.html` in a browser, or visit **https://sammo44.github.io/FirstLight/**. Everything works without a server.

- **On its own** (a file, or GitHub Pages): plans are saved in that browser's local storage. The conversational features fall back to plain forms, and Ask the plan finds matching notes in the plan.
- **As a Claude artifact**: plans are saved privately to each person's Claude account, and the conversational capture, photo reading, follow-up questions and Ask the plan use the viewer's own Claude account.

## Main features

- **Three places:** Today, My plan and For my family. On phones they sit in a labelled row at the top, next to a Menu button.
- **People, picked not typed:** beneficiaries, joint owners, heirlooms and hand-overs are chosen from the people already in the plan (or someone new). Super, insurance and assets take several beneficiaries, each with a share, and the plan checks the shares add up to 100%. Shares split evenly by default (one person gets 100%, two get 50% each, three get a third each) and stay even as people are added or removed. Once a share is typed by hand, the typed shares are kept and someone new gets whatever is left.
- **Points, vouchers and credit:** their own page under Money, set out like assets. Each frequent flyer program, loyalty scheme, gift card or credit gets a card with its member or card number (the last 4 digits for gift cards), balance, expiry, where it's kept, a linked card or account, what should happen to it, and who gets it, with shares. They show up in the executor's list, the family view, Ask the plan and Strengthen. Older plans' written lists become one card per item.
- **A quick start:** three setup questions and a two-page Life Scan. The other questions are optional, under *Tailor your plan* in My plan. The 2-minute check's gaps decide which essentials come first.
- **One measure of readiness:** ten things written down (five for hospital, five if you die), the same on the check, Today, My plan and the essentials.
- **Today:** readiness written as outcomes ("If you were in hospital tonight, Jo could…"), one next step, and a *Tell me anything* box. On wide screens, readiness sits on the left and the next step on the right.
- **Works without Claude:** prompts are worded for what the page can do, *Tell me anything* suggests where a note goes, and bills become a tick-list of common ones.
- **Backups:** download the whole plan as one file and restore it later, from Settings or the Menu. Plans kept only in the browser get a reminder.
- **Say it or snap it:** ten conversational questions for the essentials. Claude pulls out the facts and shows a *Here's what I heard* card. Nothing is saved until the person confirms.
- **Bills in a minute:** upload bank and card statements (CSV, read on the device), then decide each biller one card at a time: cancel, keep or hand on. Every card can be edited (name, what it's for, amount, how often, renewal, account, filing and notes), and a bill can be handed to anyone in the plan or someone new. The big "Hand it to …" button follows whoever was picked last, so choosing someone else once changes the default for the bills after it. A renamed bill keeps its statement name, so the next upload still matches it. The full four-step flow sits under *Fine-tune*.
- **Family view:** what to do today, this week and later, jobs assigned to people from their roles, and *Ask the plan*.
- **Walk me round the house:** a photo and a sentence at each stop (photos stay on the device).
- **Sunday afternoon mode:** for doing it together with a parent, with big type, read-aloud, a mix of practical questions and stories, and an easy break.
- **Letters and words:** guided letters by relationship, story questions, and a writing coach.
- **Vault:** card numbers and passwords, encrypted on the device (PBKDF2 and AES-GCM) with a passphrase only the owner knows.
- **Printable summaries:** hospital summary, first-days guide, executor's list, household manual and wallet card.

## Brand

- **Name:** FirstLight (one word).
- **Mark:** morning seen through a keyhole, with the circle around it going from night to dawn.
- **Palette, Clear morning:** night `#0E2630`, deep teal `#1E3E52`, teal `#2E6E78`, sea `#4E9AA0`, mint `#CBE6DC`, amber `#F4A340`, glow `#FCD58E`, morning `#FFF8E8`.
- **Type:** Newsreader (display) and Figtree (body).
- **Lines:** *Be their first light.* · *Shining a light on everything they'll need.* · *However dark the night without you, be their first light.*

## Tests

The tests run in headless Microsoft Edge on Windows:

```powershell
./tests/run-tests.ps1
```

- **System crawl (`sit.js`):** visits every screen, presses every safe button, types into every field and changes every dropdown, on the example plan, a fresh plan and a parent plan. It also runs with a stand-in for Claude. It reports any error or blank screen. Each crawl runs in two parts, because the test browser stops after a few thousand clicks in one page.
- **Feature suites:** CSV parsing and outputs (`harness2.js`), conversational capture (`talk.js`), Letters and words (`words.js`, `letters.js`), family view and Ask (`fam.js`), house walk and Sunday mode (`walk.js`), beneficiaries and shares (`people.js`), older plans that stored names as text (`legacy.js`), the quick start, offline paths, backups and layout (`ux.js`), bills one card at a time (`bq.js`), editing bills found on statements (`billedit.js`, with made-up statements), points, vouchers and credit (`points.js`), and who bills are handed to by default (`handover.js`, with made-up statements).
- Run some suites only with `./tests/run-tests.ps1 -Only people,legacy`.
- **`bq.js` needs real-looking statements.** Put them in `tests/fixtures/statements.js` as `window.__files = [{name, text}, …]`. That folder is git-ignored, so personal statements never end up in the repo.
- `mockclaude.js` and `mockclaude2.js` stand in for Claude, so the AI paths can be tested offline.

## Privacy notes

- Bank statements are read in the browser and never uploaded.
- Long card and account numbers are cut to the last four digits before any text is sent to Claude.
- Private notes, letters and the vault are never included in summaries or in Ask the plan.

This is a prototype. Get a security review before storing real sensitive information in it.
