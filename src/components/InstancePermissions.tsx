import React from "react"
import { IPermission, IModelSet, IRole, } from "@looker/sdk"
import { Flex, Box, Heading, Text, Paragraph } from '@looker/components'
import { ExtensionContext } from "../framework/ExtensionWrapper"
import { getInstancePermissions, distinct, filterPermissionsForCategory } from '../util/permissions'

interface InstancePermissionProps {
  roles?: IRole[]
}

interface InstancePermissionState {
  instancePermissions: string[]
}

class  InstancePermissions extends React.Component<InstancePermissionProps, InstancePermissionState> {
  constructor(props: InstancePermissionProps) {
    super(props)
    this.state = {
      instancePermissions: []
    }
  }

  componentDidMount() {
    const instancePermissiosn = this.getInstancePermissions()
    this.setState({
      instancePermissions: instancePermissiosn
    })
  }
 
  componentDidUpdate(prevProps: InstancePermissionProps, prevState: InstancePermissionState) {
    if ( prevProps.roles !== this.props.roles ) {
      const instancePermissiosn = this.getInstancePermissions()
      this.setState({
        instancePermissions: instancePermissiosn
      })
    }
  }
 
  getInstancePermissions() {
    const { roles } = this.props 
    let newPermissions: string[] = []
    if ( roles ) {
      for ( let role of roles ) {
        const instancePerms = this.getInstancePermissionsForRole(role)
        newPermissions = instancePerms.concat(newPermissions).filter(distinct)
      }
    }
    return newPermissions
  }

  getInstancePermissionsForRole(role: IRole) {
    let permissions: string[] = []
    if (role.permission_set && role.permission_set.permissions) {
      permissions = getInstancePermissions(role.permission_set.permissions)
    } 
    return permissions
  }

  categorize(perms: string[], category: string) {
    const list = filterPermissionsForCategory(perms, category)
    if (list.length === 0 ) { return '' }
    return (
      <Flex flexDirection='column' mb='xlarge'>
        <Text color='palette.charcoal500' textTransform="uppercase" fontSize="small" mb='small'>{category}</Text>
        {
          list.map((perm: string, ind: number) => {
          return <Paragraph key={ind} fontSize='small'>{perm}</Paragraph>
          })
        }
      </Flex>
    )
  }

  render() {
    const { instancePermissions } = this.state
    return (
      <Flex flexDirection='column' mr='xxxxlarge'>
        <Paragraph fontSize='medium' mb='large' color='palette.charcoal900' fontWeight='semiBold'>Instance Permissions</Paragraph>
        {this.categorize(instancePermissions, "Admin")}
        {this.categorize(instancePermissions, "Data Access")}
        {this.categorize(instancePermissions, "BI Interaction")}
        {this.categorize(instancePermissions, "Development Tools")}
      </Flex> 
    )
  }
}

export default InstancePermissions;
