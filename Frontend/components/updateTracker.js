import fetchFunction from "../fetchfunction.js"
const updateTracker = {
    props: ["tracker"],
    template: `
    <div class="fixed top-1/4 left-0 md:left-1/4 bg-rose-300 dark:bg-gray-800 p-4 rounded-md">
        <div>
            <h2 class="mb-2 text-lg text-center">Enter new values:</h2>
            <div class="flex flex-col">
                <label for="tracker">Tracker name:</label>
                <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="newTracker.name" name="tracker" id="tracker" placeholder="Enter the new tracker name here"/>
            </div>
            <label class="mt-4 block" for="description">Tracker description:</label>
            <input class="p-2 rounded-md w-full dark:text-gray-600" v-model="newTracker.description" name="description" id="description" placeholder="Enter the new tracker description here"/>
            <button @click="postUpdatedTrackerData(newTracker,trackerId)" class=" py-3  px-8 m-2 font-medium rounded-lg text-sm bg-blue-600 hover:bg-blue-800 text-white">Save</button>
            <button @click="$emit('cancel')" class="float-right py-3 px-8 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Cancel</button>
            <p v-if="error" class="text-lg text-red-600 font-medium"><i class="bi bi-arrow-right-circle-fill"></i> {{error}}</p>
        </div>
    </div>`,
    data() {
        return {
            trackerId:this.tracker.id,
            newTracker: {
                name: this.tracker.name,
                description: this.tracker.description,
            },
            height: 0,
            error: ""
        }
    },
    methods: {
        postUpdatedTrackerData: async function (newTracker, id) {
            if (newTracker.name.length == 0) {
                this.error = "Please enter new name."
            }
            else if (newTracker.description.length == 0) {
                this.error = "Please enter new description."
            }
            else {
                this.error = ""
                const data = await fetchFunction({
                    url: `http://127.0.0.1:8080/tracker/${id}`,
                    init_obj: {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PUT',
                        body: JSON.stringify(newTracker)
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

export default updateTracker