## 2024-05-23 - Smooth Scroll vs Focus Management
**Learning:** Custom smooth scroll implementations often hijack click events on anchor tags, preventing the default browser behavior of moving focus to the target element. This breaks accessibility for keyboard users relying on "Skip to Content" links or in-page navigation.
**Action:** When implementing smooth scroll, always ensure focus is programmatically moved to the target element (adding `tabindex="-1"` if necessary) or allow specific links (like skip links) to opt-out of the custom scroll behavior.
