import fetchFunction from "../fetchfunction.js"
import updateLogDataComp from "./updateLogData.js"
import Chart from "./Chart.js"

const trackerDetail = {
    template: `
    <div>
        <h1 class="text-2xl text-purple-700 font-medium text-center mt-14 mb-2 tracking-wider">{{ currentTracker.name }} Tracker</h1>
        <p class="text-center mx-4 mb-2"><span class="font-medium">Description of the tracker</span>: {{ currentTracker.description }}</p>
        <p class="text-center mx-4 mb-2"><span class="font-medium">Type of tracker</span>: {{ currentTracker.type }}</p>
        <p class="text-center mx-4 mb-2"><span class="font-medium">Creation date</span>: {{ currentTracker.time.slice(0,-6) }}</p>
        <p class="text-center mx-4 mb-12"><span class="font-medium">Last review time</span>: {{ currentTracker.last_tracked_time.slice(0,-6) }}</p>
        <div class="bg-slate-400 p-4 mb-16 mx-4 lg:mx-52">
            <update-log-data-comp :log=log v-if="showUpdateLogComp" @cancel="hideTheUpdateLogComp" />
            <div v-if="log_data.length == 0" class="p-8 font-medium text-lg text-center bg-rose-100 dark:bg-gray-800">
                <div>No log has been entered for this tracker.</div>
            </div>   
            <div v-else-if="log_data.length > 0 && !showUpdateLogComp" class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th width="60px" class="py-3 px-2">S. No.</th>
                            <th scope="col" class="py-3 px-4 text-center">Logged time</th>
                            <th scope="col" class="py-3 px-4 text-center">Value</th>
                            <th scope="col" class="py-3 px-4 text-center">Note</th>
                            <th scope="col" class="py-3 px-4 ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="showFiveLogs" v-for="(log,index) in log_data.slice(0,5)" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th  scope="row" class="py-4 px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{index+1}}
                            </th>
                            <td class="py-4 px-4 text-center overflow-x-auto">
                            {{ log.time.slice(0,-6) }}
                            </td>
                            <td class="py-4 px-4 text-center">
                                {{ log.value }}
                            </td>
                            <td class="py-4 px-4 text-center">
                            {{ log.note ? log.note : "No note logged" }}
                            </td>
                            <td class="py-4 px-2 ">
                                <div href="#" class="text-center font-medium text-blue-600 dark:text-blue-500">
                                    <button @click="showTheUpdateComp(log)" class="mb-2 md:mb-0" style="font-size:25px; color:lightblue"><i class="fas fa-edit md:mr-6 inline-block hover:text-blue-600"></i></button>
                                    <button @click="deleteThisLog(log.id)" style="font-size:25px; color:red;"><i class="bi bi-trash hover:text-red-700"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!showFiveLogs" v-for="(log,index) in log_data" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th  scope="row" class="py-4 px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{index+1}}
                            </th>
                            <td class="py-4 px-4 text-center">
                            {{ log.time.slice(0,-6) }}
                            </td>
                            <td class="py-4 px-4 text-center">
                                {{ log.value }}
                            </td>
                            <td class="py-4 px-4 text-center">
                            {{ log.note ? log.note : "No note logged" }}
                            </td>
                            <td class="py-4 px-2 ">
                                <div href="#" class="text-center font-medium text-blue-600 dark:text-blue-500">
                                    <button @click="showTheUpdateComp(log)" style="font-size:25px; color:lightblue"><i class="fas fa-edit  md:mr-6 inline-block hover:text-blue-600"></i></button>
                                    <button @click="deleteThisLog(log.id)" style="font-size:25px; color:red;"><i class="bi bi-trash hover:text-red-700"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr v-if="log_data.length > 5" class="font-semibold text-gray-700 dark:text-white text-center">
                            <td colspan="5"><button @click="showAllLogs" class="bg-yellow-400 hover:bg-yellow-500 px-6 py-2.5 m-2 font-medium rounded-lg text-sm" title="Click to see all logs">{{showHowMuch}}</button></td>
                        </tr>
                        <tr v-if="currentTracker.type == 'Numerical'" class="font-semibold text-gray-700 dark:text-white">
                            <th colspan="4" class="py-3 px-6 text-base text-center">Total sum of value</th>
                            <td class="py-3 px-6">{{ totalValue }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div v-if="log_data.length == 0" class="mx-4 lg:mx-52 mb-8 p-8 font-medium text-center bg-rose-100 dark:bg-gray-800">
            <p>Please log value into this tracker to see graphical progress.</p>
        </div>
        <div v-else>
            <hr style="width:50%; margin: auto; margin-bottom:48px;">
            <p v-if="currentTracker.type != 'Time Duration'" class="text-2xl font-medium p-4 mb-4 text-center">See your progress visually</p>
            <Chart :id="this.$route.params.id" :tType="currentTracker.type" />
        </div>
    </div>`,
    data() {
        return {
            log:null,
            showUpdateLogComp:false,
            log_data: [],
            currentTracker: "",
            labels: [],
            data: [],
            showFiveLogs: true,
            showHowMuch:"See All"
        }
    },
    components: {
        'update-log-data-comp': updateLogDataComp,
        'Chart':Chart,
    },
    methods: {
        showTheUpdateComp: function (log) {
            this.showUpdateLogComp = true;
            this.log = log
        },
        hideTheUpdateLogComp: function () {
            this.showTheUpdateComp = false
            // window.location.reload()
            this.$router.go()
        },
        showAllLogs: function () {
            this.showHowMuch = this.showFiveLogs ? "See Less" : "See All"
            this.showFiveLogs = !this.showFiveLogs
        },
        deleteThisLog: async function (id) {
            const data = await fetchFunction({
                url: `http://127.0.0.1:8080/logDelete/${id}`,
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
        }
    },
    computed: {
        totalValue: function () {
            let sum = 0
            this.log_data.forEach(log => {
                sum += Number(log.value)
            });
            return sum
        }
    },
    created() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
    },
    async mounted() {
        const logs = await fetchFunction({
            url: `http://127.0.0.1:8080/log/${this.$route.params.id}`,
            init_obj: {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            },
            authTokenReq: true
        })
        if (logs) {
            this.log_data = logs
            for (let i = 0; i < this.log_data.length; i++){
                let time = this.log_data[i].time.slice(5,-6)
                let value = this.log_data[i].value
                this.labels.push(time)
                this.data.push(Number(value))
            }
        }

        const currentTracker = await fetchFunction({
            url: `http://127.0.0.1:8080/tracker/${this.$route.params.id}`,
            init_obj: {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            },
            authTokenReq: true
        })
        if (currentTracker) {
            this.currentTracker = currentTracker
        }
    },
}

export default trackerDetail