import React from "react"
import { IRole, IUser } from "@looker/sdk"
import { Flex, Box, Heading } from '@looker/components'
import { ExtensionContext } from "../framework/ExtensionWrapper"
import { RoleSection } from './RoleSection'

interface UserSectionProps {
  user: IUser, 
  roles: IRole[]
}

export const UserSection: React.FunctionComponent<UserSectionProps> = ({
  user, 
  roles
}) => (
  <Flex flexDirection='column'>
    <Heading as="h2">User Section</Heading>
    <Flex flexDirection='column'>
      <Heading as="h3">{user.display_name}</Heading>
      <RoleSection roles={roles} />
    </Flex>
  </Flex>
)