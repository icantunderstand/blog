import ReactGA from "react-ga4";

let sendHomePagePvFlag = false

ReactGA.initialize("G-Q5Q946VQJF");

export const sendHomePv = () => {
    if(!sendHomePagePvFlag) {
        console.log('发送首页pv')
        sendHomePagePvFlag = true
        ReactGA.send({ hitType: 'pageview', path: 'home' })
    }
}


export const sendPagePv = () => {
    console.log('页面pv')
    const path = window.location.pathname
    ReactGA.send({ hitType: 'pageview', path })

}