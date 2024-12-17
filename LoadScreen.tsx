import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    PanResponder,
    Alert,
    Modal,
    Animated,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';
import Icon from 'react-native-vector-icons/FontAwesome';

type NewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UnloadScreen'>;

const LoadScreen: React.FC<{ publicAddress: string }> = ({ publicAddress }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [balance, setBalance] = useState(0);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(1);
    const [imagePosition] = useState(new Animated.Value(0)); // For animating the image position

    const navigation = useNavigation<NewScreenNavigationProp>();

    const noteValues = [2, 5, 10, 20, 50, 100, 200, 500, 2000];
    const noteImages: Record<number, any> = {
        2: require('./assets/2.jpg'),
        5: require('./assets/5.jpg'),
        10: require('./assets/10.jpg'),
        20: require('./assets/20.jpg'),
        50: require('./assets/50.jpg'),
        100: require('./assets/100.jpg'),
        200: require('./assets/200.jpg'),
        500: require('./assets/500.jpg'),
        2000: require('./assets/2000.jpg'),
    };

    const selectedNote = noteValues[selectedNoteIndex];

    const showAlert = (message: string) => {
        Alert.alert('Action not allowed', message, [{ text: 'OK' }]);
    };

    const handleNextNote = () => {
        if (selectedNoteIndex < noteValues.length - 1) {
            setSelectedNoteIndex((prevIndex) => prevIndex + 1);
        } else {
            showAlert('You are already at the largest note!');
        }
    };

    const handlePreviousNote = () => {
        if (selectedNoteIndex > 0) {
            setSelectedNoteIndex((prevIndex) => prevIndex - 1);
        } else {
            showAlert('You are already at the smallest note!');
        }
    };

    const handleSubmit = () => {
        if (balance > 0) {
            Alert.alert('Success', `You entered: ₹${balance}`);
            setBalance(0);
            navigation.navigate('UnloadScreen', { publicAddress });
        } else {
            Alert.alert('Error', 'Please select an amount.');
        }
        setModalVisible(false);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
            Math.abs(gestureState.dy) > 20, // Only respond to vertical swipes
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy < -20) {
                // Swipe up
                setBalance((prevBalance) => prevBalance + selectedNote);
                Animated.timing(imagePosition, {
                    toValue: -50, // Move image up by 50 units
                    duration: 100,
                    useNativeDriver: true,
                }).start(() => {
                    // Reset position after animation
                    Animated.timing(imagePosition, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                });
            } else if (gestureState.dy > 20) {
                // Swipe down
                if (balance >= selectedNote) {
                    setBalance((prevBalance) => prevBalance - selectedNote);
                    Animated.timing(imagePosition, {
                        toValue: 50, // Move image down by 50 units
                        duration: 100,
                        useNativeDriver: true,
                    }).start(() => {
                        // Reset position after animation
                        Animated.timing(imagePosition, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true,
                        }).start();
                    });
                } else {
                    showAlert("You don't have enough balance to deduct this amount!");
                }
            }
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>Balance: ₹{balance}</Text>
            </View>

            <View style={styles.noteContainer} {...panResponder.panHandlers}>
                <Text style={styles.instruction}>Swipe up to add</Text>
                <View style={styles.noteRow}>
                    <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={handlePreviousNote}
                    >
                        <Icon name="arrow-right" size={30} color="#333" />
                    </TouchableOpacity>

                    <Animated.View style={{ transform: [{ translateY: imagePosition }] }}>
                        <Image source={noteImages[selectedNote]} style={styles.noteImage} />
                    </Animated.View>

                    <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={handleNextNote}
                    >
                        <Icon name="arrow-left" size={30} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.noteValue}>₹{selectedNote}</Text>
                <Text style={styles.instruction}>Swipe down to deduct</Text>
            </View>

            <View style={styles.loadButtonContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.loadButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.loadText}>Load</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Transferring Amount: ₹{balance}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSubmit} activeOpacity={0.8}>
                                <Text style={styles.buttonModalText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonModalText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#800080',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    balanceContainer: {
        position: 'absolute',
        top: 20,
        width: '100%',
        alignItems: 'center',
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    loadButtonContainer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    loadButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#800080',
    },
    noteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
    },
    noteRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        borderRadius: 25,
        marginHorizontal: 10,
    },
    arrowText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    noteImage: {
        height: 300,
        resizeMode: 'contain',
    },
    noteValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    instruction: {
        fontSize: 16,
        color: '#555',
        marginVertical: 10,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    modalContent: {
        width: '90%',
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonSecondary: {
        flex: 1,
        padding: 12,
        marginHorizontal: 10,
        backgroundColor: '#6c757d',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonModalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 26,
    },
});

export default LoadScreen;
