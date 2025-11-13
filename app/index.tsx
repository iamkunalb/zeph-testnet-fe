import { colors } from "@/constants/theme";
import React from "react";
import { View } from "react-native";




export default function Index() {
  // const { address, chainId, isConnected } = useAppKitAccount();

  // const { walletProvider } = useAppKitProvider();

  // const { open, close } = useAppKit()
  // const { walletInfo } = useWalletInfo();

    // useEffect(() => {
    //       setTimeout(() => {
    //           router.replace('/welcome')
    //       }, 500) 
    //   }, [])

    // if (!walletInfo) {
    //   return <Text>No wallet connected or info unavailable.</Text>;
    // }

    // if (!isConnected) {
    //   return <Text>Disconnected. Please connect your wallet.</Text>;
    // }

    // async function onSignMessage() {
    //   const ethersProvider = new BrowserProvider(walletProvider as any);
    //   const signer = await ethersProvider.getSigner();
    //   // const message = "hello appkit rn + ethers";
    //   // const signature = await signer.signMessage(message);
    //   console.log(signer);
    // }


  return (  
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral900
      }}
    >
      {/* <AppKitButton />
      <View>
        <Text>Wallet Name: {walletInfo.url}</Text>
        <Text>Wallet Icon: {walletInfo.description}</Text>
      </View>
      <Button title="Open Account View" onPress={() => open({ view: 'Account' })} />
      <View>
        <Text>Connected Account (Ethers):</Text>
        <Text>Address: {address}</Text>
        <Text>Chain ID: {chainId}</Text>
      </View>
      <Button title="Open Account View" onPress={() => onSignMessage()}/>; */}
    </View>
  );
}
