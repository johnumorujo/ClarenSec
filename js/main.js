document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("before-animate")
                    if (entry.target.classList.contains("slide-side")) {
                        entry.target.classList.add("slide-right-fade")
                    } else {
                        entry.target.classList.add("slide-up-fade")
                    }
                    obs.unobserve(entry.target)
                }
            })
        },
        {
            threshold: 0.3,
        }
    )

    document.querySelectorAll(".before-animate").forEach((el) => observer.observe(el))
})

const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const closeMenu = document.getElementById("close-menu")
const mobileLinks = mobileMenu.querySelectorAll("a")

function openMenu() {
    mobileMenu.classList.remove("-translate-x-full")
    menuBtn.classList.add("hidden")
}

function closeMobileMenu() {
    mobileMenu.classList.add("-translate-x-full")
    menuBtn.classList.remove("hidden")
}

menuBtn.addEventListener("click", openMenu)
closeMenu.addEventListener("click", closeMobileMenu)

// Auto-close when any link is clicked
mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
})
