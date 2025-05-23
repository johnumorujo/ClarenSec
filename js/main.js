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
                if (entry.target.classList.contains("counter-animation")) {
                    document.querySelectorAll(".counter").forEach((el) => {
                        countUpUnified(el, 1000, 1) // All finish in 2 seconds
                    })
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
function countUpUnified(el, duration = 2000, decimals = 2) {
    const target = parseFloat(el.dataset.target)
    const isDecimal = target % 1 !== 0
    const frameRate = 60 // 60 FPS
    const totalFrames = Math.round((duration / 1000) * frameRate)
    let frame = 0

    const counter = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const current = target * progress
        el.textContent = isDecimal ? current.toFixed(decimals) : Math.round(current).toLocaleString()

        if (frame >= totalFrames) {
            el.textContent = isDecimal ? target.toFixed(decimals) : target.toLocaleString()
            clearInterval(counter)
        }
    }, 1000 / frameRate)
}

document.addEventListener("DOMContentLoaded", () => {})
