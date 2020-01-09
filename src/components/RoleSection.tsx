import React from "react"
import { IRole, } from "@looker/sdk"
import { Flex, Paragraph } from '@looker/components'

interface RoleSectionProps {
  roles?: IRole[]
}

class  RoleSection extends React.Component<RoleSectionProps> {
  render() {
    const { roles } = this.props
    return (
      <Flex flexDirection='column' mr='xxxxlarge'>
        {
          roles ? 
          <>
            <Paragraph mb='large' fontSize='medium'  color='palette.charcoal900' fontWeight='semiBold'>Roles</Paragraph>
              <Flex flexDirection='column'>
                {
                  roles.map(role => <Paragraph key={role.id} fontSize='small'>{role.name}</Paragraph>)
                }
              </Flex>
  
          </> : ''
        }
      </Flex>  
    )
  }
}

export default RoleSection;
