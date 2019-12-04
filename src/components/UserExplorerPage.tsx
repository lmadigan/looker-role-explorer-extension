import React from "react"
import { IRole, IUser } from "@looker/sdk"
import { Flex, Box, Spinner, Text, theme, Paragraph} from '@looker/components'
import { RouteComponentProps, withRouter } from "react-router-dom"
import { ExtensionContext } from "../framework/ExtensionWrapper"
import UserSection from "./UserSection"
import InstancePermissions from "./InstancePermissions"
import RoleSection from './RoleSection'
import ModelPermissionSection from './ModelPermissionSection'

interface UserExplorerPageState {
  userId: number | null | undefined
  loadingUser: boolean
  errorMessage?: string
  user: IUser
  roles: IRole[]
}

class UserExplorerPage extends React.Component<RouteComponentProps, UserExplorerPageState> {
  static contextType = ExtensionContext

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      userId: null,
      loadingUser: false,
      roles: [],
      user: {}
    }
  }

  // componentDidMount() {
  //   this.initialize()
  // }

  componentDidUpdate(prevProps: RouteComponentProps, prevState: UserExplorerPageState) {
    if (this.state.userId !== prevState.userId ) {
      this.state.userId && this.loadRoles(this.state.userId)
    }
  }

  async loadRoles(userId: number) {
    try {
      var roles = await this.context.coreSDK.ok(this.context.coreSDK.user_roles({user_id: userId}))
      this.setState({
        roles: roles
      })
    } catch (err) {
      this.setState({
        loadingUser: false, 
        errorMessage: "Error loading roles"
      })
    }
  }

  setSelectedUser(user: IUser) {
    this.setState({
      userId: user.id, 
      user: user
    })
  }

  renderUserLoaded() {
    const { user, roles } = this.state
    return (
      <Flex flexDirection='column'>
          <Flex>
            <RoleSection roles={roles} />
            <InstancePermissions roles={roles}/>
            <ModelPermissionSection roles={roles} />
          </Flex> 
      </Flex>
    )
  }

  render() {
    const { userId, user, roles } = this.state
    return (
      <Flex m='xxxlarge' flexDirection='column' mr='xxxlarge'>
        <Text fontSize='xxxlarge' color='palette.charcoal900' mb='xsmall'>Role Explorer</Text>
        <Paragraph fontSize='small' color='palette.charcoal700' mb='xlarge'>Select a user to view all permission</Paragraph>
        <UserSection user={user} setSelectedUser={(user: IUser) => this.setSelectedUser(user)}/>
          { userId ? this.renderUserLoaded() : ''}
      </Flex>
        
    )
   
  }
}

export const UserExplorePage = withRouter(UserExplorerPage)
