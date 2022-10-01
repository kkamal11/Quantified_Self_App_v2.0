import router from "../route.js"
import fetchFunction from "../fetchfunction.js"
import loader from "../components/loader.js"

const signUpForm = {
    template: `
    <div>
        <div class=" text-gray-800 rounded-md mx-12 mt-24 md:mx-16 lg:mx-28 md:my-32 dark:text-fuchsia-50">
            <p v-show="this.$store.state.showTextToGetStarted" class="text-green-600 font-medium">Please log in or sign up below to get started.</p> 
            <p v-if="errorMsg" class="text-red-700 font-medium">{{ errorMsg }}</p>
            <div>
                <label for="username" class="pt-2 block">Name<i v-if="showUsernameTick" class="bi bi-check2-all ml-2 text-xl text-green-500"></i></label>
                <input v-model="username" id="username" type="text" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <p v-if="usernameErrorMsg" class="text-sm text-red-600">{{usernameErrorMsg}}</p>
                <label for="email" class="pt-2 block">Email<i v-if="showEmailTick" class="bi bi-check2-all ml-2 text-xl text-green-500"></i></label>
                <input v-model="email" id="email" type="email" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <p v-if="emailErrorMsg" class="text-sm text-red-600">{{emailErrorMsg}}</p>
                <label for="password" class="pt-2 block">Password<i v-if="showPasswordTick" class="bi bi-check2-all ml-2 text-xl text-green-500"></i></label>
                <input v-model="password" id="password" type="password" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <span class="block text-sm mt-2">
                    <input type="checkbox" @click="showPassword" id="showpass">
                    <label for="showpass">{{ showPassText }} Password</label>
                </span>
                <p v-if="passwordErrorMsg" v-for="errMsg in passwordErrorMsg" class="text-sm text-red-600"><i class="bi bi-arrow-right-circle-fill"></i> {{errMsg}}</p>
                <p v-if="password" class="pt-2 text-red-600 font-medium text-sm" :class="[{'text-yellow-400':strength==67},{'text-green-600':strength==100}]"><i class="bi bi-arrow-right-circle-fill"></i> Password Strength: {{ strength }} % </p>
                <div class="text-center">
                    <button v-if="!sendingRequest" @click="signUpFunc($event)" :disabled="!showEmailTick || !showPasswordTick" class="font-medium text-sm py-2.5 px-6 bg-blue-600 mt-4 text-white rounded-lg hover:bg-blue-800">Sign Up</button>
                    <loader v-else></loader>
                    <p class="py-2 ">Already have an account, <router-link to="/" class="font-medium hover:text-blue-800 hover:underline underline-offset-4 dark:text-fuchsia-50">Log In</router-link></p>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            username: "",
            email: "",
            password: "",
            sendingRequest: false,
            errorMsg: "",  
            validMailFormat: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            url: "http://127.0.0.1:8080/user",
            usernameErrorMsg: "",
            showUsernameTick: false,
            emailErrorMsg: "",
            showEmailTick: false,
            passwordErrorMsg: [],
            showPasswordTick: false,
            passwordPattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
            strength: 0,
            showPassText:'Show'
        }
    },
    components: {
        'loader': loader
    },
    methods: {
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
        },
        signUpFunc: function (event) {
            this.sendingRequest = true
            const result = fetchFunction({
                url: this.url, init_obj: {
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        password: this.password
                    })
                }
            })
            result.then((resp) => {
                if (resp == 409) {
                    this.sendingRequest = false
                    this.errorMsg = "User with this email already exists."
                }
                else if (JSON.parse(resp)['success'] == true) {
                    this.sendingRequest = false
                    this.$router.push({path:'/',query:{registeredSuccessfully:true}})
                }
                else {
                    this.sendingRequest = false
                    this.errorMsg = "An error occurred. Try again."
                }
            }).catch((err) => {
                this.sendingRequest = false
                this.$store.commit('setError',err)
                this.errorMsg = err
            })
        }
    },
    computed: {

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
        username(val) {
            if (val.length > 0) {
                this.usernameErrorMsg = ""
                this.showUsernameTick = true
            }
            else {
                this.usernameErrorMsg = "Username is Required"
                this.showUsernameTick = false
            }
        },
        email(val) {
            if (!val.match(this.validMailFormat)) {
                if (val.indexOf("@") == -1) {
                    this.emailErrorMsg = "Please include an @ in email."
                    this.showEmailTick = false
                }
                else {
                    this.emailErrorMsg = "Invalid Email Address"
                    this.showEmailTick = false
                }
            }
            else {
                this.emailErrorMsg = ""
                this.showEmailTick = true
            }
        },
        password(val) {
            if (val.length > 0) {
                // if (!val.match(this.passwordPattern)) {
                //     
                // }
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

export default signUpForm