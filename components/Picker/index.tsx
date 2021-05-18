import React from 'react'
import { View, TouchableOpacity, Text, FlatList, KeyboardAvoidingView } from 'react-native'
import Modal from 'react-native-modal'
import { MaterialIcons as Icon } from '@expo/vector-icons'
import getStyles from './styles'
import { LIST_ITEM_HEIGHT, MAX_ITEM_TO_SHOW, SEARCH_BAR_HEIGHT } from './config'
import useStyles from '../../theme/useStyles'
import TextInput from '../TextInput'
import Typography from '../Typography'
import SearchBar from '../SearchBar'

interface Option {
  label: string
  value: string
  selected?: boolean
  description?: string
}

class PickerInner extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      searchKeyword: '',
      creating: false,
    }
  }

  onSearchKeywordChange = (searchKeyword: string) => this.setState({ searchKeyword })

  renderPickerItem = ({ item }: { item: Option }) => {
    const onSelect = (i: any) => {
      this.setState({ searchKeyword: '', creating: false })
      this.props.onSelect(i)
      this.props.onClose()
    }
    return item.value === 'add new' ? (
      <TouchableOpacity
        disabled={this.state.creating}
        style={this.props.styles.pickerItem}
        onPress={() => this.setState({ creating: true })}
      >
        {this.state.creating ? (
          <TextInput
            style={{ flex: 1 }}
            autoFocus
            onBlur={(e) => !e.nativeEvent.text && this.setState({ creating: false })}
            onSubmitEditing={(e) =>
              onSelect({ value: e.nativeEvent.text, label: e.nativeEvent.text })
            }
          />
        ) : (
          <Text style={{ color: this.props.theme.palette.primary }}>+ Add New</Text>
        )}
        {item.selected ? (
          <Icon name="check" size={21} color={this.props.theme.palette.primary} />
        ) : null}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={this.props.styles.pickerItem} onPress={() => onSelect(item)}>
        <View>
          <Typography type="Base">{item.label}</Typography>
          {item.description ? <Typography type="Small">{item.description}</Typography> : null}
        </View>
        {item.selected ? (
          <Icon name="check" size={21} color={this.props.theme.palette.primary} />
        ) : null}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={[
          this.props.styles.picker,
          {
            height:
              ((this.props.withDescription ? 20 : 0) + LIST_ITEM_HEIGHT) *
                Math.min(this.props.options.length, MAX_ITEM_TO_SHOW) +
              (this.props.hideSearch ? 0 : SEARCH_BAR_HEIGHT) +
              (this.props.createable ? LIST_ITEM_HEIGHT : 0) +
              this.props.theme.bottomSpace,
          },
        ]}
      >
        {!this.props.hideSearch ? (
          <View style={this.props.styles.searchContainer}>
            <SearchBar
              placeholder="Search..."
              value={this.state.searchKeyword}
              onChangeText={this.onSearchKeywordChange}
            />
          </View>
        ) : null}
        <FlatList
          data={[
            this.props.createable ? { value: 'add new', label: 'add new' } : null,
            ...this.props.options.filter((option: any) =>
              option.label.toLowerCase().includes(this.state.searchKeyword.toLowerCase())
            ),
          ].filter((a) => a)}
          keyExtractor={(item) => item.value + item.label}
          renderItem={this.renderPickerItem}
          ListFooterComponent={<View style={{ height: this.props.theme.bottomSpace }} />}
          extraData={this.state.creating}
        />
      </KeyboardAvoidingView>
    )
  }
}

interface PickerProps {
  options: Option[]
  isVisible: boolean
  onClose(): void
  onSelect(item: Option): void
}

const Picker: React.FC<PickerProps> = (props) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <Modal
      style={styles.modal}
      avoidKeyboard
      isVisible={props.isVisible}
      backdropColor={theme.palette.overlay}
      backdropOpacity={1}
      onBackdropPress={props.onClose}
      hideModalContentWhileAnimating
      useNativeDriver
    >
      <PickerInner {...props} styles={styles} theme={theme} />
    </Modal>
  )
}

export default Picker
