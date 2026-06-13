# Tome Revision QA Checklist

- [ ] Homepage loads and shows school outreach CTAs.
- [ ] Student dashboard loads.
- [ ] Teacher dashboard loads in teacher/demo role.
- [ ] Reader loads.
- [ ] Quiz flow loads.
- [ ] Classroom page loads.
- [ ] Achievements page loads.
- [ ] Audio page handles missing ElevenLabs key gracefully.
- [ ] Virgil guide handles missing AI configuration gracefully.
- [ ] Stripe webhook route returns a controlled unavailable response when secrets are missing.
- [ ] PostHog does not load without a public key.
- [ ] Intercom does not load without an app ID.
- [ ] No console errors on first load.
- [ ] No secrets appear in the client bundle.
- [ ] Mobile navigation is usable.
- [ ] Keyboard focus states are visible.
- [ ] Lighthouse/accessibility pass is acceptable for preview review.
