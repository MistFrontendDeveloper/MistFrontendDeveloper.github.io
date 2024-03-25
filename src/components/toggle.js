import "./toggle.css"

import React, { PureComponent } from "react"

function pointerCoord(event) {
  if (event) {
    const changedTouches = event.changedTouches
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0]
      return { x: touch.clientX, y: touch.clientY }
    }
    const pageX = event.pageX
    if (pageX !== undefined) {
      return { x: pageX, y: event.pageY }
    }
  }
  return { x: 0, y: 0 }
}

export default class Toggle extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ("checked" in nextProps) {
      return {
        checked: !!nextProps.checked,
        previouslyChecked: !!nextProps.checked,
      }
    }
    return prevState
  }

  state = {
    checked: !!(this.props.checked || this.props.defaultChecked),
    hasFocus: false,
    previouslyChecked: !!(this.props.checked || this.props.defaultChecked),
  }

  handleClick = event => {
    const checkbox = this.input
    this.state.previouslyChecked = checkbox.checked
    if (event.target !== checkbox && !this.moved) {
      event.preventDefault()
      checkbox.focus()
      checkbox.click()
      return
    }

    this.setState({ checked: checkbox.checked })
  }

  handleTouchStart = event => {
    this.startX = pointerCoord(event).x
    this.touchStarted = true
    this.hadFocusAtTouchStart = this.state.hasFocus
    this.setState({ hasFocus: true })
  }

  handleTouchMove = event => {
    if (!this.touchStarted) return
    this.touchMoved = true

    if (this.startX != null) {
      let currentX = pointerCoord(event).x
      if (this.state.checked && currentX + 15 < this.startX) {
        this.setState({ checked: false })
        this.startX = currentX
      } else if (!this.state.checked && currentX - 15 > this.startX) {
        this.setState({ checked: true })
        this.startX = currentX
      }
    }
  }

  handleTouchEnd = event => {
    if (!this.touchMoved) return
    const checkbox = this.input
    event.preventDefault()

    if (this.startX != null) {
      if (this.state.previouslyChecked !== this.state.checked) {
        checkbox.click()
      }

      this.touchStarted = false
      this.startX = null
      this.touchMoved = false
    }

    if (!this.hadFocusAtTouchStart) {
      this.setState({ hasFocus: false })
    }
  }

  handleTouchCancel = () => {
    if (this.startX != null) {
      this.touchStarted = false
      this.startX = null
      this.touchMoved = false
    }

    if (!this.hadFocusAtTouchStart) {
      this.setState({ hasFocus: false })
    }
  }

  handleFocus = event => {
    const { onFocus } = this.props

    if (onFocus) {
      onFocus(event)
    }

    this.hadFocusAtTouchStart = true
    this.setState({ hasFocus: true })
  }

  handleBlur = event => {
    const { onBlur } = this.props

    if (onBlur) {
      onBlur(event)
    }

    this.hadFocusAtTouchStart = false
    this.setState({ hasFocus: false })
  }

  getIcon(type) {
    const { icons } = this.props
    if (!icons) {
      return null
    }
    return icons[type] === undefined
      ? Toggle.defaultProps.icons[type]
      : icons[type]
  }

  render() {
    const { className, icons: _icons, ...inputProps } = this.props
    const classes =
      "react-toggle" +
      (this.state.checked ? " react-toggle--checked" : "") +
      (this.state.hasFocus ? " react-toggle--focus" : "") +
      (this.props.disabled ? " react-toggle--disabled" : "") +
      (className ? " " + className : "")
    return (
      <div
        className={classes}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchCancel}
      >
        <div className="react-toggle-track">
          <div className="react-toggle-track-check">
            {this.getIcon("checked")}
          </div>
          <div className="react-toggle-track-x">
            {this.getIcon("unchecked")}
          </div>
        </div>
        <div className="react-toggle-thumb" />

        <input
          {...inputProps}
          ref={ref => {
            this.input = ref
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="react-toggle-screenreader-only"
          type="checkbox"
          aria-label="Switch between Dark and Light mode"
        />
      </div>
    )
  }
}