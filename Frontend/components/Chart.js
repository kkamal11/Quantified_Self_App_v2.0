import fetchFunction from "../fetchfunction.js";
const barChart = {
    props: ["id", "tType"],
    template: `
    <div>
        <div v-if="tType == 'Numerical' || tType == 'Boolean'" class="mx-8 mb-28 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="hover:bg-rose-100 dark:hover:bg-gray-800 p-4 rounded-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300">
                <canvas id="barChart"></canvas>
            </div>
            <div class="hover:bg-rose-100 dark:hover:bg-gray-800 p-4 rounded-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300">
                <canvas id="lineChart"></canvas>
            </div>
        </div>
        <div v-if="tType == 'Multiple Choice'" class="flex items-center justify-center flex-col mt-4 mb-24">
            <div class="hover:bg-rose-100 dark:hover:bg-gray-800 p-4 rounded-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-125 duration-300">
                <p class="font-medium text-2xl text-center my-4">Pie Chart</p>
                <canvas id="pieChart"></canvas>
            </div>
            <div class="hover:bg-rose-100 dark:hover:bg-gray-800 mt-20 p-4 rounded-lg transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-125 duration-300">
                <p class="font-medium text-2xl text-center my-4">Polar Area Chart</p>
                <canvas id="polarChart"></canvas>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            labels1: [],
            data1: [],
            log_data: [],
            mcq_counter: {},
            mcq_backgroundColor:["rgb(255, 99, 132)"]
        }
    },
    methods: {
        barChartIt() {
            const canvas = document.getElementById("barChart");
            const ctx = canvas.getContext("2d");
            const myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: this.labels1,
                    datasets: [
                        {
                            label: "Bar Chart",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: this.data1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        },

        lineChartIt() {
            const canvas = document.getElementById("lineChart");
            const ctx = canvas.getContext("2d");
            const myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: this.labels1,
                    datasets: [
                        {
                            label: "Line Chart",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: this.data1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        },
        pieChart() {
            const canvas = document.getElementById("pieChart");
            const ctx = canvas.getContext("2d");
            const myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(this.mcq_counter),
                    datasets: [
                        {
                            label: "Pie Chart",
                            backgroundColor: this.mcq_backgroundColor,
                            data: Object.values(this.mcq_counter),
                            borderWidth:0,
                            hoverOffset: 4
                        },
                    ],
                },
            });
        },
        polarAreaChart() {
            const canvas = document.getElementById("polarChart");
            const ctx = canvas.getContext("2d");
            const myChart = new Chart(ctx, {
                type: "polarArea",
                data: {
                    labels: Object.keys(this.mcq_counter),
                    datasets: [
                        {
                            label: "Pie Chart",
                            backgroundColor: this.mcq_backgroundColor,
                            data: Object.values(this.mcq_counter),
                            borderWidth:0,
                            hoverOffset: 4
                        },
                    ],
                },
            });
        }
    },
    computed: {

    },
    async mounted() {
        const logs = await fetchFunction({
            url: `http://127.0.0.1:8080/log/${this.id}`,
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
            for (let i = 0; i < this.log_data.length; i++) {
                let time = this.log_data[i].time.slice(5, -9)
                let value = this.log_data[i].value
                if (value == 'Yes') {
                    value = 1
                }
                else if (value == 'No') {
                    value = 0
                }
                this.labels1.push(time)
                if (typeof value != 'string') {
                    this.data1.push(Number(value))
                }
                else {
                    this.data1.push(value)
                }
            }
        }


        if (this.tType == 'Multiple Choice') {
            let i = 5;
            for (const elem of this.data1) {
                if (this.mcq_counter[elem]) {
                    this.mcq_counter[elem] += 1
                }
                else {
                    this.mcq_backgroundColor.push(`rgb(${100 + i*3}, ${20 + i * 20}, ${120 + i*10})`)
                    this.mcq_counter[elem] = 1
                    i += 5
                }
            }
            this.pieChart();
            this.polarAreaChart()
        }
        else {
            this.barChartIt()
            this.lineChartIt()
        }
    },
}

export default barChart