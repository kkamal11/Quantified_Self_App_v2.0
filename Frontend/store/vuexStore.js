import fetchFunction from "../fetchfunction.js";
import router from "../route.js"

const store = new Vuex.Store({
	state: {
		currentUser:"",
		err: '',
		showTextToGetStarted:false,
		sendingRequest: false,
		loggedIn: localStorage.getItem('token') ? true : false,
		trackerIdTogetLastValue: null,
		scrolledHeight:0
	},
	getters: {
		token(state) {
			if (state.loggedIn === true) {
				return localStorage.getItem('token')
			}
			else {
				return null
			}
		},
	},
	mutations: {
		login: function (state) {
			state.loggedIn = true;
		},
		logout(state) {
			state.loggedIn = false
		},
		getCurrentUser(state,user) {
			state.currentUser = user
		},
		sendingRequestTrue: function (state) {
			state.sendingRequest = true;
		},
		sendingRequestFalse(state) {
			state.sendingRequest = false
		},
		setError(state, err) {
			state.err = err
		},
		showTextToGetStartedFunc(state) {
			state.showTextToGetStarted = true
		}
	},
	actions: {
		async loginUser({ commit }, user) {
			commit('sendingRequestTrue')
			const data = await fetchFunction({
				url: 'http://127.0.0.1:8080/login?include_auth_token',
				init_obj: {
					headers: {
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: JSON.stringify(user),
				}
			}).catch((err) => {
				commit('setError',err)
				commit('sendingRequestFalse')
			})
			if (data == 400) {
				commit('sendingRequestFalse')
				commit('setError',"Invalid credentials")
			}
			else if (data) {
				commit('sendingRequestFalse')
				const authToken = data.response.user.authentication_token
				localStorage.setItem('token', authToken)
				commit('login')
				router.push({path: '/home'})
			}
			else {
				commit('sendingRequestFalse')
				throw new Error("No response")
			}
		},
		async logoutUser({ commit }) {
			localStorage.removeItem('token')
			commit('logout')
			router.push({ path: '/' })
		},
		async getCurrentUser({ commit }) {
            const data = await fetchFunction({
                url: 'http://127.0.0.1:8080/user',
                init_obj: {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                },
                authTokenReq: true
            })
            if (data) {
                commit('getCurrentUser',data)
            }
		},
	},
});

export default store;
