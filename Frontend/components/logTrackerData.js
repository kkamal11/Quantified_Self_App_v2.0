import fetchFunction from "../fetchfunction.js"

const logDataTemplate = {
    props:['tracker'],
    template: `
    <div class="fixed top-1/4 left-0 md:left-1/4 bg-rose-300 dark:bg-gray-800 p-4 rounded-md">
        <h2 class="mb-2 text-xl text-center font-medium">{{tracker.name}} Tracker</h2>
        <h2 class="mb-2 text-lg text-center">Enter values to log:</h2>
        <div class="flex flex-col">
            <label for="tracker">Logging Time:</label>
            <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="time" name="tracker" id="tracker" />
        </div>
        <label for="value" class="mt-4 block">Value:</label>
        <input v-if="tracker.type == 'Numerical'" type="number" class="p-2 rounded-md w-full dark:text-gray-600" v-model="log.value" name="value" id="value" placeholder="Enter the value here"/>
        <p v-if="tracker.type == 'Numerical'" class="text-sm text-red-600">You can enter only numbers.</p>
        <select v-if="tracker.type == 'Boolean'" v-model="log.value" class="p-2 rounded-md w-full dark:text-gray-600">
            <option value="" disabled>Select Yes or No</option>
            <option>Yes</option>
            <option>No</option>
        </select>
        <select v-if="tracker.type == 'Multiple Choice'" v-model="log.value" class="p-2 rounded-md w-full dark:text-gray-600">
            <option value="" disabled>Select any value</option>
            <option v-for="s in tracker.setting.split(',')">{{s}}</option>
        </select>
        <div v-if="tracker.type == 'Time Duration'">
            <input type="number" class="p-2 rounded-md w-4/6 dark:text-gray-600" v-model="log.value" name="value" id="value" placeholder="Enter the value here"/>
            <select v-model="unitValueForTimeDuration" class="p-2 rounded-md w-1/4 dark:text-gray-600">
                <option value="" disabled>Select Unit</option>
                <option>Seconds</option>
                <option>Minutes</option>
                <option>Hours</option>
                <option>Days</option>
            </select>
        </div>
        <label class="mt-4 block" for="note">Note:</label>
        <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="log.note" name="note" id="note" placeholder="Enter any note here:"/>
        <button @click="logData(tracker.id)" class=" py-3 px-8 m-2 font-medium rounded-lg text-sm bg-blue-700 hover:bg-blue-800 text-white"><i class="bi bi-plus-lg"></i> Save</button>
        <button @click="$emit('cancel')" class="float-right py-3 px-8 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800"><i class="bi bi-x-lg"></i> Cancel</button>
        <p v-if="error" class="text-lg text-red-600 font-medium"><i class="bi bi-arrow-right-circle-fill"></i> {{error}}</p>
    </div>`,
    data() {
        return {
            time: new Date(),
            log: {
                value:"",
                note:""
            },
            error: "",
            unitValueForTimeDuration: "",
            numberError:""
        }
    },
    methods: {
        logData: async function (trackerId) {
            if (this.log.value.length == 0) {
                this.error = "Please enter new value."
            }
            else if (this.tracker.type == "Time Duration" && this.unitValueForTimeDuration == "") {
                this.error = "Please select unit."
            }
            else {
                if (this.tracker.type == 'Time Duration') {
                    this.log.value = this.log.value + " " + this.unitValueForTimeDuration
                }
                this.error = ""
                const data = fetchFunction({
                    url: `http://127.0.0.1:8080/log/${trackerId}`,
                    init_obj: {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(this.log)
                    },
                    authTokenReq: true
                })
                if (data) {
                    window.location.reload()
                }
            }
        }
    },
    
    mounted() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
    }
}

export default logDataTemplate