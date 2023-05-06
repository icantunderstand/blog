import ReactGA from "react-ga4";

let sendHomePagePvFlag = false

ReactGA.initialize("G-Q5Q946VQJF");

export const sendHomePv = () => {
    if(!sendHomePagePvFlag) {
        sendHomePagePvFlag = true
        ReactGA.send({ hitType: 'pageview', path: 'home' })
    }
}


export const sendPagePv = () => {
    const path = window.location.pathname
    ReactGA.send({ hitType: 'pageview', path })

}



