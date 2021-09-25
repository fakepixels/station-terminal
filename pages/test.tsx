import { useState } from 'react';
import Button from '../components/shared/Button';
import Select from '../components/shared/Select';
import Input from '../components/shared/Input/Index';

const sampleOptions = [
  {
    value: 'Brah',
    label: 'Brah brah',
  },
];

const Test = (): JSX.Element => {
  const [inputVal, setInputVal] = useState('');

  return (
    <div>
      <div>Test page used for testing components</div>
      <br />
      <Button
        onClick={() => {
          console.log('Brah');
        }}
      >
        Hello
      </Button>
      <br />
      <Select options={sampleOptions} />

      <br />
      <Input
        value={inputVal}
        caption={'Hello'}
        onChange={(e: any) => setInputVal(e.target.value)}
      />
    </div>
  );
};

export default Test;
