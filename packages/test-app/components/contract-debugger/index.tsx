import React from 'react';
import { Flex, Box, Input, Button, FormControl, FormLabel } from '@blockstack/ui';
import { ContractInterface } from '@blockstack/rpc-client';
import { useFormik } from 'formik';
import { FunctionForm } from './function';
import { getRPCClient } from '@common/utils';
import { TabbedCard, Tab } from '@components/tabbed-card';

const initialValues = {
  contractName: 'status',
  contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
};

export const ContractDebugger: React.FC = () => {
  const [contractInterface, setContractInterface] = React.useState<ContractInterface | null>(null);
  const [contractSource, setContractSource] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      console.log(values);
      const { contractName, contractAddress } = values;
      setLoading(true);
      // saveAuthRequest(values.contractName);
      const client = getRPCClient();
      const [contractInterface, contractSource] = await Promise.all([
        client.fetchContractInterface({
          contractName,
          contractAddress,
        }),
        client.fetchContractSource({
          contractName,
          contractAddress,
        }),
      ]);
      setContractSource(contractSource || '');
      setContractInterface(contractInterface);
      setLoading(false);
      console.log(contractInterface);
    },
  });

  const getInterfaceView = () => {
    if (!contractInterface) {
      return null;
    }
    const funcs = contractInterface.functions.map(func => {
      return (
        <FunctionForm
          func={func}
          contractName={formik.values.contractName}
          contractAddress={formik.values.contractAddress}
          key={func.name}
        />
      );
    });
    return funcs;
  };

  const tabs: Tab[] = [
    {
      title: 'Interface',
      content: getInterfaceView(),
      key: 'interface',
    },
    {
      title: 'Source',
      content: (
        <Box whiteSpace="pre" overflow="scroll" maxHeight="600px">
          {contractSource}
        </Box>
      ),
      key: 'source',
    },
  ];

  return (
    <Flex wrap="wrap">
      <Box width="50%">
        <form onSubmit={formik.handleSubmit}>
          <FormControl my={4}>
            <FormLabel>Contract Address</FormLabel>
            <Input
              type="text"
              value={formik.values.contractAddress}
              onChange={formik.handleChange}
              textStyle="body.small"
              name="contractAddress"
              placeholder="i.e. SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB"
            />
          </FormControl>
          <FormControl my={4}>
            <FormLabel>Contract Name</FormLabel>
            <Input
              type="text"
              value={formik.values.contractName}
              onChange={formik.handleChange}
              textStyle="body.small"
              name="contractName"
              placeholder="i.e. my-token"
            />
          </FormControl>
          <Button mt={4} isLoading={loading} loadingText="Fetching Interface">
            Submit
          </Button>
        </form>
      </Box>
      {contractInterface && (
        <Box width="50%" px={3}>
          <TabbedCard tabs={tabs} />
        </Box>
      )}
    </Flex>
  );
};
