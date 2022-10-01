import fetchFunction from "../fetchfunction.js"

const updateLogDataComp = {
    props:["log"],
    template: `
    </div class="fixed top-20 left-0 md:left-1/4 bg-gray-300 p-4 rounded-md dark:bg-gray-900">
        <div class="dark:bg-gray-900">
            <h2 class="mb-2 text-lg text-center">Enter new values:</h2>
            <div class="flex flex-col mx-4">
                <label for="time">Time:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="newLogData.time" name="tracker" id="time" placeholder="Enter the tracker name here"/>
            </div>
            <div class="mx-4">
                <label class="mt-4 block" for="value">New Value:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="newLogData.value" name="value" id="value" placeholder="Enter the new value here"/>
                <label class="mt-4 block" for="note">New Note:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="newLogData.note" name="note" id="note" placeholder="Enter the new value here"/>
                <button @click="sendUpdatedLogData(logId)" class="py-2 px-8 m-2 mt-4 rounded-lg bg-blue-600 text-white hover:bg-blue-800">Save</button>
                <button @click="$emit('cancel')" class="float-right py-2 px-8 m-2 mt-4 rounded-lg bg-red-500 text-white hover:bg-red-600">Cancel</button>
                <p v-if="error" class="text-lg text-red-600 font-medium"><i class="bi bi-arrow-right-circle-fill"></i> {{error}}</p>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            logId:this.log.id,
            newLogData: {
                time: this.log.time.slice(0,-9),
                value: this.log.value,
                note:this.log.note
            },
            error:""
        }
    },
    methods: {
        sendUpdatedLogData: function (logId) {
            if (this.newLogData.value.length == 0) {
                this.error = "Please enter new value."
            }
            else {
                this.error = ""
                const data = fetchFunction({
                    url: `http://127.0.0.1:8080/logDelete/${logId}`,
                    init_obj: {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PUT',
                        body: JSON.stringify(this.newLogData)
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

export default updateLogDataComp