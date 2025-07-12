// === VARIABLE DECLARATIONS ===
const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const closeMenu = document.getElementById("close-menu")
const mobileLinks = mobileMenu.querySelectorAll("a")
// const blogContainer = document.getElementById("landing-page-blog-posts")
const template = document.getElementById("blog-template")
const searchButton = document.getElementById("search-button")
const search = document.getElementById("search-bar")
const pageNumbers = document.getElementById("page-numbers")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")
const latestContainer = document.getElementById("latest-posts")

// === PAGE LOAD LOADER ===
window.addEventListener("load", () => {
    const loader = document.getElementById("loader")
    if (loader) loader.style.display = "none"
})

// === INTERSECTION ANIMATION ===
const observer = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("before-animate")
                entry.target.classList.add(
                    entry.target.classList.contains("slide-side")
                        ? "slide-right-fade"
                        : "slide-up-fade"
                )
                obs.unobserve(entry.target)

                if (entry.target.classList.contains("counter-animation")) {
                    document.querySelectorAll(".counter").forEach((el) => {
                        countUpUnified(el, 1000, 1)
                    })
                }
            }
        })
    },
    { threshold: 0.3 }
)

document.querySelectorAll(".before-animate").forEach((el) => observer.observe(el))

// === MOBILE MENU TOGGLE ===
function openMenu() {
    mobileMenu.classList.remove("-translate-x-full")
    menuBtn.classList.add("hidden")
}

function closeMobileMenu() {
    mobileMenu.classList.add("-translate-x-full")
    menuBtn.classList.remove("hidden")
}

menuBtn?.addEventListener("click", openMenu)
closeMenu?.addEventListener("click", closeMobileMenu)
mobileLinks.forEach((link) => link.addEventListener("click", closeMobileMenu))

// === COUNTER FUNCTION ===
function countUpUnified(el, duration = 1000, decimals = 2) {
    const target = parseFloat(el.dataset.target)
    const isDecimal = target % 1 !== 0
    const frameRate = 60
    const totalFrames = Math.round((duration / 1000) * frameRate)
    let frame = 0

    const counter = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const current = target * progress
        el.textContent = isDecimal
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString()

        if (frame >= totalFrames) {
            el.textContent = isDecimal ? target.toFixed(decimals) : target.toLocaleString()
            clearInterval(counter)
        }
    }, 1000 / frameRate)
}

// === NATIVE SHARE & COPY ===
const rawTitle = document.body.querySelector("h1")?.innerText || "";
const cleanTitle = rawTitle.replace(/\s*\n\s*/g, " ").trim();
const fullText = `${cleanTitle}\n${window.location.href}`;

const shareData = {
  title: document.title,
  text: fullText,
  // intentionally omit url to allow line break in text
};

document.getElementById("shareButton")?.addEventListener("click", async () => {
    if (navigator.share) await navigator.share(shareData)
})

document.getElementById("copyButton")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(shareData.url)
})

// === LOAD BLOG POSTS AND RENDER ===
async function loadBlog() {
    try {
        const res = await fetch("blog.json")
        const blogPosts = await res.json()
        // Sort all posts from newest to oldest
        const latestPosts = blogPosts.sort((a, b) => b.id - a.id)

        // Render all posts in main container
        renderBlog(latestPosts, "landing-page-blog-posts")

        showPage(currentPage)
        updatePagination()
    } catch (e) {
        console.error("Failed to load blog posts:", e)
    }
}

// === GENERAL BLOG RENDER FUNCTION ===
function renderBlog(blogPosts, containerId) {
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = ""

    blogPosts.forEach((blogPost) => {
        const templateClone = template.content.cloneNode(true)
        templateClone.querySelector(".blog-post-title").textContent = blogPost.title
        templateClone.querySelector(".blog-post-date").textContent = blogPost.date
        templateClone.querySelector(".blog-post-description").textContent = blogPost.description
        const link = templateClone.querySelector(".blog-post-link")
        link.setAttribute("href", blogPost.link)
        const image = templateClone.querySelector(".blog-post-image")
        image.setAttribute("src", blogPost.image)
        container.appendChild(templateClone)
    })
}

// === DEBOUNCE FUNCTION ===
function debounce(func, delay = 1000) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), delay)
    }
}

// === SEARCH FUNCTION ===
function searchFunction() {
    const searchInputValue = search.value.toLowerCase()
    const articles = document.querySelectorAll("#landing-page-blog-posts article")

    if (!searchInputValue) {
        articles.forEach((article) => article.classList.remove("hidden"))
        showPage(currentPage)
        return
    }

    articles.forEach((article) => {
        const title = article.querySelector("h3")?.textContent.toLowerCase()
        if (title.includes(searchInputValue)) {
            article.classList.remove("hidden")
        } else {
            article.classList.add("hidden")
        }
    })
}

// === PAGINATION ===
const itemsPerPage = 6
let currentPage = 1

function getItems() {
    return document.querySelectorAll(".article")
}

function showPage(page) {
    const items = getItems()
    items.forEach((item, index) => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        item.classList.toggle("hidden", !(index >= start && index < end))
    })
}

function updatePagination() {
    const items = getItems()
    const totalPages = Math.ceil(items.length / itemsPerPage)
    if (!pageNumbers) return
    pageNumbers.innerHTML = ""

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button")
        button.textContent = i
        button.classList.toggle("active", i === currentPage)
        button.addEventListener("click", () => {
            currentPage = i
            showPage(currentPage)
            updatePagination()
        })
        pageNumbers.appendChild(button)
    }

    prevBtn.disabled = currentPage === 1
    nextBtn.disabled = currentPage === totalPages
}

prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--
        showPage(currentPage)
        updatePagination()
    }
})

nextBtn?.addEventListener("click", () => {
    const totalPages = Math.ceil(getItems().length / itemsPerPage)
    if (currentPage < totalPages) {
        currentPage++
        showPage(currentPage)
        updatePagination()
    }
})

// === INITIALIZATION ===
search ? (search.value = "") : null
const debouncedFilter = debounce(searchFunction)
search?.addEventListener("input", debouncedFilter)
searchButton?.addEventListener("click", debouncedFilter)

if (template) {
    loadBlog()
}