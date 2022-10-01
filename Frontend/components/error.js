const error = {
    props:['error'],
    template: `
    <div class="h-screen flex items-center justify-center flex-col">
        <img src="./assets/images/error.png" alt="error image" />
        <p class="text-2xl font-medium mb-4">Oops! Error: {{error}}</p>
        <button @click="gofront" class=" text-yellow-50 p-2 bg-blue-500 dark:bg-gray-800 rounded-md hover:bg-gray-600 dark:hover:bg-gray-600">Back to Home</button>
    </div>`,

    methods: {
        gofront: function () {
            this.$router.push({path:"/"})
        }
    }
}

export default error