
// =========================================================
// AUREON CAREERS JAVASCRIPT
// =========================================================


// =========================================================
// BURGER MENU
// =========================================================

const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

const navLinks = document.querySelectorAll(".nav-menu a");


function closeMenu() {

    if (burger) {

        burger.classList.remove("active");

        burger.setAttribute("aria-expanded", "false");

        burger.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }

    if (navMenu) {

        navMenu.classList.remove("active");

    }

    document.body.classList.remove("menu-open");

}


function openMenu() {

    if (burger) {

        burger.classList.add("active");

        burger.setAttribute("aria-expanded", "true");

        burger.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

    }

    if (navMenu) {

        navMenu.classList.add("active");

    }

    document.body.classList.add("menu-open");

}


if (burger && navMenu) {

    burger.setAttribute("aria-expanded", "false");


    burger.addEventListener("click", () => {

        const isOpen = navMenu.classList.contains("active");

        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    });


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            closeMenu();

        }

    });

}


// =========================================================
// ESCAPE KEY - CLOSE MENU
// =========================================================

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeMenu();

    }

});


// =========================================================
// JOB FILTERING
// =========================================================

const filterButtons = document.querySelectorAll(".filter-button");
const jobCards = document.querySelectorAll(".job-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedFilter = button.dataset.filter;


        filterButtons.forEach(filter => {

            filter.classList.remove("active");

        });


        button.classList.add("active");


        jobCards.forEach(card => {

            const category = card.dataset.category;


            if (
                selectedFilter === "all" ||
                category === selectedFilter
            ) {

                card.style.display = "flex";


                if (typeof card.animate === "function") {

                    card.animate(

                        [
                            {
                                opacity: 0,
                                transform: "translateY(15px)"
                            },

                            {
                                opacity: 1,
                                transform: "translateY(0)"
                            }

                        ],

                        {
                            duration: 300,
                            easing: "ease-out"
                        }

                    );

                }

            } else {

                card.style.display = "none";

            }

        });

    });

});


// =========================================================
// ROLE SELECTION
// =========================================================

const roleButtons = document.querySelectorAll(".job-button");

const roleSelect = document.getElementById("applicantRole");

const applicationSection = document.getElementById("application");


roleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedRole = button.dataset.role;


        if (roleSelect) {

            roleSelect.value = selectedRole;

        }


        if (applicationSection) {

            applicationSection.scrollIntoView({

                behavior: "smooth",
                block: "start"

            });

        }

    });

});


// =========================================================
// APPLICATION FORM
// DEMO ONLY
// =========================================================

const applicationForm = document.getElementById("applicationForm");

const formMessage = document.getElementById("formMessage");


if (applicationForm) {

    applicationForm.addEventListener("submit", event => {

        event.preventDefault();


        const name = document
            .getElementById("applicantName")
            .value
            .trim();


        const email = document
            .getElementById("applicantEmail")
            .value
            .trim();


        const role = document
            .getElementById("applicantRole")
            .value;


        const message = document
            .getElementById("applicantMessage")
            .value
            .trim();


        if (
            name === "" ||
            email === "" ||
            role === "" ||
            message === ""
        ) {

            formMessage.textContent =
                "PLEASE COMPLETE ALL REQUIRED FIELDS.";

            return;

        }


        formMessage.textContent =
            "APPLICATION DEMO COMPLETE. CONNECT A BACKEND TO RECEIVE SUBMISSIONS.";


        applicationForm.reset();

    });

}


// =========================================================
// SCROLL REVEAL
// =========================================================

const revealElements = document.querySelectorAll(

    ".job-card, " +
    ".benefit-card, " +
    ".culture-content, " +
    ".culture-visual"

);


const revealStyle = document.createElement("style");


revealStyle.textContent = `

    .reveal {

        opacity: 0;

        transform: translateY(25px);

        transition:
            opacity 0.7s ease,
            transform 0.7s ease;

    }


    .reveal.revealed {

        opacity: 1;

        transform: translateY(0);

    }

`;


document.head.appendChild(revealStyle);


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    revealObserver.unobserve(entry.target);

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

} else {

    revealElements.forEach(element => {

        element.classList.add("revealed");

    });

}