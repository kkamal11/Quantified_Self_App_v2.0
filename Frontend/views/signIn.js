import fetchFunction from "../fetchfunction.js"
import loader from "../components/loader.js"

const signInForm = {
    template: `
    <div>
        <div class=" text-gray-800 rounded-md mx-12 mt-20 md:mx-16 lg:mx-28 md:my-32 dark:text-fuchsia-50"> 
        <p v-show="this.$store.state.showTextToGetStarted && timeLeft" class="text-green-600 font-medium">Please log in or sign up below to get started.</p>
        <p v-show="registeredSuccessfully && timeLeft" class="text-green-600 font-medium">Sign Up successful. Please log in with your credentials.</p>
        <p v-if="this.$store.state.err" class="text-red-700 font-medium">{{ this.$store.state.err }}. Try again!</p>    
            <form name="signinform">
                <label for="email" class="pt-2 block">Email<i v-if="showEmailTick" class="bi bi-check2-all ml-2 text-xl text-green-500"></i></label>
                <input v-model="email" id="email" type="email" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <p v-if="emailErrorMsg" class="text-sm text-red-600">{{emailErrorMsg}}</p>
                <label for="password" class="pt-2 block relative">Password<i v-if="showPasswordTick" class="bi bi-check2-all ml-2 text-xl text-green-500"></i></label>
                <input v-model="password" id="password" type="password" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <span class="block text-sm mt-2">
                    <input type="checkbox" @click="showPassword" id="showpass">
                    <label for="showpass">{{ showPassText }} Password</label>
                </span>
                <p v-if="passwordErrorMsg" v-for="errMsg in passwordErrorMsg" class="text-xs text-red-600"><i class="bi bi-arrow-right-circle-fill"></i> {{errMsg}}</p>
                <p v-if="password" class="pt-2 text-red-600 font-medium text-sm" :class="[{'text-yellow-400':strength==67},{'text-green-600':strength==100}]"><i class="bi bi-arrow-right-circle-fill"></i> Password Format Matched: {{ strength }} % </p>
                <div class="text-center">
                    <button v-if="!this.$store.state.sendingRequest" @click="loginUser({email: email,password: password})" :disabled="!showEmailTick || !showPasswordTick" class="font-medium text-sm py-2.5 px-6 bg-blue-600 mt-4 text-white rounded-xl hover:bg-blue-800">{{submit}}</button>
                    <loader v-if="this.$store.state.sendingRequest"></loader>
                    <p v-if="!this.$store.state.sendingRequest" class="py-2 clear-both">Don't have an account, <router-link to="/signup" class="font-medium hover:text-blue-800 hover:underline underline-offset-4">Sign Up</router-link></p>
                </div>
            </form>
        </div>
    </div>`,
    data() {
        return {
            email: "",
            password: "",
            sendingRequest: this.$store.state.sendingRequest,
            registeredSuccessfully: this.$route.query.registeredSuccessfully ? true : false,
            timeLeft: true,
            submit: 'Log In',
            url: "http://127.0.0.1:8080/login?include_auth_token",
            userInfo: "",
            validMailFormat: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            emailErrorMsg: "",
            showEmailTick: false,
            passwordErrorMsg: [],
            showPasswordTick: false,
            strength: 0,
            passwordPattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
            showPassText:'Show'
        }
    },
    components: {
        'loader': loader
    },
    methods: {
        ...Vuex.mapMutations(['login']),
        ...Vuex.mapActions(['loginUser']),  //map this.$store.dispatch('loginUser(user)') to this.loginUser(user)
        showPassword: function () {
            const inp = document.getElementById('password')
            if (inp.type === 'password') {
                inp.type = 'text'
                this.showPassText = 'Hide'
            }
            else if (inp.type === 'text') {
                inp.type = 'password'
                this.showPassText = 'Show'
            }
        }
    },
    computed: {

    },
    mounted() {
        if (this.$route.query.registeredSuccessfully) {
            this.$store.commit('setError',"")
            setTimeout(() => {
                this.registeredSuccessfully = false
            }, 10000);
        }
    },
    watch: {
        passwordErrorMsg() {
            if (this.passwordErrorMsg.length == 3) {
                this.strength = 0
            }
            else {
                this.strength = Math.round(((3 - this.passwordErrorMsg.length) / 3) * 100)
            }
        },
        email(val) {
            if (!val.match(this.validMailFormat)) {
                if (val.indexOf("@") == -1) {
                    this.emailErrorMsg = "Please include an @ in email."
                }
                else {
                    this.emailErrorMsg = "Invalid Email Address"
                }
            }
            else {
                this.emailErrorMsg = ""
                this.showEmailTick = true
            }
        },
        password(val) {
            if (val.length > 0) {
                this.showPasswordTick = false
                if (!val.match(/(?=.*[0-9])/) && this.passwordErrorMsg.length != 3) {
                    this.passwordErrorMsg.push("Password should have atleast 1 digit.")
                }
                else if (val.match(/(?=.*[0-9])/)) {
                    this.passwordErrorMsg = []
                }
                if (!val.match(/(?=.*[!@#$%^&*])/) && this.passwordErrorMsg.length != 3) {
                    this.passwordErrorMsg.push("Password should have atleast 1 special character(!@#$%^&*).")
                }
                else if (val.match(/(?=.*[!@#$%^&*])/)) {
                    this.passwordErrorMsg = []
                }
                if ((val.length < 6 || val.length > 16) && this.passwordErrorMsg.length != 3) {
                    this.passwordErrorMsg.push("Password should be atleast 6 and atmost 16 character long.")
                }
                else if (!val.length < 6 && !val.length > 16) {
                    this.passwordErrorMsg = []
                }
                if (this.passwordErrorMsg.length == 0) {
                    this.passwordErrorMsg = []
                    this.showPasswordTick = true
                }
            }
            else {
                this.passwordErrorMsg = []
                this.showPasswordTick = false
            }
        }
    }
}

export default signInForm