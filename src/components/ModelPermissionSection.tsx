import React from "react"
import { IRole, } from "@looker/sdk"
import { Flex, Box, Tooltip, Icon, Paragraph, List, ListItem, Text } from '@looker/components'
import Select from 'react-select';
import { getModelPermissions, getAllAccessibleModelPermissions, filterPermissionsForCategory, distinct } from '../util/permissions'
import { validatePermission } from '../util/validate'

interface ModelPermissionProps {
  roles?: IRole[]
}

interface ModelPermissionState {
  accessibleModelPerms: string[]
  modelData: Map<string, string[]>
  selectedModel: Record<string, string> | null
  modelsArray: string[]
}

class  ModelPermissionSection extends React.Component<ModelPermissionProps, ModelPermissionState> {
  constructor(props: ModelPermissionProps) {
    super(props)
    this.state = {
      accessibleModelPerms: [], 
      modelData: new Map(),
      modelsArray: [],
      selectedModel: null,
    }
  }

  componentDidMount() {
    const accessibleModelPerms = this.getAllAccessibleModelPermissions()
    const modelPermissions = this.getModelSpecificPermissions(accessibleModelPerms)
    const modelArray = this.getModelArray(modelPermissions)
    this.setState({
      accessibleModelPerms: accessibleModelPerms,
      modelData: modelPermissions, 
      modelsArray: modelArray
    })
  }

  componentDidUpdate( prevProps: ModelPermissionProps, prevState: ModelPermissionState) {
    if ( prevProps.roles !== this.props.roles ) {
      const accessibleModelPerms = this.getAllAccessibleModelPermissions()
      const modelPermissions = this.getModelSpecificPermissions(accessibleModelPerms)
      const modelArray = this.getModelArray(modelPermissions)
      this.setState({
        accessibleModelPerms: accessibleModelPerms,
        modelData: modelPermissions, 
        modelsArray: modelArray
      })
    }
  }

  getAllAccessibleModelPermissions() {
    const { roles } = this.props 
    let newPermissions: string[] = []
    if ( roles ) {
      for ( let role of roles ) {
        let perms = this.getAccessibleModelPermissionsForRole(role)
        newPermissions = perms.concat(newPermissions).filter(distinct)
      }
    }
    return newPermissions
  }

  getAccessibleModelPermissionsForRole(role: IRole) {
    let permissions: string[] = []
    if (role.permission_set && role.permission_set.permissions) {
      permissions = getAllAccessibleModelPermissions(role.permission_set.permissions)
    } 
    return permissions
  }

  getModelSpecificPermissions(accessibleModelPerms: string[]) {
    const { roles } = this.props
    let map = new Map()
    for ( let role of roles! ) {
      let modelSet = role.model_set
      let permissionSet = role.permission_set
      let models = modelSet && modelSet.models
      let permissions = permissionSet && permissionSet.permissions
      let modelPermissions = permissions && getModelPermissions(permissions)
      modelPermissions = modelPermissions && modelPermissions.concat(accessibleModelPerms)
      if ( models ) {
        for ( let model of models ) {
          if (map.has(model)) {
            let perms = map.get(model)
            const uniqPerms = modelPermissions && perms.concat(modelPermissions).filter(distinct)
            map.set(model, uniqPerms)
          } else {
            map.set(model, modelPermissions)
          }
        }
      }
    }
    return map
  }

  renderModelItem( model: string ) {
    return(
      <ListItem key={model}>
        <Paragraph fontSize='small'>{model}</Paragraph>
      </ListItem>
    )
  }

  getModelArray(modelData: Map<string, string[]>) {
    const models = modelData.keys()
    let modelArray = []
    let x = models.next().value
    while ( x ) {
      modelArray.push(x)
      x = models.next().value
    }
    return modelArray
  }

  renderModelsList() {
    const { modelsArray } = this.state
    return (
      <List  overflowY='scroll'>
        {
          modelsArray.map(model => this.renderModelItem(model))
        }
      </List>
    )
  }

  handleDropDownChange(selectedOption: any) {
    this.setState({
      selectedModel: selectedOption
    })
  }

  createModelOptions() {
    const { modelsArray } = this.state
    let options = new Array(modelsArray.length)
    for ( let i in modelsArray ) {
      options[i] = { value: modelsArray[i], label: modelsArray[i]}
    }
    return options
  }

  modelDropDownStyles() {
    return {
      option: (provided: any, state: any) => ({
        ...provided,
        fontSize: '12px',
        display: 'flex',
        flex: '0 1 auto' 
      }),
      value: (provided: any, state: any) => ({
        ...provided,
        fontSize: '12px',
        display: 'flex',
        flex: '0 1 auto' 
      }),
    }
  }

  modelDropDown() {
    const { selectedModel } = this.state
    const modelOptions = this.createModelOptions()
    return (
      <Select
        styles={this.modelDropDownStyles()}
        value={selectedModel}
        onChange={(selectedModel: any) => this.handleDropDownChange(selectedModel)}
        options={modelOptions} 
        placeholder="Model Name"
      />
    )
  }

  modelPermission(perm: string, ind: string | number | undefined, permissionSet: string[]) {
    const errorMessage = validatePermission(perm, permissionSet)
    return ( 
      <Flex ml="-20px">
        <div style={{width: '20px' }}>
        {
          errorMessage && 
          <Tooltip surfaceStyles={{backgroundColor: "white", color: "black"}} content={errorMessage} placement="left">
          {(eventHandlers, ref) => (
            <Icon ref={ref} {...eventHandlers} name="Warning" color='palette.yellow200' size={20} />
          )}
        </Tooltip>
        }
        </div>
        <Paragraph key={ind} fontSize='small'>{perm}</Paragraph>
      </Flex>
    )
  }

  renderModelPermissions() {
    const { selectedModel } = this.state 
    const modelPermissions = selectedModel && this.state.modelData.get(selectedModel.value)
    if ( !modelPermissions ) { return ''}
    return (
      <Flex flexDirection='column'>
        {this.categorize(modelPermissions, "Admin")}
        {this.categorize(modelPermissions, "Data Access")}
        {this.categorize(modelPermissions, "BI Interaction")}
        {this.categorize(modelPermissions, "Development Tools")}
      </Flex>
    )
  }

  categorize(perms: string[], category: string) {
    const list = filterPermissionsForCategory(perms, category)
    if (list.length === 0 ) { return '' }
    return (
      <Flex flexDirection='column' mb='xlarge'>
        <Text color='palette.charcoal500' textTransform="uppercase" fontSize="small" mb='small'>{category}</Text>
        {
          list.map((perm: string, ind: number) => {
          return this.modelPermission(perm, ind, perms)
          })
        }
      </Flex>
    )
  }

  render() {
    return (
      <Flex flexDirection='column'>
        <Paragraph fontSize='medium' mb='large'  color='palette.charcoal900' fontWeight='semiBold' >Model Permissions</Paragraph>
        <Box mb='large' width='300px'>
          {this.modelDropDown()}
        </Box>
        <Box>
          {this.renderModelPermissions()}
        </Box>
      </Flex> 
    )
  }
}

export default ModelPermissionSection;
