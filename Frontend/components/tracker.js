import fetchFunction from "../fetchfunction.js"

const tracker = {
    props: ["tracker"],
    template: `
    <div>
        <div class="rounded-lg bg-rose-200 mb-4 border-b-2 border-blue-600 hover:bg-rose-300 dark:bg-gray-700 dark:text-gray-200">
            <div>
                <div class="mx-4 my-3">
                    <h1 @click="seeTrackerDetails(tracker.id)" class="text-xl text-purple-800 dark:text-purple-400 text-center font-bold my-3 mx-1 inline-block hover:underline hover:underline-offset-8 hover:cursor-pointer">{{ tracker.name }} Tracker</h1>
                    <!--<i class="bi bi-pin-angle float-right inline-block my-4 px-2 hover:bg-green-600"></i>-->
                   
                    <p class="mx-1 mb-1 mt-2 overflow-y-auto h-10"><span class="font-medium">Description:</span> {{ tracker.description }}</p>
                    <p class="m-1"><span class="font-medium">Created On:</span> {{ tracker.time.slice(0,-6) }}</p>
                    <p class="m-1"><span class="font-medium">Tracker type:</span> {{ tracker.type }}</p>
                    <p class="m-1"><span class="font-medium">Last review time:</span> {{ tracker.last_tracked_time.slice(0,-6) }}</p>
                    <p class="m-1"><span class="font-medium">Last logged value:</span> {{ tracker.last_logged_value }}</p>
                    <div v-if="deleteMe" class="fixed top-1/4 md:left-1/3 bg-fuchsia-200 dark:bg-gray-800 py-8 px-16 rounded-md text-center">
                        <i class="fa-solid fa-hand" style="font-size:48px;color:red"></i>
                        <h1 class="text-2xl font-medium text-red-600 mb-4">Delete this tracker?</h1>
                        <p class="text-lg">Are you sure to delete this tracker?</p>
                        <button @click="cancelDeletePopUp" class=" px-4 py-2.5 m-2 md:mr-12 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">No <i class="bi bi-x-lg"></i></i></button>
                        <button @click="deleteThisTracker(tracker.id)" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Yes <i class="bi bi-check-lg"></i></button>
                    </div>
                    <div class="grid grid-cols-2">
                        <button @click="$emit('logDetails',tracker.id)" class="col-span-2 m-2 px-4 py-2.5 font-medium rounded-lg text-sm bg-blue-600 hover:bg-blue-800 text-white"><i class="bi bi-vector-pen"></i> Log values <i class="bi bi-vector-pen"></i></button>
                        <button @click="$emit('updateThisTracker',tracker.id)" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">Update <i class="fas fa-edit"></i></button>
                        <button @click="showDeletePopUp" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Delete <i class="bi bi-trash3"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            trackerArray: [],
            trackerLastValue: "",
            deleteMe:false
        }
    },
    methods: {
        showDeletePopUp: function () {
            this.deleteMe = true
        },
        cancelDeletePopUp: function () {
            this.deleteMe = false
        },
        deleteThisTracker: async function (id) {
            const data = await fetchFunction({
                url: `http://127.0.0.1:8080/tracker/${id}`,
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE',
                },
                authTokenReq: true
            })
            if (data) {
                window.location.reload()
            }
        },
        seeTrackerDetails: function (id) {
            this.$router.push({ name: 'trackerDetails', params: { id: id } })
        },
        // getLastLoggedValue: async function (tid) {
        //     const tracker = await fetchFunction({
        //         url: `http://127.0.0.1:8080/lvalue/tracker/${this.tId}`,
        //         init_obj: {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             method: 'GET',
        //         },
        //         authTokenReq: true
        //     })
        //     if (tracker) {
        //         console.log(tracker)
        //         this.trackerLastValue = tracker
        //     }
        // }
    },
    mounted() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
        // this.getLastLoggedValue();

    }
}

export default tracker