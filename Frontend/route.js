import signUpForm from "./views/signUp.js"
import signInForm from "./views/signIn.js"
import front from "./views/front.js";
import homeComp from "./components/homeComp.js";
import trackerDetail from "./components/trackerDetails.js";
import FAQ from "./components/FAQ.js";
import myAccount from "./components/myAccount.js";
import gChat from "./components/gChat.js";
import services from "./components/services.js"
import error from "./components/error.js";

const routes = [
    {
        path: "/", name: 'front', component: front,
        children: [
            { path: '', name: 'signin', component: signInForm },
            { path: '/signup', name: 'signup', component: signUpForm },
        ]
    },
    {
        path: '/home',
        name:'home',
        component: homeComp,
    },
    {
        path:"/tracker/:id", name:"trackerDetails", component:trackerDetail
    },
    {
        path:"/faq", name:"faq", component:FAQ
    },
    {
        path:'/services', name:"services", component:services
    },
    {
        path:"/myAccount", name:"myAccount", component:myAccount
    },
    {
        path:"/gchat", name:"gchat", component:gChat
    },
    {
        path:'*', name:'route-error', component:error
    },
    
]

const router = new VueRouter({
    routes,
    base: "/"
});

export default router;