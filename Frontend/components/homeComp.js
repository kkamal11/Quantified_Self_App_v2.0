import tracker from "./tracker.js"
import createTracker from "./createTracker.js"
import updateTracker from "./updateTracker.js"
import logDataTemplate from "./logTrackerData.js"
import fetchFunction from "../fetchfunction.js"

const homeComp = {
    template: `
    <div>
        <log-data-template :tracker=tracker v-if="showToLogData" @cancel="cancelPopUp" />
        <updateTracker :tracker=tracker_to_update v-if="showToUpdateTracker" @cancel="cancelPopUp" />
        <createTracker v-if="showToAddTracker" :allTracker="trackerArray" @cancel = "cancelPopUp" />
        <div v-if="!gotDataFromServer" class="h-screen flex items-center justify-center">
            <span class="loader mr-4"></span>
            <div class="font-medium text-3xl">Waiting...</div>
        </div>
        <div v-if="trackerArray.length > 0" class="flex items-center justify-center">
            <button v-on:click="AddTracker" class="md:hidden px-4 py-2 mt-8 text-gray-400 rounded-lg bg-white 100 font-medium hover:text-blue-700 border-2 hover:border-blue-700"><i class="bi bi-plus-lg"></i> Add a tracker</button>
        </div>
        <div v-if="gotDataFromServer" class="main-color grid grid-cols-1 md:grid-cols-3 divide-x divide-blue-700">
            <div v-if="trackerArray.length > 0" class="grid grid-cols-1 md:grid-cols-2 overflow-y-auto md:col-span-2">
                <tracker  @logDetails="showLogDataPopUp(tracker)" @updateThisTracker="showUpdatePopUp(tracker)" v-for="tracker in trackerArray" :tid="tracker.id" :tracker=tracker :key="tracker.id" class="my-4 mx-8 "> </tracker>
            </div>
            <!-- When there is no active tracker show this -->
            <div v-if="trackerArray.length === 0" class="flex flex-col col-span-2 justify-center items-center">
                <p class="text-xl font-semibold mt-12 md:mt-0">You have not created any tracker yet.</p><br>
                <button v-on:click="AddTracker" class="text-white mb-12 md:mb-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Now <i class="bi bi-plus-lg font-bold"></i></button>
            </div>
            <!--SIDE BAR-->
            <div class="bg-fuchsia-100 dark:bg-gray-900">
                <div class="hidden pt-4 my-6 md:block text-center text-lg font-medium text-orange-600 dark:text-yellow-400 italic">
                    <i v-if="greeting == 'Good Morning'" class="bi bi-sunrise font-medium text-xl"></i>
                    <i v-if="greeting == 'Good afternoon'" class="bi bi-sun font-medium text-xl"></i>
                    <i v-if="greeting == 'Good Evening'" class="bi bi-moon-stars-fill font-medium text-xl"></i>
                    {{ greeting }} {{ this.$store.state.currentUser.username }}
                </div>
                <div class="mt-8 ml-2 md:mt-2 text-center">
                    <button v-on:click="AddTracker" class="px-4 py-2 mb-2 md:mb-0 text-gray-400 rounded-lg bg-white 00 font-medium hover:text-blue-700 border-2 hover:border-blue-700"><i class="bi bi-plus-lg"></i> Add a tracker</button> <span class="inline-block text-3xl">|</span>
                    <div class="inline-block p-2 rounded-lg bg-white border-2 hover:border-blue-700">
                        <i class="bi bi-search dark:text-gray-700"></i>
                        <input v-model="searchTracker" placeholder="Search an existing one" class="focus:outline-none font-medium hover:text-blue-700 dark:hover:text-blue-700 dark:text-gray-700" style="border: none;"/>
                    </div>
                    <p @click="seeTrackerDetails" v-if="foundTracker != 'No tracker with this name.'" class="text-center text-lg font-medium mt-2 py-2 hover:text-blue-600 hover:underline hover:underline-offset-4 cursor-pointer">{{foundTracker}}</p>
                    <p v-else class="text-center text-lg font-medium mt-2 py-2">{{foundTracker}}</p>
                </div>
                <div class="my-8"> 
                    <hr style="width:200px; margin: auto;">
                    <h1 class="font-semibold text-center text-xl my-4">Stats and Summary</h1>
                    <div class="h-32 overflow-y-auto">
                        <div class="mx-6 leading-8">
                            <p>Total Number Of Trackers: {{ trackerArray.length }}</p>
                            <p>Last Created Tracker: {{ latestTracker[0] }}</p>
                            <p>Last Tracker Created On: {{ latestTracker[1].slice(0,-6) }}</p>
                        </div>
                    </div>
                    <hr style="width:200px; margin: auto;">
                </div>
                <div class="text-center">
                    <h1 class="font-medium text-xl mb-2">Action Store</h1>
                    <p v-if="ErrorMsg" class="text-lg text-red-600 font-medium"><i v-if="ErrorMsg == 'File is being processed. Please wait.'" class="text-2xl bi bi-hourglass-split"></i>{{ErrorMsg}}</p>
                    <div class="leading-8">
                        <p class="mb-1"><i class="fa-solid fa-download"></i> Download Consolidated Report</p>
                        <button v-if="!fetchingConsolidatedReport" @click="getConsolidatedReport" class="text-white bg-blue-600 hover:bg-blue-900 font-medium rounded-lg text-sm px-8 py-1.5 mb-4 text-center">PDF <i class="bi bi-filetype-pdf text-lg"></i></button>
                        <button v-else class="loader"></button>
                        <p class="mb-1"><i class="fa-solid fa-download"></i> Download Tracker Report</p>
                        <button v-if="!fetchingTrackerReport" @click="getTrackerReport" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 mb-4 mr-4 text-center">PDF <i class="bi bi-filetype-pdf text-lg"></i></button>
                        <button v-if="fetchingTrackerReport" class="loader "></button>
                        <button v-if="!fetchingTrackerReport" @click="getTrackerReportCSV" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 mb-4 text-center">CSV <i class="bi bi-filetype-csv text-lg"></i></button>

                        <p class="mb-1"><i class="fa-solid fa-download"></i> Download Log Report</p>
                        <button v-if="!fetchingLogReport" @click="getLogReport" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 mb-4 mr-4 text-center">PDF <i class="bi bi-filetype-pdf text-lg"></i></i></button>
                        <button v-if="!fetchingLogReport" @click="getLogReportCSV" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 mb-4 text-center">CSV <i class="bi bi-filetype-csv text-lg"></i></button>
                        <button v-if="fetchingLogReport" class="loader"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            tracker_to_update: null,
            tracker: null,
            user: "",
            showToAddTracker: false,
            showToUpdateTracker: false,
            showToLogData: false,
            searchTracker: '',
            foundTracker: "",
            trackerArray: [],
            greeting: "",
            tId: null,
            gotDataFromServer: false,
            ErrorMsg: "",
            fetchingTrackerReport: false,
            fetchingLogReport: false,
            fetchingConsolidatedReport: false
        }
    },
    components: {
        'tracker': tracker,
        'createTracker': createTracker,
        'updateTracker': updateTracker,
        'log-data-template': logDataTemplate
    },
    methods: {
        ...Vuex.mapActions(['getCurrentUser']),
        AddTracker: function () {
            this.showToAddTracker = true;
        },
        showUpdatePopUp(tracker) {
            this.showToUpdateTracker = true
            this.tracker_to_update = tracker
        },
        showLogDataPopUp(tracker) {
            this.showToLogData = true
            this.tracker = tracker
        },
        cancelPopUp: function () {
            this.showToAddTracker = false;
            this.showToUpdateTracker = false;
            this.showToLogData = false;
        },
        getAllTrackers: async function () {
            const trackers = await fetchFunction({
                url: 'http://127.0.0.1:8080/tracker',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                },
                authTokenReq: true
            })
            if (trackers) {
                this.trackerArray = trackers
                this.gotDataFromServer = true
            }
        },
        seeTrackerDetails: function () {
            this.$router.push({ name: 'trackerDetails', params: { id: this.tId } })
        },
        //Consolidated tracker and log report in 1 pdf
        async getConsolidatedReport() {
            this.fetchingConsolidatedReport = true
            this.ErrorMsg = "File is being processed. Please wait."
            const response = await fetch(
                'http://127.0.0.1:8080/mixed/report',
                {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Authentication-token': this.$store.getters.token,
                    },
                    method: 'GET',
                },
            )
            if (response.ok) {
                const data = await response.blob().catch(() => {
                    this.ErrorMsg = "Unexpected Respone"
                    throw new Error("Unexpected Respone")
                })
                if (data) {
                    this.fetchingConsolidatedReport = false
                    this.ErrorMsg = ""
                    var url = window.URL.createObjectURL(data);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "consolidated_Report.pdf";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();
                }
            }
            else {
                this.fetchingConsolidatedReport = false
                this.ErrorMsg = "Bad request."
                throw new Error("BAD Request")
            }
        },
        //Getting reports in PDF formats
        async getTrackerReport() {
            this.ErrorMsg = "File is being processed. Please wait."
            this.fetchingTrackerReport = true
            const response = await fetch(
                'http://127.0.0.1:8080/tracker/report',
                {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Authentication-token': this.$store.getters.token,
                    },
                    method: 'GET',
                },
            )
            if (response.ok) {
                const data = await response.blob().catch(() => {
                    this.ErrorMsg = "Unexpected Respone"
                    throw new Error("Unexpected Respone")
                })
                if (data) {
                    this.ErrorMsg = ""
                    this.fetchingTrackerReport = false
                    var url = window.URL.createObjectURL(data);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "tracker_Report.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            }
            else {
                this.fetchingTrackerReport = false
                this.ErrorMsg = "Bad request."
                throw new Error("BAD Request")
            }
        },
        async getLogReport() {
            this.ErrorMsg = "File is being processed. Please wait."
            this.fetchingLogReport = true
            const response = await fetch(
                'http://127.0.0.1:8080/log/report',
                {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Authentication-token': this.$store.getters.token,
                    },
                    method: 'GET',
                },
            )
            if (response.ok) {
                const data = await response.blob().catch(() => {
                    throw new Error("Unexpected Respone")
                })
                if (data) {
                    this.ErrorMsg = ""
                    this.fetchingLogReport = false
                    var url = window.URL.createObjectURL(data);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "Log_Report.pdf";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();
                }
            }
            else {
                this.fetchingLogReport = false
                throw new Error("BAD Request")
            }
        },
        //Getting reports in CSV formats
        async getTrackerReportCSV() {
            this.ErrorMsg = "File is being processed. Please wait."
            this.fetchingTrackerReport = true
            const response = await fetch(
                'http://127.0.0.1:8080/tracker/report/csv',
                {
                    headers: {
                        'Content-Type': 'application/csv',
                        'Authentication-token': this.$store.getters.token,
                    },
                    method: 'GET',
                },
            )
            if (response.ok) {
                const data = await response.blob().catch(() => {
                    throw new Error("Unexpected Respone")
                })
                if (data) {
                    this.ErrorMsg = ""
                    this.fetchingTrackerReport = false
                    var url = window.URL.createObjectURL(data);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "tracker_Report.csv";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();
                }
            }
            else {
                this.fetchingTrackerReport = false
                throw new Error("BAD Request")
            }
        },
        async getLogReportCSV() {
            this.ErrorMsg = "File is being processed. Please wait."
            this.fetchingLogReport = true
            const response = await fetch(
                'http://127.0.0.1:8080/log/csv',
                {
                    headers: {
                        'Content-Type': 'application/csv',
                        'Authentication-token': this.$store.getters.token,
                    },
                    method: 'GET',
                },
            )
            if (response.ok) {
                const data = await response.blob().catch(() => {
                    throw new Error("Unexpected Respone")
                })
                if (data) {
                    this.ErrorMsg = ""
                    this.fetchingLogReport = false
                    var url = window.URL.createObjectURL(data);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "log_Report.csv";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();
                }
            }
            else {
                this.fetchingLogReport = false
                throw new Error("BAD Request")
            }
        }

    },
    computed: {
        latestTracker: function () {
            let latestTrackerCreationTime = null
            let latestTrackerIndex = null;
            let t1 = new Date('1790-01-01')  //just an old date to compare
            for (let i = 0; i < this.trackerArray.length; i++) {
                let d1 = new Date(this.trackerArray[i].time)
                if (d1.getTime() > t1.getTime()) {
                    latestTrackerIndex = i
                    latestTrackerCreationTime = this.trackerArray[i].time
                }
            }
            try {
                let latestTrackerName = this.trackerArray[latestTrackerIndex].name
                if (latestTrackerName) {
                    return [latestTrackerName + " Tracker", latestTrackerCreationTime]
                }
            }
            catch {
                return ["No tracker created yet", "No tracker created yet      "] //don;t remove space
            }
        }
    },
    watch: {
        searchTracker(val) {
            if (val == "") {
                this.foundTracker = ""
            }
            else {
                for (let i = 0; i < this.trackerArray.length; i++) {
                    if (this.trackerArray[i].name.toLowerCase().startsWith(val.toLowerCase()) && val.length > 0) {
                        this.tId = this.trackerArray[i].id
                        this.foundTracker = this.trackerArray[i].name
                        break
                    }
                    else {
                        this.tId = null
                        this.foundTracker = "No tracker with this name."
                    }
                }
            }
        }
    },
    mounted() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
        // Now use fetch function to fetch data with auth=true
        this.getAllTrackers();
        this.getCurrentUser();
        var t = setInterval(() => {
            let currentTime = new Date();
            let hour = currentTime.getHours();
            if (hour < 12) {
                this.greeting = "Good Morning"
            }
            else if (hour < 18) {
                this.greeting = "Good afternoon"
            }
            else {
                this.greeting = "Good Evening"
            }
        }, 100);
    },
    // beforeDestroy() {
    //     clearInterval(t)
    // }
}

export default homeComp