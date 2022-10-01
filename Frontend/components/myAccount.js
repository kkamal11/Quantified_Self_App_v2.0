import fetchFunction from "../fetchfunction.js"
import loader from "./loader.js"
const myAccount = {
    template: `
    <div v-if="!gotDataFromServer" class="h-screen flex items-center justify-center">
            <span class="loader mr-4"></span>
            <div class="font-medium text-3xl">Waiting...</div>
    </div>
    <div v-else class="mx-auto flex items-center justify-center flex-col">
        <h1 class="mt-8 md:my-12 text-center font-medium text-xl">My Account</h1>
        <p v-if="resetMsg" class="text-red-600 px-2 py-1 border-2 border-red-600 rounded-lg">{{ resetMsg }}</p>
        <div v-if="changePass" class="fixed top-1/4 bg-fuchsia-200 dark:bg-gray-800 mx-4 py-4 px-16 rounded-md">
            <h1 class="mb-2 text-2xl font-medium">Please enter below information.</h1>
            <div>
                <label for="oldPassword" class="block">Enter the old Password</label>
                <input v-model="oldPassword" id="oldPassword" type="password" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <span class="block text-sm mt-2">
                    <input type="checkbox" @click="showPassword('old')" id="showpassold">
                    <label for="showpassold">{{ showOldPassText }} Password</label>
                </span>
                <label for="password" class="pt-4 block">Enter a new Password</label>
                <input v-model="newPassword" id="password" type="password" class="rounded-md block px-2 border-2 w-full dark:text-gray-700">
                <span class="block text-sm mt-2">
                    <input type="checkbox" @click="showPassword('new')" id="showpass">
                    <label for="showpass">{{ showNewPassText }} Password</label>
                </span>
                <p v-if="passwordErrorMsg" class=" w-96 text-lg text-center font-medium text-red-600 m-2">{{passwordErrorMsg}}</p>
                <div class="mt-4">
                    <button v-if="!sendingRequest" @click="cancelDeletePopUp" class="px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">Go Back</button>
                    <button v-if="!sendingRequest" @click="changePassword" class="float-right font-medium text-sm py-2.5 px-4 bg-blue-600 mt-4 text-white rounded-xl hover:bg-blue-800">Update</button>
                    <loader v-if="sendingRequest" />
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-1">
            <div class="text-center mt-2">
                <img v-if="previewImage" :src="previewImage" width="120px"  class="block mx-auto rounded-full mt-8 mb-4 md:mb-0" alt="profile image" >
                <div v-if="!previewImage" class="avatar mx-auto mt-8 font-medium text-lg rounded-full bg-gray-600 flex justify-center items-center" :data-label="nameInitial"></div>
            </div>
            <div class="md:my-12 mb-8 md:mb-0">
                <p class="text-lg"><span class="font-medium"><i class="bi bi-person-check"></i> Username:</span> {{ this.$store.state.currentUser.username }}</p>
                <p class="text-lg"><span class="font-medium"><i class="bi bi-envelope-check"></i> Email:</span> {{ this.$store.state.currentUser.email }} </p>
                <p class="text-lg"><span class="font-medium"><i class="bi bi-alarm"></i> Active since:</span> {{ this.$store.state.currentUser.active_since ? this.$store.state.currentUser.active_since.slice(0,-6) : 'Fetching...' }}</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-y-4 md:gap-x-40 mt-8">
            <label class="px-4 py-2 font-medium text-base bg-blue-600 hover:bg-blue-800 text-white rounded-lg cursor-pointer">
                <i class="bi bi-file-earmark-image"></i> {{ imgAction }} Image
                <input @change="uploadImage" type="file" class="hidden" />
            </label>
            <button @click="showChangePasswordPopUp" class="block text-center font-medium text-base px-4 py-2 text-white bg-blue-600 hover:bg-blue-800 rounded-lg"><i class="bi bi-pencil-square"></i> Change Password</button>
        </div>
        <div v-if="deleteMe" class="fixed top-1/4 md:left-1/3 bg-fuchsia-200 dark:bg-gray-800 py-8 px-16 rounded-md text-center">
            <i class="fa-solid fa-hand" style="font-size:48px;color:red"></i>
            <h1 class="text-2xl font-medium text-red-600 mb-4">Delete your account??</h1>
            <p class="text-lg">Are you sure to delete your account permanentally?</p>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">Remember! all your data and info will be gone forever.</p>
            <button @click="cancelDeletePopUp" class="px-4 py-2.5 m-2 mr-8 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">No <i class="bi bi-x-lg"></i></i></button>
            <button @click="deleteAccount" class="px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Yes <i class="bi bi-check-lg"></i></button>
        </div>
        <div v-if="resetMe" class="fixed top-1/4 md:left-1/3 bg-fuchsia-200 dark:bg-gray-800 py-8 px-16 rounded-md text-center">
            <i class="fa-solid fa-hand" style="font-size:48px;color:red"></i>
            <h1 class="text-2xl font-medium text-red-600 mb-4">Reset your account??</h1>
            <p class="text-lg">Are you sure to reset your account permanentally?</p>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">Remember! all your data and info will be gone forever.</p>
            <button @click="cancelDeletePopUp" class="px-4 py-2.5 m-2 mr-8 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">No <i class="bi bi-x-lg"></i></i></button>
            <button @click="resetAccount" class="px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Yes <i class="bi bi-check-lg"></i></button>
        </div>
        <button @click="showResetPopUp" class="bg-red-600 hover:bg-red-800 rounded-md text-white text-sm font-medium py-3 px-4 mt-12 mb-4"><i class="fas fa-trash-restore"></i> Reset Account </button>
        <button @click="showDeletePopUp" class="bg-red-600 hover:bg-red-800 rounded-md text-white text-sm font-medium py-3 px-4 mb-4"><i class="bi bi-trash3"></i> Delete Account</button>
    </div>`,
    data() {
        return {
            imgAction: "Upload",
            previewImage: null,
            resetMsg: "",
            changingPassword: false,
            sendingRequest: false,
            oldPassword: "",
            newPassword: "",
            gotDataFromServer: false,
            deleteMe: false,
            resetMe: false,
            changePass: false,
            passwordErrorMsg: "",
            showOldPassText: 'show old',
            showNewPassText: 'show new',
            passwordPattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
        }
    },
    components: {
        loader: loader
    },
    methods: {
        ...Vuex.mapActions(['getCurrentUser']),
        showDeletePopUp: function () {
            this.deleteMe = true
        },
        cancelDeletePopUp: function () {
            this.deleteMe = false
            this.resetMe = false
            this.passwordErrorMsg = ""
            this.changePass = false
        },
        showResetPopUp: function () {
            this.resetMe = true
        },
        showChangePasswordPopUp: function () {
            this.changePass = true
        },
        showPassword: function (val) {
            if (val == "old") {
                const inp = document.getElementById("oldPassword")
                if (inp.type === 'password') {
                    inp.type = 'text'
                    this.showOldPassText = 'Hide ' + val
                }
                else if (inp.type === 'text') {
                    inp.type = 'password'
                    this.showOldPassText = 'Show ' + val
                }
            }
            else if (val == 'new') {
                const inp = document.getElementById("password")
                if (inp.type === 'password') {
                    inp.type = 'text'
                    this.showNewPassText = 'Hide ' + val
                }
                else if (inp.type === 'text') {
                    inp.type = 'password'
                    this.showNewPassText = 'Show ' + val
                }
            }
        },
        uploadImage(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.previewImage = e.target.result;
                localStorage.setItem("profile-pic", this.previewImage)
            };
        },
        deleteAccount: async function () {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/user',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE',
                },
                authTokenReq: true
            })
            if (data) {
                localStorage.removeItem('token')
                this.$router.push({ path: '/' })
                window.location.reload()
            }
        },
        resetAccount: async function () {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/user/reset',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE',
                },
                authTokenReq: true
            })
            if (data) {
                this.resetMe = false
                this.resetMsg = 'Reset Account successfull.'
            }
        },
        changePassword: async function () {
            if (this.oldPassword.length < 6 || this.newPassword.length < 6) {
                this.passwordErrorMsg = "Password should have atleast 6 character."
            }
            else if (!this.newPassword.match(this.passwordPattern)) {
                if (!this.newPassword.match(/(?=.*[0-9])/)) {
                    this.passwordErrorMsg = "Password should have atleast 1 digit."
                }
                if (!this.newPassword.match(/(?=.*[!@#$%^&*])/)) {
                    this.passwordErrorMsg = "Password should have atleast 1 special character(!@#$%^&*)."
                }
            }
            else {
                this.passwordErrorMsg = ""
                this.changingPassword = !this.changingPassword
                this.sendingRequest = true
                const data = await fetchFunction({
                    url: 'http://127.0.0.1:8080/user',
                    init_obj: {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PUT',
                        body: JSON.stringify({
                            old: this.oldPassword,
                            new: this.newPassword
                        })
                    },
                    authTokenReq: true
                })
                if (data == 401) {
                    this.sendingRequest = false
                    this.passwordErrorMsg = "Incorrect old password."
                }
                else {
                    this.changePass = false
                    this.sendingRequest = false
                    this.resetMsg = "Password Changed Successfully."
                }
            }
        }
    },
    computed: {
        nameInitial() {
            return this.$store.state.currentUser.username[0].toUpperCase()
        }
    },
    watch: {

    },
    mounted() {
        this.getCurrentUser();
        if (this.$store.state.currentUser.username) {
            this.gotDataFromServer = true
        }
        else {
            this.gotDataFromServer = false
        }
        //////
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
        ///////
        const avatars = document.querySelectorAll(".avatar");

        avatars.forEach((a) => {
            const charCodeRed = a.dataset.label.charCodeAt(0);
            const charCodeGreen = a.dataset.label.charCodeAt(1) || charCodeRed;

            const red = Math.pow(charCodeRed, 7) % 200;
            const green = Math.pow(charCodeGreen, 7) % 200;
            const blue = (red + green) % 200;

            a.style.background = `rgb(${red}, ${green}, ${blue})`;
        });

        ////////
        if (localStorage.getItem("profile-pic")) {
            this.previewImage = localStorage.getItem("profile-pic")
            this.imgAction = 'Change'
        }
    }
}

export default myAccount