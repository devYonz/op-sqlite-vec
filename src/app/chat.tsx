import React, { useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { open } from "@op-engineering/op-sqlite";

const db = open({
  name: "chat.db",
  location: "../files/databases"
});
export default function Chat() {
  const [inputVal, setInputVal] = React.useState("");

const [mockMessages, setMockMessages] = React.useState([
  { id: "1", text: "Hello!", sender: "user" },
  { id: "2", text: "Hi there!", sender: "bot" },
  { id: "3", text: "How can I help you today?", sender: "bot" }
]);
const idx = mockMessages.length;

const handleSend = (value: string) => {
  if (inputVal.trim() === "") return;
  const newMessage = { id: idx.toString(), text: value, sender: "user" };
  setMockMessages((prevMessages) => [...prevMessages, newMessage]);
  setInputVal("");
  db.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", [value, "user"]);
}

useEffect(() => {
  // Initialize the db
  db.execute( "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, sender TEXT)");
  const chats = db.execute("SELECT * FROM messages").res;
  console.log("Database chats: ", chats);
  setMockMessages(chats);
}, [])


  return (
    <View className='flex-1 bg-black p-12'>
      <FlatList
        className='flex-1'
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            key={index}
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
            onPress={() => handleSend(inputVal)}
            className='bg-blue-500 p-2 rounded-full'>
            <Ionicons name='send' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}