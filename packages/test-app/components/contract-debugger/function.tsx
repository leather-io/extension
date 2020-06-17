import React from 'react';
import { Box, Input, FormControl, FormLabel, Text, Button } from '@blockstack/ui';
import { ContractInterfaceFunction, ContractInterfaceFunctionArg } from '@blockstack/rpc-client';
import { standardPrincipalCV, deserializeCV, ClarityType } from '@blockstack/stacks-transactions';
import { getAuthOrigin, getRPCClient } from '@common/utils';
import { useConnect, ContractCallArgumentType, ContractCallArgument } from '@blockstack/connect';
import Styled from 'styled-components';

interface FunctionProps {
  func: ContractInterfaceFunction;
  contractName: string;
  contractAddress: string;
}

interface Arg extends ContractInterfaceFunctionArg {
  value: string;
}

interface FormState {
  [key: string]: Arg;
}

const TypeLabel = Styled(Text)`
  border-radius: 3px;
  background-color: #aaa;
`;

export const FunctionForm: React.FC<FunctionProps> = ({ func, contractAddress, contractName }) => {
  // return <span>{func.name}</span>;
  const [state, setState] = React.useState<FormState>({});
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const { doContractCall } = useConnect();

  React.useEffect(() => {
    const newState: FormState = {};
    func.args.forEach(arg => {
      newState[arg.name] = {
        ...arg,
        value: '',
      };
    });
    setState(newState);
  }, [func.name]);

  const args = Object.keys(state).map(argKey => {
    // console.log(argDef, state);
    const arg = state[argKey];
    const argType = typeof arg.type === 'string' ? arg.type : 'buffer';
    return (
      <FormControl key={argKey} mb={2}>
        <FormLabel>
          {arg.name}
          <TypeLabel px={1} ml={2} fontSize={0}>
            {argType}
          </TypeLabel>
        </FormLabel>
        <Input
          type="text"
          value={arg.value}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            const value = evt.target.value;
            setState(curState => ({
              ...curState,
              [argKey]: {
                ...curState[argKey],
                value: value,
              },
            }));
          }}
          textStyle="body.small"
          name={arg.name}
        />
      </FormControl>
    );

    // return <Arg arg={arg} />;
  });

  const doReadOnly = async () => {
    const funcArgs = func.args.map(arg => {
      const cv = standardPrincipalCV(state[arg.name].value);
      return cv;
    });
    const client = getRPCClient();
    const data = await client.callReadOnly({
      contractName,
      contractAddress,
      args: funcArgs,
      functionName: func.name,
    });
    console.log(data);
    const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex'));
    console.log(cv);
    if (cv.type === ClarityType.Buffer) {
      const ua = Array.from(cv.buffer);
      const str = String.fromCharCode.apply(null, ua);
      setResult(str);
      console.log(str);
    } else if (cv.type === ClarityType.Int || cv.type === ClarityType.UInt) {
      setResult(cv.value.toNumber().toString());
    } else {
      setResult(JSON.stringify(cv));
    }
  };

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    console.log(state);
    setLoading(true);
    try {
      switch (func.access) {
        case 'read_only':
          await doReadOnly();
          setLoading(false);
          break;
        case 'public':
          const authOrigin = getAuthOrigin();
          const functionArgs: ContractCallArgument[] = func.args.map(arg => {
            const type = (typeof arg.type === 'string'
              ? arg.type
              : ContractCallArgumentType.BUFFER) as ContractCallArgumentType;
            return { type, value: state[arg.name].value };
          });
          await doContractCall({
            authOrigin,
            contractAddress,
            functionName: func.name,
            functionArgs,
            contractName,
            finished: data => {
              const { txId } = data;
              console.log('finished!', data);
              setResult(`TXID ${txId}`);
              setLoading(false);
            },
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box width="100%" mb={6}>
      <Text>
        {func.name}
        <TypeLabel px={1} ml={2} fontSize={0}>
          {func.access}
        </TypeLabel>
      </Text>
      {func.access === 'private' ? (
        ''
      ) : (
        <form onSubmit={onSubmit}>
          {args}
          <Button isLoading={loading} loadingText="Loading" size="md">
            Submit
          </Button>
        </form>
      )}
      {result && <Text>Result: {result}</Text>}
    </Box>
  );
};
