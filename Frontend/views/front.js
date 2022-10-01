import services from "../components/services.js"

const front = {
    template: `
    <div class="text-lg">
        <div class="grid md:grid-cols-2 dark:text-fuchsia-50">
            <div class="flex items-center justify-center m-8 md:mx-0 md:ml-20 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300">
                <img src="./assets/images/frontPage.jpg" class="rounded-xl opacity-90 dark:opacity-70 -rotate-6 shadow-2xl shadow-gray-500" alt="image">
            </div>
            <div class="mb-12">
                <router-view></router-view>
            </div>
        </div>
        <services class="md:mt-0" />
    </div>`,
    data: function () {
        return {

        }
    },
    components: {
        services:services
    },
    method: {
        
    }
}

export default front