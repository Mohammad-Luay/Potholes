
import { View, Image, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, PermissionsAndroid, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';
import * as ImagePicker from 'expo-image-picker';
import firebase from './firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
// <Image source={require() style={{width:"20%",height:"7%"}}}/>
const HomeScreen = () => {
  const [phone, setPhone] = React.useState("")
  const [typePoth, setTypePoth] = React.useState(0)
  var color = "red"
  const [pressed,isPressed] = React.useState(false)
  const [isChosen1, setIsChosen1] = React.useState(true)
  const [isChosen2, setIsChosen2] = React.useState(false)
  const [isChosen3, setIsChosen3] = React.useState(false)
  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Accessing Permission",
          message: "App needs access to your location",
          buttonNegative: "Cancel",
          buttonPositive: "Ok"
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }
  function sty(color){
    return{
      backgroundColor:color
    }
  }
  requestLocation()
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require("./images/background.png")} resizeMode="cover" style={styles.image}>
        <View style={{ flexDirection: "row", marginLeft: 30, marginTop: -200 }}>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity onPress={() => { setTypePoth(1); setIsChosen1(true); setIsChosen2(false); setIsChosen3(false); }} style = {{}}>
              <Image source={require("./images/1.png")} style={isChosen1?{ width: 100, height: 100, borderRadius: 290, borderColor: "red", borderWidth: 1}:{ width: 100, height: 100, borderRadius: 290}} />
              <Text style={{ marginLeft: "25%", color: "black" }}>Small</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity onPress={() => { setTypePoth(2); setIsChosen1(false); setIsChosen2(true); setIsChosen3(false); }}>
              <Image source={require("./images/2.png")} style={isChosen2?{ width: 100, height: 100, borderRadius: 290, borderColor: "red", borderWidth: 1}:{ width: 100, height: 100, borderRadius: 290}} />
              <Text style={{ marginLeft: "20%", color: "black" }}>Medium</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => { setTypePoth(3); setIsChosen1(false); setIsChosen2(false); setIsChosen3(true); }}>
              <Image source={require("./images/3.png")} style={isChosen3?{ width: 100, height: 100, borderRadius: 290, borderColor: "red", borderWidth: 1}:{ width: 100, height: 100, borderRadius: 290}} />
              <Text style={{ marginLeft: "25%", color: "black" }}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>
{/*Image Picker*/}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>

        <View>
          <TextInput onChangeText={setPhone} placeholder="Your Phone Number..." value={phone} style={{ borderRadius: 200, marginTop: "15%", backgroundColor: 'gray', width: "70%", marginLeft: "17%" }} />
          {/*phone.length == 10 ? null : alert("Please write your number correctly ")*/}
          <TouchableOpacity onPress={() => { typePoth==0 || phone.length < 9?alert("Please Choose A Photo And Type Your Phone Number"):alert("Sucess");getpoision(); }}>
            <Image source={require("./images/locate.png")} style={{ width: 120, height: 120, borderRadius: 200, position: "absolute", marginTop: 120, marginLeft: 130 }} />
            <Text style={{ width: 300,color:"white",fontSize:20, height: 120, borderRadius: 200, position: "absolute", marginTop: 250, marginLeft: 80 }}>Send The Pothole Location</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}
// image picker
const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

const Welcome = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('./images/cover.png')} resizeMode="cover" style={styles.image}>
      <Text style={styles.text}>Welcome to PatcHole</Text>
        <View style={{ flexDirection: 'row',marginTop:50,position:"absolute",marginLeft:"5%", width: '95%', height: '8%', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style = {{flexDirection:"row",marginLeft:"80%",width:50,height:50}} onPress={()=>{navigation.navigate("Help")}}>
          <Icon name="question-circ" style={{borderWidth:5,backgroundColor:"lightgray",borderColor:"white",width:50,textAlign:"center",borderRadius:100,marginTop:"-10%",maxHeight:150}} size={40} color="white" onPress={() => navigation.navigate('Help')} />
          </TouchableOpacity>
        </View>
        <View style={{ display: "flex", justifyContent: "center",marginLeft:"30%",backgroundColor:"lightblue",borderRadius:900,position:"absolute", alignItems: "center",height:50 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ borderWidth: 0, width: 100, textAlign: "center", borderRadius: 20, }}>
            <Text style={{ color: 'white', fontSize: 26,textAlign:"center",marginTop:0 }}>Start</Text>
          </TouchableOpacity>
        </View >
      </ImageBackground>

    </View>
  )
}
const getpoision = () => {
  var x, y
  var i = []
  Geolocation.getCurrentPosition((pos) => {
    console.log(x, y)
    i.push(x, y)
    console.log(i)
    const usernameAndPasswordData = firebase
      .database()
      .ref('usernameAndPasswordTable');
    usernameAndPasswordData.push({
      long: pos.coords.longitude,
      lot: pos.coords.latitude,
    });

  })

}
const Help = () => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require("./images/helpPNG.png")} resizeMode="cover" style={styles.image}>
      </ImageBackground>
    </View>
  )
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name='Help' component={Help} />
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:true}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
const styles = StyleSheet.create({

  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 100,
    marginTop:-600,


  }
});