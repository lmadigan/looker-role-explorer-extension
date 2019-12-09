import React from "react"
import { IRole, IUser } from "@looker/sdk"
import Select from 'react-select'
import { Flex, Box, Paragraph } from '@looker/components'
import { ExtensionContext } from "../framework/ExtensionWrapper"

interface UserSectionProps {
  user: IUser | null
  setSelectedUser: (user: IUser) => void
}

interface UserSectionState{
  selectedUser: Record<string, string | IUser | null>
  userList: IUser[]
  userOptions: Record<string, string>[]
  loadingUsers: boolean
}

class UserSection extends React.Component<UserSectionProps, UserSectionState>{
  static contextType = ExtensionContext

  constructor(props: UserSectionProps ) {
    super(props)
    this.state = {
      userList: [],
      selectedUser: { value: null },
      loadingUsers: false,
      userOptions: []
    }
  }

  componentDidMount() {
    this.loadUsersInitial()
  }

  async loadUsersInitial() {
    this.setState({ loadingUsers: true })
    try {
      var users = await this.context.coreSDK.ok(this.context.coreSDK.all_users('display_name', 1, 15))
      let userOptions = this.createUserOptions(users)
      this.setState({
        userList: users, 
        loadingUsers: false, 
        userOptions: userOptions
      })
    } catch (err) {
      this.setState({
        userList: [], 
        selectedUser: { value: null },
        loadingUsers: false, 
      })
    }
  }

  async searchUsersByName(name: string) {
    try {
      var users = await this.context.coreSDK.ok(this.context.coreSDK.search_users_names({pattern: name }))
      let userOptions = this.createUserOptions(users)
      this.setState({
        userList: users, 
        userOptions: userOptions
      })
    } catch (err) {
      this.setState({
        userList: [], 
        selectedUser: { value: null },
      })
    }
  }

  createUserOptions(users: IUser[]) {
    let userOptions = new Array(users.length)
    for (let i in users ) {
      userOptions[i] = { 
        value: users[i].display_name, 
        label: users[i].display_name, 
        email: users[i].email, 
        avatar: users[i].avatar_url
     }
    }
    return userOptions
  }

  onSelectUser(userOption: Record<string, string>) {
    const { userList } = this.state 
    this.setState({
      selectedUser: userOption
    })
    let user = userList.filter(user => user.display_name === userOption.value)
    this.props.setSelectedUser(user[0])
  }

  onInputChange(value: any) {
    if (value.length) {
      let val = `${value}%`
      this.searchUsersByName(val)
    }
  }

  formatOptionLabel(option: any) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
      <div>{option.label}</div>
      <div style={{ color: "#ccc", fontSize: '10px'}}>
        {option.email}
      </div>
    </div>
    )
  }

  userDropDown() {
    const { selectedUser, userOptions } = this.state
    return (
      <Box width='350px'>
        <Select
          options={userOptions}
          value={selectedUser}
          onChange={(selectedUser: any) => this.onSelectUser(selectedUser)}
          placeholder={{value:"Search for a user"}}
          onInputChange={(value: any) => this.onInputChange(value)}
          formatOptionLabel={this.formatOptionLabel}
        />
      </Box>
    )
  }

  render() {
    const { user } = this.props
    return (
      <Flex flexDirection='column'>
        <Box mb='xlarge'>
          <Paragraph fontSize='large' color='palette.charcoal500'>User</Paragraph>
          { this.userDropDown() }
        </Box>
      </Flex>
    )
  }
}

export default UserSection;