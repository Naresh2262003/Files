import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type NewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const NewScreen: React.FC<{ publicAddress: string }> = ({ publicAddress }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');

    const navigation = useNavigation<NewScreenNavigationProp>();

    const handleSubmit = () => {
        if (amount.trim()) {
            Alert.alert('Success', `You entered: ${amount}`);
            setAmount('');
            setModalVisible(false);
            navigation.navigate('Home', { publicAddress });
        } else {
            Alert.alert('Error', 'Please enter a valid amount.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.pageTitle}>Anon. CBDC</Text> 
            <ScrollView style={styles.tabContent}>
                <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Wallet Address</Text>
                    <Text style={styles.addressText}>
                        {`${publicAddress.substring(0, 6)}...${publicAddress.substring(publicAddress.length - 4)}`}
                    </Text>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <Text style={styles.balanceAmount}>0 CBDC</Text>
                </View>
                <View style={styles.tabContent}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Unload</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    pageTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 26
    },
    addressContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    addressLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    balanceContainer: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 10,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#666',
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
});

export default NewScreen;
