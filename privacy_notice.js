
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* ======================================
       AUTOMATIC COPYRIGHT YEAR
    ====================================== */

    const yearElement = document.getElementById("privacyYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* ======================================
       PRIVACY SECTION NAVIGATION
    ====================================== */

    const navigationLinks = Array.from(
        document.querySelectorAll(".privacy-sidebar nav a")
    );

    const sections = navigationLinks
        .map((link) => {
            const target = link.getAttribute("href");

            if (!target || !target.startsWith("#")) {
                return null;
            }

            return document.querySelector(target);
        })
        .filter(Boolean);

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        a.boundingClientRect.top -
                        b.boundingClientRect.top
                );

            if (!visibleEntries.length) {
                return;
            }

            const activeId = visibleEntries[0].target.id;

            navigationLinks.forEach((link) => {
                const isActive =
                    link.getAttribute("href") === `#${activeId}`;

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        },
        {
            root: null,
            rootMargin: "-100px 0px -65% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
});
