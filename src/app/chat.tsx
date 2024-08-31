import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { open } from "@op-engineering/op-sqlite";

const db = open({
  name: "chat.db",
  location: "../files/databases"
});
export default function Chat() {
  const [inputVal, setInputVal] = React.useState("");
  const [mockMessages, setMockMessages] = React.useState([]);

  useEffect(() => {
    // Initialize the db
    // db.execute("CREATE VIRTUAL TABLE IF NOT EXISTS vec_examples USING vec0(embedding FLOAT[8]);");
  //   db.execute(`INSERT INTO vec_examples(rowid, embedding) VALUES
  //   (1, '[-0.200, 0.250, 0.341, -0.211, 0.645, 0.935, -0.316, -0.924]'),
  //   (2, '[0.443, -0.501, 0.355, -0.771, 0.707, -0.708, -0.185, 0.362]'),
  //   (3, '[0.716, -0.927, 0.134, 0.052, -0.669, 0.793, -0.634, -0.162]'),
  //   (4, '[-0.710, 0.330, 0.656, 0.041, -0.990, 0.726, 0.385, -0.958]');
  // `);
    db.execute(
      "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, sender TEXT)"
    );
    const chats = db.execute("SELECT * FROM messages").res;
    const mockMessages = chats?.map((chat: any) => ({
      id: chat.id,
      text: chat.text,
      sender: chat.sender
    }));
    console.log("Database chats: ", chats);
  }, []);

  const handleSend = (value: string) => {
    if (inputVal.trim() === "") return;
    setInputVal("");
    db.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", [value, "user"]);
    console.log("Starting embed vec test");
    // testEmbed();
    runOps();
  };


  const runOps = () => {
    const res2 = db.execute(
      'CREATE VIRTUAL TABLE vec_items USING vec0(embedding float[4]);',
    );

    const items = [
      [1, [0.1, 0.1, 0.1, 0.1]],
      [2, [0.2, 0.2, 0.2, 0.2]],
      [3, [0.3, 0.3, 0.3, 0.3]],
      [4, [0.4, 0.4, 0.4, 0.4]],
      [5, [0.5, 0.5, 0.5, 0.5]]
    ];

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      const res3 = db.execute(
        'INSERT INTO vec_items(rowid, embedding) VALUES (?, ?)',
        [item![0], JSON.stringify(item![1])],
      );
    }

    const res4 = db.execute(
      "SELECT rowid, distance FROM vec_items WHERE embedding MATCH ? ORDER BY distance LIMIT 3",
      [JSON.stringify([0.3, 0.3, 0.3, 0.3])]
    );

    console.log(res4);
    console.log(res4.rows?._array);
  };


  const testEmbed = () => {
    db.execute(`INSERT INTO vec_examples(rowid, embedding) VALUES
    (1, '[-0.200, 0.250, 0.341, -0.211, 0.645, 0.935, -0.316, -0.924]'),
    (2, '[0.443, -0.501, 0.355, -0.771, 0.707, -0.708, -0.185, 0.362]'),
    (3, '[0.716, -0.927, 0.134, 0.052, -0.669, 0.793, -0.634, -0.162]'),
    (4, '[-0.710, 0.330, 0.656, 0.041, -0.990, 0.726, 0.385, -0.958]');
  `);
    const testQuery = db.execute(`select rowid,distance from vec_examples
    where embedding match '[0.890, 0.544, 0.825, 0.961, 0.358, 0.0196, 0.521, 0.175]'
    order by distance limit 2;`);
    console.log("testQuery", testQuery.res);
  };

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
