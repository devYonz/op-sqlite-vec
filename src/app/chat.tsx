import React, { useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Chat() {
  const [inputVal, setInputVal] = React.useState("Enter Text");

const [mockMessages, setMockMessages] = React.useState([
  { id: "1", text: "Hello!", sender: "user" },
  { id: "2", text: "Hi there!", sender: "bot" },
  { id: "3", text: "How can I help you today?", sender: "bot" }
]);
const idx = mockMessages.length;
useEffect(() => {
  // Initialize the db


}, [])


  return (
      <View className='flex-1 bg-black p-12'>
        <FlatList
          className='flex-1'
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`p-2 mb-2 rounded ${
                item.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
              }`}>
              <Text className='text-white'>{item.text}</Text>
            </View>
          )}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}>
          <View className='flex-row items-center p-2 bg-black'>
            <TextInput
              className='flex-1 p-2 mr-2 border border-gray-300 rounded-lg bg-white'
              placeholder='Type your message here...'
              value={inputVal}
              onChangeText={(text) => setInputVal(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setMockMessages([...mockMessages, { id: String(mockMessages.length + 1), text: "New message", sender: "user" }]);
              }}
              className='bg-blue-500 p-2 rounded-full'>
              <Ionicons name='send' size={24} color='white' />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

  );
}