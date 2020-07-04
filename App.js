import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  StatusBar,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Container,
  Card,
  CardItem,
  Header,
  Left,
  Body,
  Right,
  Form,
  Item,
  Input,
  Text,
  Title,
  Thumbnail,
  Grid,
  Col,
  Icon,
  Content,
  Button,
} from 'native-base';

import Dialog from 'react-native-dialog';
import useAxios from 'axios-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const WeatherForecast = params => {
  const city = params.city;
  const API_KEY = process.env.React_APP_API_KEY;
  const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const [{data, loading, error}, refetch] = useAxios(
    URL + city + '&mode=json&units=metric' + '&appid=' + API_KEY,
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error</Text>;

  const refreshForecast = () => {
    refetch();
  };

  const deleteCity = () => {
    params.deleteCity(params.id);
  };

  return (
    <Card>
      <CardItem style={{backgroundColor: '#beebe9'}}>
        <Body>
          <Grid>
            <Col style={{width: 200}}>
              <Text style={{fontWeight: 'bold', color: '#1b6ca8'}}>{city}</Text>
              <Text> Main: {data.weather[0].main} </Text>
              <Text> Temp: {data.main.temp} °C </Text>
              <Text> Feels like: {data.main.feels_like} °C </Text>
              <Text> Humidity: {data.main.humidity} % </Text>
            </Col>
            <Col>
              <Thumbnail
                large
                source={{
                  uri:
                    'http://openweathermap.org/img/wn/' +
                    data.weather[0].icon +
                    '@2x.png',
                }}
              />
            </Col>
          </Grid>
        </Body>
      </CardItem>
      <CardItem footer style={{backgroundColor: '#f1fcfc'}}>
        <Left>
          <Button small rounded danger onPress={deleteCity}>
            <Text style={{fontWeight: 'bold'}}> x </Text>
          </Button>
        </Left>
        <Right>
          <Button small rounded info onPress={refreshForecast}>
            <Text style={{fontWeight: 'bold'}}> Refresh </Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
};

const App: () => React$Node = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);

  const openDialog = () => {
    setModalVisible(true);
  };

  const addCity = () => {
    setCities([
      ...cities,
      {
        id: cities.length,
        name: cityName,
      },
    ]);
  };

  const cancelCity = () => {
    setModalVisible(false);
  };

  const deleteCity = id => {
    let filteredArray = cities.filter(city => city.id !== id);
    setCities(filteredArray);
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setCities('@cities', JSON.stringify(cities));
    } catch (e) {
      console.log('Cities Saving ERROR!');
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities');
      if (value !== null) {
        setCities(JSON.parse(value));
      }
    } catch (e) {
      console.log('Cities Loading ERROR!');
    }
  };

  useEffect(() => {
    getData();
  }, [cities]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Container>
            <Header>
              <Left />
              <Body>
                <Title> Weather App</Title>
              </Body>
              <Right>
                <Button info>
                  <Text onPress={openDialog}>Add</Text>
                </Button>
              </Right>
            </Header>
            <ScrollView>
              {cities.map(function(city, index) {
                return (
                  <WeatherForecast
                    key={index}
                    id={city.id}
                    city={city.name}
                    deleteCity={deleteCity}
                  />
                );
              })}
            </ScrollView>
            <Dialog.Container visible={modalVisible}>
              <Dialog.Title>Add a new City</Dialog.Title>
              <Form>
                <Item>
                  <Input
                    onChangeText={text => setCityName(text)}
                    placeholder="cityname"
                  />
                </Item>
              </Form>
              <Dialog.Button label="Cancel" onPress={cancelCity} />
              <Dialog.Button label="Add" onPress={addCity} />
            </Dialog.Container>
          </Container>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
