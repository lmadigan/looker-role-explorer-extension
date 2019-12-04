import React from "react";
import { IPermission, IModelSet, IRole } from "@looker/sdk";
import { Flex, Box, Heading, Text, Paragraph } from "@looker/components";
import { ExtensionContext } from "../framework/ExtensionWrapper";
import {
  getModelPermissions,
  getInstancePermissions,
  getUniquePermissions,
  distinct
} from "../util/permissions";
interface InstancePermissionProps {
  roles?: IRole[];
}
interface InstancePermissionState {
  instancePermissions: Record<string, string>[];
}
class InstancePermissions extends React.Component<
  InstancePermissionProps,
  InstancePermissionState
> {
  constructor(props: InstancePermissionProps) {
    super(props);
    this.state = {
      instancePermissions: []
    };
  }
  componentDidMount() {
    const instancePermissions = this.getInstancePermissions();
    this.setState({
      instancePermissions: instancePermissions
    });
  }
  componentDidUpdate(
    prevProps: InstancePermissionProps,
    prevState: InstancePermissionState
  ) {
    if (prevProps.roles !== this.props.roles) {
      const instancePermissions = this.getInstancePermissions();
      this.setState({
        instancePermissions: instancePermissions
      });
    }
  }
  getInstancePermissions() {
    const { roles } = this.props;
    let newPermissions: Record<string, string>[] = [];
    if (roles) {
      for (let role of roles) {
        const instancePerms = this.getInstancePermissionsForRole(role);
        newPermissions = instancePerms.concat(newPermissions).filter(distinct);
      }
    }
    return newPermissions;
  }
  getInstancePermissionsForRole(role: IRole) {
    let permissions: Record<string, string>[] = [];
    if (role.permission_set && role.permission_set.permissions) {
      permissions = getInstancePermissions(role.permission_set.permissions);
    }
    return permissions;
  }
  eachCategories = (list: any) =>
    list.map((permission: any, index: any) => (
      <Paragraph key={index} fontSize="small">
        {permission}
      </Paragraph>
    ));
  instancePermissionsList = (instancePermissions: any) => {
    const finalList: any = {};
    instancePermissions.map((permission: Record<string, string>) => {
      if (finalList[permission.category]) {
        finalList[permission.category].push(permission.value);
      } else {
        finalList[permission.category] = [permission.value];
      }
    });
    let arr = [];
    for (const category in finalList) {
      arr.push(
        <div key={category}>
          <Paragraph fontWeight="bold" fontSize="medium">
            {category}
          </Paragraph>
          {this.eachCategories(finalList[category])}
        </div>
      );
    }
    return arr;
  };
  render() {
    const { instancePermissions } = this.state;
    const list: any = this.instancePermissionsList(instancePermissions);
    return (
      <Flex flexDirection="column" mr="xxxlarge">
        <Paragraph fontSize="medium" mb="large" color="palette.charcoal600">
          Instance Permissions
        </Paragraph>
        {list}
      </Flex>
    );
  }
}
export default InstancePermissions;