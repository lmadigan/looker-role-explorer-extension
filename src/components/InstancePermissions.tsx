import React from "react"
import { IPermission, IModelSet, IRole, } from "@looker/sdk"
import { Flex, Box, Heading, Text, Paragraph } from '@looker/components'
import { ExtensionContext } from "../framework/ExtensionWrapper"
import { getInstancePermissions, distinct } from '../util/permissions'
import { limitByRadius } from "@looker/components/dist/types/Form/Fields/FieldColor/ColorWheel/math_utils"

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
      console.log(instancePermissiosn)
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

  render() {
    const { instancePermissions } = this.state
    return (
      <Flex flexDirection='column' mr='xxxlarge'>
        <Paragraph fontSize='medium' mb='large' color='palette.charcoal600'>Instance Permissions</Paragraph>
        {
          instancePermissions.map((perm: string, ind: string | number | undefined) => {
          return <Paragraph key={ind} fontSize='small'>{perm}</Paragraph>
          })
        }
      </Flex> 
    )
  }
}

export default InstancePermissions;
