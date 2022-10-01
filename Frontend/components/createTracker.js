import fetchFunction from "../fetchfunction.js"
const createTracker = {
    props:['allTracker'],
    template: `
    <div class="fixed top-1/5 left-0 md:left-1/4 bg-rose-300 p-4 rounded-md dark:bg-gray-800">
        <div v-if="trackerCreatedSuccessfully" class="bg-rose-300 dark:bg-gray-800"><p class="loader"></p><p class="float-right mt-2 ml-4 font-medium">Creating the tracker...</p></div>
        <div v-else>
            <h2 class="m-2 text-xl font-medium text-center">Add a tracker</h2>
            <p v-if="Error" class="text-center text-base text-red-600 font-medium">{{ Error}}</p>
            <div class="flex flex-col mb-4">
                <label for="tracker" class="mb-2">Tracker name:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-500" v-model="name" name="tracker" id="tracker" placeholder="Enter the tracker name here"/>
                <p v-if="nameError" class="text-sm text-red-600">{{nameError}}</p>
            </div>
            <div class="mb-4">
                <label class="mb-2 inline-block" for="description">Tracker description:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-500" v-model="description" name="description" id="description" placeholder="Enter the tracker description here"/>
                <p v-if="descriptionError" class="text-sm text-red-600">{{descriptionError}}</p>
            </div>
            <label for="setting" class="mb-2 inline-block" >Type:</label>
            <select class="p-2 rounded-md w-full dark:text-gray-500" v-model="type">
                <option value="Numerical">Numerical</option>
                <option >Multiple Choice</option>
                <option>Boolean</option>
                <option>Time Duration</option>
            </select>
            <p v-if="typeError" class="text-sm text-red-600">{{typeError}}</p>
            <div v-if="type == 'Multiple Choice'" class="">
                <label class="mt-4 mb-2 inline-block" for="type">Setting:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-500" v-model="setting" name="type" id="type" placeholder="Enter values separated by comma(,) without any space."/>
                <p v-if="settingError" class="text-sm text-red-600 w-full">{{settingError}}</p>
            </div>
            <button @click="postTrackerData" :disabled="!namePresent || !descriptionPresent" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm py-3 px-8 m-2 mt-4 text-center md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700"><i class="bi bi-plus-lg"></i> Create</button>
            <button @click="$emit('cancel')" class="float-right text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm py-3 px-8 m-2 mt-4 text-center md:mr-0 "><i class="bi bi-x-lg"></i> Cancel</button>
        </div>
    </div>`,
    data() {
        return {
            name: '',
            type: "Numerical",
            description: "",
            setting: "",
            trackerCreatedSuccessfully: false,
            nameError: "",
            typeError: "",
            descriptionError: "",
            settingError: "",
            namePresent: false,
            descriptionPresent: false,
            typePresent: false,
            Error: ""
        }
    },
    methods: {
        postTrackerData: async function () {
            if (!this.namePresent) {
                this.Error = "Please give a name to your tracker."
            }
            else if (!this.descriptionPresent) {
                this.Error = "Please describe your tracker."
            }
            else if (this.type == "Multiple Choice" && this.setting == "") {
                this.Error = "Select setting for MCQ type tracker your are creating."
            }
            else {
                const data = await fetchFunction({
                    url: 'http://127.0.0.1:8080/tracker',
                    init_obj: {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            name: this.name,
                            type: this.type,
                            description: this.description,
                            setting: this.setting
                        }),
                    },
                    authTokenReq: true
                })
                if (data) {
                    console.log(data)
                    this.trackerCreatedSuccessfully = true;
                    window.location.reload()
                }
            }
        },
    },
    watch: {
        name(val) {
            if (val.length == 0) {
                this.nameError = "Please enter tracker name"
                this.namePresent = false
            }
            else {
                this.nameError = ""
                let present = false
                for (let i = 0; i < this.allTracker.length; i++){
                    if (this.allTracker[i]['name'] == val) {
                        present = true
                        break
                    }
                }
                if (!present) {
                    this.Error = ""
                    this.namePresent = true
                }
                else {
                    this.Error = "Tracker with this name already exists."
                }
            }
        },
        description(val) {
            if (val.length == 0) {
                this.descriptionError = "Please describe your tracker"
                this.descriptionPresent = false
            }
            else {
                this.descriptionPresent = true
                this.descriptionError = ""
            }
        },
        setting(val) {
            if (val.includes(" ")) {
                this.settingError = "It should be comma (,) separated."
            }
            else {
                this.settingError = ""
            }
        }
    },
    mounted() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
    }
}

export default createTracker