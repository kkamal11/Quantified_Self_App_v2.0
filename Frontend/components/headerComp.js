const headerComp = {
    template: `
    <div>
        <nav class="border-gray-200 px-2 sm:px-8 py-1 rounded dark:bg-gray-800">
            <div class="container flex flex-wrap justify-between items-center mx-auto">
                <button @click="takeMeToHome" class="flex items-center hover:underline underline-offset-8">
                    <img src="../assets/images/navImg.jpg" class="mr-1 h-6 sm:h-9 rounded-full" alt="App Logo">
                    <span class="hidden md:block self-center text-xl font-semibold whitespace-nowrap dark:text-white">QuantifiedSelf App</span>
                </button>
                <div class="flex md:order-2">
                    <button @click="showTextToGetStartedFunc" v-if="!this.$store.state.loggedIn" type="button" class="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700">Get started</button>
                    <button @click="logoutUser" v-else type="button" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700">Log out <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
                    <button @click="openMenu" data-collapse-toggle="navbar-cta" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
                <div class="hidden bg-fuchsia-100 justify-between items-center w-full md:flex md:w-auto md:order-1 dark:bg-gray-800 dark:text-fuchsia-50" id="navbar-cta">
                    <ul class="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:dark:bg-gray-800 dark:border-gray-700 dark:bg-gray-900">
                        <li>
                            <button @click="frontPageHome" v-if="!this.$store.state.loggedIn"  class="block py-2 pr-4 pl-3 text-white md:text-gray-700 md:hover:text-blue-700 rounded md:bg-transparent md:p-0 dark:text-white" ><i class="bi bi-house-heart"></i> Home</button>
                            <button @click="mainHomePage" v-else class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:hover:text-blue-700 md:p-0 dark:text-white"><i class="bi bi-house-heart"></i> Home</button>
                        </li>
                        <li v-if="!this.$store.state.loggedIn">
                            <button @click="showServicesPage" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-fuchsia-50 dark:hover:text-blue-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="fa fa-tasks" aria-hidden="true"></i> Services</button>
                        </li>
                        <li v-if="!this.$store.state.loggedIn">
                            <button @click="showAddress" class="block py-2 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-700 dark:text-fuchsia-50 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="fa fa-address-book" aria-hidden="true"></i> Contact</button>
                        </li>
                        <li v-if="this.$store.state.loggedIn">
                            <button @click="myAccount" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-fuchsia-50 dark:hover:bg-gray-700 dark:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="bi bi-person-circle"></i> My Account</button>
                        </li>
                        <li v-if="this.$store.state.loggedIn">
                            <button @click="googleChat" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-fuchsia-50 dark:hover:bg-gray-700 dark:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="bi bi-chat-left-text-fill"></i> Google Chat</button>
                        </li>
                        <li v-if="!this.$store.state.loggedIn">
                            <button @click="getFAQ" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-fuchsia-50 dark:hover:bg-gray-700 dark:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="bi bi-question-lg"></i>FAQ</button>
                        </li>
                        <li>
                            <button @click="changeMode" v-if="!isDark" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="bi bi-moon-stars-fill"></i> Dark Mode</button>
                            <button @click="changeMode" v-else class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-fuchsia-50 dark:hover:bg-gray-700 dark:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"><i class="bi bi-brightness-high"></i> Light Mode</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>`,
    data() {
        return {
            todayDate: String(new Date()),
            isShowingDropDown: false,
            expand: true,
            isDark:false
        }
    },

    methods: {
        //this.login -> this.$store.commit('login')
        ...Vuex.mapMutations(['login', 'logout','showTextToGetStartedFunc']),
        ...Vuex.mapActions(['loginUser', 'logoutUser']),
        openMenu() {
            this.expand = !this.expand
			const x = document.getElementById("navbar-cta");
			if (!this.expand) {
				x.classList.remove("hidden");
			} else {
				x.classList.add("hidden");
			}
        },
        changeMode: function () {
			if (!this.isDark) {
				localStorage.setItem('theme', 'dark')
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark')
				localStorage.setItem("theme","light")
			}
			this.isDark = !this.isDark
		},
        getFAQ: function () {
            this.$router.push({path:'/faq'})
        },
        frontPageHome: function () {
            this.$router.push({path:"/"})
        },
        showAddress: function () {
            alert("Please see the footer section for contact details.")
        },
        myAccount: function () {
            this.$router.push({path:"/myAccount"})
        },
        googleChat: function () {
            this.$router.push({path:'/gchat'})
        },
        mainHomePage: function () {
            this.$router.push({path:"/home"})
        },
        showServicesPage: function () {
            this.$router.push({path:'/services'})
        },
        takeMeToHome: function () {
            if (this.$store.state.loggedIn) {
                this.$router.push({path: "/home"})
            }
            else {
                this.$router.push({path: "/"})
            }
        }
    },
    mounted: function () {
        if (localStorage.getItem('theme') === 'dark' || ((localStorage.getItem("theme") === 'light') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
			this.isDark = true;
		} else {
			document.documentElement.classList.remove('dark')
			this.isDark = false;
		}
    }
}

export default headerComp