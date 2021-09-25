import ReactSelect from 'react-select';

export interface valueLabel {
  value: string;
  label: string;
}
interface ownProps {
  options: valueLabel[];
  placeholder?: string;
  menuIsOpen?: boolean;
  onChange?: any;
  value?: valueLabel | null;
  isMulti?: boolean;
  disabled?: boolean;
  width?: string;
  isSearchable?: boolean;
}

const Select = (props: ownProps): JSX.Element => {
  const {
    options,
    placeholder,
    menuIsOpen,
    onChange,
    value,
    isMulti,
    disabled,
    isSearchable,
  } = props;

  const renderValues = (value: any) => {
    if (isMulti) {
      return value;
    }
  };

  return (
    <ReactSelect
      options={options}
      classNamePrefix={'react-select'}
      placeholder={placeholder}
      menuIsOpen={menuIsOpen}
      onChange={onChange}
      value={renderValues(value)}
      isMulti={isMulti || false}
      isDisabled={disabled}
      isSearchable={isSearchable || false}
    />
  );
};

export default Select;
