import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch data in real-time
  useEffect(() => {
    const ref = database().ref('/users');

    const onValueChange = ref.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setUsers(formatted);
      } else {
        setUsers([]);
      }
    });

    // Cleanup listener
    return () => ref.off('value', onValueChange);
  }, []);

  // Add user
  const addUser = () => {
    if (!name || !age) {
      alert('Please enter name and age');
      return;
    }

    const newRef = database().ref('/users').push();
    newRef
      .set({
        name,
        age,
      })
      .then(() => {
        setName('');
        setAge('');
      });
  };

  // Update user
  const updateUser = id => {
    database()
      .ref(`/users/${id}`)
      .update({
        age: parseInt(age) || 0,
      })
      .then(() => alert('User updated!'));
  };

  // Delete user
  const deleteUser = id => {
    database()
      .ref(`/users/${id}`)
      .remove()
      .then(() => alert('User deleted!'));
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.text}>
        👤 {item.name} — Age: {item.age}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => updateUser(item.id)}
          style={styles.updateBtn}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteUser(item.id)}
          style={styles.deleteBtn}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Realtime Database</Text>

      <TextInput
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Add User" onPress={addUser} />

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  text: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  updateBtn: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#FF4C4C',
    padding: 8,
    borderRadius: 5,
  },
  btnText: {
    color: '#FFF',
  },
});
