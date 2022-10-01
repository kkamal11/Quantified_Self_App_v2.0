import fetchFunction from "../fetchfunction.js"

export default {
    template: `
    <div class="text-center">
        <div class="m-12 font-medium text-xl dark:text-white">
            <p>Google Chat Space for reminder alerts.</p>
        </div>
        <div v-if="!chatLinkCreated" class="my-12">
            <p class="text-lg">Please Create a chat space and share the link here.</p>
            <p class="text-sm mb-8">Don't know how to create space, follow <span class="font-medium">Step 1</span> <a href="https://developers.google.com/chat/how-tos/webhooks" target="_blank" class="text-blue-600 hover:text-blue-800">here.</a></p>
            <label for="chat" class="pt-2 inline-block my-8">Enter Chat Space link:</label>
            <input v-model="chatlink" id="chat" type="text" class="rounded-md px-2 border-2 dark:bg-gray-600 "><br>
            <p v-if="errorMsg" class="mb-8 text-sm text-red-600">{{errorMsg}}</p>
            <button v-on:click="SendChatLink" :disabled="!chatlink" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-800">Submit Link</button>
        </div>
        <div v-if="deleteMe" class="fixed top-1/4 md:left-1/3 bg-fuchsia-200 dark:bg-gray-800 py-8 px-16 rounded-md text-center">
            <i class="fa-solid fa-hand" style="font-size:48px;color:red"></i>
            <h1 class="text-2xl font-medium text-red-600 mb-4">Delete this chat link?</h1>
            <p class="text-lg">Are you sure to delete this chat space link?</p>
            <button @click="cancelDeletePopUp" class="px-4 py-2.5 m-2 mr-8 font-medium rounded-lg text-sm bg-green-600 hover:bg-green-800 text-white">No <i class="bi bi-x-lg"></i></i></button>
            <button @click="deleteLink" class="px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Yes <i class="bi bi-check-lg"></i></button>
        </div>
        <div v-if="chatLinkCreated" class="my-12 overflow-x-auto">
            <p class="text-lg">Your active google chat space webhook link is:</p>
            <p class="text-base font-medium m-4 text-green-600">{{chatlink}}</p>
            <button @click="changeLink" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-800">Change Link <i class="fas fa-edit"></i></button>
            <button @click="showDeletePopUp" class=" px-4 py-2.5 m-2 font-medium rounded-lg text-sm bg-red-600 text-white hover:bg-red-800">Delete Link <i class="bi bi-trash3"></i></button>
            <p class="m-8">Last reminder alert status:<span class="font-medium" :class="[status ? 'text-green-600' :'','text-red-600']"> {{status ? 'Successful' : 'Unsuccessful'}}</span></p>
        </div>
    </div>`,
    data() {
        return {
            chatlink: "",
            chatLinkCreated: false,
            status: false,
            chatLinkAdded: false,
            errorMsg: "",
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
        changeLink: function () {
            this.chatlink = ""
            this.chatLinkCreated = false
        },
        SendChatLink: async function () {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/reminder/link',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        chat_link: this.chatlink
                    }),
                },
                authTokenReq: true
            })
            if (data) {
                this.chatLinkAdded = true
                this.$router.go()
            }
            else {
                throw new Error("error")
            }
        },
        getChatInfo: async function () {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/reminder/link',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                },
                authTokenReq: true
            })
            if (data) {
                if (data.chat_link) {
                    this.chatLinkAdded = true
                    this.chatLinkCreated = true
                    this.chatlink = data.chat_link
                    this.status = data.last_alert_status
                }
            }
            else {
                throw new Error("error")
            }
        },
        deleteLink: async function () {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/reminder/link',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'DELETE',
                },
                authTokenReq: true
            })
            if (data) {
                this.chatlink = ""
                this.chatLinkCreated = false
                this.$router.go()
            }
        }
    },
    watch: {
        chatlink(val) {
            if (val.length > 0 && val.includes('googleapis')) {
                this.errorMsg = ""
            }
            else if (val.length == 0) {
                this.errorMsg = ""
            }
            else {
                this.errorMsg = "Your link is not a valid Link"
            }
        }
    },
    mounted() {
        if (!this.$store.state.loggedIn) {
            this.$router.push({ path: "/" })
        }
        this.getChatInfo()
    }
}