import { Modal } from 'antd';
import { success } from '../components/Message';

const filterOutUndefined = (array) => {
  return array.filter(item => item !== undefined);
};

const hasDuplicates = (array, setPoll, setValidateOptions) => {
  const newArray = array.map(item => {
    return item.trim().toLowerCase();
  });
  const duplicate = (new Set(newArray)).size !== newArray.length;
  if (duplicate) {
    Modal.error({
      title: 'Error',
      content: 'Options must be unique. Please check the given options and remove duplicated values.',
      onOk() {
        setPoll(undefined);
        setValidateOptions(false);
      }
    });
  } else {
    success('Poll is valid!');
  }
};

export const validate = (form, setPoll, setValidateOptions) => {
  const values = form.getFieldsValue();

  const answers = values.answers ? filterOutUndefined(values.answers) : null;

  const additionalOptions = answers && answers.length > 0 ? answers.map(item => item.option.trim()) : null;

  const filteredAdditionalOptions = additionalOptions ? additionalOptions.filter(item => item !== '') : null;

  let options = [values.first, values.second];

  if (filteredAdditionalOptions) {
    filteredAdditionalOptions.map(item => options.push(item));
  }

  if (options && options.length >= 2) {
    const noDuplicates = !hasDuplicates(options, setPoll, setValidateOptions);
    if (noDuplicates) {
      setValidateOptions(true);
      setPoll({ question: values.question, options: options });
    }
  }
};
