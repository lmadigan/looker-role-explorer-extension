import React from "react"
import { IRole } from "@looker/sdk"
import { Flex, Box, Heading, Text } from '@looker/components'
import { ExtensionContext } from "../framework/ExtensionWrapper"

interface RoleSectionProps {
  roles?: IRole[]
}

export const RoleSection: React.FunctionComponent<RoleSectionProps> = ({
  roles
}) => { 
  return (
    <Flex flexDirection='column'>
      {
        roles ? 
        <>
          <Heading as="h3">{roles.length} Roles</Heading>
            <Flex flexDirection='column'>
              {
                roles.map(role => <Text>{role.name}</Text>)
              }
              
            </Flex>

        </> : ''
      }
    </Flex>  
  )
}