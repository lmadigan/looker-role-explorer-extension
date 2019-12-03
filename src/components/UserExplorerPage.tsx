import React from "react"
import { IRole, IUser } from "@looker/sdk"
import { Flex, Box, Spinner, theme } from '@looker/components'
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom"
import styled, { ThemeProvider } from 'styled-components'
import { ExtensionContext } from "../framework/ExtensionWrapper"
import { UserSection } from "./UserSection"

interface UserExplorerPageState {
  userId?: number, 
  loadingUser: boolean, 
  errorMessage?: string, 
  user?: IUser, 
  roles?: IRole[],
}

class UserExplorerPage extends React.Component<RouteComponentProps, UserExplorerPageState> {
  static contextType = ExtensionContext

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      userId: 4,
      loadingUser: false,
      roles: []
    }
  }

  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    this.setState({ loadingUser: true })
    this.state.userId && this.loadUser(this.state.userId)
    this.state.userId && this.loadUserRoles(this.state.userId)
    this.setState({ loadingUser: false })
  }
  async loadUser(userId: number) {
    this.setState({ loadingUser: true })
    try {
      var user = await this.context.coreSDK.ok(this.context.coreSDK.user(userId))
      this.setState({
        user: user, 
        loadingUser: false
      })

    } catch (err) {
      this.setState({
        user: {}, 
        loadingUser: false, 
        errorMessage: "Error loading user"
      })
    }
  }

  async loadUserRoles(userId: number) {
    try {
      var roles = await this.context.coreSDK.ok(this.context.coreSDK.user_roles(userId))
      this.setState({
        roles: roles,
      })
    } catch (err) {
      this.setState({
        roles: [], 
        errorMessage: "Error loading user roles"
      })
    }
  }



  render() {
    const { user, roles } = this.state
    console.log(this.state)
    return (
      <ThemeProvider theme={theme}>
        <Flex>
          { user ? 
            <UserSection user={user} roles={roles}/> : 
            <Spinner />
          }
        </Flex>
      </ThemeProvider>
    )
   
  }
}

export const UserExplorePage = withRouter(UserExplorerPage)
