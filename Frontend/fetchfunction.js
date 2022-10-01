import store from "./store/vuexStore.js"

async function fetchFunction({ url, init_obj, authTokenReq }) {

    if (url === undefined) {
        throw new Error("Url required")
    }
    if (init_obj === undefined) {
        init_obj = {}
    }
    if (authTokenReq === undefined) {
        authTokenReq = false
    }
    if (authTokenReq === true) {
        if (init_obj.headers === undefined) {
            init_obj.headers = {
                'Authentication-token': store.getters.token,
            }
        }
        else {
            init_obj.headers['Authentication-token'] = store.getters.token
        }
    }
    const response = await fetch(url, init_obj).catch(() => { //it fails only if there is a network error i.e the request will not reach to the server.
        throw new Error("Network Error")
    })

    if (response) {
        if (response.ok) { //to avoid errors like 404, 405
            const data = await response.json().catch(() => {
                throw new Error("Unexpected Respone") //to avoid any response other than json
            })
            if (data) {
                return data
            }
        }
        else if (response.status == 400) {
            return response.status
        }
        else if (response.status == 409) {
            return response.status
        }
        else if (response.status == 401) {
            return response.status
        }
    }
    else {
        console.log("No respone")
    }
}
export default fetchFunction