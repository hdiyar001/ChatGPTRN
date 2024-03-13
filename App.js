import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { OPENAI_API_KEY } from "@env";
import { MaterialIcons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import * as Speech from "expo-speech";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleButtonClick = () => {
    if (inputMessage.toLocaleLowerCase().startsWith("generate image")) {
      generateImages();
    } else if (inputMessage != "") {
      generateText();
    }
  };
  const generateText = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message)
    );
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: inputMessage }],
        model: "gpt-3.5-turbo-0125",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInputMessage("");
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Open AI",
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, message)
        );
        const options = {};
        Speech.speak(data.choices[0].message.content, options);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const generateImages = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message)
    );
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 2,
        size: "1024x1024",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInputMessage("");
        data.data.forEach((item, index) => {
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: "#" + (index + 1),
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Open AI",
            },
            image: item.url,
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, message)
          );
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTextInput = (text) => {
    setInputMessage(text);
  };
  return (
    // <ImageBackground source={require('./assets/bg.jpg')} resizeMode="cover" style{{flex:1, width:100%, height:100%}}>
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {/* <Text>{outputMessage}</Text> */}
        <GiftedChat
          messages={messages}
          renderInputToolbar={() => {}}
          user={{ _id: 1 }}
          minInputToolbarHeight={0}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your question or start with generate image to generate images."
            onChangeText={handleTextInput}
            value={inputMessage}
          />
        </View>
        <TouchableOpacity onPress={handleButtonClick}>
          <View style={styles.sendBtn}>
            <MaterialIcons name="send" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 9999,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
