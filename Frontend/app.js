import router from "./route.js"
import store from "./store/vuexStore.js"
import headerComp from "./components/headerComp.js"
import footerComp from "./components/footerComp.js"


var app = new Vue({
    el: '#app',
    data: {
        message:"kamal"
    },
    components: {
        'header-comp':headerComp,
        'footer-comp':footerComp
    },
    store: store,
    router,   //this makes the router accessible to all the components
    methods: {

    }
})

////////////Scroll to Top setting////////////////////
let scrollButton = document.getElementById("scrollBtn");
scrollButton.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})
window.addEventListener("scroll", () => {
    if (window.scrollY > 14) {
        scrollButton.classList.remove("hidden");
    }
    else {
        scrollButton.classList.add("hidden");
    }
})