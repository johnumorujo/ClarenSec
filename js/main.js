// VARIABLE DECLARATIONS
const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const closeMenu = document.getElementById("close-menu")
const mobileLinks = mobileMenu.querySelectorAll("a")
const blogContainer = document.getElementById("landing-page-blog-posts")
const template = document.getElementById("blog-template")
const searchButton = document.getElementById("search-button")
const search = document.getElementById("search-bar")
const items = document.querySelectorAll(".article")
const pageNumbers = document.getElementById("page-numbers")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")

window.addEventListener("load", () => {
    const loader = document.getElementById("loader")
    if (loader) loader.style.display = "none"
})

// slide items in when the content enters the screen in view
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

    // toggling opening and closing of the navigation menu
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

    // Auto countup animation
    function countUpUnified(el, duration = 1000, decimals = 2) {
        const target = parseFloat(el.dataset.target)
        const isDecimal = target % 1 !== 0
        const frameRate = 60 // 60 FPS
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

    // native sharing on mobile
    const currentUrl = window.location.href
    const shareData = {
        title: document.title,
        text: document.body.querySelector("h1").textContent,
        url: currentUrl,
    }

    document.getElementById("shareButton")?.addEventListener("click", async () => {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            return null
        }
    })

    // copy link to clipboard
    document.getElementById("copyButton")?.addEventListener("click", async () => {
        await navigator.clipboard.writeText(shareData.url)
    })

    // pagination logic
    const itemsPerPage = 6
    let currentPage = 1

    // // Calculate total pages
    const totalPages = Math.ceil(items?.length / itemsPerPage)

    // Display items for current page
    function showPage(page) {
        items?.forEach((item, index) => {
            item.classList.add("hidden")
            const start = (page - 1) * itemsPerPage
            const end = start + itemsPerPage
            item.classList.toggle("hidden", !(index >= start && index < end))
        })
    }

    // Update pagination buttons
    function updatePagination() {
        if (!pageNumbers) return null
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
            pageNumbers?.appendChild(button)
        }

        prevBtn.disabled = currentPage === 1
        nextBtn.disabled = currentPage === totalPages
    }

    // Event Listeners
    prevBtn?.addEventListener("click", () => {
        console.log("clicked on previous button")
        if (currentPage > 1) {
            currentPage--
            showPage(currentPage)
            updatePagination()
        }
    })

    nextBtn?.addEventListener("click", () => {
        console.log("clicked on next button")
        if (currentPage < totalPages) {
            currentPage++
            showPage(currentPage)
            updatePagination()
        }
    })

    // Initialize
    showPage(currentPage)
    updatePagination()

    // load blogposts on the landing page using an external json file "landing-page-blog".json
    async function loadBlog() {
        try {
            const res = await fetch("landing-page-blog.json")
            const blogPost = await res.json()
            renderBlog(blogPost)
        } catch (e) {}
    }
    function renderBlog(blogPosts) {
        blogPosts.forEach((blogPost) => {
            const templateClone = template.content.cloneNode(true)
            templateClone.querySelector(".blog-post-title").textContent = blogPost.title
            templateClone.querySelector(".blog-post-date").textContent = blogPost.date
            templateClone.querySelector(".blog-post-description").textContent = blogPost.description
            const link = templateClone.querySelector(".blog-post-link")
            link.setAttribute("href", blogPost.link)
            const image = templateClone.querySelector(".blog-post-image")
            image.setAttribute("src", blogPost.image)
            blogContainer.appendChild(templateClone)
        })
    }
    blogContainer || template ? loadBlog() : null

    // debounce function declaration
    function debounce(func) {
        let timeout
        return function (...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func.apply(this, args)
            }, 1000)
        }
    }

    // reset search on page refresh
    search ? (search.value = "") : null
    // function declaration to actually search the articles by the name of the articls
    function searchFunction() {
        const searchInputValue = search.value.toLowerCase()
        const articles = document.querySelectorAll("article > h3")
        // Show all if search is empty
        if (!searchInputValue) {
            articles.forEach((article) => article.classList.remove("hidden"))
            showPage(currentPage) // Reset to current pagination
            return
        }
        articles.forEach((article) => {
            article.closest("article").classList.remove("hidden")
            let articleTitle = article.textContent.toLowerCase()
            articleTitle.includes(searchInputValue)
                ? ""
                : article.closest("article").classList.add("hidden")
        })
    }

    const debouncedFilter = debounce(searchFunction)
    // filter the blogposts when the user is typing in the search bar
    search?.addEventListener("input", (e) => {
        debouncedFilter()
    })
    // filter the blogpost when the user clicks on the search icon
    searchButton?.addEventListener("click", debouncedFilter)
})
