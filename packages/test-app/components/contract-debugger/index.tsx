import React from 'react';
import { Flex, Box, Input, Button, FormControl, FormLabel, Text } from '@blockstack/ui';
import { fetchContractInterface, ContractInterface } from '@blockstack/rpc-client';
import { useFormik } from 'formik';
import { Function } from './function';

const initialValues = {
  contractName: 'status',
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
};

export const ContractDebugger: React.FC = () => {
  const [contractInterface, setContractInterface] = React.useState<ContractInterface | null>(null);
  const [loading, setLoading] = React.useState(false);
  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      console.log(values);
      const { contractName, contractAddress } = values;
      setLoading(true);
      // saveAuthRequest(values.contractName);
      const contractInterface = await fetchContractInterface({
        contractName,
        contractAddress,
      });
      setContractInterface(contractInterface);
      setLoading(false);
      console.log(contractInterface);
    },
  });

  const getInterfaceView = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }
    if (!contractInterface) {
      return null;
    }
    const funcs = contractInterface.functions.map(func => {
      return (
        <Function
          func={func}
          contractName={formik.values.contractName}
          contractAddress={formik.values.contractAddress}
          key={func.name}
        />
      );
    });
    return funcs;
  };

  return (
    <Flex wrap="wrap">
      <Box width="50%" p={5}>
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
          <Button mt={4}>Submit</Button>
        </form>
      </Box>
      <Box width="50%">{getInterfaceView()}</Box>
    </Flex>
  );
};
