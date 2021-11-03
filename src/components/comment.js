import React, { PureComponent } from 'react'

const containerStyle = {
  width: 700,
  margin: '0 auto',
}

export default class Comment extends PureComponent {
    constructor(props) {
        super(props)
        this._commentRef = React.createRef()
    }
    async componentDidMount() {
        if (typeof window === "undefined") {
            return
          }
          if(!this._commentRef.current) {
            return
          }
          const Valine= await(await import('valine')).default
          this._valine = new Valine({
            el: this._commentRef.current, // 如果是用id定位<div>，则这里填入id
            appId: "5UvRKnJtRpFNVsjwkIYxayN9-gzGzoHsz",
            appKey: "07PG3nQyrsrJCDmjzEUgy2R9",
            path: window.location.pathname
          })
    }
    render() {
    return <div style={containerStyle} id="vcomment" ref={this._commentRef} />
    }
}