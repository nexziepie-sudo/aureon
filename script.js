/* =========================================================
   AUREON
   JAVASCRIPT
========================================================= */


/* =========================================================
   BURGER MENU
========================================================= */

const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");


function openMenu() {

    burger.classList.add("active");

    navMenu.classList.add("active");

    document.body.classList.add("menu-open");

}


function closeMenu() {

    burger.classList.remove("active");

    navMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

}


burger.addEventListener("click", () => {

    const isOpen =
        navMenu.classList.contains("active");

    if (isOpen) {

        closeMenu();

    } else {

        openMenu();

    }

});


/* Close menu when a navigation link is clicked */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});


/* Close menu when ESC is pressed */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeMenu();

    }

});


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const service =
        document.getElementById("service").value;

    const message =
        document.getElementById("message").value.trim();


    if (
        !name ||
        !email ||
        !service ||
        !message
    ) {

        formMessage.textContent =
            "PLEASE COMPLETE ALL FIELDS.";

        return;

    }


    formMessage.textContent =
        "THANK YOU. YOUR INQUIRY IS READY TO SEND.";


    /*
        This demo does not actually send email.

        Connect this form to:
        - PHP
        - Formspree
        - EmailJS
        - Your own backend
        - Hostinger mail

        before using it in production.
    */


    contactForm.reset();

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".service-card, " +
        ".marketing-box, " +
        ".process-step, " +
        ".project-item, " +
        ".contact-form, " +
        ".ecosystem-content"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");


const navItems =
    document.querySelectorAll(
        '.nav-menu a[href^="#"]'
    );


function updateActiveNavigation() {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navItems.forEach(item => {

        item.classList.remove("active");

        const href =
            item.getAttribute("href");

        if (
            href === `#${currentSection}`
        ) {

            item.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


updateActiveNavigation();


/* =========================================================
   MOUSE PARALLAX
========================================================= */

const heroVisual =
    document.querySelector(".hero-visual");

const heroOrb =
    document.querySelector(".orb");


if (
    heroVisual &&
    heroOrb &&
    window.innerWidth > 760
) {

    heroVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroVisual.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const moveX =
                (x - centerX) / 25;

            const moveY =
                (y - centerY) / 25;


            heroOrb.style.transform =
                `translate(${moveX}px, ${moveY}px)`;

        }
    );


    heroVisual.addEventListener(
        "mouseleave",
        () => {

            heroOrb.style.transform =
                "translate(0, 0)";

        }
    );

}


/* =========================================================
   SMOOTH CTA LINKS
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute("href");

                const target =
                    document.querySelector(targetId);


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });