import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFail = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFail(data.error_msg)
    }
  }

  onChangeUser = event => {
    this.setState({username: event.target.value})
  }

  onChangePass = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, errorMsg} = this.state

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={this.onChangeUser}
            className="input-field"
            placeholder="henry"
          />

          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={this.onChangePass}
            className="input-field"
            placeholder="henry_the_developer"
          />

          <button type="submit" className="login-button">
            Login
          </button>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
