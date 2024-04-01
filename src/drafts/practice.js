
function onionMiddle(...middles) {
    return (next) => {
        let index = - 1
        function dispatch(i) {
            if(i <= index) {
                throw new Error('called multiple time')
            }
            index = i
            let fn = middles[i]
            if(i === middles.length) fn = next
            if(!fn) return 
            return fn(() => dispatch(i + 1))
        }
        return dispatch(0);
    }
}